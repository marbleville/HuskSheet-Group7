import { Argument, Publisher } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";
import { GetSheetRow } from "../database/db";
import { clientAndPublisherMatch, sendError, getArgument } from "../utils";
import { Request, Response } from "express";
import { get } from "http";

/**
 * Returns an array of arguments containing all sheets asscoiated with the
 * publisher in the given argument object
 *
 * @param arg The argument object containing the publisher
 * @param clientUsername The username of the client making the request
 *
 * @returns An array of arguments containing all sheets
 *          associated with the publisher
 *
 * @author hunterbrodie
 */
async function getSheets(
	arg: Argument,
	clientUsername: string
): Promise<Array<Argument>> {
	try {
		let sheets: Array<Argument> = [];
		let publisher: string = arg.publisher;

		// Get the database instance
		const database: DatabaseInstance = DatabaseInstance.getInstance();

		// Assemble query string
		let queryStringForPubSheets: string =
			DatabaseQueries.getSheets(publisher);

		let result: GetSheetRow[] = await database.query<GetSheetRow>(
			queryStringForPubSheets
		);

		// Appends private sheets to the result if the client is the publisher
		if (arg.publisher === clientUsername) {
			let queryStringForPrivSheets: string = DatabaseQueries.getSheets(
				publisher,
				""
			);
			result = result.concat(
				await database.query<GetSheetRow>(queryStringForPrivSheets)
			);
		}

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
	} catch (error) {
		throw error;
	}
}

export { getSheets };
