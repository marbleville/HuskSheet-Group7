import findDependencies from "../../../client/src/utils/findDependencies";
import { SheetDataMap } from "../../../client/src/types";

describe("getColumnNumber", () => {
	it("should return the column number", () => {
    let data: SheetDataMap = {};
    data["$A1"] = "=$B2";
    data["$C5"] = "=$B2";
    data["$G5"] = "=$B2";
    data["$Z9"] = "=$B2";
    data["$B2"] = "";
    data["$AA1"] = "5";

    expect(findDependencies(data, "$B2")).toEqual([]);
  });

	it("should return the column number", () => {
    let data: SheetDataMap = {};
    data["$A1"] = "=$B2";
    data["$C5"] = "=$G5";
    data["$G5"] = "=$Z9";
    data["$Z9"] = "test";
    data["$B2"] = "=$C5";
    data["$AA1"] = "5";

    expect(findDependencies(data, "$B2")).toEqual(["$C5"]);
  });

	it("should return the column number", () => {
    let data: SheetDataMap = {};
    data["$A1"] = "=$B2";
    data["$C5"] = "=$G5";
    data["$G5"] = "=$Z9";
    data["$Z9"] = "test";
    data["$B2"] = "=$C5";
    data["$AA1"] = "=SUM($C1:$C5)";

    expect(findDependencies(data, "$AA1")).toEqual(["$C1", "$C5"]);
  });
});
