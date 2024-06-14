import React, { useState, useEffect } from "react";
import "../styles/Cell.css";
import {
  ExpressionNode,
  FunctionCallNode,
  FormulaNode,
} from "../functions/Nodes";
import Parser from "../functions/Parser";

interface CellProps {
  cellId: string;
  onUpdate: (value: string, cellId: string) => void;
  cellValue: string;
  sheetData: { [key: string]: string };
  isUpdated: boolean;
}

//const ERROR_TIMEOUT = 1500;

// Inside the Cell component
const Cell: React.FC<CellProps> = ({
  cellId,
  onUpdate,
  cellValue,
  sheetData,
  isUpdated,
}) => {
  const [value, setValue] = useState(cellValue);
  const [prevValue, setPrevValue] = useState(cellValue);
  const [error, setError] = useState(false);
  const [formula, setFormula] = useState(cellValue);

  useEffect(() => {
    setValue(cellValue);
    setPrevValue(cellValue);
    //console.log(`retrieved formula: ${sheetData[cellId]}`)
    if (isAFormula(sheetData[cellId])) {
      setFormula(sheetData[cellId]);
    }
  }, [cellValue]);

  const isAFormula = (cellValue: string): boolean => {
    const parsedNode: ExpressionNode = Parser.getInstance().parse(cellValue);

    return (
      parsedNode instanceof FunctionCallNode ||
      parsedNode instanceof FormulaNode
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setPrevValue(value);
    setValue(newValue);
    setError(false);
  };

  const handleFocus = () => {
    /*
    console.log(`formula in focus: ${formula}`);
    console.log(`value in focus: ${value}`);
    console.log(`prev value in focus: ${prevValue}`);
    console.log(`cell value in focus: ${cellValue}`);
    */
    // if there is a formula, i want to display it
    // whatever was in the value, then goes to previous value
    if (formula !== "") {
      setValue(formula);
      setPrevValue(value);
    } else {
      setValue(cellValue);
      setPrevValue(cellValue);
    }
  };

  const handleBlur = () => {
    /*
    console.log(`formula in blur: ${formula}`);
    console.log(`value in blur: ${value}`);
    console.log(`prev value in blur: ${prevValue}`);
    console.log(`cell value in blur: ${cellValue}`);
    */
    // if there is a new input that is different from whatever was there and a formula
    // then this is an update
    if (value !== prevValue && value !== formula) {
      console.log("CHANGE DETECTED");
      onUpdate(value, cellId);
    } else if (value === formula) {
      setValue(cellValue);
      setPrevValue(cellValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleBlur();
    }
  };

  /*
  const evaluateAndUpdate = () => {
    if (value === "") {
      onUpdate("", cellId);
      return;
    }
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
      // setTimeout(() => {
      //   setError(false);
      // }, ERROR_TIMEOUT);
    }
    onUpdate(result, cellId);
    setPrevValue(result);
  };
  */

  return (
    <td
      key={cellId}
      className={`cell ${error ? "error" : ""} ${
        isUpdated ? "updated-cell" : ""
      }`}
    >
      <input
        type="text"
        value={value ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        className="cell-input"
        style={{ color: isUpdated ? "blue" : "inherit" }}
      />
    </td>
  );
};

export default Cell;
