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
async function register(argument: Argument): Promise<void> {
  /**
   * Added the publisher name as new user. Have to confirm it works with
   * @todo how to setup connection and set password
   */
  console.log("JSON: " + argument.payload);
  let username: String = argument.publisher;
  let pass: String = argument.sheet;

  // Get database instance
  const database = DatabaseInstance.getInstance();
  console.log("banana");
  try {
    let queryString =
      `INSERT INTO publishers (username, pass)` +
      `VALUES(${username}, ${pass})`;

    await database.query(queryString);

    console.log(`Success ${username} was added!`);
  } catch (error) {
    console.error("An error occurred when inserting new user into db", error);
  }
}
export { register };
