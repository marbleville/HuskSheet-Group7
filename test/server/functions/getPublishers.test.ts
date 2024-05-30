import { getPublishers } from "../../../server/src/functions/getPublishers";
import { GetUserRow } from "../../../server/src/database/db";
import { mockDB, getMockRowQueryResults } from "../../utils";

describe("getPublishers", () => {
	let mockResultArr: GetUserRow[] = [];

	afterEach(() => {
		jest.clearAllMocks();
		mockResultArr = [];
	});

	it("should return an array of arguments containing all publishers", async () => {
		for (let i = 0; i < 5; i++) {
			mockResultArr.push(
				getMockRowQueryResults(`examplePublisher${i + 1}`)
			);
		}

		const mockQuery = mockDB(mockResultArr);

		const result = await getPublishers();

		result.forEach((publisher, idx) => {
			expect(publisher.publisher).toEqual(`examplePublisher${idx + 1}`);
			expect(publisher.sheet).toEqual("");
			expect(publisher.id).toEqual("");
			expect(publisher.payload).toEqual("");
		});

		expect(mockQuery).toHaveBeenCalledWith(
			"SELECT username FROM publishers"
		);
	});

	it("should return an empty array if no publishers exist", async () => {
		const mockQuery = mockDB(mockResultArr);

		const result = await getPublishers();

		expect(result).toEqual([]);

		expect(mockQuery).toHaveBeenCalledWith(
			"SELECT username FROM publishers"
		);
	});
});
