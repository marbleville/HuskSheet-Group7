import { Argument, Publisher, Sheet } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import { GetSheetRow } from "../database/db";

/**
 * Deletes the sheet from the Sheets table with the given publisher and sheet
 *
 * @param argument The argument object containing the publisher and sheet to
 * 				   delete
 *
 * @author marbleville, hunterbrodie
 */
async function deleteSheet(argument: Argument): Promise<void> {
	let publisher: Publisher = argument.publisher;
	let sheetName: Sheet = argument.sheet;

	/**
	 * argument.publisher is the publisher to delete the sheet for
	 * argument.sheet is the name of the sheet to delete
	 *
	 * Delete the sheet from the Sheets table where the owner is the
	 * argument.publisher and the name is the argument.sheet
	 */
	const database = DatabaseInstance.getInstance();

	// Assemble query string
	let queryString =
		`DELETE sheets FROM sheets` +
		`INNER JOIN publishers ON sheets.owner=publishers.userid` +
		`WHERE publishers.username='${publisher}' AND sheets.name='${sheetName}';`;

	await database.query<GetSheetRow>(queryString);
}

export { deleteSheet };
