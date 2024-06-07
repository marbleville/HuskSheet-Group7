const express = require("express");
import cors from "cors";
import { Request, Response, Application } from "express";
import {
	authenticate,
	runEndpointFuntion,
	parseAuthHeader,
	assembleResultObject,
} from "./utils";
import { Result, Argument } from "../../types/types";
import {
	register,
	getSheets,
	getPublishers,
	createSheet,
	deleteSheet,
	getUpdatesForPublished,
	getUpdatesForSubscription,
	updatePublished,
	updateSubscription,
} from "./serverFunctionsExporter";
import HashStore from "./database/HashStore";

import DatabaseInstance from "./database/databaseInstance";

const app: Application = express();
const PORT: Number = 3000;

// CORS configuration
const allowedOrigins = ["http://localhost:5173"];

const options: cors.CorsOptions = {
	origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.json());

/**
 * @description Register states:
 * 		1.  authHeader is not provided => return false (Unauthorized)
 * 		2.  publisher does not exist => create publisher, return true (Authorized)
 * 		3.  publisher exists, password does not match => return false (Unauthorized)
 * 		4.  publisher exists, password matches => return true (Authorized)
 *
 * 		Generally, two outcomes exist:
 * 		1. success: false => Unauthorized
 * 		2. success: true  => Authorized
 *
 * @author kris-amerman
 */
app.get("/api/v1/register", async (req: Request, res: Response) => {
	let result: Result;

	const database = DatabaseInstance.getInstance();
	const authHeader = req.headers.authorization;

	let [username, password] = ["", ""];

	let queryResult = null;
	let userExists = false;
	let isAuthenticated = false;

	// Check if a publisher exists (could be in separate function)
	try {
		[username, password] = parseAuthHeader(authHeader);
		let queryString = `SELECT * FROM publishers WHERE username = '${username}';`;

		queryResult = await database.query(queryString);
	} catch (error) {
		console.error("An error happened in register", error);
	}
	userExists = queryResult?.length != 0 ? true : false;

	// If publisher does NOT exist, create publisher
	if (!userExists) {
		await register(username, password);
	}

	isAuthenticated = await authenticate(authHeader);
	let success = false;

	// If publisher exists and password matches, set success to true, otherwise leave false
	if (isAuthenticated) {
		success = true;
	}

	result = {
		success: success,
		message: "",
		value: [],
	};
	res.send(JSON.stringify(result));
});

/**
 * Endpoint for getting publishers
 *
 * @author marbleville
 */
app.get("/api/v1/getPublishers", async (req: Request, res: Response) => {
	runEndpointFuntion(req, res, getPublishers);
});

/**
 * Endpoint for creating a sheet
 *
 * @author marbleville
 */
app.post("/api/v1/createSheet", async (req: Request, res: Response) => {
	runEndpointFuntion(req, res, createSheet);
});

/**
 * Endpoint for getting sheets
 *
 * @author marbleville
 */
app.post("/api/v1/getSheets", async (req: Request, res: Response) => {
	runEndpointFuntion(req, res, getSheets);
});

/**
 * Endpoint for deleting a sheet
 *
 * @author marbleville
 */
app.post("/api/v1/deleteSheet", async (req: Request, res: Response) => {
	runEndpointFuntion(req, res, deleteSheet);
});

/**
 * Endpoint for getting updates for a subscription
 *
 * @author marbleville
 */
app.post(
	"/api/v1/getUpdatesForSubscription",
	async (req: Request, res: Response) => {
		runEndpointFuntion(req, res, getUpdatesForSubscription);
	}
);

/**
 * Endpoint for getting updates for a published sheet
 *
 * @author marbleville
 */
app.post(
	"/api/v1/getUpdatesForPublished",
	async (req: Request, res: Response) => {
		runEndpointFuntion(req, res, getUpdatesForPublished);
	}
);

/**
 * Endpoint for updating a published sheet
 *
 * @author marbleville
 */
app.post("/api/v1/updatePublished", async (req: Request, res: Response) => {
	runEndpointFuntion(req, res, updatePublished);
});

/**
 * Endpoint for updating a subscription
 *
 * @author marbleville
 */
app.post("/api/v1/updateSubscription", async (req: Request, res: Response) => {
	let result: Result;

	if (!(await authenticate(req.headers.authorization))) {
		result = assembleResultObject(
			false,
			`updateSubscription: Unauthorized`,
			[]
		);
		res.send(JSON.stringify(result));
		return;
	}

	try {
		let argument = req.body as Argument;
		const authHeader = req.headers.authorization;

		const [username, password] = parseAuthHeader(authHeader);

		await updateSubscription(argument, username);

		result = assembleResultObject(true, `updateSubscription: `, []);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		console.error(err);
		result = assembleResultObject(
			false,
			`updateSubscription: ` + err.message,
			[]
		);
		res.send(JSON.stringify(result));
	}
});

app.on("listening", () => {
	HashStore.initHash();
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}/`);
});
