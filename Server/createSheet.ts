import { Argument, Publisher, Sheet } from "../types/types";

/**
 * Creates a sheets owned by the publisher given in the argument object with
 * the name given in the argument object
 *
 * @param argument The argument object containing the publisher and sheet name
 *
 * @author marbleville
 */
function createSheet(argument: Argument): void {
	let publisher: Publisher = argument.publisher;
	let sheetName: Sheet = argument.sheet;
	/**
	 * argument.publisher is the publisher to create the sheet for
	 * argument.sheet is the name of the sheet to create
	 *
	 * Insert the sheet into the Sheets table with the owner as the
	 * argument.publisher
	 */
}
export { createSheet };
