import { updateSubscription } from "../../../server/src/functions/updateSubscription";
import { getUpdatesForPublished } from "../../../server/src/functions/getUpdatesForPublished";
import { Argument } from "../../../types/types";
import { assembleTestArgumentObject, setupDB } from "../../utils";
import { getUpdatesForSubscription } from "../../../server/src/functions/getUpdatesForSubscription";

describe("updateSubscription", () => {
	it("checks to see if updateSubscription inserts in DB", async () => {
		await setupDB();

		let data: string = "$A1 helloworld";
		await updateSubscription(
			assembleTestArgumentObject("rishav", "test1", "", data),
			"laurence"
		);
		let updates = await getUpdatesForPublished(
			assembleTestArgumentObject("rishav", "test1", "1", "")
		);
		expect(updates.payload.split("\n").includes(data)).toEqual(true);
	});

	it("checks to see if updateSubscription does not insert into HashStore", async () => {
		await setupDB();

		let data: string = "$A1 helloworld";
		await updateSubscription(
			assembleTestArgumentObject("rishav", "test1", "", data),
			"laurence"
		);
		let updates = await getUpdatesForSubscription(
			assembleTestArgumentObject("rishav", "test1", "0", "")
		);
		expect(updates.payload.split("\n").includes(data)).toEqual(false);
	});

	it("checks to see if updateSubscription inserts in DB when client and publisher are the same", async () => {
		await setupDB();

		let data: string = "$A1 helloworld";
		await updateSubscription(
			assembleTestArgumentObject("rishav", "test1", "", data),
			"rishav"
		);
		let updates = await getUpdatesForPublished(
			assembleTestArgumentObject("rishav", "test1", "1", "")
		);
		expect(updates.payload.split("\n").includes(data)).toEqual(false);

		updates = await getUpdatesForSubscription(
			assembleTestArgumentObject("rishav", "test1", "1", "")
		);

		expect(updates.payload.split("\n").includes(data)).toEqual(false);
	});

	it("checks to see if updateSubscription inserts in DB", async () => {
		await setupDB();

		let data: string = "$A8 =dsadsa + 3213";
		await updateSubscription(
			assembleTestArgumentObject("hunter", "test3", "", data),
			"laurence"
		);
		let updates = await getUpdatesForPublished(
			assembleTestArgumentObject("hunter", "test3", "1", "")
		);
		expect(updates.payload.split("\n").includes(data)).toEqual(true);
	});

	it("checks to see if updateSubscription inserts in DB", async () => {
		await setupDB();

		let data: string = "$A8 =dsadsa + 3213";
		await updateSubscription(
			assembleTestArgumentObject("hunter", "test3", "", data),
			"laurence"
		);
		let updates = await getUpdatesForPublished(
			assembleTestArgumentObject("hunter", "test3", "1", "")
		);
		expect(updates.payload.split("\n").includes(data)).toEqual(true);
	});

	it("checks to see if updateSubscription thorws an error with malformed data", async () => {
		await setupDB();

		let data: string = "A8 =dsadsa + 3213";

		try {
			await updateSubscription(
				assembleTestArgumentObject("hunter", "test3", "", data),
				"laurence"
			);
		} catch (error) {
			expect(error).toMatch("Invalid payload format");
		}
	});

	it("checks to see if updateSubscription thorws an error with malformed data", async () => {
		await setupDB();

		let data: string = "$A =dsadsa + 3213";

		try {
			await updateSubscription(
				assembleTestArgumentObject("hunter", "test3", "", data),
				"laurence"
			);
		} catch (error) {
			expect(error).toMatch("Invalid payload format");
		}
	});

	it("checks to see if updateSubscription thorws an error with malformed data", async () => {
		await setupDB();

		let data: string = "$8 =dsadsa + 3213";

		try {
			await updateSubscription(
				assembleTestArgumentObject("hunter", "test3", "", data),
				"laurence"
			);
		} catch (error) {
			expect(error).toMatch("Invalid payload format");
		}
	});
});
