import express, { Request, Response, Application } from "express";
import { authenticate, assembleResultObject } from "./utils";
import {register} from "./register";
import { getSheets } from "./getSheets";
import { getPublishers } from "./getPublishers";
import { createSheet } from "./createSheet";
import { deleteSheet } from "./deleteSheet";
import { getUpdatesForPublished } from "./getUpdatesForPublished";
import { getUpdatesForSubscription } from "./getUpdatesForSubscription";
import { updatePublished } from "./updatePublished";
import { updateSubscription } from "./updateSubscription";
import { Argument, Result } from "../types/types";
const app: Application = express();
const PORT: Number = 3000;

app.post("/api/v1/register", (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = authenticate(auth);

	if (!authenticated) {
		res.sendStatus(401);
	}
	let result: Result;
	try{
		register(req.body);
		result = assembleResultObject(true, "register", []);
		res.send(JSON.stringify(result));
	} catch(error) {
		const err: Error = error as Error;
		result = assembleResultObject(false, "register" + err.message, []);
		res.send(JSON.stringify(result));
	}
});

app.get("/api/v1/getPublishers", (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = authenticate(auth);

	if (!authenticated) {
		res.sendStatus(401);
	}

	let publishers: Array<Argument>;
	let result: Result;

	try {
		publishers = getPublishers();
		result = assembleResultObject(true, "getPublishers", publishers);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		result = assembleResultObject(
			false,
			"getPublishers:" + err.message,
			[]
		);
		res.send(JSON.stringify(result));
	}
});

app.post("/api/v1/createSheet", (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = authenticate(auth);

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
		result = assembleResultObject(false, "createSheet" + err.message, []);
		res.send(JSON.stringify(result));
	}
});

app.post("/api/v1/getSheets", (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = authenticate(auth);

	if (!authenticated) {
		res.sendStatus(401);
	}

	let sheets: Array<Argument>;
	let result: Result;

	try {
		sheets = getSheets(req.body);
		result = assembleResultObject(true, "getSheets", sheets);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		result = assembleResultObject(false, "getSheets" + err.message, []);
		res.send(JSON.stringify(result));
	}
});

app.post("/api/v1/deleteSheet", (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = authenticate(auth);

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
		result = assembleResultObject(false, "deleteSheet" + err.message, []);
	}
});

app.post("/api/v1/getUpdatesForSubscription", (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = authenticate(auth);

	if (!authenticated) {
		res.sendStatus(401);
	}

	let updates: Argument;
	let result: Result;

	try {
		updates = getUpdatesForSubscription(req.body);
		result = assembleResultObject(true, "getUpdatesForSubscription", [
			updates,
		]);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		result = assembleResultObject(
			false,
			"getUpdatesForSubscription" + err.message,
			[]
		);
		res.send(JSON.stringify(result));
	}
});

app.post("/api/v1/getUpdatesForPublished", (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = authenticate(auth);

	if (!authenticated) {
		res.sendStatus(401);
	}

	let updates: Argument;
	let result: Result;

	try {
		updates = getUpdatesForPublished(req.body);
		result = assembleResultObject(true, "getUpdatesForPublished", [
			updates,
		]);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		result = assembleResultObject(
			false,
			"getUpdatesForPublished" + err.message,
			[]
		);
		res.send(JSON.stringify(result));
	}
});

app.post("/api/v1/updatePublished", (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = authenticate(auth);

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
			"updatePublished" + err.message,
			[]
		);
	}
});

app.post("/api/v1/updateSubscription", (req: Request, res: Response) => {
	let auth: string | undefined = req.headers.authorization;
	let authenticated: boolean = authenticate(auth);

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
			"updateSubscription" + err.message,
			[]
		);
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}/`);
});
