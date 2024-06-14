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
 * @param {function} handleCellUpdate 
 *        The function to handle cell updates
 * @returns {SheetDataMap} 
 *        The updated sheet data with the new column added
 * 
 * @author rishavsarma5
 */
const addColData = (
    sheetData: SheetDataMap, 
    numCols: number, 
    numRows: number, 
    handleCellUpdate: (value: string, cellID: string) => void
) => {
    const newSheetData = { ...sheetData };
    const newColumnLetter = getHeaderLetter(numCols);

    for (let row = 1; row <= numRows; row++) {
        const cellID = `$${newColumnLetter}${row}`;
        newSheetData[cellID] = "";
        handleCellUpdate("", cellID);
    }

    return newSheetData;
};

export default addColData;