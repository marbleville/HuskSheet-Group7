import { SheetDataMap } from "../types";
import getHeaderLetter from "./getHeaderLetter";

/**
 * Deletes the last row from the sheet data.
 * 
 * @param {SheetDataMap} sheetData 
 *        The current sheet data
 * @param {number} numRows 
 *        The current number of rows
 * @param {number} numCols 
 *        The current number of columns
 * @param {function} handleCellUpdate 
 *        The function to handle cell updates
 * @returns {SheetDataMap} 
 *        The updated sheet data with the last row deleted
 * 
 * @author rishavsarma5
 */
const deleteRowData = (
    sheetData: SheetDataMap, 
    numRows: number, 
    numCols: number, 
    handleCellUpdate: (value: string, cellID: string) => void
) => {
    // Do nothing if there's only one row left
    if (numRows === 1) {
        return sheetData;
    }

    const lastRowNumber = numRows;

    for (let col = 0; col < numCols; col++) {
        const colLetter = getHeaderLetter(col);
        const cellID = `$${colLetter}${lastRowNumber}`;
        // Clear the cell content if it's not empty
        if (sheetData[cellID] !== "") {
            handleCellUpdate("", cellID);
        }
    }

    return sheetData;
};

export default deleteRowData;
