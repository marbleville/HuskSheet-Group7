import {
  FunctionCallNode,
  ExpressionNode,
  NumberNode,
  FormulaNode,
  ReferenceNode,
  OperationNode,
  StringNode,
} from "../../../client/src/functions/Nodes";
import Tokenizer from "../../../client/src/functions/Tokenizer";
import Parser from "../../../client/src/functions/Parser";

describe("Parser Test", () => {
  describe("Parser Singleton tests", () => {
    it("should return an instance of Parser", () => {
      const instance = Parser.getInstance();
      expect(instance).toBeInstanceOf(Parser);
    });

    it("should return the same instance for multiple calls", () => {
      const instance1 = Parser.getInstance();
      const instance2 = Parser.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  let parser: Parser;
  beforeEach(() => {
    parser = Parser.getInstance();
  });

  it("Checks that parser woks for formulas ", () => {
    const func: string = "=IF(1, 2)";
    const res: ExpressionNode = parser.parse(func);
    const expected: ExpressionNode = new FunctionCallNode("IF", [
      new NumberNode(1),
      new NumberNode(2),
    ]);
    expect(res).toEqual(expected);
  });

  it("Checks that parser for comma works properkly", () => {
    const func: string = "=IF(1, 2, 3)";
    const tokenizer = Tokenizer.getInstance();
    const tokens: string[] = tokenizer.tokenize(func);
    const res: ExpressionNode = parser.parse(func);
    const expected: ExpressionNode = new FunctionCallNode("IF", [
      new NumberNode(1),
      new NumberNode(2),
      new NumberNode(3),
    ]);
    expect(res).toEqual(expected);
  });

  it("should parse formulas correctly", () => {
    const func: string = "=SUM($A1, 2, 3)";
    const result = parser.parse(func);
    expect(result).toBeInstanceOf(FunctionCallNode);

    // Create the expected node structure
    const expected: ExpressionNode = new FunctionCallNode("SUM", [
      new ReferenceNode("$A1"),
      new NumberNode(2),
      new NumberNode(3),
    ]);

    expect(result).toEqual(expected);
  });

  it("should parse formulas correctly", () => {
    const func: string = "=SUM($A1, 1, 2, 3)";
    const res: ExpressionNode = parser.parse(func);
    const expected: ExpressionNode = new FunctionCallNode("SUM", [
      new ReferenceNode("$A1"),
      new NumberNode(1),
      new NumberNode(2),
      new NumberNode(3),
    ]);
    expect(res).toEqual(expected);
  });

  it("should parse formulas correctly", () => {
    const func: string = "-1";
    const res: ExpressionNode = parser.parse(func);
    const expected: ExpressionNode = new NumberNode(-1);
    expect(res).toEqual(expected);
  });

  it("should parse negative numbers correctly", () => {
    const func: string = "-1";
    const res: ExpressionNode = parser.parse(func);
    const expected: ExpressionNode = new NumberNode(-1);
    expect(res).toEqual(expected);
  });

  it("should parse formulas correctly", () => {
    const func: string = "-1";
    const res: ExpressionNode = parser.parse(func);
    const expected: ExpressionNode = new NumberNode(-1);
    expect(res).toEqual(expected);
  });

  it("should parse copy formula correctly", () => {
    const func: string = "=COPY($A1, $A2)";
    const res: ExpressionNode = parser.parse(func);
    const expected: ExpressionNode = new FunctionCallNode("COPY", [
      new ReferenceNode("$A1"),
      new ReferenceNode("$A2"),
    ]);
    expect(res).toEqual(expected);
  });

  it("should parse copy formula correctly", () => {
    const func: string = "=COPY(1,$A2)";
    const res: ExpressionNode = parser.parse(func);
    const expected: ExpressionNode = new FunctionCallNode("COPY", [
      new NumberNode(1),
      new ReferenceNode("$A2"),
    ]);
    expect(res).toEqual(expected);
  });

  it("should parse sum and range formula correctly", () => {
    const func: string = "=SUM($A1:$B4)";
    const res: ExpressionNode = parser.parse(func);
    const expected: ExpressionNode = new FunctionCallNode("SUM", [
      new OperationNode(
        new ReferenceNode("$A1"),
        ":",
        new ReferenceNode("$B4")
      ),
    ]);
    expect(res).toEqual(expected);
  });

  // it("should parse a %a1 to be a uppercase reference node", () => {
  //   const func: string = "$a1";
  //   const res: ExpressionNode = parser.parse(func);
  //   const expected: ExpressionNode = new ReferenceNode("$A1");
  //   expect(res).toEqual(expected);
  // });
});
