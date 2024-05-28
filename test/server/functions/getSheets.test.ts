import { getSheets } from "../../../server/src/functions/getSheets";
import { Argument } from "../../../types/types";
import { GetSheetRow } from "../../../server/src/database/db";
import DatabaseInstance from "../../../server/src/database/databaseInstance";
import { connect } from "http2";

describe("getSheets", () => {
	it("should return an array of arguments containing all sheets associated with the publisher", async () => {
		// Mock the argument object
		const argument: Argument = {
			publisher: "examplePublisher",
			sheet: "",
			id: "",
			payload: "",
		};

		// We lose some type safety here, but it should not be necessary here
		const mockResult1 = {
			sheetid: 1,
			sheetname: "Sheet 1",
		} as GetSheetRow;

		const mockResult2 = {
			sheetid: 2,
			sheetname: "Sheet 2",
		} as GetSheetRow;

		// Mock the database query result
		const mockResultArr: GetSheetRow[] = [mockResult1, mockResult2];

		// Mock the database query function
		const mockQuery = jest.fn().mockResolvedValue(mockResultArr);

		// Mock the database instance
		const mockDatabaseInstance: DatabaseInstance = {
			query: mockQuery,
		};

		// Mock the DatabaseInstance.getInstance() method
		jest.spyOn(DatabaseInstance, "getInstance").mockReturnValue(
			mockDatabaseInstance
		);

		// Call the getSheets function
		const result = await getSheets(argument);

		// Assert the result
		expect(result).toEqual([
			{
				publisher: "examplePublisher",
				sheet: "Sheet 1",
				id: "",
				payload: "",
			},
			{
				publisher: "examplePublisher",
				sheet: "Sheet 2",
				id: "",
				payload: "",
			},
		]);

		// Assert the database query function was called with the correct query string
		expect(mockQuery).toHaveBeenCalledWith(
			"SELECT sheets.sheetid, sheets.sheetname FROM sheets INNER JOIN publishers ON sheets.owner=publishers.userid WHERE publishers.username='examplePublisher';"
		);
	});
});
