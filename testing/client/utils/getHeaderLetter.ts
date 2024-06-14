import getHeaderLetter from "../../../client/src/utils/getHeaderLetter";

describe("getColumnNumber", () => {
	it("should return the column number", () => {
    expect(getHeaderLetter(7)).toEqual("G");
    expect(getHeaderLetter(1)).toEqual("A");
    expect(getHeaderLetter(28)).toEqual("AB");
    expect(getHeaderLetter(17859)).toEqual("ZJW");
  });
});




