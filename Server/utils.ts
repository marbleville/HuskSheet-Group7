import { Argument, Result } from "../types/types";

/**
 * Authenticates the user based on the authorization header from the request
 *
 * @param authHeader The authorization header from the request
 *
 * @returns True if the user is authenticated, false otherwise
 *
 * @author marbleville
 */
function authenticate(authHeader: string | undefined): boolean {
	if (!authHeader) {
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

	return true;
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
	value: Array<Argument>
): Result {
	return {
		success: success,
		message: message,
		value: value,
	};
}

export { authenticate, assembleResultObject };
