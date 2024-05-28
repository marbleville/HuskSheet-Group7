import { getUpdatesForPublished } from "../../../server/src/functions/getUpdatesForPublished";
import { Argument } from "../../../types/types";
import { GetSheetRow } from "../../../server/src/database/db";
import DatabaseInstance from "../../../server/src/database/databaseInstance";

describe("getUpdatesForPublished", () => {
	const argument: Argument = {
		publisher: "examplePublisher",
		sheet: "sheet1",
		id: "0",
		payload: "",
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should return an an argument object containing the updates occuring after the argument ID", async () => {
		// We lose some type safety here, but it should not be an issue here
		const mockResult1 = {
			sheetid: 1,
			sheetname: argument.sheet,
			latest: "$A1 1\n$a2 'help'\n$B1 -1.01\n$C4 ''\n$c1 = SUM($A1:$B1)",
		} as GetSheetRow;

		// Mock the database query result
		const mockResultArr: GetSheetRow[] = [mockResult1];

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
		const result = await getUpdatesForPublished(argument);

		// Assert the result
		expect(result).toEqual({
			publisher: `${argument.publisher}`,
			sheet: `${mockResult1.sheetname}`,
			id: argument.id,
			payload: mockResult1.latest,
		});

		// Assert the database query function was called with the correct query string
		expect(mockQuery).toHaveBeenCalledWith(
			`SELECT updates.* FROM updates INNER JOIN sheets 
		ON updates.sheet=sheets.sheetid 
		WHERE sheets.sheetname=${argument.sheet};`
		);
	});

	it("should return an argument object with and empy payload section", async () => {
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
		const result = await getUpdatesForPublished(argument);

		// Assert the result
		expect(result).toEqual(argument);

		// Assert the database query function was called with the correct query string
		expect(mockQuery).toHaveBeenCalledWith(
			`SELECT updates.* FROM updates INNER JOIN sheets 
		ON updates.sheet=sheets.sheetid 
		WHERE sheets.sheetname=${argument.sheet};`
		);
	});
});
