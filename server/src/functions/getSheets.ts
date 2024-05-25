import { Argument, Publisher } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import { GetSheetRow } from "../database/db";

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

	// Get the database instance
	const database = DatabaseInstance.getInstance();

	// Assemble query string
	let queryString = `SELECT sheets.sheetid, sheets.sheetname FROM sheets 
		INNER JOIN publishers ON sheets.owner=publishers.userid 
		WHERE publishers.username='${publisher}';`;

	let result = await database.query<GetSheetRow>(queryString);

	// Assemble the array of arguments
	result.forEach((sheet) => {
		const tempArgument: Argument = {
			publisher: publisher,
			sheet: sheet.sheetname,
			id: "",
			payload: "",
		};

		sheets.push(tempArgument);
	});

	return sheets;
}

export { getSheets };
