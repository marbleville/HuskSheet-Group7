import { Argument, Sheet, Publisher } from "../../../types/types";
import DatabaseQueries from "../../../types/queries";
import { getUpdatesHelper } from "../utils";

/**
 * Returns only the updates owned by clients other than the publisher of the
 * sheet for the given published sheet occuring after the given update ID.
 *
 * @param argument Argument object containing the publisher, sheet, and update
 *                 id to get updates for
 *
 * @returns The argument object containing the last update id and payload
 *          containing all changes
 */
async function getUpdatesForPublished(argument: Argument): Promise<Argument> {
	let sheetName: Sheet = argument.sheet;
	let publisher: Publisher = argument.publisher;
	let id: number = parseInt(argument.id);

	const queryString = DatabaseQueries.getUpdatesForPublished(
		publisher,
		sheetName,
		id
	);

	return await getUpdatesHelper(argument, queryString);
}

export { getUpdatesForPublished };
