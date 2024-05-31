// import { register } from "../../../server/src/functions/register";
// import DatabaseInstance from "../../../server/src/database/databaseInstance";
// import { GetUserRow } from "../../../server/src/database/db";
// import { Argument } from "../../../types/types";

// describe("register", () => {
//   const registerArgument: Argument = {
//     id: "6",
//     username: "alice",
//     password: "123",
//   };

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("should add the username and password to the get publishers to see whether works", async () => {
//     // We lose some type safety here, but it should not be an issue here
//     const mockResult1 = {
//       id: "4",
//       username: "alice",
//       password: "123",
//     } as RegisterArgument;

//     const mockResult2 = {
//       id: "5",
//       username: "ruben",
//       password: "123",
//     } as RegisterArgument;

//     // Mock the database query result
//     const mockResultArr: GetUserRow[] = [mockResult1, mockResult2];

//     // Mock the database query function
//     const mockQuery = jest.fn().mockResolvedValue(mockResultArr);

//     // Mock the database instance
//     const mockDatabaseInstance: DatabaseInstance = {
//       query: mockQuery,
//     };

//     // Mock the DatabaseInstance.getInstance() method
//     jest
//       .spyOn(DatabaseInstance, "getInstance")
//       .mockReturnValue(mockDatabaseInstance);

//     // Call the register function
//     const result = await register(registerArgument);

//     // Assert the result
//     expect(result).toEqual([
//       {
//         success: `true`,
//         sheet: `null`,
//         id: "",
//         payload: "",
//       },
//       {
//         publisher: `${argument.publisher}`,
//         sheet: `${mockResult2.sheetname}`,
//         id: "",
//         payload: "",
//       },
//     ]);

//     // Assert the database query function was called with the correct query string
//     expect(mockQuery).toHaveBeenCalledWith(
//       `SELECT sheets.sheetid, sheets.sheetname FROM sheets
// 		INNER JOIN publishers ON sheets.owner=publishers.userid
// 		WHERE publishers.username='${argument.publisher}';`
//     );
//   });

//   it("should return an empty array if the publisher has no sheets", async () => {
//     // Mock the database query result
//     const mockResultArr: GetSheetRow[] = [];

//     // Mock the database query function
//     const mockQuery = jest.fn().mockResolvedValue(mockResultArr);

//     // Mock the database instance
//     const mockDatabaseInstance: DatabaseInstance = {
//       query: mockQuery,
//     };

//     // Mock the DatabaseInstance.getInstance() method
//     jest
//       .spyOn(DatabaseInstance, "getInstance")
//       .mockReturnValue(mockDatabaseInstance);

//     // Call the getSheets function
//     const result = await register(argument);

//     // Assert the result
//     expect(result).toEqual([]);

//     // Assert the database query function was called with the correct query string
//     expect(mockQuery).toHaveBeenCalledWith(
//       `SELECT sheets.sheetid, sheets.sheetname FROM sheets
// 		INNER JOIN publishers ON sheets.owner=publishers.userid
// 		WHERE publishers.username='${argument.publisher}';`
//     );
//   });
// });
