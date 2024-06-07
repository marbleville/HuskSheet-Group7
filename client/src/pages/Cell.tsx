import React, { useState, useEffect } from "react";
import "../styles/Cell.css";
import Parser from "../functions/Parser";
import Evaluator from "../functions/Evaluator";

interface CellProps {
  cellId: string;
  initialValue: string;
  onUpdate: (value: string, cellId: string) => void;
  cellValue: string; // New prop to pass the value of the cell
}

const Cell: React.FC<CellProps> = ({
  cellId,
  initialValue,
  onUpdate,
  cellValue, // Use cellValue instead of sheetData
}) => {
  const [value, setValue] = useState(initialValue);

  // Update the value when the cellValue prop changes
  useEffect(() => {
    setValue(cellValue);
  }, [cellValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  const handleBlur = () => {
    const parsedNode = Parser.getInstance().parse(value);
    console.log(`parser result: ${parsedNode}`);
    const result = Evaluator.getInstance().evaluate(parsedNode);
    console.log('Evaluation Result:', result);
    onUpdate(result.toString(), cellId);
  };

  return (
    <td key={cellId} className="cell">
      <input
        type="text"
        value={value ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        className="cell-input"
      />
    </td>
  );
};

export default Cell;
