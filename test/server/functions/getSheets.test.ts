import { getSheets } from "../../../server/src/functions/getSheets";
import { Argument } from "../../../types/types";
import { GetSheetRow } from "../../../server/src/database/db";
import DatabaseInstance from "../../../server/src/database/databaseInstance";

describe("getSheets", () => {
	const argument: Argument = {
		publisher: "examplePublisher",
		sheet: "",
		id: "",
		payload: "",
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should return an array of arguments containing all sheets associated with the publisher", async () => {
		// We lose some type safety here, but it should not be an issue here
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
				publisher: `${argument.publisher}`,
				sheet: `${mockResult1.sheetname}`,
				id: "",
				payload: "",
			},
			{
				publisher: `${argument.publisher}`,
				sheet: `${mockResult2.sheetname}`,
				id: "",
				payload: "",
			},
		]);

		// Assert the database query function was called with the correct query string
		expect(mockQuery).toHaveBeenCalledWith(
			`SELECT sheets.sheetid, sheets.sheetname FROM sheets 
		INNER JOIN publishers ON sheets.owner=publishers.userid 
		WHERE publishers.username='${argument.publisher}';`
		);
	});

	it("should return an empty array if the publisher has no sheets", async () => {
		// Mock the database query result
		const mockResultArr: GetSheetRow[] = [];

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
		expect(result).toEqual([]);

		// Assert the database query function was called with the correct query string
		expect(mockQuery).toHaveBeenCalledWith(
			`SELECT sheets.sheetid, sheets.sheetname FROM sheets 
		INNER JOIN publishers ON sheets.owner=publishers.userid 
		WHERE publishers.username='${argument.publisher}';`
		);
	});
});
