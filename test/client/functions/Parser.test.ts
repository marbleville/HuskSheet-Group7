import {
  FunctionCallNode,
  INode,
  NumberNode,
} from "../../../client/src/functions/Nodes";
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

  it("Checks that parser for comma works properkly", () => {
    const func: string = "=IF(1, 2)";
    const res: INode = Parser.getInstance().parse(func);
    const expected: INode = new FunctionCallNode("IF", [
      new NumberNode(1),
      new NumberNode(2),
    ]);
    expect(res).toEqual(expected);
  });

  it("Checks that parser for comma works properkly", () => {
    const func: string = "=IF(1, 2, 3)";
    const res: INode = Parser.getInstance().parse(func);
    const expected: INode = new FunctionCallNode("IF", [
      new NumberNode(1),
      new NumberNode(2),
      new NumberNode(3),
    ]);
    expect(res).toEqual(expected);
  });
});
