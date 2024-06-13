import { SheetDataMap } from "../types";
import getHeaderLetter from "./getHeaderLetter";

/**
 * Adds a new row to the sheet data.
 * 
 * @param {SheetDataMap} sheetData 
 *        The current sheet data
 * @param {number} numRows 
 *        The current number of rows
 * @param {number} numCols 
 *        The current number of columns
 * @param {React.MutableRefObject<SheetDataMap>} prevCellDataRef 
 *        A reference object to store the previous cell data
 * @returns {Object} 
 *        The updated sheet data with the new row added
 * 
 * @author rishavsarma5
 */
const addRowData = (
    sheetData: SheetDataMap, 
    numRows: number, 
    numCols: number, 
) => {
    const newSheetData = { ...sheetData };
    const newRowNumber = numRows + 1;

    for (let col = 0; col < numCols; col++) {
        const colLetter = getHeaderLetter(col);
        const cellID = `$${colLetter}${newRowNumber}`;
        // If there's an update for this cellID, use the provided value
        newSheetData[cellID] = "";
    }

    return newSheetData;
};

export default addRowData;