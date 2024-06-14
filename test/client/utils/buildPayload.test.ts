import buildPayload from "../../../client/src/utils/buildPayload";
import { SheetDataMap } from "../../../client/src/types";

describe("addBuildPayload", () => {
    let data: SheetDataMap = {};
    data["$A1"] = "test";
    data["$A2"] = "test1";
    data["$AB1"] = "test2";
    data["$B1"] = "test3";
    data["$B5"] = "test4";
    data["$D12"] = "test5";
    data["$D3"] = "test6";

	it("gets 3 cells", () => {
    let set = new Set(["$A1", "$AB1", "$D12"]);
    expect(buildPayload(set, data)).toEqual("$A1 test\n$AB1 test2\n$D12 test5\n");
  });

  it("gets no cells", () => {
    let set = new Set([]);
    expect(buildPayload(set, data)).toEqual("");
  });

  it("all cells", () => {
    let set = new Set(["$A1", "$A2", "$B1", "$B5", "$D3", "$AB1", "$D12"]);
    expect(buildPayload(set, data)).toEqual("$A1 test\n$A2 test1\n$AB1 test2\n$B1 test3\n$B5 test4\n$D12 test5\n$D3 test6\n");
  });
});

