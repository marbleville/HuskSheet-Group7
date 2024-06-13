import Evaluator from "../../../client/src/functions/Evaluator";
import {
  FunctionCallNode,
  ExpressionNode,
  NumberNode,
  OperationNode,
  ReferenceNode,
  StringNode,
  FormulaNode,
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
    const res: ExpressionNode = Parser.getInstance().parse(func);
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
    const res: ExpressionNode = Parser.getInstance().parse(func);
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
    const func: string = "=SUM($A2, $A3)";
    const res: ExpressionNode = Parser.getInstance().parse(func);
    console.log("Parsed result:", res); // Debug log
    const expected: ExpressionNode = new FunctionCallNode("SUM", [
      new ReferenceNode("$A2"),
      new ReferenceNode("$A3"),
    ]);
    expect(res).toEqual(expected);

    const evaluator: Evaluator = Evaluator.getInstance();
    evaluator.setContext({
      $A2: "1",
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
    evaluator.evaluate(parsed);
    const result = evaluator.getContextValue("$A2");
    const expected = "1";
    expect(result).toEqual(expected);
  });

  // /**
  //  * @todo this doesnt work
  //  */
  // it("Check that copy function works properly", () => {
  //   evaluator.setContext({
  //     $A1: "Hello",
  //     $A2: "works",
  //   });
  //   const parsed: ExpressionNode = new FunctionCallNode("COPY", [
  //     new ReferenceNode("$A1"),
  //     new ReferenceNode("$A2"),
  //   ]);
  //   evaluator.evaluate(parsed);
  //   const result = evaluator.getContextValue("$A2");
  //   const expected = "Hello";
  //   expect(result).toEqual(expected);
  // });

  it("Check that the sum of range operation works", () => {
    const parsed: ExpressionNode = new FunctionCallNode("SUM", [
      new OperationNode(
        new ReferenceNode("$A1"),
        ":",
        new ReferenceNode("$B4")
      ),
    ]);

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

    const result = evaluator.evaluate(parsed);
    const expected = "36";
    expect(result).toEqual(expected);
  });

  describe("Test that evalute works", () => {
    test("should evaluate NumberNode correctly", () => {
      const node = new NumberNode(42);
      const result = evaluator.evaluate(node);
      expect(result).toBe("42");
    });

    test("should evaluate StringNode correctly", () => {
      const node = new StringNode("hello");
      const result = evaluator.evaluate(node);
      expect(result).toBe("hello");
    });

    test("should evaluate ReferenceNode correctly", () => {
      evaluator.setContext({ $A1: "world" });
      const node = new ReferenceNode("$A1");
      const result = evaluator.evaluate(node);
      expect(result).toBe("world");
    });

    test("should return reference name if ReferenceNode is not in context", () => {
      const node = new ReferenceNode("$B1");
      const result = evaluator.evaluate(node);
      expect(result).toBe("$B1");
    });

    test("should evaluate OperationNode correctly for addition", () => {
      const leftNode = new NumberNode(2);
      const rightNode = new NumberNode(3);
      const node = new OperationNode(leftNode, "+", rightNode);
      const result = evaluator.evaluate(node);
      expect(result).toBe("5");
    });

    test("should evaluate OperationNode correctly for subtraction", () => {
      const leftNode = new NumberNode(5);
      const rightNode = new NumberNode(3);
      const node = new OperationNode(leftNode, "-", rightNode);
      const result = evaluator.evaluate(node);
      expect(result).toBe("2");
    });

    test("should evaluate FunctionCallNode correctly", () => {
      const arg1 = new NumberNode(10);
      const arg2 = new NumberNode(20);
      const node = new FunctionCallNode("SUM", [arg1, arg2]);
      const result = evaluator.evaluate(node);
      expect(result).toBe("30");
    });

    test("should evaluate FormulaNode correctly", () => {
      const innerNode = new NumberNode(7);
      const node = new FormulaNode(innerNode);
      const result = evaluator.evaluate(node);
      expect(result).toBe("7");
    });
  });
});
