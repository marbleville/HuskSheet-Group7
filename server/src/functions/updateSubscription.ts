import { Argument, Publisher, Sheet, Payload } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";
import HashStore from "../database/HashStore";
import { GetUpdateRow } from "../database/db";

/**
 * Updates the Updates table with the given publisher, sheet, and payload for
 * a sheet not owned by the client
 *
 * @param argument Argument object containing the publisher, sheet, and payload
 *                 for the update
 *
 * @author marbleville
 */
async function updateSubscription(
	argument: Argument,
	clientName: string
): Promise<void> {
	let publisher: Publisher = argument.publisher;
	let sheetName: Sheet = argument.sheet;
	let payload: Payload = argument.payload;

	const database = DatabaseInstance.getInstance();

	const queryString = DatabaseQueries.updateSubscription(
		sheetName,
		publisher,
		payload,
		clientName
	);

	try {
		await database.query<GetUpdateRow>(queryString);
	} catch (error) {
		throw error;
	}
}

export { updateSubscription };
