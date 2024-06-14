import { Argument, Publisher, Sheet, Payload } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";
import { GetUpdateRow } from "../database/db";
import { checkPayloadFormat, sanitize } from "../utils";

/**
 * Updates the Updates table with the given publisher, sheet, and payload for
 * a sheet not owned by the client
 *
 * @param argument Argument object containing the publisher, sheet, and payload
 *                 for the update
 * @param clientName The username of the client making the request
 *
 * @author marbleville
 */
async function updateSubscription(
	argument: Argument,
	clientName: string
): Promise<void> {
	let publisher: Publisher = argument.publisher;
	let sheetName: Sheet = argument.sheet;
	let payload: Payload = sanitize(argument.payload);

	const database: DatabaseInstance = DatabaseInstance.getInstance();

	const queryString: string = DatabaseQueries.updateSubscription(
		sheetName,
		publisher,
		payload,
		clientName
	);

	if (checkPayloadFormat(payload) === false) {
		throw new Error("Invalid payload format");
	}
	await database.query<GetUpdateRow>(queryString);
}

export { updateSubscription };
