import { updatePublished } from "../../../server/src/functions/updatePublished";
import { getUpdatesForSubscription } from "../../../server/src/functions/getUpdatesForSubscription";
import { Argument } from "../../../types/types";
import { assembleTestArgumentObject, setupDB } from "../../utils";

describe("updatePublished", () => {
	it("checks to see if updatePublished inserts in DB", async () => {
		await setupDB();

		let data: string = "$A1 helloworld";
		await updatePublished(
			assembleTestArgumentObject("rishav", "test1", "", data)
		);
		let updates = await getUpdatesForSubscription(
			assembleTestArgumentObject("rishav", "test1", "1", "")
		);
		expect(updates.payload.split("\n").includes(data)).toEqual(true);
	});

	it("checks to see if updatePublished inserts in DB", async () => {
		await setupDB();

		let data: string = "$A8 =dsadsa + 3213";
		await updatePublished(
			assembleTestArgumentObject("hunter", "test3", "", data)
		);
		let updates = await getUpdatesForSubscription(
			assembleTestArgumentObject("hunter", "test3", "1", "")
		);
		expect(updates.payload.split("\n").includes(data)).toEqual(true);
	});

	it("checks to see if updatePublished inserts in HashStore", async () => {
		await setupDB();

		let data: string = "$A1 helloworld";
		await updatePublished(
			assembleTestArgumentObject("rishav", "test1", "", data)
		);
		let updates = await getUpdatesForSubscription(
			assembleTestArgumentObject("rishav", "test1", "0", "")
		);
		expect(updates.payload.split("\n").includes(data)).toEqual(true);
	});

	it("checks to see if updatePublished inserts in DB", async () => {
		await setupDB();

		let data: string = "$A8 =dsadsa + 3213";
		await updatePublished(
			assembleTestArgumentObject("hunter", "test3", "", data)
		);
		let updates = await getUpdatesForSubscription(
			assembleTestArgumentObject("hunter", "test3", "1", "")
		);
		expect(updates.payload.split("\n").includes(data)).toEqual(true);
	});

	it("checks to see if updatePublished thorws an error with malformed data", async () => {
		await setupDB();

		let data: string = "A8 =dsadsa + 3213";
		expect(
			await updatePublished(
				assembleTestArgumentObject("hunter", "test3", "", data)
			)
		).toThrow("Invalid payload format");
	});
});
