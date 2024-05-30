import DatabaseInstance from "../database/databaseInstance";

/**
 *  Creates a publisher in the DB with the given username and password.
 *  @param username client username.
 *  @param password client password.
 *  @author kris-amerman, eduardo-ruiz-garay, rishavsarma5
 */
async function register(username: string, password: string): Promise<void> {
    const database = DatabaseInstance.getInstance();
    let queryString = `
        INSERT INTO publishers (username, pass)
        VALUES ('${username}', '${password}');
    `;

    try {
		await database.query(queryString);
	} catch (error) {
		console.error("An error happened when creating a new publisher", error);
	}
}
export { register };
