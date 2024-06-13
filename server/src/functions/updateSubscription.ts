import { Argument, Publisher, Sheet, Payload } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";
import { GetUpdateRow } from "../database/db";
import { checkPayloadFormat } from "../utils";

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

	const database: DatabaseInstance = DatabaseInstance.getInstance();

	const queryString: string = DatabaseQueries.updateSubscription(
		sheetName,
		publisher,
		// We need to sanitize the paylod of '' to prevent SQL errors
		payload,
		clientName
	);

	try {
		if (checkPayloadFormat(payload) === false) {
			throw new Error("Invalid payload format");
		}
		await database.query<GetUpdateRow>(queryString);
	} catch (error) {
		throw error;
	}
}

export { updateSubscription };
