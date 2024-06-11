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
 * @param argument The argument object containing the publisher
 * @returns An array of arguments containing all sheets
 *                              associated with the publisher
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
		const database = DatabaseInstance.getInstance();

		// Assemble query string

		let queryStringForPubSheets = DatabaseQueries.getSheets(publisher);

		let result = await database.query<GetSheetRow>(queryStringForPubSheets);

		if (arg.publisher === clientUsername) {
			let queryStringForPrivSheets = DatabaseQueries.getSheets(
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
