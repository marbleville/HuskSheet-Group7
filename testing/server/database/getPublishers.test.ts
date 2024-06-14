import { getPublishers } from "../../../server/src/functions/getPublishers";
import { Argument } from "../../../types/types";
import { setupDB } from "../../utils";

describe("getPublishers", () => {
	it("should return an array of arguments containing all publishers", async () => {
		await setupDB();

		expect(await getPublishers()).toEqual([
			{
				id: "",
				payload: "",
				publisher: "rishav",
				sheet: "",
			} as Argument,
			{
				id: "",
				payload: "",
				publisher: "laurence",
				sheet: "",
			} as Argument,
			{
				id: "",
				payload: "",
				publisher: "kris",
				sheet: "",
			} as Argument,
			{
				id: "",
				payload: "",
				publisher: "eduardo",
				sheet: "",
			} as Argument,
			{
				id: "",
				payload: "",
				publisher: "hunter",
				sheet: "",
			} as Argument,
		]);
	});
});
