import getUnreconciledUpdates from "../../../client/src/utils/getUnreconciledUpdates";
import { SheetDataMap } from "../../../client/src/types";

/**
 * Tests for the getUnreconciledUpdates function.
 * 
 * @author kris-amerman
 */
describe("getUnreconciledUpdates", () => {
    it("should return an empty object when there are no incoming updates", () => {
        const existingUpdates: SheetDataMap = {
            "A1": "oldValue",
            "B2": "anotherOldValue"
        };
        const incomingUpdates: SheetDataMap = {};

        const result = getUnreconciledUpdates(existingUpdates, incomingUpdates);

        expect(result).toEqual({});
    });

    it("should return all incoming updates when there are no existing updates", () => {
        const existingUpdates: SheetDataMap = {};
        const incomingUpdates: SheetDataMap = {
            "A1": "newValue",
            "B2": "anotherNewValue"
        };

        const result = getUnreconciledUpdates(existingUpdates, incomingUpdates);

        expect(result).toEqual(incomingUpdates);
    });

    it("should return only updates that are different from existing updates", () => {
        const existingUpdates: SheetDataMap = {
            "A1": "oldValue",
            "B2": "anotherOldValue"
        };
        const incomingUpdates: SheetDataMap = {
            "A1": "newValue",
            "B2": "anotherOldValue",
            "C3": "newCellValue"
        };

        const expected: SheetDataMap = {
            "A1": "newValue",
            "C3": "newCellValue"
        };

        const result = getUnreconciledUpdates(existingUpdates, incomingUpdates);

        expect(result).toEqual(expected);
    });

    it("should return all incoming updates if existing updates are empty", () => {
        const existingUpdates: SheetDataMap = {};
        const incomingUpdates: SheetDataMap = {
            "A1": "newValue",
            "B2": "anotherNewValue"
        };

        const result = getUnreconciledUpdates(existingUpdates, incomingUpdates);

        expect(result).toEqual(incomingUpdates);
    });

    it("should return an empty object if both existing and incoming updates are the same", () => {
        const existingUpdates: SheetDataMap = {
            "A1": "value1",
            "B2": "value2"
        };
        const incomingUpdates: SheetDataMap = {
            "A1": "value1",
            "B2": "value2"
        };

        const result = getUnreconciledUpdates(existingUpdates, incomingUpdates);

        expect(result).toEqual({});
    });

    it("should correctly handle case where existing updates have more cells than incoming updates", () => {
        const existingUpdates: SheetDataMap = {
            "A1": "oldValue",
            "B2": "anotherOldValue",
            "C3": "yetAnotherOldValue"
        };
        const incomingUpdates: SheetDataMap = {
            "A1": "newValue",
            "B2": "anotherOldValue"
        };

        const expected: SheetDataMap = {
            "A1": "newValue"
        };

        const result = getUnreconciledUpdates(existingUpdates, incomingUpdates);

        expect(result).toEqual(expected);
    });

    it("should correctly handle case where incoming updates have more cells than existing updates", () => {
        const existingUpdates: SheetDataMap = {
            "A1": "oldValue"
        };
        const incomingUpdates: SheetDataMap = {
            "A1": "newValue",
            "B2": "anotherNewValue",
            "C3": "yetAnotherNewValue"
        };

        const expected: SheetDataMap = {
            "A1": "newValue",
            "B2": "anotherNewValue",
            "C3": "yetAnotherNewValue"
        };

        const result = getUnreconciledUpdates(existingUpdates, incomingUpdates);

        expect(result).toEqual(expected);
    });
});
