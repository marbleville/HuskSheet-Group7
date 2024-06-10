import Evaluator from "../../../client/src/functions/Evaluator";
import {
  FunctionCallNode,
  ExpressionNode,
  NumberNode,
  OperationNode,
  ReferenceNode,
  StringNode,
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

  // Have to implement range and copy
  // describe("Check that range for functions works", () => {
  //   it("Check that : for the functions works", () => {
  //     const formula: string = "=DEBUG(SUM($A1:$B4))";
  //     const tokenizer = Tokenizer.getInstance();
  //     const tokens: string[] = tokenizer.tokenize(formula);
  //     const res: ExpressionNode = Parser.getInstance().parse(tokens);
  //     const expected: ExpressionNode = new FunctionCallNode("SUM", [
  //       new OperationNode(
  //         new ReferenceNode("$A1"),
  //         ":",
  //         new ReferenceNode("$A3")
  //       ),
  //     ]);
  //     expect(res).toEqual(expected);
  //     const evaluator: string = Evaluator.getInstance().evaluate(res);
  //     const expected1: string = "2";
  //     expect(evaluator).toStrictEqual(expected1);
  //   });
  // });

  // // Have to implement range and copy
  // describe("Check that range for functions works", () => {
  //   it("Check that : for the functions works", () => {
  //     // const formula: string = "=COPY($A1, "$B1")";
  //     const tokenizer = Tokenizer.getInstance();
  //     const tokens: string[] = tokenizer.tokenize(formula);
  //     const res: ExpressionNode = Parser.getInstance().parse(tokens);
  //     const expected: ExpressionNode = new FunctionCallNode("SUM", [
  //       new OperationNode(
  //         new ReferenceNode("$A1"),
  //         ":",
  //         new ReferenceNode("$A3")
  //       ),
  //     ]);
  //     expect(res).toEqual(expected);
  //     const evaluator: string = Evaluator.getInstance().evaluate(res);
  //     const expected1: string = "2";
  //     expect(evaluator).toStrictEqual(expected1);
  //   });
  // });
});
