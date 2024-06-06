import { Argument, Publisher, Sheet, Payload } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";
import HashStore from "../database/HashStore";
import { GetUpdateRow } from "../database/db";

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
	let sheetName: Sheet = argument.sheet;
	let payload: Payload = argument.payload;

	const database = DatabaseInstance.getInstance();

	const queryString = DatabaseQueries.updatePublished(
		sheetName,
		publisher,
		payload
	);

	try {
		let updates: GetUpdateRow[] = await database.query<GetUpdateRow>(
			queryString
		);

		let lastID =
			updates.length > 0 ? updates[updates.length - 1].updateid : 0;
		await HashStore.initHash();
		await HashStore.updateSheetPayload(sheetName, publisher, payload, lastID);

		// now we need to update the latest accepted version of the sheet
	} catch (error) {
		throw error;
	}
}

export { updatePublished };
