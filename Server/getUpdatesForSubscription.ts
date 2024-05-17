import { Argument, Publisher, Payload } from "../types/types";

/**
 * Returns the updates for the given subscription occuring after the given
 * update ID. Sheet must not be owned by the publisher.
 *
 * @param argument Argument object containing the publisher, sheet, and update
 *                 id to get updates for
 *
 * @returns The argument object containing the last update id and payload
 *          containing all changes
 */
function getUpdatesForSubscription(argument: Argument): Argument {
	let updates: Argument = { publisher: "", sheet: "", id: "", payload: "" };
	let publisher: Publisher = argument.publisher;

	/**
	 * argument.publisher is the publisher to gather updates from
	 *
	 * Check if the publisher is the same as the client
	 *
	 * Grab all updates from the Updates table where the publisher is the same
	 * as the argument.publisher and the update is newer than the last update
	 *
	 * Push each update to a string and then push that to the updates payload
	 * and set the id to the last id of the updates
	 */

	return updates;
}

export { getUpdatesForSubscription };
