import fetchWithAuth from "../../../client/src/utils/fetchWithAuth";
import { validateSheet } from "../../../client/src/utils/validateSheet";
import { Result } from "../../../types/types";

// Mock the NavigateFunction from react-router-dom
const navigateMock = jest.fn();

// Mock fetchWithAuth function
jest.mock("../../../client/src/utils/fetchWithAuth", () => ({
    __esModule: true,
    default: jest.fn(),
}));

/**
 * Tests for the getUnreconciledUpdates function.
 * 
 * @author kris-amerman
 */
describe("validateSheet", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call fetchWithAuth with 'getPublishers' and correct arguments", async () => {
        await validateSheet({}, navigateMock);

        expect(fetchWithAuth).toHaveBeenCalledWith(
            "getPublishers",
            { method: "GET" },
            expect.any(Function),
            expect.any(Function)
        );
    });

    it("should navigate to /dashboard on fetchWithAuth error", async () => {
        (fetchWithAuth as jest.Mock).mockRejectedValueOnce(new Error("Fetch error"));

        await validateSheet({}, navigateMock);

        expect(navigateMock).toHaveBeenCalledWith("/dashboard");
    });

    it("should navigate to /dashboard when publisher is not found in data", async () => {
        const mockPublishersData: Result = {
            success: true,
            message: null,
            value: [
                { publisher: "Publisher1", sheet: "Sheet1", id: "1", payload: "$A1 test\n" },
                { publisher: "Publisher2", sheet: "Sheet2", id: "2", payload: "$A2 test\n" },
            ],
        };

        (fetchWithAuth as jest.Mock).mockImplementation((endpoint, options, onSuccess) => {
            if (endpoint === "getPublishers") {
                onSuccess(mockPublishersData);
            }
        });

        await validateSheet({ publisher: "Publisher3" }, navigateMock);

        expect(navigateMock).toHaveBeenCalledWith("/dashboard");
    });

    it("should call fetchWithAuth with 'getSheets' and correct arguments when publisher is found", async () => {
        const mockPublishersData: Result = {
            success: true,
            message: null,
            value: [
                { publisher: "Publisher1", sheet: "Sheet1", id: "1", payload: "$A1 test\n" },
                { publisher: "Publisher2", sheet: "Sheet2", id: "2", payload: "$A2 test\n" },
            ],
        };

        (fetchWithAuth as jest.Mock).mockImplementation((endpoint, options, onSuccess) => {
            if (endpoint === "getPublishers") {
                onSuccess(mockPublishersData);
            }
        });

        await validateSheet({ publisher: "Publisher1" }, navigateMock);

        expect(fetchWithAuth).toHaveBeenCalledWith(
            "getSheets",
            {
                method: "POST",
                body: JSON.stringify({ publisher: "Publisher1" }),
            },
            expect.any(Function),
            expect.any(Function)
        );
    });

    it("should navigate to /dashboard when sheet is not found in data", async () => {
        const mockPublishersData: Result = {
            success: true,
            message: null,
            value: [
                { publisher: "Publisher1", sheet: "Sheet1", id: "1", payload: "$A1 test\n" },
                { publisher: "Publisher2", sheet: "Sheet2", id: "2", payload: "$A2 test\n" },
            ],
        };

        const mockSheetsData: Result = {
            success: true,
            message: null,
            value: [
                { publisher: "Publisher1", sheet: "Sheet1", id: "1", payload: "$A1 test\n" },
                { publisher: "Publisher1", sheet: "Sheet3", id: "2", payload: "$A2 test\n" },
            ],
        };

        (fetchWithAuth as jest.Mock).mockImplementation((endpoint, options, onSuccess) => {
            if (endpoint === "getPublishers") {
                onSuccess(mockPublishersData);
            } else if (endpoint === "getSheets") {
                onSuccess(mockSheetsData);
            }
        });

        await validateSheet({ publisher: "Publisher1", sheet: "Sheet2" }, navigateMock);

        expect(navigateMock).toHaveBeenCalledWith("/dashboard");
    });

    it("should not navigate when sheet is found in data", async () => {
        const mockPublishersData: Result = {
            success: true,
            message: null,
            value: [
                { publisher: "Publisher1", sheet: "Sheet1", id: "1", payload: "$A1 test\n" },
                { publisher: "Publisher2", sheet: "Sheet2", id: "2", payload: "$A2 test\n" },
            ],
        };

        const mockSheetsData: Result = {
            success: true,
            message: null,
            value: [
                { publisher: "Publisher1", sheet: "Sheet1", id: "1", payload: "$A1 test\n" },
                { publisher: "Publisher1", sheet: "Sheet2", id: "2", payload: "$A2 test\n" },
            ],
        };

        (fetchWithAuth as jest.Mock).mockImplementation((endpoint, options, onSuccess) => {
            if (endpoint === "getPublishers") {
                onSuccess(mockPublishersData);
            } else if (endpoint === "getSheets") {
                onSuccess(mockSheetsData);
            }
        });

        await validateSheet({ publisher: "Publisher1", sheet: "Sheet2" }, navigateMock);

        expect(navigateMock).not.toHaveBeenCalled();
    });

    it("should navigate to /dashboard on unauthorized response from fetchWithAuth for 'getPublishers'", async () => {
        (fetchWithAuth as jest.Mock).mockImplementation((endpoint, options, onSuccess, onFailure) => {
            if (endpoint === "getPublishers") {
                onFailure({ message: "Unauthorized" });
            }
        });

        await validateSheet({}, navigateMock);

        expect(navigateMock).toHaveBeenCalledWith("/dashboard");
    });

    it("should navigate to /dashboard on unauthorized response from fetchWithAuth for 'getSheets'", async () => {
        const mockPublishersData: Result = {
            success: true,
            message: null,
            value: [
                { publisher: "Publisher1", sheet: "Sheet1", id: "1", payload: "$A1 test\n" },
                { publisher: "Publisher2", sheet: "Sheet2", id: "2", payload: "$A2 test\n" },
            ],
        };

        (fetchWithAuth as jest.Mock).mockImplementation((endpoint, options, onSuccess, onFailure) => {
            if (endpoint === "getPublishers") {
                onSuccess(mockPublishersData);
            } else if (endpoint === "getSheets") {
                onFailure({ message: "Unauthorized" });
            }
        });

        await validateSheet({ publisher: "Publisher1" }, navigateMock);

        expect(navigateMock).toHaveBeenCalledWith("/dashboard");
    });

    it("should navigate to /dashboard if fetchWithAuth throws an error for 'getPublishers'", async () => {
        (fetchWithAuth as jest.Mock).mockImplementation(() => {
            throw new Error("Network error");
        });

        await validateSheet({}, navigateMock);

        expect(navigateMock).toHaveBeenCalledWith("/dashboard");
    });

    it("should navigate to /dashboard if fetchWithAuth throws an error for 'getSheets'", async () => {
        const mockPublishersData: Result = {
            success: true,
            message: null,
            value: [
                { publisher: "Publisher1", sheet: "Sheet1", id: "1", payload: "$A1 test\n" },
                { publisher: "Publisher2", sheet: "Sheet2", id: "2", payload: "$A2 test\n" },
            ],
        };

        (fetchWithAuth as jest.Mock).mockImplementation((endpoint, options, onSuccess) => {
            if (endpoint === "getPublishers") {
                onSuccess(mockPublishersData);
            } else if (endpoint === "getSheets") {
                throw new Error("Network error");
            }
        });

        await validateSheet({ publisher: "Publisher1" }, navigateMock);

        expect(navigateMock).toHaveBeenCalledWith("/dashboard");
    });

});
