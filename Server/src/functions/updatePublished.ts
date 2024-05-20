import { Argument, Publisher, Sheet, Payload } from "../../../types/types";

/**
 * Updates the Updates table with the given publisher, sheet, and payload for
 * a sheet owned by the client
 *
 * @param argument Argument object containing the publisher, sheet, and payload
 *                 for the update
 *
 * @author marbleville
 */
function updatePublished(argument: Argument): void {
	let publisher: Publisher = argument.publisher;
	let sheetName: Sheet = argument.sheet;
	let payload: Payload = argument.payload;

	/**
	 * Check if the publisher is the same as the client
	 *
	 * Add a new row to the Updates table with the publisher, sheet, and payload
	 */
}

export { updatePublished };
