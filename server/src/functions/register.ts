import { Connection } from "mysql2/typings/mysql/lib/Connection";
import { ID, Publisher, Argument } from "../../../types/types";
import mysql from "mysql2";
import DatabaseInstance from "../database/databaseInstance";

/**
 * Creates a publisher with the client name
 *
 * @param argument The argument object containing the publisher and the sheet name
 *
 * @author eduardo-ruiz-garay, rishavsarma5
 */
async function register(authHeader: string | undefined): Promise<void> {
	/**
	 * Added the publisher name as new user. Have to confirm it works with
	 * @todo how to setup connection and set password
	 *
	 * I think that we shoud pass the auth header into register, and not an
	 * argument object, as register does not take in any args
	 */
	if (authHeader === undefined) {
		throw new Error("No auth header provided");
	}

	let usernameAndPasswordArray = authHeader.split(":");
	let username: String = usernameAndPasswordArray[0];
	let pass: String = usernameAndPasswordArray[1];

	// Get database instance
	const database = DatabaseInstance.getInstance();
	try {
		let queryString =
			`INSERT INTO publishers (username, pass)` +
			`VALUES(${username}, ${pass})`;

		await database.query(queryString);
	} catch (error) {
		throw new Error(`Failed to add ${username} to the database`);
	}
}
export { register };
