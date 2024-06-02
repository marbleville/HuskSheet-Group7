import { Argument, Publisher, Sheet, Payload } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";
import HashStore from "../database/HashStore"

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

	const queryString = DatabaseQueries.updatePublished(
		parseInt(id),
		sheetName,
		publisher,
		payload
	);

	try {
		await database.query(queryString);
    HashStore.initHash();
    HashStore.updateSheetPayload(sheetName, publisher, payload);

		// now we need to update the latest accepted version of the sheet
	} catch (error) {
		throw error;
	}
}

export { updatePublished };
