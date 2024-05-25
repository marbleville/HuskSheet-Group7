const express = require("express");
import cors from "cors";
import { Request, Response, Application } from "express";
import {
	authenticate,
	assembleResultObject,
	runEndpointFuntion,
} from "./utils";
import { Argument, Result } from "../../types/types";
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
import { run } from "node:test";

const app: Application = express();
const PORT: Number = 3000;

// CORS configuration
const allowedOrigins = ["http://localhost:5173"];

const options: cors.CorsOptions = {
	origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.json());

app.get("/api/v1/register", async (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;

	let result: Result;

	// So if the user is not authenticated, we should pass the auth header to
	// register to add the new user with username:password
	// This would stop duplicate usrname and password combos
	if (await authenticate(auth)) {
		result = assembleResultObject(false, "User already exists", []);
		res.send(JSON.stringify(result));
	}

	try {
		register(auth);
		result = assembleResultObject(true, "register", []);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		result = assembleResultObject(false, "register " + err.message, []);
		res.send(JSON.stringify(result));
	}
});

app.get("/api/v1/getPublishers", async (req: Request, res: Response) => {
	runEndpointFuntion(req, res, getPublishers);
});

app.post("/api/v1/createSheet", async (req: Request, res: Response) => {
	runEndpointFuntion(req, res, createSheet);
});

app.post("/api/v1/getSheets", async (req: Request, res: Response) => {
	runEndpointFuntion(req, res, getSheets);
});

app.post("/api/v1/deleteSheet", async (req: Request, res: Response) => {
	runEndpointFuntion(req, res, deleteSheet);
});

app.post(
	"/api/v1/getUpdatesForSubscription",
	async (req: Request, res: Response) => {
		runEndpointFuntion(req, res, getUpdatesForSubscription);
	}
);

app.post(
	"/api/v1/getUpdatesForPublished",
	async (req: Request, res: Response) => {
		runEndpointFuntion(req, res, getUpdatesForPublished);
	}
);

app.post("/api/v1/updatePublished", async (req: Request, res: Response) => {
	runEndpointFuntion(req, res, updatePublished);
});

app.post("/api/v1/updateSubscription", async (req: Request, res: Response) => {
	if (!(await authenticate(req.headers.authorization))) {
		res.sendStatus(401);
	}

	let result: Result;

	try {
		updateSubscription(req.body);
		result = assembleResultObject(true, "updateSubscription", []);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		result = assembleResultObject(
			false,
			"updateSubscription " + err.message,
			[]
		);
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}/`);
});
