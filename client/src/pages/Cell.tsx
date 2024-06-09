import React, { useState, useEffect } from "react";
import "../styles/Cell.css";
import Parser from "../functions/Parser";
import Evaluator from "../functions/Evaluator";

interface CellProps {
  cellId: string;
  onUpdate: (value: string, cellId: string) => void;
  cellValue: string;
  sheetData: { [key: string]: string };
  isUpdated: boolean;
}

const ERROR_TIMEOUT = 1500;

// Inside the Cell component
const Cell: React.FC<CellProps> = ({
  cellId,
  onUpdate,
  cellValue,
  sheetData,
  isUpdated
}) => {
  const [value, setValue] = useState(cellValue);
  const [prevValue, setPrevValue] = useState(cellValue);
  const [error, setError] = useState(false);

  useEffect(() => {
    setValue(cellValue);
    setPrevValue(cellValue);
  }, [cellValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setPrevValue(value);
    setValue(newValue);
    setError(false);
  };

  const handleBlur = () => {
    if (value !== prevValue) {
      console.log("CHANGE DETECTED")
      evaluateAndUpdate();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      evaluateAndUpdate();
    }
  };

  const evaluateAndUpdate = () => {
    if (value === "") {
      onUpdate("", cellId);
      return;
    }
    const parser = Parser.getInstance()
    const evaluator = Evaluator.getInstance();
    evaluator.setContext(sheetData);
    let result: string = "";
    let isError = false;

    try {
      const parsedNode = parser.parse(value);
      result = evaluator.evaluate(parsedNode);
      console.log('Evaluation Result:', result);
    } catch (error) {
      isError = true;
    }

    if (isError) {
      result = "";
      setValue(result);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, ERROR_TIMEOUT);
    }
    onUpdate(result, cellId);
    setPrevValue(result);
  };

  return (
    <td key={cellId} className={`cell ${error ? 'error' : ''} ${isUpdated ? 'updated-cell' : ''}`}>
      <input
        type="text"
        value={value ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="cell-input"
        style={{ color: isUpdated ? 'blue' : 'inherit' }}
      />
    </td>
  );
};


export default Cell;
