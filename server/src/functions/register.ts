import { RegisterArgument } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";

/**
 * Creates a publisher with the client name
 *
 * @param argument The argument object containing the publisher and the sheet name
 *
 * @author eduardo-ruiz-garay, rishavsarma5
 */
async function register(registerArgument: RegisterArgument): Promise<void> {
  /**
   *
   */

  const userid = registerArgument.id;
  const username = registerArgument.username;
  const password = registerArgument.password;

<<<<<<< HEAD
	// Get database instance
	const database = DatabaseInstance.getInstance();
	try {
		let queryString = DatabaseQueries.register(username, pass);
=======
  if (!username || !password || !userid) {
    throw new Error("Username, password, and userid must be provided");
  }
>>>>>>> origin/main

  // Get database instance
  const database = DatabaseInstance.getInstance();
  try {
    let queryString = `INSERT INTO publishers (userid, username, pass) 
			VALUES(${userid}, ${username}, ${password})`;

    await database.query(queryString);
  } catch (error) {
    throw new Error(`Failed to add ${username} to the database`);
  }
}
export { register };
