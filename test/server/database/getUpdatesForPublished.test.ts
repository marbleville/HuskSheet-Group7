import { getUpdatesForPublished } from "../../../server/src/functions/getUpdatesForPublished";
import { Argument } from "../../../types/types";
import { assembleTestArgumentObject } from "../../utils";

describe("getUpdatesForPublished", () => {
	it("should return an argument object containing the updates stored in the updates table with multiple accepted updates", async () => {
		const testArg: Argument = assembleTestArgumentObject(
			"hunter",
			"test3",
			"0",
			""
		);

		expect(await getUpdatesForPublished(testArg)).toEqual(
			assembleTestArgumentObject(
				"hunter",
				"test3",
				"5",
				'$A2 "helping"\n'
			)
		);
	});

	it("should return an argument object containing the updates stored in the updates table with one update", async () => {
		const testArg: Argument = assembleTestArgumentObject(
			"rishav",
			"test1",
			"0",
			""
		);

		expect(await getUpdatesForPublished(testArg)).toEqual(
			assembleTestArgumentObject("rishav", "test1", "0", "")
		);
	});

	it("should return an argument object containing the updates stored in the updates table with multiple updates and id > 0", async () => {
		const testArg: Argument = assembleTestArgumentObject(
			"hunter",
			"test3",
			"2",
			""
		);

		expect(await getUpdatesForPublished(testArg)).toEqual(
			assembleTestArgumentObject(
				"hunter",
				"test3",
				"5",
				'$A2 "helping"\n'
			)
		);
	});

	it("should return an argument object containing the updates stored in the updates table with no updates", async () => {
		const testArg: Argument = assembleTestArgumentObject(
			"laurence",
			"test2",
			"0",
			""
		);

		expect(await getUpdatesForPublished(testArg)).toEqual(
			assembleTestArgumentObject("laurence", "test2", "0", "")
		);
	});

	it("should return an argument object containing the updates stored in the updates table with no updates and id too high", async () => {
		const testArg: Argument = assembleTestArgumentObject(
			"laurence",
			"test2",
			"1",
			""
		);

		expect(await getUpdatesForPublished(testArg)).toEqual(
			assembleTestArgumentObject("laurence", "test2", "1", "")
		);
	});
});
