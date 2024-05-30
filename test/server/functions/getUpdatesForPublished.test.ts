import { getUpdatesForPublished } from "../../../server/src/functions/getUpdatesForPublished";
import { Argument } from "../../../types/types";
import { GetUpdateRow } from "../../../server/src/database/db";
import {
	assembleTestArgumentObject,
	mockDB,
	getMockUpdateQueryResults,
} from "../../utils";
import DatabaseQueries from "../../../types/queries";

describe("getUpdatesForPublished", () => {
	const argument: Argument = assembleTestArgumentObject(
		"examplePublisher",
		"sheet1",
		"0",
		""
	);
	let mockResultArr: GetUpdateRow[] = [];

	afterEach(() => {
		jest.clearAllMocks();
		mockResultArr = [];
	});

	it("should return an an argument object containing the updates occuring after the argument ID", async () => {
		// We lose some type safety here, but it should not be an issue here
		const mockResult1 = {
			updateid: 1,
			changes: "$A1 1\n$a2 'help'\n$B1 -1.01\n$C4 ''\n$c1 = SUM($A1:$B1)",
		} as GetUpdateRow;

		// Mock the database query result
		const mockResultArr: GetUpdateRow[] = [
			getMockUpdateQueryResults(
				1,
				"$A1 1\n$a2 'help'\n$B1 -1.01\n$C4 ''\n$c1 = SUM($A1:$B1)"
			),
		];

		// Mock the database query function
		const mockQuery = mockDB(mockResultArr);

		// Call the getSheets function
		const result = await getUpdatesForPublished(argument);

		// Assert the result
		expect(result).toEqual({
			publisher: `${argument.publisher}`,
			sheet: `${argument.sheet}`,
			id: mockResult1.updateid.toString(),
			payload: mockResult1.changes,
		});

		// Assert the database query function was called with the correct query string
		expect(mockQuery).toHaveBeenCalledWith(
			DatabaseQueries.getUpdatesForPublished(argument.sheet)
		);
	});

	it("should return an argument object with and empy payload section", async () => {
		const mockResultArr: GetUpdateRow[] = [];

		const mockQuery = mockDB(mockResultArr);

		const result = await getUpdatesForPublished(argument);

		expect(result).toEqual(argument);

		// Assert the database query function was called with the correct query string
		expect(mockQuery).toHaveBeenCalledWith(
			DatabaseQueries.getUpdatesForPublished(argument.sheet)
		);
	});
});
