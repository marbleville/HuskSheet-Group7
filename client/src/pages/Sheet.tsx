import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface SheetDataMap {
  [ref: string] : string
}

const initialSheetRowSize = 52;
const initialSheetColumnSize = 52;

const initializeSheet = (rowSize: number, colSize: number): SheetDataMap => {
  const initialData: SheetDataMap = {};

  for (let i = 1; i <= rowSize; i++) {
      for (let j = 0; j < colSize; j++) {
          const columnValue = String.fromCharCode(65 + j);
          const ref = `$${columnValue}${i}`;
          initialData[ref] = '';
      }
  }

  return initialData;
};

const Sheet: React.FC = () => {
  const { publisher, sheet } = useParams<{ publisher: string; sheet: string }>();

  const [cellValue, setCellValue] = useState(() => {
    const sheetData = initializeSheet(initialSheetRowSize, initialSheetRowSize);
    return sheetData;
  });

  const renderSheetHeader = () => {
    const headers = [];

    headers.push(<th key="header-empty"></th>)
    for (let col = 0; col < initialSheetColumnSize; col++) {
      headers.push(<th key={`$header-${col}`}>`${String.fromCharCode(65 + col)}`</th>)
    }

    return <tr>{headers}</tr>
  };

  const renderSheetRows = () => {
    const rows = [];

    for (let row = 1; row <= initialSheetRowSize; row++) {
      const cellsPerRow = [];
      cellsPerRow.push(<td key={`row-${row}`}>row</td>);

      for (let col = 1; col <= initialSheetColumnSize; col++) {
        cellsPerRow.push(<td key={`$${String.fromCharCode(65 + col)}${row}`}></td>)
      }
      rows.push(cellsPerRow)
    }
    
    return <tr>{rows}</tr>
  };



  return (
    <div>
      <h1>Sheet Page</h1>
      <p>Username: {publisher}</p>
      <p>Sheet Name: {sheet}</p>
      <table className="sheet">
        <thead>
          {renderSheetHeader()}
        </thead>
        <tbody>
          {renderSheetRows()}
        </tbody>
      </table>
    </div>
  );
}

export default Sheet;