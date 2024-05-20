import { Argument, Publisher } from "../../../types/types";
import mysql from "mysql2";
import dbConfig from "../config/db.config";

/**
 * Returns an array of arguments containing all sheets asscoiated with the
 * publisher in the given argument object
 *
 * @param argument The argument object containing the publisher
 * @returns An array of arguments containing all sheets
 *                              associated with the publisher
 *
 * @author marbleville, hunterbrodie
 */
function getSheets(argument: Argument): Array<Argument> {
	let sheets: Array<Argument> = [];
	let publisher: Publisher = argument.publisher;

	/**
	 * argument.publisher is the publisher to gatehr sheets from
	 *
	 * Grab all sheets from the Sheets table where the publisher is the same
	 * as the argument.publisher
	 *
	 * Push each sheets and the publisher to an argument object and push that
	 * to the sheets array
	 */

  const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
  });
  connection.connect();

  connection.query('SELECT sheets.sheetid, sheets.sheetname FROM sheets INNER JOIN publishers ON sheets.owner=publishers.userid WHERE publishers.username=\'hunter\';', (err, rows, fields) => {
    if (err) throw err

    console.log(rows)
  });

  connection.end();


	return sheets;
}

export { getSheets };
