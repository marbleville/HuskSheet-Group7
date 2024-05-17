import { Argument, Publisher, Sheet } from "../types/types";

/**
 * Deletes the sheet from the Sheets table with the given publisher and sheet
 *
 * @param argument The argument object containing the publisher and sheet to
 * 				   delete
 *
 * @author marbleville
 */
function deleteSheet(argument: Argument): void {
	let publisher: Publisher = argument.publisher;
	let sheetName: Sheet = argument.sheet;

	/**
	 * argument.publisher is the publisher to delete the sheet for
	 * argument.sheet is the name of the sheet to delete
	 *
	 * Delete the sheet from the Sheets table where the owner is the
	 * argument.publisher and the name is the argument.sheet
	 */
}

export { deleteSheet };
