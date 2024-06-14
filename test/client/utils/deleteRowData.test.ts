import deleteRowData from "../../../client/src/utils/deleteRowData";
import { SheetDataMap } from "../../../client/src/types";

/**
 * Tests for the deleteRowData function.
 * 
 * @author kris-amerman
 */
describe("deleteRowData", () => {
  it("should return sheetData unchanged if there's only one row", () => {
    const initialData: SheetDataMap = {
      "$A1": "Value 1",
      "$B1": "Value 2",
    };
    const numRows = 1;
    const numCols = 2;
    const handleCellUpdate = jest.fn();

    const result = deleteRowData(initialData, numRows, numCols, handleCellUpdate);

    // Expect the result to be unchanged
    expect(result).toEqual(initialData);
    // Ensure handleCellUpdate is not called
    expect(handleCellUpdate).not.toHaveBeenCalled();
  });

  it("should delete the last row and trigger handleCellUpdate for each cell in the row", () => {
    const initialData: SheetDataMap = {
      "$A1": "Value 1",
      "$A2": "Value 2",
      "$B1": "Value 3",
      "$B2": "Value 4",
    };
    const numRows = 2;
    const numCols = 2;
    const handleCellUpdate = jest.fn((value, cellID) => {
      // Simulate state update
      initialData[cellID] = value;
    });

    // Call deleteRowData and expect it to indirectly update initialData
    deleteRowData(initialData, numRows, numCols, handleCellUpdate);

    // After deleteRowData, expect initialData to have the last row deleted
    const expectedData: SheetDataMap = {
      "$A1": "Value 1",
      "$A2": "",
      "$B1": "Value 3",       
      "$B2": "",      
    };

    // Expect initialData to match the expectedData after indirect updates
    expect(initialData).toEqual(expectedData);

    // Expect handleCellUpdate to be called for each cell in the deleted row
    expect(handleCellUpdate).toHaveBeenCalledTimes(2); // Since numCols is 2
    expect(handleCellUpdate).toHaveBeenCalledWith("", "$A2");
    expect(handleCellUpdate).toHaveBeenCalledWith("", "$B2");
  });
});
