import { sanitize } from "../../server/src/utils";

describe("sanitize", () => {
	it("checks to see if sanitize removes single quotes and doubles apostrophes", () => {
		let value: string = "$A1 'hello'world'";
		let sanitizedValue: string = sanitize(value);
		let expectedValue: string = "$A1 \"hello''world\"";

		expect(sanitizedValue).toEqual(expectedValue);
	});

	it("checks to see if sanitize removes single quotes", () => {
		let value: string = "$A1 'helloworld'";
		let sanitizedValue: string = sanitize(value);
		let expectedValue: string = '$A1 "helloworld"';

		expect(sanitizedValue).toEqual(expectedValue);
	});

	it("checks to see if sanitize does not mess with correct strings", () => {
		let value: string = "$A1 'helloworld'";
		let sanitizedValue: string = sanitize(value);
		let expectedValue: string = '$A1 "helloworld"';

		expect(sanitizedValue).toEqual(expectedValue);
	});

	it("checks to see if sanitize does not mess with correct strings", () => {
		let value: string = '$A1 "helloworld"';
		let sanitizedValue: string = sanitize(value);
		let expectedValue: string = '$A1 "helloworld"';

		expect(sanitizedValue).toEqual(expectedValue);
	});

	it("checks to see if sanitize does not mess with correct strings", () => {
		let value: string = "$A1 1234";
		let sanitizedValue: string = sanitize(value);
		let expectedValue: string = "$A1 1234";

		expect(sanitizedValue).toEqual(expectedValue);
	});
});
