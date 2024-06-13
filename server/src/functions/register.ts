import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";

/**
 *  Creates a publisher in the DB with the given username and password.
 *
 *  @param username client username.
 *  @author marbleville
 *
 * @TODO change to be create new user
 */
async function register(username: string): Promise<void> {
	const database: DatabaseInstance = DatabaseInstance.getInstance();
	let queryString: string = DatabaseQueries.register(username);

	try {
		await database.query(queryString);
	} catch (error) {
		throw new Error("Failed to register user.");
	}
}
export { register };
