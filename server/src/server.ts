const express = require("express");
import cors from "cors";
import { Request, Response, Application } from "express";
import { authenticate, assembleResultObject } from "./utils";
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
	let authenticated: boolean = await authenticate(auth);

	let result: Result;

	// So if the user is not authenticated, we should pass the auth header to
	// register to add the new user with username:password
	// This would stop duplicate usrname and password combos
	if (authenticated) {
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
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = await authenticate(auth);

	if (!authenticated) {
		res.sendStatus(401);
	}

	let publishers: Array<Argument>;
	let result: Result;

	try {
		publishers = await getPublishers();
		result = assembleResultObject(true, "getPublishers", publishers);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		result = assembleResultObject(
			false,
			"getPublishers: " + err.message,
			[]
		);
		res.send(JSON.stringify(result));
	}
});

app.post("/api/v1/createSheet", async (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = await authenticate(auth);

	if (!authenticated) {
		res.sendStatus(401);
	}

	let result: Result;

	try {
		createSheet(req.body);
		result = assembleResultObject(true, "createSheet", []);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		result = assembleResultObject(false, "createSheet " + err.message, []);
		res.send(JSON.stringify(result));
	}
});

app.post("/api/v1/getSheets", async (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = await authenticate(auth);

	if (!authenticated) {
		res.sendStatus(401);
	}

	let sheets: Array<Argument>;
	let result: Result;

	try {
		sheets = await getSheets(req.body);
		result = assembleResultObject(true, "getSheets", sheets);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		result = assembleResultObject(false, "getSheets " + err.message, []);
		res.send(JSON.stringify(result));
	}
});

app.post("/api/v1/deleteSheet", async (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = await authenticate(auth);

	if (!authenticated) {
		res.sendStatus(401);
	}

	let result: Result;

	try {
		deleteSheet(req.body);
		result = assembleResultObject(true, "deleteSheet", []);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		result = assembleResultObject(false, "deleteSheet " + err.message, []);
	}
});

app.post(
	"/api/v1/getUpdatesForSubscription",
	async (req: Request, res: Response) => {
		let auth: string | undefined = req.headers.authorization;
		let authenticated: boolean = await authenticate(auth);

		if (!authenticated) {
			res.sendStatus(401);
		}

		let updates: Argument;
		let result: Result;

		try {
			updates = await getUpdatesForSubscription(req.body);
			result = assembleResultObject(true, "getUpdatesForSubscription", [
				updates,
			]);
			res.send(JSON.stringify(result));
		} catch (error) {
			const err: Error = error as Error;
			result = assembleResultObject(
				false,
				"getUpdatesForSubscription " + err.message,
				[]
			);
			res.send(JSON.stringify(result));
		}
	}
);

app.post(
	"/api/v1/getUpdatesForPublished",
	async (req: Request, res: Response) => {
		let auth: string | undefined = req.headers.authorization;
		let authenticated: boolean = await authenticate(auth);

		if (!authenticated) {
			res.sendStatus(401);
		}

		let updates: Argument;
		let result: Result;

		try {
			updates = await getUpdatesForPublished(req.body);
			result = assembleResultObject(true, "getUpdatesForPublished", [
				updates,
			]);
			res.send(JSON.stringify(result));
		} catch (error) {
			const err: Error = error as Error;
			result = assembleResultObject(
				false,
				"getUpdatesForPublished " + err.message,
				[]
			);
			res.send(JSON.stringify(result));
		}
	}
);

app.post("/api/v1/updatePublished", async (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = await authenticate(auth);

	if (!authenticated) {
		res.sendStatus(401);
	}

	let result: Result;

	try {
		updatePublished(req.body);
		result = assembleResultObject(true, "updatePublished", []);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		result = assembleResultObject(
			false,
			"updatePublished " + err.message,
			[]
		);
	}
});

app.post("/api/v1/updateSubscription", async (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = await authenticate(auth);

	if (!authenticated) {
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
