import { getSheets } from "../../../server/src/functions/getSheets";
import { Argument } from "../../../types/types";
import { GetSheetRow } from "../../../server/src/database/db";
import {
	assembleTestArgumentObject,
	mockDB,
	getMockSheetQueryResults,
} from "../../utils";
import DatabaseQueries from "../../../types/queries";

describe("getSheets", () => {
	const argument: Argument = assembleTestArgumentObject(
		"examplePublisher",
		"",
		"",
		""
	);
	let mockResultArr: GetSheetRow[] = [];

	afterEach(() => {
		jest.clearAllMocks();
		mockResultArr = [];
	});

	it("should return an array of arguments containing all sheets associated with the publisher", async () => {
		for (let i = 0; i < 5; i++) {
			mockResultArr.push(
				getMockSheetQueryResults(i + 1, `Sheet ${i + 1}`)
			);
		}

		const mockQuery = mockDB(mockResultArr);

		const result = await getSheets(argument);

		result.forEach((sheet, idx) => {
			expect(sheet).toEqual({
				publisher: `${argument.publisher}`,
				sheet: `Sheet ${idx + 1}`,
				id: "",
				payload: "",
			});
		});

		expect(mockQuery).toHaveBeenCalledWith(
			DatabaseQueries.getSheets(argument.publisher)
		);
	});

	it("should return an empty array if the publisher has no sheets", async () => {
		const mockQuery = mockDB(mockResultArr);

		const result = await getSheets(argument);

		expect(result).toEqual([]);

		expect(mockQuery).toHaveBeenCalledWith(
			DatabaseQueries.getSheets(argument.publisher)
		);
	});
});
