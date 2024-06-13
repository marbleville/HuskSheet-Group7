import { SheetDataMap } from "../types";
import getColumnNumber from "./getColumnNumber";
import getColAndRowFromRef from "./getColAndRowFromRef";

/**
 * Parses an argument payload to generate a SheetDataMap.
 *
 * @param {string} payload - the payload to parse
 * @param {number} currColSize - the current column size
 * @param {number} currRowSize - the current row size
 * @returns {Object} - SheetDataMap and updated col/row numbers
 *
 * @author kris-amerman
 */
export const generateSheetDataMap = (
    payload: string,
    currColSize: number,
    currRowSize: number
): { sheetMap: SheetDataMap, newColSize: number, newRowSize: number } => {
    const sheetMap: SheetDataMap = {};
    let newColSize = currColSize;
    let newRowSize = currRowSize;

    const updates: string[] = payload.split("\n");

    for (const update of updates) {
        if (update.trim()) {
            const [ref, ...rest] = update.split(" ");
            const term = rest.join(" ");
            if (ref) {
                const { col, row } = getColAndRowFromRef(ref);
                const colNumber = getColumnNumber(col);

                if (colNumber > newColSize) {
                    newColSize = colNumber;
                }
                if (row > newRowSize) {
                    newRowSize = row;
                }

                sheetMap[ref] = term;
            }
        }
    }
    
    return { sheetMap, newColSize, newRowSize}; 
};

export default generateSheetDataMap;