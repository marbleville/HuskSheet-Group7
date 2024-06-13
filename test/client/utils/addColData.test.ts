import addColData from "../../../client/src/utils/addColData";
import { SheetDataMap } from "../../../client/src/types";

describe("addColData", () => {
	it("should add all the rows", () => {
    let numRows = 5;
    let numCols = 7;
    let data: SheetDataMap = {};
    expect(addColData(data, numCols, numRows)).toEqual({"$H1": "", "$H2": "", "$H3": "", "$H4": "", "$H5": ""} as SheetDataMap);
  });

	it("should add all the rows", () => {
    let numRows = 7;
    let numCols = 5;
    let data: SheetDataMap = {};
    expect(addColData(data, numCols, numRows)).toEqual({"$F1": "", "$F2": "", "$F3": "", "$F4": "", "$F5": "", "$F6": "", "$F7": ""} as SheetDataMap);
  });
});
