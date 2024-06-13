import addRowData from "../../../client/src/utils/addRowData";
import { SheetDataMap } from "../../../client/src/types";

describe("addRowData", () => {
	it("should add all the cols", () => {
    let numRows = 5;
    let numCols = 7;
    let data: SheetDataMap = {};
    expect(addRowData(data, numCols, numRows)).toEqual({
      "$A8": "",
      "$B8": "",
      "$C8": "",
      "$D8": "",
      "$E8": "",
} as SheetDataMap);
  });

	it("should add all the cols", () => {
    let numRows = 7;
    let numCols = 5;
    let data: SheetDataMap = {};
    expect(addRowData(data, numCols, numRows)).toEqual({
      "$A6": "",
      "$B6": "",
      "$C6": "",
      "$D6": "",
      "$E6": "",
      "$F6": "",
      "$G6": "",
} as SheetDataMap);
  });
});

