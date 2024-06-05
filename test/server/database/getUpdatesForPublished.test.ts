import { getUpdatesForPublished } from "../../../server/src/functions/getUpdatesForPublished";
import { Argument } from "../../../types/types";
import { assembleTestArgumentObject } from "../../utils";

describe("getUpdatesForPublished", () => {
	it("should return an argument object containing the updates stored in the updates table", async () => {
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
				"3",
				'$A1 1\n$a2 "help"\n$B1 -1.01\n$C4 ""\n$c1 = SUM($A1:$B1)\n'
			)
		);
	});
});
