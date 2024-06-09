import {
	Result,
	Argument,
	Publisher,
	Sheet,
	ID,
	Payload,
} from "../../types/types";
import DatabaseInstance from "./database/databaseInstance";
import { Request, Response } from "express";
import { GetUpdateRow, GetUserRow } from "./database/db";
import DatabaseQueries from "../../types/queries";

/**
 * Checks if each change in the payload is in the correct format e.g. $A1 5
 *
 * @param payload newline delimited string of changes
 *
 * @returns boolean indicating whether the payload is in the correct format
 *
 * @author marbleville
 */
function checkPayloadFormat(payload: string): boolean {
	let changes = payload.split("\n");

	changes.forEach((change) => {
		let ref = change.split(" ", 1)[0];

		return ref.match(/\$([A-Za-z]+[0-9]+)/) !== null;
	});

	return true;
}

async function isUserPublisher(header: string | undefined): Promise<boolean> {
	if (header === undefined) {
		return false;
	}

	const [username] = parseAuthHeader(header);

	const database = DatabaseInstance.getInstance();

	let queryString = DatabaseQueries.getUser(username);

	let result = await database.query<GetUserRow>(queryString);

	return result[0].isPublisher;
}

/**
 * Checks if the client and publisher match.
 *
 * @param req the request object from the client
 * @param authHeader the authorization header from the request
 *
 * @returns a boolean indicating whether the client and publisher match
 *
 * @author marbleville
 */
function clientAndPublisherMatch(
	req: Request,
	authHeader: string | undefined
): boolean {
	if (authHeader === undefined) {
		return false;
	}

	if (authHeader === undefined) {
		return false;
	}

	const [username] = parseAuthHeader(authHeader);
	const publisher = req.body.publisher;

	return publisher === username;
}

/**
 * Returns the updates for the given published sheet occuring after the given
 * id in an Argument object.
 *
 * @param argument the Argument object containing the publisher, sheet, and
 * update id to get updates for
 * @param query the query to get the updates
 *
 * @returns The argument object containing the last update id and payload
 * containing all changes
 *
 * @author marbleville, huntebrodie
 */
async function getUpdatesHelper(
	argument: Argument,
	query: string
): Promise<Argument> {
	let updates: Argument = {
		publisher: argument.publisher,
		sheet: argument.sheet,
		id: "",
		payload: "",
	};
	let publisher: Publisher = argument.publisher;
	let sheetName: Sheet = argument.sheet;
	let id: ID = argument.id;

	const database = DatabaseInstance.getInstance();

	let result = await database.query<GetUpdateRow>(query);

	let payload: Payload = "";

	result.forEach((update) => {
		if (update.changes != "") {
			payload += update.changes.includes("\n", update.changes.length - 2)
				? update.changes
				: update.changes + "\n";
		}
	});

	updates.publisher = publisher;
	updates.sheet = sheetName;
	updates.id =
		result.length > 0 ? result[result.length - 1].updateid.toString() : id;
	updates.payload = payload;

	return updates;
}

/**
 * Runs the given endpoint function with the given request and response objects
 *
 * @param req Request object from the client
 * @param res Response object to send to the client
 * @param func Function to run with the given request
 *
 * @author marbleville
 */
async function runEndpointFuntion(
	req: Request,
	res: Response,
	func: (
		argument: Argument
	) => Promise<Argument[]> | Promise<Argument> | Promise<void>
): Promise<void> {
	let result: Result;

	if (!(await authenticate(req.headers.authorization))) {
		res.status(410).send("Unauthorized");
		return;
	}

	try {
		if (req.body === undefined) {
			throw new Error("No body provided.");
		}

		let argument = req.body as Argument;
		let value: Argument[] | Argument | void = await func(argument);

		result = assembleResultObject(true, null, value);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		console.error(err);
		result = assembleResultObject(
			false,
			`${func.name}: ` + err.message,
			[]
		);
		res.send(JSON.stringify(result));
	}
}

/**
 * Parses the Authorization header and returns [username, password].
 *
 * @param authHeader the Authorization header from the request with the form of
 *   username:password encoded in base64
 *
 * @returns [username, password] string array
 *
 * @author kris-amerman, eduardo-ruiz-garay
 */
function parseAuthHeader(authHeader: string | undefined): string[] {
	if (authHeader === undefined) {
		throw new Error("No Authorization header provided.");
	}

	const base64 = authHeader.split(" ")[1];
	// Decodes to binary
	const decodedAuthHeader = Buffer.from(base64, "base64").toString("utf-8");
	return decodedAuthHeader.split(":").map((str) => str.trimEnd());
}

async function doesUserExist(authHeader: string | undefined): Promise<boolean> {
	if (authHeader === undefined) {
		return false;
	}

	const [username] = parseAuthHeader(authHeader);
	const database = DatabaseInstance.getInstance();

	let queryString = DatabaseQueries.getUser(username);

	let result = await database.query<GetUserRow>(queryString);

	let userExists = result.length != 0 ? true : false;

	return userExists;
}

/**
 * Checks for a username:password match in the database.
 *
 * @param authHeader The authorization header from the request
 *
 * @returns True if the user is authenticated, false otherwise
 *
 * @author marbleville, eduardo-ruiz-garay
 */
async function authenticate(authHeader: string | undefined): Promise<boolean> {
	if (authHeader === undefined) {
		return false;
	}

	/**
	 * authHeader is the authorization header from the request with the form of
	 * username:password encoded in base64
	 *
	 * Split the authHeader by the colon and decode to get the username
	 * and password
	 *
	 * Search the Users table for the username and check the password
	 *
	 * If either fails, return false, otherwise return true
	 */
	const [username, password] = parseAuthHeader(authHeader);
	const database = DatabaseInstance.getInstance();

	let queryString = `SELECT * FROM publishers WHERE username = '${username}' 
	AND pass = '${password}';`;

	let result = null;
	try {
		result = await database.query(queryString);
	} catch (error) {
		throw new Error("An error happened when authenticating the user");
	}
	return result?.length != 0 ? true : false;
}

/**
 * Assembles a result object to be returned to the client with the given
 * success, message, and value arguments
 *
 * @param success Boolean value indicating the success of the operation
 * @param message String message to be returned to the client
 * @param value Array of arguments to be returned to the client
 *
 * @returns Result object containing the success, message, and value
 *
 * @author marbleville
 */
function assembleResultObject(
	success: boolean,
	message: string | null,
	value: Argument[] | Argument | void
): Result {
	if (!(value instanceof Array) && value !== undefined) {
		value = [value];
	}

	return {
		success: success,
		message: message,
		value: value == undefined ? [] : value,
	};
}

export {
	authenticate,
	assembleResultObject,
	runEndpointFuntion,
	parseAuthHeader,
	getUpdatesHelper,
	clientAndPublisherMatch,
	checkPayloadFormat,
	doesUserExist,
	isUserPublisher,
};
