const request = require("supertest");
import app from "../../server/src/app";
import { Response } from "supertest";
import { assembleResultObject } from "../../server/src/utils";
import { setupDB } from "../utils";
import DatabaseInstance from "../../server/src/database/databaseInstance";
import DatabaseQueries from "../../types/queries";
import { GetUserRow } from "../../server/src/database/db";

describe("Tests auth checks in server.ts", () => {
	it("register should fail if the user password is wrong", async () => {
		await setupDB();

		const response: Response = await request(app)
			.get("/api/v1/register")
			.auth("caroline", "1234");

		expect(response.statusCode).toBe(401);
	});

	it("register should return a success result object", async () => {
		await setupDB();

		const response: Response = await request(app)
			.get("/api/v1/register")
			.auth("caroline", "123");

		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.text)).toEqual(
			assembleResultObject(true, null, [])
		);
	});

	it("register should add a new user", async () => {
		await setupDB();

		const response: Response = await request(app)
			.get("/api/v1/register")
			.auth("caroline-but-wrong", "123");

		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.text).success).toBeFalsy();

		let user = await DatabaseInstance.getInstance().query<GetUserRow>(
			DatabaseQueries.getUser("caroline-but-wrong")
		);

		expect(user.length).toBe(1);
	});
});
