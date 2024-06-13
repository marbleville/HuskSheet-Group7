import { sanitize } from "../../server/src/utils";

describe("sanitize", () => {
	it("checks to see if sanitize removes single quotes", () => {
		let value: string = "$A1 'hello'world'";
		let sanitizedValue: string = sanitize(value);
		let expectedValue: string = "$A1 \"hello''world\"";

		expect(sanitizedValue).toEqual(expectedValue);
	});
});
