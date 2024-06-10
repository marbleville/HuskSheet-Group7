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
    let sheets = await getSheets(assembleTestArgumentObject(pub, "", "", ""));
    expect(sheets.some(sheet => sheet.publisher === pub && sheet.sheet === sheetName)).toEqual(true);
  });

	it("checks to see if it adds a number to a duplicate sheet name", async () => {
    await setupDB();
    
    const pub: string = "hunter";
    const sheetName: string = "test3";
    await createSheet(assembleTestArgumentObject(pub, sheetName, "", ""));
    let sheets = await getSheets(assembleTestArgumentObject(pub, "", "", ""));
    expect(sheets.some(sheet => sheet.publisher === pub && sheet.sheet === sheetName + " (1)")).toEqual(true);
  });

	it("checks to see two users can own a sheet with the same name", async () => {
    await setupDB();
    
    const pub: string = "rishav";
    const sheetName: string = "test3";
    await createSheet(assembleTestArgumentObject(pub, sheetName, "", ""));
    let sheets = await getSheets(assembleTestArgumentObject(pub, "", "", ""));
    expect(sheets.some(sheet => sheet.publisher === pub && sheet.sheet === sheetName)).toEqual(true);
    sheets = await getSheets(assembleTestArgumentObject("hunter", "", "", ""));
    expect(sheets.some(sheet => sheet.publisher === "hunter" && sheet.sheet === sheetName)).toEqual(true);
  });
});
