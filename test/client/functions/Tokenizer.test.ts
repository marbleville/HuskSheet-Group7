import Tokenizer from "../../../client/src/functions/Tokenizer";
import Parser from "../../../client/src/functions/Parser";
import Evaluator from "../../../client/src/functions/Evaluator";

describe("Formula tests", () => {
  let tokenizer: Tokenizer;

  beforeAll(() => {
    // parser = new Parser();
  });
  //   it("correctly parses a normal number that doesn't need to change", () => {
  //     const formula: string = "42";
  //     const result: string = parser.parse(formula);
  //     const expected: string = "42";
  //     expect(result).toEqual(expected);
  //   });

  it("check that the overall formula is working", () => {
    const context = {
      A1: 5,
      A2: 10,
      B1: 15,
    };
    const formula = "1+1";
    const parser = new Parser();
    const ast = parser.parse(formula);

    const evaluator = new Evaluator(context);
    const result = evaluator.evaluate(ast);
    const expected = "15High";
    expect(result).toEqual(expected);
  });

  it("check that nextToken works for +", () => {
    tokenizer = new Tokenizer();
    const formula: string = "1+1";
    const result: string | null = tokenizer.nextToken();
    const expected: string[] = ["1", "+", "1"];
    expect(result).toEqual(expected);
  });

  // it("check that tokenize works for +", () => {
  //   const formula: string = "1+1";
  //   const result: string[] = Tokenizer.tokenize(formula);
  //   const expected: string[] = ["1", "+", "1"];
  //   expect(result).toEqual(expected);
  // });

  // it("check that tokenize works for -", () => {
  //   const formula: string = "1*(1+3)";
  //   const result: string[] = Tokenizer.tokenize(formula);
  //   const expected: string[] = ["1", "*", "(", "1", "+", "3", ")"];
  //   expect(result).toEqual(expected);
  // });

  // it("check that tokenize works for +", () => {
  //   const formula: string = "1+1";
  //   const result: string[] = Tokenizer.tokenize(formula);
  //   const expected: string[] = ["1", "+", "1"];
  //   expect(result).toEqual(expected);
  // });

  // it("check that tokenize works for /", () => {
  //   const formula: string = "1+1";
  //   const result: string[] = Tokenizer.tokenize(formula);
  //   const expected: string[] = ["1", "+", "1"];
  //   expect(result).toEqual(expected);
  // });

  // test("check that tokenize works for (_  E)", () => {
  //   const formula: string = "1+1";
  //   const result: string[] = Tokenizer.tokenize(formula);
  //   const expected: string[] = ["1", "+", "1"];
  //   expect(result).toEqual(expected);
  // });

  // test("check that tokenizer breaks up expression correctly", () => {
  //   const formula: string = "sum(A1, A2, A3)";
  //   const result: string[] = Tokenizer.tokenize(formula);
  //   const expected: string[] = ["sum", "(", "A1", ",", "A2", ",", "A3", ")"];
  //   expect(result).toEqual(expected);
  // });
});
