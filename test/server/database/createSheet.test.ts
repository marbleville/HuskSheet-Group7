import { createSheet } from "../../../server/src/functions/createSheet";
import { getSheets } from "../../../server/src/functions/getSheets";
import { Argument } from "../../../types/types";
import { assembleTestArgumentObject, setupDB } from "../../utils";

describe("createSheet", () => {
	it("checks to see if sheet appears after insertion", async () => {
    await setupDB();
    
    const pub: string = "hunter";
    const sheetName: string = "new_sheet name";
    await createSheet(assembleTestArgumentObject(pub, sheetName, "", ""));
    let sheets = await getSheets(assembleTestArgumentObject("hunter", "", "", ""));
    expect(sheets.some(sheet => sheet.publisher === pub && sheet.sheet === sheetName)).toEqual(true);
  });
});
