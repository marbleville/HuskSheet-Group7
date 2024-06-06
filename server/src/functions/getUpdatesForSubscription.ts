import { Argument, Sheet, Publisher } from "../../../types/types";
import { getUpdatesHelper } from "../utils";
import DatabaseQueries from "../../../types/queries";
import HashStore from "../database/HashStore";

/**
 * Returns the updates for the given subscription occuring after the given
 * update IDthat have been accepted by the publisher.
 *
 * @param argument Argument object containing the publisher, sheet, and update
 *                 id to get updates for
 *
 * @returns The argument object containing the last update id and payload
 *          containing all changes
 *
 * @author marbleville
 */
async function getUpdatesForSubscription(
	argument: Argument
): Promise<Argument> {
	let sheetName: Sheet = argument.sheet;
	let publisher: Publisher = argument.publisher;
	let id: number = parseInt(argument.id);
	let updates: Argument = {
		publisher: argument.publisher,
		sheet: argument.sheet,
		id: "",
		payload: "",
	};

	if (id == 0) {
		await HashStore.initHash();
		let payload = await HashStore.getSheetPayload(publisher, sheetName);
		updates.payload = payload[0];
		updates.id = payload[1];
		return updates;
	}

	const queryString = DatabaseQueries.getUpdatesForSubscription(
		publisher,
		sheetName,
		id
	);

	return getUpdatesHelper(argument, queryString);
}

export { getUpdatesForSubscription };
