import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";

/**
 *  Creates a publisher in the DB with the given username and password.
 *  @param username client username.
 *  @param password client password.
 *  @author kris-amerman, eduardo-ruiz-garay, rishavsarma5
 *
 * @TODO change to be create new user
 */
async function register(registerArgument: RegisterArgument): Promise<void> {
	/**
	 *
	 */

	const userid = registerArgument.id;
	const username = registerArgument.username;
	const password = registerArgument.password;

	if (!username || !password || !userid) {
		throw new Error("Username, password, and userid must be provided");
	}

	// Get database instance
	const database = DatabaseInstance.getInstance();
	try {
		let queryString = DatabaseQueries.register(username, password);

		await database.query(queryString);
	} catch (error) {
		throw new Error(`Failed to add ${username} to the database`);
	}
}
export { register };
