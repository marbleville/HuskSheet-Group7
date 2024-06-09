const request = require("supertest");
import app from "../../server/src/server";
import { Response } from "supertest";
import { assembleResultObject } from "../../server/src/utils";

describe("Sets auth checks in server.ts", () => {
	it("register should fail if the user password is wrong", async () => {
		const response: Response = await request(app)
			.get("/api/v1/register")
			.auth("caroline", "1234");

		expect(response.statusCode).toBe(401);
	});

	it("register should return a success result object", async () => {
		const response: Response = await request(app)
			.get("/api/v1/register")
			.auth("caroline", "123");

		expect(response.body).toEqual(assembleResultObject(true, null, []));
	});
});
