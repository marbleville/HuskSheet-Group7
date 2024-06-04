import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Cell from "./Cell";
import { fetchWithAuth } from "../utils";
import "../styles/Sheet.css";
import { SheetResponse } from "./Dashboard";
import { Argument } from "../../../types/types";

interface SheetDataMap {
  [ref: string]: string;
}

const initialSheetRowSize = 52;
const initialSheetColumnSize = 52;

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

const Sheet: React.FC = () => {
  const { publisher, sheet } = useParams<{
    publisher: string;
    sheet: string;
  }>();

  // these two lines receive data from dashboard
  const location = useLocation();
  const sheetInfo: SheetResponse = location.state;

  let sheetData: SheetDataMap = initializeSheet(
    initialSheetRowSize,
    initialSheetColumnSize
  );

  //sets use state as sheet data
  const [cellValue, setCellValue] = useState<SheetDataMap>(sheetData);

  const handleChange = (value: string, cellId: string) => {
    // console.log(value);
    sheetData = { ...sheetData, [cellId]: value };
    setCellValue(sheetData);
    console.log(cellId);
    console.log(sheetData[cellId]);
    // console.log(cellValue);
  };

  // Gets the updates to the cel map and pushes to backend using args.
  const onPublishButtonClick = async () => {
    const getAllCellUpdates = (): string => {
      const payload: string[] = [];
      for (const [ref, valueAtCell] of Object.entries(sheetData)) {
        console.log(ref);
        console.log(valueAtCell);
        if (valueAtCell !== "") {
          payload.push(`${ref} ${valueAtCell}`);
          console.log(valueAtCell);
        }
      }
      return payload.join("/n");
    };

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
   * Displays the headers of the columns correctly with the A then to AA by using mod 26
   *
   * @returns the new headers for the columns
   */
  const renderSheetHeader = () => {
    const headers = [];
    headers.push(<th key="header-empty" className="header"></th>);

    const col = initialSheetColumnSize;
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

  const renderSheetRows = () => {
    const rows = [];

    for (let row = 1; row <= initialSheetRowSize; row++) {
      const cellsPerRow = [];
      cellsPerRow.push(
        <td key={`row-header-${row}`} className="row-header">
          {row}
        </td>
      );

      for (let col = 0; col < initialSheetColumnSize; col++) {
        const columnLetter: string = getHeaderLetter(col);
        const cellId = `$${columnLetter}${row}`;
        cellsPerRow.push(
          <Cell
            key={cellId}
            cellId={cellId}
            initialValue={cellValue[cellId]}
            onUpdate={handleChange}
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

  return (
    <div className="sheet-container">
      <div className="info-section">
        <div className="publisher-info">Publisher: {publisher}</div>
        <div className="sheet-name">Sheet Name: {sheet}</div>
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
