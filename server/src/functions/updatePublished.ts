import { Argument, Publisher, Sheet, Payload } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";
import HashStore from "../database/HashStore";
import { GetUpdateRow } from "../database/db";
import { checkPayloadFormat, sanitize } from "../utils";

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
	let payload: Payload = sanitize(argument.payload);

	if (checkPayloadFormat(payload) === false) {
		throw new Error("Invalid payload format");
	}

	try {
		const database: DatabaseInstance = DatabaseInstance.getInstance();

		const queryString: string = DatabaseQueries.updatePublished(
			sheetName,
			publisher,
			payload
		);

		// inserts the update into the database
		await database.query(queryString);

		// gets the updates for the subscription so we can grab ids
		let updates: GetUpdateRow[] = await database.query<GetUpdateRow>(
			DatabaseQueries.getUpdatesForSubscription(publisher, sheetName, 0)
		);

		let payloadUpdate: GetUpdateRow | null = null;

		updates.forEach((update) => {
			if (update.changes.includes(payload.replace("''", "'"))) {
				payloadUpdate = update;
			}
		});

		if (!payloadUpdate) {
			throw new Error("Payload not found in updates");
		}

		payloadUpdate = payloadUpdate as GetUpdateRow;

		let payloadID: number = payloadUpdate.updateid;

		await HashStore.initHash();
		await HashStore.updateSheetPayload(
			sheetName,
			publisher,
			payload,
			payloadID
		);

		// now we need to update the latest accepted version of the sheet
	} catch (error) {
		throw error;
	}
}

export { updatePublished };
