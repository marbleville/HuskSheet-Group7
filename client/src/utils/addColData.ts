import { SheetDataMap } from "../types";
import getHeaderLetter from "./getHeaderLetter";

/**
 * Adds a new column to the sheet data.
 * 
 * @param {SheetDataMap} sheetData 
 *        The current sheet data
 * @param {number} numCols 
 *        The current number of columns
 * @param {number} numRows 
 *        The current number of rows
 * @returns {SheetDataMap} 
 *        The updated sheet data with the new column added
 * 
 * @author rishavsarma5
 */
const addColData = (
    sheetData: SheetDataMap, 
    numCols: number, 
    numRows: number, 
) => {
    const newSheetData = { ...sheetData };
    const newColumnLetter = getHeaderLetter(numCols);

    for (let row = 1; row <= numRows; row++) {
        const cellID = `$${newColumnLetter}${row}`;
        newSheetData[cellID] = "";
    }

    return newSheetData;
};

export default addColData;