import { Argument, Publisher, Sheet } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import { GetSheetRow } from "../database/db";

/**
 * Creates a sheets owned by the publisher given in the argument object with
 * the name given in the argument object
 *
 * @param argument The argument object containing the publisher and sheet name
 *
 * @author kris-amerman, marbleville
 */
async function createSheet(argument: Argument): Promise<void> {
	let publisher: Publisher = argument.publisher;
	let sheetName: Sheet = argument.sheet;
	/**
	 * argument.publisher is the publisher to create the sheet for
	 * argument.sheet is the name of the sheet to create
	 *
	 * Insert the sheet into the Sheets table with the owner as the
	 * argument.publisher
	 */

	const database = DatabaseInstance.getInstance();
	let newSheetName = sheetName;

	try {
		// Query to fetch all sheet names that share the same base name
		let querySameBaseName = `SELECT sheetname FROM sheets 
            WHERE sheetname LIKE '${sheetName}%'
            AND owner = 
			(SELECT userid FROM publishers WHERE username = '${publisher}');`;

		let existingSheetsResult = await database.query<GetSheetRow>(
			querySameBaseName
		);

		// Filter strictly by "sheetname" or "sheetname (n)" where `n` is a
		// number
		existingSheetsResult = existingSheetsResult.filter((row) => {
			let regex = new RegExp(`^${sheetName}( \\(\\d+\\))?$`);
			return regex.test(row.sheetname);
		});

		// Extract and parse the appended numbers
		let appendedNumbers = existingSheetsResult.map((row) => {
			let appendedPart = row.sheetname.replace(sheetName, "").trim();
			appendedPart = appendedPart.replace(/^\(/, "").replace(/\)$/, "");

			return parseInt(appendedPart) || 0;
		});

		// Find the maximum appended number
		let maxAppended = Math.max(...appendedNumbers);

		// Append the next available number
		if (maxAppended !== -Infinity) {
			newSheetName = `${sheetName} (${maxAppended + 1})`;
		}

		let queryInsertNewSheet = `INSERT INTO sheets (sheetname, owner, latest) 
								   VALUES ('${newSheetName}', 
								   (SELECT userid FROM publishers WHERE username 
								   = '${publisher}'), NULL);`;

		await database.query(queryInsertNewSheet);
	} catch (error) {
		throw error;
	}
}
export { createSheet };
