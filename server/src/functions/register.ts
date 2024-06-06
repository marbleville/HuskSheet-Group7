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
async function register(username: string, password: string): Promise<void> {
	const database = DatabaseInstance.getInstance();
	let queryString = DatabaseQueries.register(username, password);

	try {
		await database.query(queryString);
	} catch (error) {
		console.error("An error happened when creating a new publisher", error);
	}
}
export { register };
