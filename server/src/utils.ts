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

/**
 * Sanitizes the payload to prevent SQL injection. Replaces leading adn trailing
 * "'" with """.
 *
 * @param payload the payload to sanitize
 *
 * @returns the sanitized payload
 *
 * @author marbleville
 */
function sanitize(payload: Payload): Payload {
	let changes = payload.split("\n");

	if (changes[changes.length - 1] === "") {
		changes.pop();
	}

	changes = changes.map((change) => {
		let term: string = change.substring(change.indexOf(" ") + 1);

		if (term.charAt(0) === "'") {
			term = '"' + term.slice(1);
		}

		if (term.charAt(term.length - 1) === "'") {
			term = term.substring(0, term.length - 1) + '"';
		}

		term = term.replace(/'/g, "''");

		return change.split(" ", 1)[0] + " " + term;
	});

	return changes.join("\n");
}

/**
 * Checks if the user is a publisher.
 *
 * @param header the authorization header from the request
 *
 * @returns a boolean indicating whether the user is a publisher
 *
 * @author marbleville
 */
async function isUserPublisher(header: string | undefined): Promise<boolean> {
	if (header === undefined) {
		return false;
	}

	const [username] = parseAuthHeader(header);

	const database = DatabaseInstance.getInstance();

	let queryString = DatabaseQueries.getUser(username);

	let result = await database.query<GetUserRow>(queryString);

	return result.length == 1 && result[0].isPublisher;
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
 * @author hunterbrodie
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
				? update.changes.replace("''", "'")
				: update.changes.replace("''", "'") + "\n";
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

	try {
		if (!(await authenticate(req.headers.authorization))) {
			throw new Error("Unauthorized");
		}

		let value: Argument[] | Argument | void;

		// these two functions take an arg, the rest don't
		if (func.name !== "register" && func.name !== "getPublishers") {
			let argument: Argument = getArgument(req);
			value = await func(argument);
		} else {
			value = await func({} as Argument);
		}

		result = assembleResultObject(true, null, value);
		res.send(JSON.stringify(result));
	} catch (error) {
		sendError(res, func.name, error);
	}
}

/**
 * Sends an error to the client with the given response object, function name,
 * and error
 *
 * @param res the response object to send to the error to
 * @param functionName the name of the function that threw the error
 * @param error the error that was thrown
 *
 * @author marbleville
 */
function sendError(res: Response, functionName: string, error: any): void {
	const err: Error = error as Error;
	let errorMessage: string = `${functionName}: ${err.message}`;
	let result: Result = assembleResultObject(false, errorMessage, []);
	res.send(JSON.stringify(result));
}

/**
 * Gets the argument object from the body of the request
 *
 * @param req the request object from the client
 *
 * @returns the argument object from body of the request
 *
 * @throws an error if the body is empty
 *
 * @author marbleville
 */
function getArgument(req: Request): Argument {
	if (JSON.stringify(req.body) === "{}") {
		throw new Error("No body provided.");
	}

	let argument: Argument = req.body as Argument;

	return argument;
}

/**
 * Parses the Authorization header and returns [username, password].
 *
 * @param authHeader the Authorization header from the request with the form of
 *   username:password encoded in base64
 *
 * @returns [username, password] string tuple
 *
 * @throws an error if the Authorization header is not provided
 *
 * @author kris-amerman
 */
function parseAuthHeader(authHeader: string | undefined): string[] {
	if (authHeader === undefined) {
		throw new Error("No Authorization header provided.");
	}

	const base64: string = authHeader.split(" ")[1];
	// Decodes to binary
	const decodedAuthHeader: string = Buffer.from(base64, "base64").toString(
		"utf-8"
	);
	return decodedAuthHeader.split(":").map((str) => str.trimEnd());
}

/**
 * Checks if the user exists in the database.
 *
 * @param username the username to check
 * @param password the password to check
 *
 * @returns a boolean indicating whether the user exists
 *
 * @author kris-amerman
 */
async function doesUserExist(
	username: string,
	password: string
): Promise<boolean> {
	if (!username || !password) {
		return false;
	}

	const database: DatabaseInstance = DatabaseInstance.getInstance();

	let queryString: string = DatabaseQueries.getUser(username);

	let result: GetUserRow[] = await database.query<GetUserRow>(queryString);

	let userExists: boolean = result.length != 0 ? true : false;

	return userExists;
}

/**
 * Checks for a username:password match in the database.
 *
 * @param authHeader The authorization header from the request
 *
 * @returns True if the user is authenticated, false otherwise
 *
 * @throws Error if an error occurs when authenticating the user
 *
 * @author marbleville
 */
async function authenticate(authHeader: string | undefined): Promise<boolean> {
	if (authHeader === undefined) {
		return false;
	}

	const [username, password] = parseAuthHeader(authHeader);
	const database: DatabaseInstance = DatabaseInstance.getInstance();

	let queryString: string = DatabaseQueries.authenticate(username, password);

	let result: GetUserRow[] | null = null;
	try {
		result = await database.query<GetUserRow>(queryString);
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
	sendError,
	getArgument,
	sanitize,
};
