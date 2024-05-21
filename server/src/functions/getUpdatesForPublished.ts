import { Argument, Sheet, Publisher, ID, Payload } from "../../../types/types";

/**
 * Returns the updates for the given published sheet occuring after the given
 * update ID. Sheet must be owned by the publisher.
 *
 * @param argument Argument object containing the publisher, sheet, and update
 *                 id to get updates for
 *
 * @returns The argument object containing the last update id and payload
 *          containing all changes
 */
function getUpdatesForPublished(argument: Argument): Argument {
	let updates: Argument = { publisher: "", sheet: "", id: "", payload: "" };
	let publisher: Publisher = argument.publisher;
	let sheetName: Sheet = argument.sheet;
	let id: ID = argument.id;

	/**
	 * argument.publisher is the publisher of the sheet to get updates for
	 *
	 * Grab all updates from the Updates table where the publisher is the same
	 * as the argument.publisher and the update is newer than the last update
	 *
	 * Push each update to a string and then push that to the updates payload
	 * and set the id to the last id of the updates
	 */

	return updates;
}

export { getUpdatesForPublished };