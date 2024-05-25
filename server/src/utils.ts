import { Argument, Result } from "../../types/types";
import DatabaseInstance from "./database/databaseInstance";
import { Request, Response } from "express";

async function runEndpointFuntion(
	req: Request,
	res: Response,
	func: (
		argument: Argument
	) => Promise<Argument[]> | Promise<Argument> | Promise<void>
) {
	if (!(await authenticate(req.headers.authorization))) {
		res.sendStatus(401);
	}

	let result: Result;

	try {
		let argument = JSON.parse(req.body) as Argument;
		let value: Argument[] | Argument | void = await func(argument);

		result = assembleResultObject(true, "createSheet", value);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		result = assembleResultObject(false, "createSheet " + err.message, []);
		res.send(JSON.stringify(result));
	}
}

/**
 * Authenticates the user based on the authorization header from the request
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
	const base64 = authHeader.split(" ")[1];
	// Decodes to binary
	const decodedAuthHeader = Buffer.from(base64, "base64").toString("utf-8");
	const [username, password] = decodedAuthHeader
		.split(":")
		.map((str) => str.trimEnd());
	const database = DatabaseInstance.getInstance();

	let queryString = `SELECT * FROM publishers WHERE username = '${username}' 
	AND pass = '${password}';`;

	let result = null;
	try {
		result = await database.query(queryString);
	} catch (error) {
		console.error("An error happened  when authenticating the user", error);
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
	message: string,
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

export { authenticate, assembleResultObject, runEndpointFuntion };
