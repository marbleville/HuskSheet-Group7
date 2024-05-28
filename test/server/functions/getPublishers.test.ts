import { getPublishers } from "../../../server/src/functions/getPublishers";
import { GetUserRow } from "../../../server/src/database/db";
import DatabaseInstance from "../../../server/src/database/databaseInstance";

describe("getPublishers", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should return an array of arguments containing all publishers", async () => {
		// We lose some type safety here, but it should not be an issue here
		const mockResult1 = {
			username: "examplePublisher1",
		} as GetUserRow;

		const mockResult2 = {
			username: "examplePublisher2",
		} as GetUserRow;

		// Mock the database query result
		const mockResultArr: GetUserRow[] = [mockResult1, mockResult2];

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
		const result = await getPublishers();

		// Assert the result
		expect(result).toEqual([
			{
				publisher: `${mockResult1.username}`,
				sheet: "",
				id: "",
				payload: "",
			},
			{
				publisher: `${mockResult2.username}`,
				sheet: "",
				id: "",
				payload: "",
			},
		]);

		// Assert the database query function was called with the correct query string
		expect(mockQuery).toHaveBeenCalledWith(
			"SELECT username FROM publishers"
		);
	});

	it("should return an empty array if no publishers exist", async () => {
		// Mock the database query result
		const mockResultArr: GetUserRow[] = [];

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
		const result = await getPublishers();

		// Assert the result
		expect(result).toEqual([]);

		// Assert the database query function was called with the correct query string
		expect(mockQuery).toHaveBeenCalledWith(
			"SELECT username FROM publishers"
		);
	});
});
