import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";

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

	const base64 = authHeader.split(" ")[1];
	// Decodes to binary
	const decodedAuthHeader = Buffer.from(base64, "base64").toString("utf-8");
	const [username, pass] = decodedAuthHeader
		.split(":")
		.map((str) => str.trimEnd());

	// Get database instance
	const database = DatabaseInstance.getInstance();
	try {
		let queryString = DatabaseQueries.register(username, pass);

		await database.query(queryString);
	} catch (error) {
		throw new Error(`Failed to add ${username} to the database`);
	}
}
export { register };
