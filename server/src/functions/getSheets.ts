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
async function getSheets(argument: Argument): Promise<Array<Argument>> {
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
	let database = DatabaseInstance.getInstance();

	let result = await database.query<GetSheetRow>(
		"SELECT sheets.sheetid, sheets.sheetname FROM sheets INNER JOIN publishers ON sheets.owner=publishers.userid WHERE publishers.username='hunter';"
	);

	result.forEach((sheet) => {
		sheets.push({
			publisher: "hunter",
			id: "",
			sheet: sheet.sheetname,
			payload: "",
		});
	});

	return sheets;
}

export { getSheets };
