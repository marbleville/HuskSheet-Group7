import { getUpdatesForSubscription } from "../../../server/src/functions/getUpdatesForSubscription";
import { Argument } from "../../../types/types";
import { assembleTestArgumentObject, setupDB } from "../../utils";

describe("getUpdatesForSubscription", () => {
	it("should return an argument object containing the updates stored in the updates table with multiple accepted updates", async () => {
		await setupDB();
		const testArg: Argument = assembleTestArgumentObject(
			"hunter",
			"test3",
			"0",
			""
		);

		expect(await getUpdatesForSubscription(testArg)).toEqual(
			assembleTestArgumentObject(
				"hunter",
				"test3",
				"4",
				'$A1 2\n$a2 "help"\n$B1 -1.01\n$C4 ""\n$c1 = SUM($A1:$B1)\n'
			)
		);
	});

	it("should return an argument object containing the updates stored in the updates table with one update", async () => {
		await setupDB();
		const testArg: Argument = assembleTestArgumentObject(
			"rishav",
			"test1",
			"0",
			""
		);

		expect(await getUpdatesForSubscription(testArg)).toEqual(
			assembleTestArgumentObject(
				"rishav",
				"test1",
				"1",
				'$A1 1\n$a2 "help"\n'
			)
		);
	});

	it("should return an argument object containing the updates stored in the updates table with multiple updates and id > 0", async () => {
		await setupDB();
		const testArg: Argument = assembleTestArgumentObject(
			"hunter",
			"test3",
			"1",
			""
		);

		expect(await getUpdatesForSubscription(testArg)).toEqual(
			assembleTestArgumentObject(
				"hunter",
				"test3",
				"4",
				'$A1 2\n$a2 "help"\n$B1 -1.01\n$C4 ""\n$c1 = SUM($A1:$B1)\n'
			)
		);
	});

	it("should return an argument object containing the updates stored in the updates table with no updates", async () => {
		await setupDB();
		const testArg: Argument = assembleTestArgumentObject(
			"laurence",
			"test2",
			"0",
			""
		);

		expect(await getUpdatesForSubscription(testArg)).toEqual(
			assembleTestArgumentObject("laurence", "test2", "0", "")
		);
	});

	it("should throw an error if the sheet does not exist", async () => {
		await setupDB();
		const testArg: Argument = assembleTestArgumentObject(
			"laurence",
			"test6",
			"0",
			""
		);

		try {
			await getUpdatesForSubscription(testArg);
		} catch (e) {
			const error = e as Error;
			expect(error.message).toEqual("Sheet not found");
		}
	});

	it("should return an argument object containing the updates stored in the updates table with no updates and id too high", async () => {
		await setupDB();
		const testArg: Argument = assembleTestArgumentObject(
			"laurence",
			"test2",
			"1",
			""
		);

		expect(await getUpdatesForSubscription(testArg)).toEqual(
			assembleTestArgumentObject("laurence", "test2", "0", "")
		);
	});
});
