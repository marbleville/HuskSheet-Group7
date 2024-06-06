import { getSheets } from "../../../server/src/functions/getSheets";
import { Argument } from "../../../types/types";
import { assembleTestArgumentObject } from "../../utils"

describe("getSheets", () => {
	it("should return an array of all sheets owned by the given publisher", async () => {
    const arg = assembleTestArgumentObject("hunter", "", "", "");
    expect(await getSheets(arg)).toEqual([
      {
        "id": "",
        "payload": "",
        "publisher": "hunter",
        "sheet": "test3",
      } as Argument,
      {
        "id": "",
        "payload": "",
        "publisher": "hunter",
        "sheet": "test4",
      } as Argument
    ]);
  });
});
