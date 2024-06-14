import { Argument, Sheet, ID, Payload } from "../types/types";
import {
	GetUserRow,
	GetUpdateRow,
	GetSheetRow,
} from "../server/src/database/db";
import { RowDataPacket } from "mysql2";
import DatabaseInstance from "../server/src/database/databaseInstance";
import DatabaseQueries from "../types/queries"

/**
 * Returns an argument object with the given parameters.
 *
 * @param publisher the publisher for this argument object
 * @param sheet the sheet name for this argument object
 * @param id the id for the updates for this argument object
 * @param payload the payload for the updates for this argument object
 *
 * @returns an argument object with the given parameters
 *
 * @author marbleville
 */
function assembleTestArgumentObject(
	publisher: string,
	sheet: Sheet,
	id: ID,
	payload: Payload
): Argument {
	return {
		publisher,
		sheet,
		id,
		payload,
	} as Argument;
}

/**
 * Sets up the database to the original testing data.
 *
 * @author hunterbrodie
 */
async function setupDB(): Promise<void> {
	const database = DatabaseInstance.getInstance();
  await database.query(DatabaseQueries.setUpTesting());
}

export { assembleTestArgumentObject, setupDB };
