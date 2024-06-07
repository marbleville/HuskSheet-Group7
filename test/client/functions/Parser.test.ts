import { INode } from "../../../client/src/functions/Nodes";
import Parser from "../../../client/src/functions/Parser";

describe("Parser Test", () => {
  it("Checks that parser for comma works properkly", () => {
    const func: string = "=IF(1, 2)";
    const res: INode = Parser.getInstance().parse(func);
    const expected = ["=IF", "(", "1", ",", "2", ")"];
    expect(res).toEqual(expected);
  });
});
