import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Cell from "./Cell";
import { fetchWithAuth } from "../utils";
import "../styles/Sheet.css";

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
  
  // Log the initialized data for debugging
  console.log(initialData);
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
  // const location = useLocation();
  // const data = location.state;

  let sheetData: SheetDataMap = {};

  const [cellValue, setCellValue] = useState(() => {
    sheetData = initializeSheet(initialSheetRowSize, initialSheetColumnSize);
    return sheetData;
  });

  const handleChange = (value: string, cellId: string) => {
    setCellValue((prevData) => ({ ...prevData, [cellId]: value }));
  };

  const onPublishButtonClick = async () => {
    // need to add getting all current updates from cells and sending that as well

    try {
      await fetchWithAuth("http://localhost:3000/api/v1/updatePublished", {
        method: "GET",
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
