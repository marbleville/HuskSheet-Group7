import { Argument, Publisher, Sheet } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";
import { GetSheetRow } from "../database/db";

/**
 * Creates a sheets owned by the publisher given in the argument object with
 * the name given in the argument object
 *
 * @param argument The argument object containing the publisher and sheet name
 *
 * @author kris-amerman
 */
async function createSheet(argument: Argument): Promise<void> {
	let publisher: Publisher = argument.publisher;
	let sheetName: Sheet = argument.sheet;

	const database = DatabaseInstance.getInstance();
	let newSheetName = sheetName;

	try {
		// Query to fetch all sheet names that share the same base name
		let querySameBaseName = DatabaseQueries.createSheetNewName(
			sheetName,
			publisher
		);

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

		let queryInsertNewSheet = DatabaseQueries.createSheet(
			newSheetName,
			publisher
		);

		await database.query(queryInsertNewSheet);
	} catch (error) {
		throw error;
	}
}
export { createSheet };
