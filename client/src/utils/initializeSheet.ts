import { SheetDataMap } from "../types";
import getHeaderLetter from "./getHeaderLetter";

/**
 * Initializes the SheetDataMap based on given row/columns.
 * 
 * @param {number} rowSize - number of rows to initialize with
 * @param {number} colSize - number of columns to initialize with
 * @returns {SheetDataMap} - the initialized sheet
 *
 * @author rishavsarma5
 */
const initializeSheet = (
    rowSize: number,
    colSize: number
): SheetDataMap => {
    const initialData: SheetDataMap = {};

    for (let i = 1; i <= rowSize; i++) {
        for (let j = 0; j < colSize; j++) {
            const columnValue: string = getHeaderLetter(j);
            const ref = `$${columnValue}${i}`;
            initialData[ref] = "";
        }
    }

    return initialData;
};

export default initializeSheet;