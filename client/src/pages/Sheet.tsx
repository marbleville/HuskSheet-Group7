import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Cell from "./Cell";
import { fetchWithAuth } from "../utils";

interface SheetDataMap {
  [ref: string]: string;
}

const initialSheetRowSize = 52;
const initialSheetColumnSize = 52;

const initializeSheet = (rowSize: number, colSize: number): SheetDataMap => {
  const initialData: SheetDataMap = {};

  for (let i = 1; i <= rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      const columnValue = String.fromCharCode(65 + j);
      const ref = `$${columnValue}${i}`;
      initialData[ref] = "";
    }
  }

  return initialData;
};

const Sheet: React.FC = () => {
  const { publisher, sheet } = useParams<{
    publisher: string;
    sheet: string;
  }>();

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

  const renderSheetHeader = () => {
    const headers = [];

    headers.push(<th key="header-empty"></th>);
    for (let col = 0; col < initialSheetColumnSize; col++) {
      headers.push(
        <th key={`header-${col}`}>{String.fromCharCode(65 + col)}</th>
      );
    }

    return <tr>{headers}</tr>;
  };

  const renderSheetRows = () => {
    const rows = [];

    for (let row = 1; row <= initialSheetRowSize; row++) {
      const cellsPerRow = [];
      cellsPerRow.push(<td key={`row-header-${row}`}>{row}</td>);

      for (let col = 1; col <= initialSheetColumnSize; col++) {
        const columnLetter = String.fromCharCode(65 + col);
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
      rows.push(<tr key={`row-${row}`}>{cellsPerRow}</tr>);
    }

    return rows;
  };

  return (
    <div>
      <h1>Sheet Page</h1>
      <p>Username: {publisher}</p>
      <p>Sheet Name: {sheet}</p>
      <table className="sheet">
        <thead>{renderSheetHeader()}</thead>
        <tbody>{renderSheetRows()}</tbody>
      </table>
      <br />
      <button
        onClick={onPublishButtonClick}
        key="publish-button"
        value="Publish"
      />
    </div>
  );
};

export default Sheet;
