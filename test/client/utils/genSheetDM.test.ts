import generateSheetDataMap from "../../../client/src/utils/generateSheetDataMap";
import { SheetDataMap } from "../../../client/src/types";

describe("getColumnNumber", () => {
	it("should return the column number", () => {
    expect(generateSheetDataMap("$A1 1", 0, 0,)).toEqual({ sheetMap: {"$A1": "1",}, newColSize: 1, newRowSize: 1 });
  });
	it("should return the column number", () => {
    expect(generateSheetDataMap("", 2, 5,)).toEqual({ sheetMap: {}, newColSize: 2, newRowSize: 5 });
  });
	it("should return the column number", () => {
    expect(generateSheetDataMap("$A1 1\n$AZ25 =SUM($A1)", 10, 5,)).toEqual({ sheetMap: {
      "$A1": "1", "$AZ25": "=SUM($A1)"}, newColSize: 52, newRowSize: 25 });
  });
	it("should return the column number", () => {
    expect(generateSheetDataMap("$A1 1\n$K27 test\n$AA20 20", 20, 20,)).toEqual({ sheetMap: {
      "$A1": "1", "$AA20": "20","$K27": "test"}, newColSize: 27, newRowSize: 27 });
  });
});

