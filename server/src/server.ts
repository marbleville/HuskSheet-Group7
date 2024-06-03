const express = require("express");
import cors from "cors";
import { Request, Response, Application } from "express";
import {
  authenticate,
  assembleResultObject,
  runEndpointFuntion,
  parseAuthHeader,
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

// register should be to register a publisher not add a user
app.get("/api/v1/register", async (req: Request, res: Response) => {
  let result: {
    success: Boolean;
    message: string | null;
    value: Array<Argument>;
    time: number;
  };

  const database = DatabaseInstance.getInstance();
  const authHeader = req.headers.authorization;

  // Invalid Authorization header provided
  if (authHeader === undefined) {
    result = {
      success: false,
      message: "Unauthorized",
      value: [],
      time: Date.now(),
    };
    res.send(JSON.stringify(result));
    return;
  }

  const [username, password] = parseAuthHeader(authHeader);

  let queryString = `SELECT * FROM publishers WHERE username = '${username}';`;
  let queryResult = null;
  let userExists = false;
  let isAuthenticated = false;

  // Check if a user exists (could be in separate function)
  try {
    queryResult = await database.query(queryString);
  } catch (error) {
    console.error("An error happened in register", error);
  }
  userExists = queryResult?.length != 0 ? true : false;

  console.log("check if user exists");

  // If user does NOT exist, create user
  if (!userExists) {
    await register(username, password);
    console.log("create user");
  }

  isAuthenticated = await authenticate(authHeader);
  let success = false;

  console.log("call authenticate");

  // If user exists and password matches, set success to true, otherwise leave false
  if (isAuthenticated) {
    success = true;
  }

  result = {
    success: success,
    message: null,
    value: [],
    time: Date.now(),
  };
  res.send(JSON.stringify(result));
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

app.on("listening", () => {
	HashStore.initHash();
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}/`);
});
