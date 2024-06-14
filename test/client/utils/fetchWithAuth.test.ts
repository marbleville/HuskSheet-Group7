import fetchWithAuth from "../../../client/src/utils/fetchWithAuth";
import clientConfig from "../../../client/src/config/clientConfig";
import { validEndpoints, Endpoint } from "../../../client/src/types";
import { Result } from "../../../types/types";

// Define mock sessionStorage and mock implementation
const sessionStorageMock = {
    getItem: jest.fn((key: string) => {
        return {
            username: "mock_username",
            password: "mock_password",
        }[key];
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

// Mock sessionStorage in global object
Object.defineProperty(global, "sessionStorage", {
    value: sessionStorageMock,
});

/**
 * Tests for the fetchWithAuth function.
 * 
 * @author kris-amerman
 */
describe("fetchWithAuth", () => {
    let originalConsoleLog: typeof console.log;

    beforeEach(() => {
        jest.clearAllMocks();
        console.log = jest.fn();
    });

    afterEach(() => {
        console.log = originalConsoleLog;
        jest.clearAllMocks();
    });

    validEndpoints.forEach((endpoint) => {
        it(`should fetch data from endpoint "${endpoint}" successfully`, async () => {
            const mockData: Result = {
                success: true,
                message: `Data from ${endpoint}`,
                value: [
                    {
                        publisher: "mock_publisher",
                        sheet: "mock_sheet",
                        id: "mock_id",
                        payload: "mock_payload",
                    },
                ],
            };
            const options: RequestInit = {
                method: ["getPublishers", "register"].includes(endpoint) ? "GET" : "POST",
            };
            const onSuccess = jest.fn();

            // Mock fetch
            jest.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockData),
                headers: new Headers({ "content-type": "application/json" }),
            } as Response);

            await fetchWithAuth(endpoint, options, onSuccess);

            expect(global.fetch).toHaveBeenCalledWith(
                `${clientConfig.BASE_URL}${endpoint}`,
                expect.objectContaining({
                    method: ["getPublishers", "register"].includes(endpoint) ? "GET" : "POST",
                    headers: expect.objectContaining({
                        Authorization: `Basic ${btoa("mock_username:mock_password")}`,
                    }),
                })
            );

            expect(onSuccess).toHaveBeenCalledWith(mockData);
        });
    });

    it("should throw error for invalid endpoint", async () => {
        // @ts-ignore
        const invalidEndpoint: Endpoint = "/invalidEndpoint";
        const options: RequestInit = {
            method: "GET",
        };

        await expect(fetchWithAuth(invalidEndpoint, options)).rejects.toThrow(
            `Invalid endpoint: ${invalidEndpoint}`
        );
    });

    it("should throw error when username or password is missing", async () => {
        sessionStorageMock.getItem.mockReturnValueOnce(undefined); // Simulate missing username

        const endpoint: Endpoint = "getPublishers";
        const options: RequestInit = {
            method: "GET",
        };

        await expect(fetchWithAuth(endpoint, options)).rejects.toThrow(
            "Username and password are required for authorization."
        );

        expect(global.fetch).not.toHaveBeenCalled(); // Ensure fetch was not called
    });

    it("should set Content-Type header for POST requests", async () => {
        const endpoint: Endpoint = "createSheet";
        const options: RequestInit = {
            method: "POST",
            body: JSON.stringify({ someData: "data" }), // Provide a sample body
        };

        await fetchWithAuth(endpoint, options);

        expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
                "Content-Type": "application/json",
            }),
        }));
    });

    it("should call onFailure callback on 401 Unauthorized", async () => {
        const endpoint: Endpoint = "getUpdatesForSubscription";
        const options: RequestInit = {
            method: "POST",
        };
        const onFailure = jest.fn();

        jest.spyOn(global, "fetch").mockResolvedValueOnce({
            ok: false,
            status: 401,
        } as Response);

        await fetchWithAuth(endpoint, options, jest.fn(), onFailure);

        expect(onFailure).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should handle error parsing non-JSON plaintext response", async () => {
        const endpoint: Endpoint = "getSheets";
        const options: RequestInit = {
            method: "POST",
        };
        const mockPlainText = "This is plaintext response";

        jest.spyOn(global, "fetch").mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ "content-type": "text/plain" }),
            text: () => Promise.resolve(mockPlainText),
        } as Response);

        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

        await fetchWithAuth(endpoint, options);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Error parsing non-JSON plaintext -- ",
            expect.any(SyntaxError)
        );
    });

    it("should log warning and call onFailure for unsuccessful response", async () => {
        const endpoint: Endpoint = "register";
        const options: RequestInit = {
            method: "POST",
            body: JSON.stringify({}),
        };
        const mockData: Result = {
            success: false,
            message: "Failed to register",
            value: [],
        };

        jest.spyOn(global, "fetch").mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ "content-type": "application/json" }),
            json: () => Promise.resolve(mockData),
        } as Response);

        const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
        const onFailure = jest.fn();

        await fetchWithAuth(endpoint, options, jest.fn(), onFailure);

        expect(consoleWarnSpy).toHaveBeenCalledWith(mockData);
        expect(onFailure).toHaveBeenCalledWith(mockData);
    });

    it("should log error for non-200, non-404 response", async () => {
        const endpoint: Endpoint = "deleteSheet";
        const options: RequestInit = {
            method: "POST",
        };

        const mockResponse = {
            ok: false,
            status: 500,
            headers: {
                get: jest.fn().mockReturnValue("application/json"),
            } as any,
            text: jest.fn().mockResolvedValue("test"),
            json: jest.fn(),
            redirected: false,
            statusText: "",
            type: "",
            url: "",
            clone: jest.fn(),
            body: null,
            bodyUsed: false,
            arrayBuffer: jest.fn(),
            blob: jest.fn(),
            formData: jest.fn(),
        };

        jest.spyOn(global, "fetch").mockResolvedValue(mockResponse as unknown as Response);

        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

        await fetchWithAuth(endpoint, options);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            `Encountered a bad response code: 500`
        );
    });

    it("should log error when fetch throws an error", async () => {
        const endpoint: Endpoint = "updateSubscription";
        const options: RequestInit = {
            method: "POST",
        };

        jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network error"));

        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

        await fetchWithAuth(endpoint, options);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            new Error("Network error")
        );
    });
});
