import { Argument, Sheet, Publisher } from "../../../types/types";
import { getUpdatesHelper } from "../utils";
import DatabaseQueries from "../../../types/queries";

/**
 * Returns the updates for the given subscription occuring after the given
 * update ID. Sheet must not be owned by the publisher.
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

	const queryString = DatabaseQueries.getUpdatesForSubscription(
		publisher,
		sheetName,
		id
	);

	return getUpdatesHelper(argument, queryString);
}

export { getUpdatesForSubscription };
