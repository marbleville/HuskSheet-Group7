import { Argument, Publisher, Sheet } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";
import { GetSheetRow } from "../database/db";

/**
 * Deletes the sheet from the Sheets table with the given publisher and sheet
 *
 * @param argument The argument object containing the publisher and sheet to
 * 				   delete
 *
 * @author hunterbrodie
 */
async function deleteSheet(argument: Argument): Promise<void> {
	let publisher: Publisher = argument.publisher;
	let sheetName: Sheet = argument.sheet;

	// TODO: check if pub is the same as client
	const database = DatabaseInstance.getInstance();

	// Assemble query string
	let queryString = DatabaseQueries.deleteSheet(sheetName, publisher);

	await database.query<GetSheetRow>(queryString);
}

export { deleteSheet };
