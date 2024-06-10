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

  it("Checks that parser for comma works properkly", () => {
    const func: string = "=IF(1, 2)";
    const tokenizer = Tokenizer.getInstance();
    const tokens: string[] = tokenizer.tokenize(func);
    const res: ExpressionNode = parser.parse(tokens);
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
    const res: ExpressionNode = parser.parse(tokens);
    const expected: ExpressionNode = new FunctionCallNode("IF", [
      new NumberNode(1),
      new NumberNode(2),
      new NumberNode(3),
    ]);
    expect(res).toEqual(expected);
  });

  it("should parse formulas correctly", () => {
    const tokens: string[] = ["=SUM", "(", "$A1", ",", "2", ",", "3", ")"];
    const result = parser.parse(tokens);
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
    const tokenizer = Tokenizer.getInstance();
    const tokens: string[] = tokenizer.tokenize(func);
    console.log(tokens);
    const res: ExpressionNode = parser.parse(tokens);
    const expected: ExpressionNode = new FunctionCallNode("SUM", [
      new ReferenceNode("$A1"),
      new NumberNode(1),
      new NumberNode(2),
      new NumberNode(3),
    ]);
    expect(res).toEqual(expected);
  });
});
