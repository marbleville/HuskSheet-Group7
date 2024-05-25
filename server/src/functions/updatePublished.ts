import { Argument, Publisher, Sheet, Payload } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";

/**
 * Updates the Updates table with the given publisher, sheet, and payload for
 * a sheet owned by the client
 *
 * @param argument Argument object containing the publisher, sheet, and payload
 *                 for the update
 *
 * @author marbleville
 */
async function updatePublished(argument: Argument): Promise<void> {
	let publisher: Publisher = argument.publisher;
	let id = argument.id;
	let sheetName: Sheet = argument.sheet;
	let payload: Payload = argument.payload;

	/**
	 * Check if the publisher is the same as the client (client side check)
	 *
	 * Add a new row to the Updates table with the publisher, sheet, and payload
	 */

	const database = DatabaseInstance.getInstance();

	const queryString = `INSERT INTO updates 
		(updateid, updatetime, sheet, owner, changes) 
		VALUES (${id}, ${Date.now()}, (SELECT sheetid FROM sheets 
		WHERE sheetname = ${sheetName}), (SELECT userid FROM publishers 
		WHERE username = '${publisher}'), ${payload});`;

	try {
		await database.query(queryString);
	} catch (error) {
		throw error;
	}
}

export { updatePublished };
