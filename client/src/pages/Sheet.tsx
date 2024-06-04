import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Cell from "./Cell";
import { fetchWithAuth } from "../utils";
import "../styles/Sheet.css";
import { SheetResponse } from "./Dashboard";
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
const INITIALSHEETROWSIZE = 100;
const INITIALSHEETCOLUMNSIZE = 100;

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
  
  /*
  const { publisher, sheet } = useParams<{
    publisher: string;
    sheet: string;
  }>();
  */

  // receive information about sheet from dashboard page
  const location = useLocation();
  const sheetInfo: SheetResponse = location.state;

  // initializes the first sheetData with 100 rows/columns
  const initialSheetData: SheetDataMap = initializeSheet(
    INITIALSHEETROWSIZE,
    INITIALSHEETCOLUMNSIZE
  );

  // sets state for sheet data
  const [sheetData, setSheetData] = useState<SheetDataMap>(initialSheetData);

/**
 * @description Updates the sheetData when a cell's input changes.
 * 
 * @author rishavsarma5, eduardo-ruiz-garay
 */
  const handleCellUpdate = (value: string, cellId: string) => {
    setSheetData((prevState) => {
      return { ...prevState, [cellId]: value };
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
      for (const [ref, valueAtCell] of Object.entries(sheetData)) {
        if (valueAtCell !== "") {
          payload.push(`${ref} ${valueAtCell}`);
        }
      }
      return payload.join("/n");
    };

    // Argument object of all updates to a sheet
    const allUpdates: Argument = {
      publisher: sheetInfo.publisher,
      sheet: sheetInfo.sheet,
      id: sheetInfo.id,
      payload: getAllCellUpdates(),
    };

    console.log(allUpdates.publisher);
    console.log(allUpdates.sheet);
    console.log(allUpdates.id);
    console.log(allUpdates.payload);

    // calls updatePublished or updateSubscribed depending on user and relation to sheet
    // TODO: call UpdateSubscribed

    try {
      await fetchWithAuth("http://localhost:3000/api/v1/updatePublished", {
        method: "POST",
        body: JSON.stringify(allUpdates),
      });
    } catch (error) {
      console.error("Error publishing new changes", error);
    }
  };

  /**
   * Renders the headers of the columns correctly with the A then to AA by using mod 26.
   *
   * @author rishavsarma5, eduardo-ruiz-garay
   * @returns the new headers for the columns
   */

  // TODO: make dynamic
  const renderSheetHeader = () => {
    const headers = [];
    headers.push(<th key="header-empty" className="header"></th>);

    const col = INITIALSHEETCOLUMNSIZE;
    for (let i = 0; i < col; i++) {
      const letters: string = getHeaderLetter(i);
      headers.push(
        <th key={`header-${letters}`} className="header">
          {letters}
        </th>
      );
    }

    return <tr>{headers}</tr>;
  };

  /**
   * Renders the rows and renders cells for each column in each row.
   *
   * @author rishavsarma5, eduardo-ruiz-garay
   * @returns the row headers and cells per row
   */

  // TODO: make dynamic
  const renderSheetRows = () => {
    const rows = [];

    for (let row = 1; row <= INITIALSHEETROWSIZE; row++) {
      const cellsPerRow = [];
      cellsPerRow.push(
        <td key={`row-header-${row}`} className="row-header">
          {row}
        </td>
      );

      for (let col = 0; col < INITIALSHEETCOLUMNSIZE; col++) {
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

    return rows;
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
