import { Argument, Publisher } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import { GetSheetRow, GetUserRow } from "../database/db";

/**
 * Returns an array of arguments containing all sheets asscoiated with the
 * publisher in the given argument object
 *
 * @param argument The argument object containing the publisher
 * @returns An array of arguments containing all sheets
 *                              associated with the publisher
 *
 * @author marbleville, hunterbrodie
 */
function getSheets(argument: Argument): Array<Argument> {
	let connection: DatabaseInstance = DatabaseInstance.getInstance();

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

	connection.query<GetSheetRow>(
		"SELECT sheets.sheetid, sheets.sheetname FROM sheets INNER JOIN publishers ON sheets.owner=publishers.userid WHERE publishers.username='hunter';"
	);

	return sheets;
}

export { getSheets };
