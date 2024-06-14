import getColAndRowFromRef from "../../../client/src/utils/getColAndRowFromRef";

describe("getColAndRowFromRef ", () => {
	it("should add all the cols", () => {
    expect(getColAndRowFromRef("$G2")).toEqual({col: "G", row: 2});
    expect(getColAndRowFromRef("$A89")).toEqual({col: "A", row: 89});
    expect(getColAndRowFromRef("$AB42")).toEqual({col: "AB", row: 42});
  });

  it("should error on invalid", () => {
    try {
      getColAndRowFromRef("A89");
    } catch (error) {
			expect(error).toMatch("Invalid reference format");
    }
  });
  it("should error", () => {
    try {
      getColAndRowFromRef("$89a");
    } catch (error) {
			expect(error).toEqual(new Error("Invalid reference format"));
    }
  });
});


