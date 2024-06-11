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
  describe("Evaluator Singleton tests", () => {
    it("should return an instance of Evaluator", () => {
      const instance = Evaluator.getInstance();
      expect(instance).toBeInstanceOf(Evaluator);
    });

    it("should return the same instance for multiple calls", () => {
      const instance1 = Evaluator.getInstance();
      const instance2 = Evaluator.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  let evaluator: Evaluator;

  beforeEach(() => {
    evaluator = Evaluator.getInstance();
  });

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

  it("Checks that evaluator works for a given parser", () => {
    const func: string = "=SUM($A1, $A3)";
    const tokenizer = Tokenizer.getInstance();
    const tokens: string[] = tokenizer.tokenize(func);
    console.log("Tokens:", tokens); // Debug log
    const res: ExpressionNode = Parser.getInstance().parse(tokens);
    console.log("Parsed result:", res); // Debug log
    const expected: ExpressionNode = new FunctionCallNode("SUM", [
      new ReferenceNode("$A1"),
      new ReferenceNode("$A3"),
    ]);
    expect(res).toEqual(expected);

    const evaluator: Evaluator = Evaluator.getInstance();
    evaluator.setContext({
      $A1: "2",
      $A3: "3", // Added context for $A3
    });

    const expected1: string = "5"; // Expected result of 2 + 3
    const result: string = evaluator.evaluate(res);
    console.log("Evaluation result:", result); // Debug log
    expect(result).toEqual(expected1);
  });

  it("Checks that evaluator works for a given parser", () => {
    const func: string = "=SUM(1, $A3)";
    const tokenizer = Tokenizer.getInstance();
    const tokens: string[] = tokenizer.tokenize(func);
    console.log("Tokens:", tokens); // Debug log
    const res: ExpressionNode = Parser.getInstance().parse(tokens);
    console.log("Parsed result:", res); // Debug log
    const expected: ExpressionNode = new FunctionCallNode("SUM", [
      new NumberNode(1),
      new ReferenceNode("$A3"),
    ]);
    expect(res).toEqual(expected);

    const evaluator: Evaluator = Evaluator.getInstance();
    evaluator.setContext({
      $A1: "1",
      $A3: "3", // Added context for $A3
    });

    const expected1: string = "4"; // Expected result of 2 + 3
    const result: string = evaluator.evaluate(res);
    console.log("Evaluation result:", result); // Debug log
    expect(result).toEqual(expected1);
  });
  // // Have to implement range and copy
  // describe("Check that range for functions works", () => {
  //   it("Check that : for the functions works", () => {
  //     // Get value from A1 - A4, B1 - B4
  //     const formula: string = "=DEBUG(SUM($A1:$B4))";
  //     const tokenizer = Tokenizer.getInstance();
  //     const tokens: string[] = tokenizer.tokenize(formula);
  //     // Should go over the values from A1 to A4 then B1 to B4
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

  it("Check that copy function works properly", () => {
    const parsed: ExpressionNode = new FunctionCallNode("COPY", [
      new NumberNode(1),
      new ReferenceNode("$A2"),
    ]);
    const debug = evaluator.evaluate(parsed);
    const result = evaluator.getContextValue("$A2");
    const expected = "1";
    expect(result).toEqual(expected);
  });

  it("Check that the range operation works", () => {
    const parsed: ExpressionNode = new OperationNode("$A1", ":", "$B4");
    const debug = evaluator.evaluate(parsed);
    const result = evaluator.getContextValue("$A2");
    evaluator.setContext({
      $A1: "1",
      $A2: "2",
      $A3: "3",
      $A4: "4",
      $B1: "5",
      $B2: "6",
      $B3: "7",
      $B4: "8",
    });
    const expected = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(result).toEqual(expected);
  });
});
