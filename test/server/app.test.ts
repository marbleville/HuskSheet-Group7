const request = require("supertest");
import app from "../../server/src/app";
import { Response } from "supertest";
import { assembleResultObject } from "../../server/src/utils";
import { assembleTestArgumentObject, setupDB } from "../utils";
import DatabaseInstance from "../../server/src/database/databaseInstance";
import DatabaseQueries from "../../types/queries";
import { GetUserRow } from "../../server/src/database/db";

describe("Tests auth checks in app.ts", () => {
	// register tests

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

	// createSheet tests

	it("createSheet should should fail if user is not a publisher", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/createSheet")
			.auth("caroline", "123")
			.send(
				assembleTestArgumentObject("caroline", "caroline-test", "", "")
			);

		expect(JSON.parse(response.text).success).toBeFalsy();
	});

	it("createSheet should should succeed if user is a publisher", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/createSheet")
			.auth("hunter", "123")
			.send(assembleTestArgumentObject("hunter", "hunter-test", "", ""));

		expect(JSON.parse(response.text).success).toBeTruthy();
	});

	// deleteSheet tests

	it("deleteSheet should should fail if user is not a publisher", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/deleteSheet")
			.auth("caroline", "123")
			.send(
				assembleTestArgumentObject("caroline", "caroline-test", "", "")
			);

		expect(JSON.parse(response.text).success).toBeFalsy();
	});

	it("deleteSheet should should fail if client and publisher do not match", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/deleteSheet")
			.auth("hunter", "123")
			.send(
				assembleTestArgumentObject("caroline", "caroline-test", "", "")
			);

		expect(JSON.parse(response.text).success).toBeFalsy();
	});

	it("deleteSheet should should succeed if user is a publisher and matches client", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/deleteSheet")
			.auth("hunter", "123")
			.send(assembleTestArgumentObject("hunter", "hunter-test", "", ""));

		expect(JSON.parse(response.text).success).toBeTruthy();
	});

	// getUpdatesForPublished tests

	it("getUpdatesForPublished should should fail if user is not a publisher", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/getUpdatesForPublished")
			.auth("caroline", "123")
			.send(
				assembleTestArgumentObject("caroline", "caroline-test", "0", "")
			);

		expect(JSON.parse(response.text).success).toBeFalsy();
	});

	it("getUpdatesForPublished should should fail if client and publisher do not match", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/getUpdatesForPublished")
			.auth("hunter", "123")
			.send(assembleTestArgumentObject("laurence", "test2", "0", ""));

		expect(JSON.parse(response.text).success).toBeFalsy();
	});

	it("getUpdatesForPublished should should succeed if user is a publisher and matches client", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/getUpdatesForPublished")
			.auth("hunter", "123")
			.send(assembleTestArgumentObject("hunter", "test3", "0", ""));

		expect(JSON.parse(response.text).success).toBeTruthy();
	});

	// updatePublished tests

	it("updatePublished should should fail if user is not a publisher", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/updatePublished")
			.auth("caroline", "123")
			.send(
				assembleTestArgumentObject("caroline", "caroline-test", "0", "")
			);

		expect(JSON.parse(response.text).success).toBeFalsy();
	});

	it("updatePublished should should fail if client and publisher do not match", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/updatePublished")
			.auth("hunter", "123")
			.send(assembleTestArgumentObject("laurence", "test2", "0", ""));

		expect(JSON.parse(response.text).success).toBeFalsy();
	});

	it("updatePublished should should fail if there is no auth header", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/updatePublished")
			.send(assembleTestArgumentObject("laurence", "test2", "0", ""));

		expect(JSON.parse(response.text).success).toBeFalsy();
	});

	it("updatePublished should should succeed if user is a publisher and matches client", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/updatePublished")
			.auth("hunter", "123")
			.send(assembleTestArgumentObject("hunter", "test3", "0", ""));

		expect(JSON.parse(response.text).success).toBeTruthy();
	});

	// updateSubscription tests

	it("updateSubscription should should fail if user is not authenticated", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/updateSubscription")
			.auth("caroline", "1234")
			.send(
				assembleTestArgumentObject("caroline", "caroline-test", "", "")
			);

		expect(JSON.parse(response.text).success).toBeFalsy();
	});

	it("updateSubscription should should fail if no auth header is given", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/updateSubscription")
			.auth("caroline", "1234")
			.send(
				assembleTestArgumentObject("caroline", "caroline-test", "", "")
			);

		expect(JSON.parse(response.text).success).toBeFalsy();
	});

	it("updateSubscription should should succeed if client and publisher do match", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/updateSubscription")
			.auth("hunter", "123")
			.send(assembleTestArgumentObject("hunter", "test3", "", ""));

		expect(JSON.parse(response.text).success).toBeTruthy();
	});

	it("updateSubscription should should fail if no body is provided", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/updateSubscription")
			.auth("hunter", "123");

		expect(JSON.parse(response.text).success).toBeFalsy();
	});

	it("updateSubscription should should succeed if client does not match publisher", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/updateSubscription")
			.auth("hunter", "123")
			.send(assembleTestArgumentObject("laurence", "test2", "", ""));

		expect(JSON.parse(response.text).success).toBeTruthy();
	});

	// All other enpoints are executed by runEndpointFunction,
	// so I'll only test on of them to ensure proper auth flow

	it("getSheets should should fail if user is not authenticated", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/getSheets")
			.auth("caroline", "1234")
			.send(assembleTestArgumentObject("laurence", "", "", ""));

		expect(JSON.parse(response.text).success).toBeFalsy();
	});

	it("getSheets should should fail if no body is provided", async () => {
		await setupDB();

		const response: Response = await request(app)
			.post("/api/v1/getSheets")
			.auth("hunter", "123");

		expect(JSON.parse(response.text).success).toBeFalsy();
	});
});
