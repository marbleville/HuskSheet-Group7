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
	let argumentID: number = parseInt(argument.id);

	let updates: Argument = {
		publisher: argument.publisher,
		sheet: argument.sheet,
		id: "",
		payload: "",
	};

	try {
		let [payload, id] = await HashStore.getSheetPayload(
			publisher,
			sheetName,
			argumentID
		);
		updates.payload = payload;
		updates.id = id;

		return updates;
	} catch (error) {
		throw error;
	}
}

export { getUpdatesForSubscription };
