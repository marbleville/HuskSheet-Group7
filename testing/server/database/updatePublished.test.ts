import { updatePublished } from "../../../server/src/functions/updatePublished";
import { getUpdatesForSubscription } from "../../../server/src/functions/getUpdatesForSubscription";
import { assembleTestArgumentObject, setupDB } from "../../utils";
import { sanitize } from "../../../server/src/utils";

describe("updatePublished", () => {
	it("checks to see if updatePublished inserts in DB", async () => {
		await setupDB();

		let data: string = "$A1 'hello'world'";
		await updatePublished(
			assembleTestArgumentObject("rishav", "test1", "", data)
		);
		let updates = await getUpdatesForSubscription(
			assembleTestArgumentObject("rishav", "test1", "1", "")
		);

		expect(
			updates.payload.includes(sanitize(data).replace("''", "'"))
		).toEqual(true);
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

		try {
			await updatePublished(
				assembleTestArgumentObject("hunter", "test3", "", data)
			);
		} catch (error) {
			expect(error).toMatch("Invalid payload format");
		}
	});

	it("checks to see if updatePublished thorws an error with malformed data", async () => {
		await setupDB();

		let data: string = "$A =dsadsa + 3213";

		try {
			await updatePublished(
				assembleTestArgumentObject("hunter", "test3", "", data)
			);
		} catch (error) {
			expect(error).toMatch("Invalid payload format");
		}
	});

	it("checks to see if updatePublished throws an error with malformed data", async () => {
		await setupDB();

		let data: string = "$8 =dsadsa + 3213";

		try {
			await updatePublished(
				assembleTestArgumentObject("hunter", "test3", "", data)
			);
		} catch (error) {
			expect(error).toMatch("Invalid payload format");
		}
	});
});
