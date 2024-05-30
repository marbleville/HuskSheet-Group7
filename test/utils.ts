import { Argument, Sheet, ID, Payload } from "../types/types";
import {
	GetUserRow,
	GetUpdateRow,
	GetSheetRow,
} from "../server/src/database/db";
import { RowDataPacket } from "mysql2";
import DatabaseInstance from "../server/src/database/databaseInstance";

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
 * Returns a "GetUserRow" object with the given username. This object is not
 * the complete type and doe not provide full safety.
 *
 * @param username the username to be used in the mock row query results
 *
 * @returns a "GetUserRow" object with the given username
 *
 * @author marbleville
 */
function getMockRowQueryResults(username: string): GetUserRow {
	return {
		username,
	} as GetUserRow;
}

/**
 * Returns a "GetUpdateRow" object with the given values. This object is not
 * the complete type and doe not provide full safety.
 *
 * @param updateid the id to be used in the mock update query results
 * @param changes the changes to be used in the mock update query results
 *
 * @returns a "GetUpdateRow" object with the given username
 *
 * @author marbleville
 */
function getMockUpdateQueryResults(
	updateid: number,
	changes: string
): GetUpdateRow {
	return {
		updateid,
		changes,
	} as GetUpdateRow;
}

/**
 * Returns a "GetSheetRow" object with the given values. This object is not
 * the complete type and doe not provide full safety.
 *
 * @param updateid the id to be used in the mock update query results
 * @param changes the changes to be used in the mock update query results
 *
 * @returns a "GetUpdateRow" object with the given username
 *
 * @author marbleville
 */
function getMockSheetQueryResults(
	sheetid: number,
	sheetname: string,
	latest: string = ""
): GetSheetRow {
	return {
		sheetid,
		sheetname,
		latest,
	} as GetSheetRow;
}

/**
 * Mocks the database query function and returns the mocked function.
 *
 * @param mockResult the mock result to be returned by the database query
 *
 * @returns the mocked function for the database query
 *
 * @author marbleville
 */
function mockDB<T extends RowDataPacket>(mockResult: T[]): jest.Mock {
	const mockQuery = jest.fn().mockResolvedValue(mockResult);
	const mockDatabaseInstance: DatabaseInstance = {
		query: mockQuery,
	};
	jest.spyOn(DatabaseInstance, "getInstance").mockReturnValue(
		mockDatabaseInstance
	);

	return mockQuery;
}

export {
	assembleTestArgumentObject,
	mockDB,
	getMockRowQueryResults,
	getMockUpdateQueryResults,
	getMockSheetQueryResults,
};