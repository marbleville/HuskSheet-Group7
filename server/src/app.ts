const express = require("express");
import cors from "cors";
import { Request, Response, Application } from "express";
import {
	authenticate,
	runEndpointFuntion,
	parseAuthHeader,
	assembleResultObject,
	clientAndPublisherMatch,
	doesUserExist,
	isUserPublisher,
	sendError,
	getArgument,
} from "./utils";
import { Result } from "../../types/types";
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
import DatabaseQueries from "../../types/queries";
import { get } from "http";

const app: Application = express();

// CORS configuration
const allowedOrigins = ["http://localhost:5173"];

const options: cors.CorsOptions = {
	origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.json());

/**
 * @description Register will respond in one of three ways:
 * 		1. If the user does not exist, it will create a new user and respond with a fail in the response object.
 * 		2. If the user exists, it will register the user as a publisher and respond with a success in the response object.
 * 		3. If the provided auth header fials to authenticate, it will respond with a 401 status code.
 *
 * @author marbleville
 */
app.get("/api/v1/register", async (req: Request, res: Response) => {
	const database = DatabaseInstance.getInstance();
	const authHeader = req.headers.authorization;

	let result = assembleResultObject(false, null, []);

	try {
		let [username, password] = parseAuthHeader(authHeader);

		// ensure username and password aren't empty
		if (
			username &&
			password &&
			!(await doesUserExist(username, password))
		) {
			await database.query(
				DatabaseQueries.addNewPublisher(username, password)
			);
			result.message = `register: User does not exist. Created new user.`;
			res.send(JSON.stringify(result));
		} else {
			if (!(await authenticate(req.headers.authorization))) {
				res.status(401).send("Unauthorized");
				return;
			}

			await register(username);
			result.success = true;
			res.send(JSON.stringify(result));
		}
	} catch (error) {
		sendError(res, "register", error);
	}
});

/**
 * Endpoint for getting publishers
 *
 * @author marbleville
 */
app.get("/api/v1/getPublishers", async (req: Request, res: Response) => {
	await runEndpointFuntion(req, res, getPublishers);
});

/**
 * Endpoint for creating a sheet
 *
 * @author marbleville
 */
app.post("/api/v1/createSheet", async (req: Request, res: Response) => {
	if (await isUserPublisher(req.headers.authorization)) {
		await runEndpointFuntion(req, res, createSheet);
	} else {
		res.status(401).send("Unauthorized");
	}
});

/**
 * Endpoint for getting sheets
 *
 * @author marbleville
 */
app.post("/api/v1/getSheets", async (req: Request, res: Response) => {
	try {
		if (!(await authenticate(req.headers.authorization))) {
			throw new Error("Unauthorized");
		}

		const authHeader = req.headers.authorization;

		const [username] = parseAuthHeader(authHeader);

		let arg = getArgument(req);
		let sheets = await getSheets(arg, username);

		let result = assembleResultObject(true, null, sheets);
		res.send(JSON.stringify(result));
	} catch (error) {
		sendError(res, "getSheets", error);
	}
});

/**
 * Endpoint for deleting a sheet
 *
 * @author marbleville
 */
app.post("/api/v1/deleteSheet", async (req: Request, res: Response) => {
	if (
		(await isUserPublisher(req.headers.authorization)) &&
		clientAndPublisherMatch(req, req.headers.authorization)
	) {
		await runEndpointFuntion(req, res, deleteSheet);
	} else {
		let result = assembleResultObject(
			false,
			"You do not own this sheet",
			[]
		);
		res.send(result);
	}
});

/**
 * Endpoint for getting updates for a subscription
 *
 * @author marbleville
 */
app.post(
	"/api/v1/getUpdatesForSubscription",
	async (req: Request, res: Response) => {
		await runEndpointFuntion(req, res, getUpdatesForSubscription);
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
		if (
			clientAndPublisherMatch(req, req.headers.authorization) &&
			(await isUserPublisher(req.headers.authorization))
		) {
			await runEndpointFuntion(req, res, getUpdatesForPublished);
		} else {
			res.status(401).send("Unauthorized");
		}
	}
);

/**
 * Endpoint for updating a published sheet
 *
 * @author marbleville
 */
app.post("/api/v1/updatePublished", async (req: Request, res: Response) => {
	if (
		clientAndPublisherMatch(req, req.headers.authorization) &&
		(await isUserPublisher(req.headers.authorization))
	) {
		await runEndpointFuntion(req, res, updatePublished);
	} else {
		res.status(401).send("Unauthorized");
	}
});

/**
 * Endpoint for updating a subscription
 *
 * @author marbleville
 */
app.post("/api/v1/updateSubscription", async (req: Request, res: Response) => {
	let result: Result = assembleResultObject(false, null, []);

	try {
		// check if the user is authenticated or if a user is trying to update their own sheet
		if (!(await authenticate(req.headers.authorization))) {
			res.status(401).send("Unauthorized");
			return;
		}

		let argument = getArgument(req);

		const authHeader = req.headers.authorization;

		const [username] = parseAuthHeader(authHeader);

		await updateSubscription(argument, username);

		result.success = true;

		res.send(JSON.stringify(result));
	} catch (error) {
		sendError(res, "updateSubscription", error);
	}
});

app.on("listening", () => {
	HashStore.initHash();
});

export default app;
