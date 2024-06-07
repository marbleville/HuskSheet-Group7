import Tokenizer from "../../../client/src/functions/Tokenizer";
import Parser from "../../../client/src/functions/Parser";
import Evaluator from "../../../client/src/functions/Evaluator";

describe("Tokenizer tests", () => {
  it("Checks that tokenizer for functions works properkly", () => {
    const func: string = "=IF(1, 2)";
    const res: string[] = Tokenizer.getInstance().tokenize(func);
    const expected = ["=IF", "(", "1", ",", "2", ")"];
    expect(res).toEqual(expected);
  });

  it("Checks that tokenizer for expression for (", () => {
    const func: string = "=1+(2+5)";
    const res: string[] = Tokenizer.getInstance().tokenize(func);
    const expected = ["=", "1", "+", "(", "2", "+", "5", ")"];
    expect(res).toEqual(expected);
  });

  it("Checks that tokenizer for expression for (", () => {
    const func: string = "=SUM(A1, A2)";
    const res: string[] = Tokenizer.getInstance().tokenize(func);
    const expected = ["=SUM", "(", "A1", ",", "A2", ")"];
    expect(res).toEqual(expected);
  });
});
