import getColumnNumber from "../../../client/src/utils/getColumnNumber";

describe("getColumnNumber", () => {
	it("should return the column number", () => {
    expect(getColumnNumber("G")).toEqual(7);
    expect(getColumnNumber("A")).toEqual(1);
    expect(getColumnNumber("AB")).toEqual(28);
    expect(getColumnNumber("ZJW")).toEqual(17859);
  });
});



