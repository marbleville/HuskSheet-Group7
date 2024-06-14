import deleteColData from "../../../client/src/utils/deleteColData";
import { SheetDataMap } from "../../../client/src/types";

/**
 * Tests for the deleteColData function.
 * 
 * @author kris-amerman
 */
describe("deleteColData", () => {
  it("should return sheetData unchanged if there's only one column", () => {
    const initialData: SheetDataMap = {
      "$A1": "Value 1",
      "$A2": "Value 2",
    };
    const numCols = 1;
    const numRows = 2;
    const handleCellUpdate = jest.fn();

    const result = deleteColData(initialData, numCols, numRows, handleCellUpdate);

    // Expect the result to be unchanged
    expect(result).toEqual(initialData);
    // Ensure handleCellUpdate is not called
    expect(handleCellUpdate).not.toHaveBeenCalled();
  });

  it("should delete the last column and trigger handleCellUpdate for each cell in the column", () => {
    const initialData: SheetDataMap = {
      "$A1": "Value 1",
      "$B1": "Value 2",
      "$A2": "Value 3",
      "$B2": "Value 4",
    };
    const numCols = 2;
    const numRows = 2;
    const handleCellUpdate = jest.fn((value, cellID) => {
      // Simulate state update
      initialData[cellID] = value;
    });

    // Call deleteColData and expect it to indirectly update initialData
    deleteColData(initialData, numCols, numRows, handleCellUpdate);

    // After deleteColData, expect initialData to have the last column deleted
    const expectedData: SheetDataMap = {
      "$A1": "Value 1",
      "$A2": "Value 3", 
      "$B1": "",       
      "$B2": "",       
    };

    // Expect initialData to match the expectedData after indirect updates
    expect(initialData).toEqual(expectedData);

    // Expect handleCellUpdate to be called for each cell in the deleted column
    expect(handleCellUpdate).toHaveBeenCalledTimes(2); // Since numRows is 2
    expect(handleCellUpdate).toHaveBeenCalledWith("", "$B1");
    expect(handleCellUpdate).toHaveBeenCalledWith("", "$B2");
  });
});
