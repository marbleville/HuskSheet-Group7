import { assembleTestArgumentObject, setupDB } from "../../utils";
import { register } from "../../../server/src/functions/register";
import { getPublishers } from "../../../server/src/functions/getPublishers";
import { Argument } from "../../../types/types";
import { assembleResultObject } from "../../../server/src/utils";

describe("register", () => {
	it("checks to see if the isPublished field is updated", async () => {
		await setupDB();

		const sub: string = "caroline";
		await register(sub);

		let users = await getPublishers();

		expect(users.some((user: Argument) => user.publisher === sub)).toEqual(
			true
		);
	});
});
