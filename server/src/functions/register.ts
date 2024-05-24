import { Connection } from "mysql2/typings/mysql/lib/Connection";
import { ID, Publisher, Argument } from "../../../types/types";
import mysql from "mysql2";
import DatabaseInstance from "../database/databaseInstance";

/**
 * Creates a publisher with the client name
 *
 * @param argument The argument object containing the publisher and the sheet name
 *
 * @author eduardo-ruiz-garay
 */
async function register(argument: Argument): Promise<void> {
  /**
   * Added the publisher name as new user. Have to confirm it works with
   * @todo how to setup connection and set password
   */
  let userid: String = argument.id;
  let username: String = argument.publisher;
  // let pass: String = argument.sheet;

  // Get database instance
  const database = DatabaseInstance.getInstance();

  try {
    // await database.connect();
    // Assemble query string
    let queryString =
      `CREATE TABLE IF NOT EXISTS publishers (` +
      `${userid} INT NOT NULL AUTO_INCREMENT,` +
      `${username} TEXT NOT NULL,` +
      //   `${pass} TEXT NOT NULL,` +
      `PRIMARY KEY (${userid})` +
      `)`;

    await database.query(queryString);

    console.log(
      `Successfully connected and created a table for user ${username}!`
    );
  } catch (error) {
    console.log(error);
  } finally {
    // await database.close();
  }
}
export { register };
