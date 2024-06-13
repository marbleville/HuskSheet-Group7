import { SheetDataMap } from "../types";
import getColumnNumber from "./getColumnNumber";
import getColAndRowFromRef from "./getColAndRowFromRef";

/**
 * Parses an argument payload to generate a SheetDataMap.
 *
 * @param {string} payload - the payload to parse
 * @param {number} currColSize - the current column size
 * @param {number} currRowSize - the current row size
 * @returns {SheetDataMap} - SheetDataMap representation of payload
 *
 * @author kris-amerman
 */
export const generateSheetDataMap = (
    payload: string,
    currColSize: number,
    currRowSize: number
): SheetDataMap => {
    const sheetsMap: SheetDataMap = {};

    const updates: string[] = payload.split("\n");

    for (const update of updates) {
        if (update.trim()) {
            const [ref, ...rest] = update.split(" ");
            const term = rest.join(" ");
            if (ref) {
                if (currRowSize === 0 || currColSize === 0) {
                    throw new Error("Sheet rows and columns not set!");
                }

                const { col, row } = getColAndRowFromRef(ref);
                const colNumber = getColumnNumber(col);

                if (colNumber > currColSize) {
                    currColSize = currColSize + colNumber - currColSize;
                }
                if (row > currRowSize) {
                    currRowSize = currRowSize + row - currRowSize;
                }

                sheetsMap[ref] = term;
            }
        }
    }
    
    return sheetsMap; // TODO make sure returning the most recent
};

export default generateSheetDataMap;