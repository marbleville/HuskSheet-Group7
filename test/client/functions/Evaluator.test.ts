import Evaluator from "../../../client/src/functions/Evaluator";
import {
  FunctionCallNode,
  ExpressionNode,
  NumberNode,
} from "../../../client/src/functions/Nodes";
import Tokenizer from "../../../client/src/functions/Tokenizer";
import Parser from "../../../client/src/functions/Parser";

describe("Evaluator Test", () => {
  it("Checks that evaluator works for a given parser", () => {
    const func: string = "=IF(1, 2, 3)";
    const tokenizer = Tokenizer.getInstance();
    const tokens: string[] = tokenizer.tokenize(func);
    const res: ExpressionNode = Parser.getInstance().parse(tokens);
    const expected: ExpressionNode = new FunctionCallNode("IF", [
      new NumberNode(1),
      new NumberNode(2),
      new NumberNode(3),
    ]);
    expect(res).toEqual(expected);
    const evaluator: string = Evaluator.getInstance().evaluate(res);
    const expected1: string = "2";
    expect(evaluator).toStrictEqual(expected1);
  });
});
