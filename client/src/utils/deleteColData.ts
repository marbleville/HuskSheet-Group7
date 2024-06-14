import { SheetDataMap } from "../types";
import getHeaderLetter from "./getHeaderLetter";

/**
 * Deletes the last column from the sheet data.
 * 
 * @param {SheetDataMap} sheetData 
 *        The current sheet data
 * @param {number} numCols 
 *        The current number of columns
 * @param {number} numRows 
 *        The current number of rows
 * @param {function} handleCellUpdate 
 *        The function to handle cell updates
 * 
 * @author rishavsarma5
 */
const deleteColData = (
    sheetData: SheetDataMap, 
    numCols: number, 
    numRows: number, 
    handleCellUpdate: (value: string, cellID: string) => void
) => {
    // Do nothing if there's only one column left
    if (numCols === 1) {
        return sheetData;
    }

    const lastColumnLetter = getHeaderLetter(numCols - 1);

    for (let row = 1; row <= numRows; row++) {
        const cellID = `$${lastColumnLetter}${row}`;
        // Clear the cell content if it's not empty
        if (sheetData[cellID] !== "") {
            handleCellUpdate("", cellID);
        }
    }
};

export default deleteColData;
