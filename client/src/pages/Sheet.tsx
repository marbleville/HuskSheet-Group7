import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Cell from "./Cell";
import { fetchWithAuth } from "../utils";
import "../styles/Sheet.css";
import { Argument } from "../../../types/types";

/**
 * @description This is the HashMap type that represents how cell data is stored on a sheet.
 *
 * @author rishavsarma5
 */
interface SheetDataMap {
  [ref: string]: string;
}

// GLOBAL CONSTANTS
const INITIALSHEETROWSIZE = 10;
const INITIALSHEETCOLUMNSIZE = 10;

/**
 * @description Initializes the sheet HashMap based on given row/columns.
 *
 * @author rishavsarma5
 */
const initializeSheet = (rowSize: number, colSize: number): SheetDataMap => {
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

/**
 * @description Helper to get the letter of the column
 * Starts from 'A ... Z, then 'AA ... AZ', etc.
 *
 * @author rishavsarma5
 */
const getHeaderLetter = (curr: number): string => {
  let currentCol = curr;
  let letters = "";
  while (currentCol >= 0) {
    const remainder = currentCol % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    currentCol = Math.floor(currentCol / 26) - 1;
  }

  return letters;
};

/**
 * @description Represents a Sheet that a publisher owns and Subscribers can make edits on.
 * Renders a scrollable table with cell inputs and a publish button to allow edits to be saved to the server.
 *
 * @author kris-amerman, rishavsarma5, eduardo-ruiz-garay
 */
const Sheet: React.FC = () => {
  // receive information about sheet from dashboard page
  const location = useLocation();
  const sheetInfo: Argument = location.state;

  // initializes the first sheetData with 100 rows/columns
  const initialSheetData: SheetDataMap = initializeSheet(
    INITIALSHEETROWSIZE,
    INITIALSHEETCOLUMNSIZE
  );

  // sets state for sheet data
  const [sheetData, setSheetData] = useState<SheetDataMap>(initialSheetData);
  const prevCellDataRef = useRef<SheetDataMap>({ ...sheetData });

  const [numRows, setNumRows] = useState(INITIALSHEETROWSIZE);
  const [numCols, setNumCols] = useState(INITIALSHEETCOLUMNSIZE);
  const [newlyAddedCells, setNewlyAddedCells] = useState<Set<string>>(
    new Set()
  );
  const [newlyDeletedCells, setNewlyDeletedCells] = useState<Set<string>>(
    new Set()
  );

  /**
   * @description Updates the sheetData when a cell's input changes.
   *
   * @author rishavsarma5, eduardo-ruiz-garay
   */
  const handleCellUpdate = (value: string, cellId: string) => {
    console.log(`should be called for ${cellId} with value: ${value}`);
    if (value === "<DELETED>" || value === "<CREATED>") {
      value = "";
    }
    setSheetData((prevSheetData) => {
      const updatedSheetData = { ...prevSheetData, [cellId]: value };
      prevCellDataRef.current = {
        ...prevCellDataRef.current,
        [cellId]: prevSheetData[cellId],
      };
      return updatedSheetData;
    });
  };

  /**
   * @description Gets all new updates a Publisher/Subscriber makes on a sheet and pushes to server using args.
   *
   * @author rishavsarma5, eduardo-ruiz-garay
   */
  const onPublishButtonClick = async () => {
    // iterates through sheetData and stores updates in a new-line delimited string
    const getAllCellUpdates = (): string => {
      const payload: string[] = [];

      for (const ref of newlyDeletedCells) {
        payload.push(`${ref} <DELETED>`);
      }

      for (const ref of newlyAddedCells) {
        payload.push(`${ref} <CREATED>`);
      }

      for (const [ref, valueAtCell] of Object.entries(sheetData)) {
        const prevValueAtCell = prevCellDataRef.current[ref] || "";
        if (valueAtCell !== prevValueAtCell) {
          payload.push(`${ref} ${valueAtCell}`);
        }
      }

      return payload.join("\n");
    };

    // Argument object of all updates to a sheet
    const allUpdates: Argument = {
      publisher: sheetInfo.publisher,
      sheet: sheetInfo.sheet,
      id: "",
      payload: getAllCellUpdates(),
    };

    console.log(allUpdates.payload);

    // calls updatePublished or updateSubscribed depending on user and relation to sheet
    // @TODO: call UpdateSubscribed

    try {
      await fetchWithAuth("http://localhost:3000/api/v1/updatePublished", {
        method: "POST",
        body: JSON.stringify(allUpdates),
      });

      // Reset newlyAddedCells and newlyDeletedCells sets to empty after successful fetch
      //setNewlyAddedCells(new Set());
      //setNewlyDeletedCells(new Set());
    } catch (error) {
      console.error("Error publishing new changes", error);
    }
  };

  const addNewRow = () => {
    setNumRows((prevNumRows) => prevNumRows + 1);

    const newSheetData = { ...sheetData };
    const newRowNumber = numRows + 1;
    const newCells = new Set(newlyAddedCells);

    for (let col = 0; col < numCols; col++) {
      const colLetter = getHeaderLetter(col);
      const cellID = `$${colLetter}${newRowNumber}`;
      newSheetData[cellID] = "";
      prevCellDataRef.current[cellID] = "";
      newCells.add(cellID);

      // Check if the newly added cell was marked as deleted before
      if (newlyDeletedCells.has(cellID)) {
        newlyDeletedCells.delete(cellID); // Remove the cell from deletedCells
        newCells.delete(cellID);
      }
    }

    setSheetData(newSheetData);
    setNewlyAddedCells(newCells);
  };

  const deleteRow = () => {
    if (numRows === 1) {
      return;
    }

    setNumRows((prevNumRows) => prevNumRows - 1);
    const lastRowNumber = numRows;

    const newSheetData = { ...sheetData };
    const deletedCells = new Set(newlyDeletedCells);

    for (let col = 0; col < numCols; col++) {
      const colLetter = getHeaderLetter(col);
      const cellID = `$${colLetter}${lastRowNumber}`;
      delete newSheetData[cellID];
      delete prevCellDataRef.current[cellID];
      deletedCells.add(cellID);

      // Check if the newly deleted cell was added before
      if (newlyAddedCells.has(cellID)) {
        newlyAddedCells.delete(cellID); // Remove the cell from addedCells
        deletedCells.delete(cellID);
      }
    }

    setSheetData(newSheetData);
    setNewlyDeletedCells(deletedCells);
  };

  const addNewCol = () => {
    setNumCols((prevNumCols) => prevNumCols + 1);

    const newSheetData = { ...sheetData };
    const newColumnLetter = getHeaderLetter(numCols);
    const newCells = new Set(newlyAddedCells);

    for (let row = 1; row <= numRows; row++) {
      const cellID = `$${newColumnLetter}${row}`;
      newSheetData[cellID] = "";
      prevCellDataRef.current[cellID] = "";
      newCells.add(cellID);

      // Check if the newly added cell was marked as deleted before
      if (newlyDeletedCells.has(cellID)) {
        newlyDeletedCells.delete(cellID); // Remove the cell from deletedCells
        newCells.delete(cellID);
      }
    }

    setSheetData(newSheetData);
    setNewlyAddedCells(newCells);
  };

  const deleteCol = () => {
    if (numCols === 1) {
      return;
    }

    setNumCols((prevNumCols) => prevNumCols - 1);

    const newSheetData = { ...sheetData };
    const lastColumnLetter = getHeaderLetter(numCols - 1);
    const deletedCells = new Set(newlyDeletedCells);

    for (let row = 1; row <= numRows; row++) {
      const cellID = `$${lastColumnLetter}${row}`;
      delete newSheetData[cellID];
      delete prevCellDataRef.current[cellID];
      deletedCells.add(cellID);

      // Check if the newly deleted cell was added before
      if (newlyAddedCells.has(cellID)) {
        newlyAddedCells.delete(cellID); // Remove the cell from addedCells
        deletedCells.delete(cellID);
      }
    }

    setSheetData(newSheetData);
    setNewlyDeletedCells(deletedCells);
  };

  /**
   * Renders the headers of the columns correctly with the A then to AA by using mod 26.
   *
   * @author rishavsarma5, eduardo-ruiz-garay
   * @returns the new headers for the columns
   */
  const renderSheetHeader = () => {
    const headers = [];
    headers.push(<th key="header-empty" className="header"></th>);

    const col = numCols;
    for (let i = 0; i < col; i++) {
      const letters: string = getHeaderLetter(i);
      headers.push(
        <th key={`header-${letters}`} className="header">
          {letters}
        </th>
      );
    }

    headers.push(
      <th key="delete-column-header" className="button-header">
        <button
          onClick={deleteCol}
          className="delete-column-button"
          key="delete-column-button"
        >
          - Column
        </button>
      </th>
    );

    headers.push(
      <th key="add-column-header" className="button-header">
        <button
          onClick={addNewCol}
          className="add-column-button"
          key="add-column-button"
        >
          + Column
        </button>
      </th>
    );

    return <tr>{headers}</tr>;
  };

  /**
   * Renders the rows and renders cells for each column in each row.
   *
   * @author rishavsarma5, eduardo-ruiz-garay
   * @returns the row headers and cells per row
   */
  const renderSheetRows = () => {
    const rows = [];

    for (let row = 1; row <= numRows; row++) {
      const cellsPerRow = [];
      cellsPerRow.push(
        <td key={`row-header-${row}`} className="row-header">
          {row}
        </td>
      );

      for (let col = 0; col < numCols; col++) {
        const columnLetter: string = getHeaderLetter(col);
        const cellId = `$${columnLetter}${row}`;
        cellsPerRow.push(
          <Cell
            key={cellId}
            cellId={cellId}
            initialValue={sheetData[cellId]}
            onUpdate={handleCellUpdate}
          />
        );
      }
      rows.push(
        <tr key={`row-${row}`} className="row">
          {cellsPerRow}
        </tr>
      );
    }

    rows.push(
      <tr key="row-buttons">
        <td className="button-header">
          <button
            onClick={deleteRow}
            className="delete-row-button"
            key="delete-row-button"
          >
            - Row
          </button>
          <button
            onClick={addNewRow}
            className="add-row-button"
            key="add-row-button"
          >
            + Row
          </button>
        </td>
        <td colSpan={numCols}></td>
      </tr>
    );

    return <>{rows}</>;
  };

  // html for rendering sheet
  return (
    <div className="sheet-container">
      <div className="info-section">
        <div className="publisher-info">Publisher: {sheetInfo.publisher}</div>
        <div className="sheet-name">Sheet Name: {sheetInfo.sheet}</div>
        <button
          onClick={onPublishButtonClick}
          className="publish-button"
          key="publish-button"
        >
          Publish
        </button>
      </div>
      <div className="sheet-wrapper">
        <table className="sheet">
          <thead>{renderSheetHeader()}</thead>
          <tbody>{renderSheetRows()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Sheet;
