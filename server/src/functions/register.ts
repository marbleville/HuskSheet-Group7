import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";

/**
 *  Creates a publisher in the DB with the given username and password.
 *
 *  @param username client username.
 *  @param password client password.
 *  @author kris-amerman, eduardo-ruiz-garay, rishavsarma5
 *
 * @TODO change to be create new user
 */
async function register(username: string): Promise<void> {
	const database = DatabaseInstance.getInstance();
	let queryString = DatabaseQueries.register(username);

	try {
		await database.query(queryString);
	} catch (error) {
		throw new Error("Failed to register user.");
	}
}
export { register };
