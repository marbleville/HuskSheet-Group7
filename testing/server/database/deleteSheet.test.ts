import { deleteSheet } from "../../../server/src/functions/deleteSheet";
import { getSheets } from "../../../server/src/functions/getSheets";
import { Argument } from "../../../types/types";
import { assembleTestArgumentObject, setupDB } from "../../utils";

describe("createSheet", () => {
	it("checks to see if sheet disappears after deletion", async () => {
		await setupDB();

		const pub: string = "laurence";
		const sheetName: string = "test2";
		await deleteSheet(assembleTestArgumentObject(pub, sheetName, "", ""));
		let sheets = await getSheets(
			assembleTestArgumentObject(pub, "", "", ""),
			pub
		);
		expect(
			sheets.some(
				(sheet) => sheet.publisher === pub && sheet.sheet === sheetName
			)
		).toEqual(false);
	});

	it("checks to see if sheet stays after deletion with wrong publisher", async () => {
		await setupDB();

		const pub: string = "hunter";
		const sheetName: string = "test2";
		await deleteSheet(assembleTestArgumentObject(pub, sheetName, "", ""));
		let sheets = await getSheets(
			assembleTestArgumentObject(pub, "", "", ""),
			pub
		);
		expect(sheets).toEqual([
			{
				id: "",
				payload: "",
				publisher: "hunter",
				sheet: "test3",
			} as Argument,
			{
				id: "",
				payload: "",
				publisher: "hunter",
				sheet: "test4",
			} as Argument,
			{
				id: "",
				payload: "",
				publisher: "hunter",
				sheet: "test5-private",
			} as Argument,
		]);
		sheets = await getSheets(
			assembleTestArgumentObject("laurence", "", "", ""),
			pub
		);
		expect(sheets).toEqual([
			{
				id: "",
				payload: "",
				publisher: "laurence",
				sheet: "test2",
			} as Argument,
		]);
	});
});
