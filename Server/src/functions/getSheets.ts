import { Argument, Publisher } from "../../../types/types";

/**
 * Returns an array of arguments containing all sheets asscoiated with the
 * publisher in the given argument object
 *
 * @param argument The argument object containing the publisher
 * @returns An array of arguments containing all sheets
 *                              associated with the publisher
 *
 * @author marbleville
 */
function getSheets(argument: Argument): Array<Argument> {
	let sheets: Array<Argument> = [];
	let publisher: Publisher = argument.publisher;

	/**
	 * argument.publisher is the publisher to gatehr sheets from
	 *
	 * Grab all sheets from the Sheets table where the publisher is the same
	 * as the argument.publisher
	 *
	 * Push each sheets and the publisher to an argument object and push that
	 * to the sheets array
	 */

	return sheets;
}

export { getSheets };
