import Parser from "../../../client/src/functions/Parser";

describe("Formula Parser tests", () => {
	let parser: Parser;

	beforeAll(() => {
		parser = new Parser();
	});
	it("correctly parses a normal number that doesn't need to change", () => {
		const formula: string = "42";
		const result: string = parser.parse(formula);
		const expected: string = "42";
		expect(result).toEqual(expected);
	});

	it("check that tokenize works for +", () => {
		const formula: string = "1+1";
		const result: string[] = parser.tokenize(formula);
		const expected: string[] = ["1", "+", "1"];
		expect(result).toEqual(expected);
	});

	it("check that tokenize works for -", () => {
		const formula: string = "1*(1+3)";
		const result: string[] = parser.tokenize(formula);
		const expected: string[] = ["1", "*", "(", "1", "+", "3", ")"];
		expect(result).toEqual(expected);
	});

	it("check that tokenize works for +", () => {
		const formula: string = "1+1";
		const result: string[] = parser.tokenize(formula);
		const expected: string[] = ["1", "+", "1"];
		expect(result).toEqual(expected);
	});

	it("check that tokenize works for /", () => {
		const formula: string = "1+1";
		const result: string[] = parser.tokenize(formula);
		const expected: string[] = ["1", "+", "1"];
		expect(result).toEqual(expected);
	});

	test("check that tokenize works for (_  E)", () => {
		const formula: string = "1+1";
		const result: string[] = parser.tokenize(formula);
		const expected: string[] = ["1", "+", "1"];
		expect(result).toEqual(expected);
	});

	test("check that parser takes in two numbers and adds them correctly", () => {
		const formula: string = "1+1";
		const result: string = parser.parse(formula);
		const expected: string = "";
		expect(result).toEqual(expected);
	});
});
