import { NavigateFunction } from "react-router-dom";
import { Result } from "../../../types/types";
import fetchWithAuth from "./fetchWithAuth";

type SheetInfoType = {
    publisher?: string;
    sheet?: string;
};

/**
 * Handles successful retrieval of publishers data.
 * 
 * @param {Result} data - The result data containing publishers.
 * @param {SheetInfoType} sheetInfo - Information about the sheet.
 * 
 * @author kris-amerman
 */
const handlePublishersSuccess = async (data: Result, sheetInfo: SheetInfoType, navigate: NavigateFunction) => {
    const publishers = data.value.map((item) => item.publisher);
    if (sheetInfo.publisher && publishers.includes(sheetInfo.publisher)) {
        await checkValidSheets(sheetInfo, navigate);
    } else {
        navigate("/dashboard");
    }
};

/**
 * Handles successful retrieval of sheets data.
 * 
 * @param {Result} data - The result data containing sheets.
 * @param {SheetInfoType} sheetInfo - Information about the sheet.
 * 
 * @author kris-amerman
 */
const handleSheetsSuccess = (data: Result, sheetInfo: SheetInfoType, navigate: NavigateFunction) => {
    const sheets = data.value.map((item) => item.sheet);
    if (!sheetInfo.sheet || !sheets.includes(sheetInfo.sheet)) {
        navigate("/dashboard");
    }
};

/**
 * Checks if the retrieved sheets for a publisher are valid.
 * 
 * @param {SheetInfoType} sheetInfo - Information about the sheet.
 * 
 * @author kris-amerman
 */
const checkValidSheets = async (sheetInfo: SheetInfoType, navigate: NavigateFunction) => {
    try {
        await fetchWithAuth(
            "getSheets",
            {
                method: "POST",
                body: JSON.stringify({ publisher: sheetInfo.publisher }),
            },
            (data: Result) => handleSheetsSuccess(data, sheetInfo, navigate),
            () => {
                navigate("/dashboard");
            }
        );
    } catch (error) {
        navigate("/dashboard");
    }
};

/**
 * Validates the specified sheet info against publishers data.
 * 
 * @param {SheetInfoType} sheetInfo - Information about the sheet.
 * 
 * @author kris-amerman
 */
export const validateSheet = async (sheetInfo: SheetInfoType, navigate: NavigateFunction) => {
    try {
        await fetchWithAuth(
            "getPublishers",
            { method: "GET" },
            async (data) => await handlePublishersSuccess(data, sheetInfo, navigate),
            () => {
                navigate("/dashboard");
            }
        );
    } catch (error) {
        navigate("/dashboard");
    }
};
