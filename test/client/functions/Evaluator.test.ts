import Evaluator from "../../../client/src/functions/Evaluator";
import {
  FunctionCallNode,
  INode,
  NumberNode,
} from "../../../client/src/functions/Nodes";
import Parser from "../../../client/src/functions/Parser";

describe("Evaluator Test", () => {
  it("Checks that evaluator works for a given parser", () => {
    const func: string = "=IF(1, 2, 3)";
    const res: INode = Parser.getInstance().parse(func);
    const expected: INode = new FunctionCallNode("IF", [
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
