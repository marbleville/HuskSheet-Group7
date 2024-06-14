import React, { useState, useEffect } from "react";
import "../styles/Cell.css";
import Parser from "../functions/Parser";
import Evaluator from "../functions/Evaluator";

// represents the props passed into Cell from Sheet
interface CellProps {
  cellId: string;
  onUpdate: (value: string, cellId: string) => void;
  onFormulaUpdate: (value: string, cellId: string) => void;
  cellValue: string;
  sheetData: { [key: string]: string };
  formulaData: { [key: string]: string };
  isUpdated: boolean;
}

// CONSTANTS
// necessary for evaluating cell input
const parser = Parser.getInstance();
const evaluator = Evaluator.getInstance();

/**
 * The Cell component. Handles user input and client-side evaluation.
 * Has funcs to update the Sheet state vars based on evaluated input.
 *
 * @author rishavsarma5
 */
const Cell: React.FC<CellProps> = ({
  cellId,
  onUpdate, // calls handleCellUpdate in Sheet with given value and cellId
  onFormulaUpdate, // calls handleFormulaUpdate in Sheet
  cellValue,
  sheetData,
  formulaData,
  isUpdated,
}) => {
  // set Cell state
  const [value, setValue] = useState(cellValue);
  const [prevValue, setPrevValue] = useState(cellValue);
  const [error, setError] = useState(false);

  /**
   * On change to the cell input, usually from evaluation from sheet, this will trigger 
   * and update the displayed value of the cell to cellValue.
   *
   * @author rishavsarma5
   */
  useEffect(() => {
    setValue(cellValue);
  }, [cellValue]);

  /**
   * Handles displaying the currently typed input into the cell.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - react object for retrieving typed input
   *
   * @author rishavsarma5
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setPrevValue(value);
    setValue(newValue);
    setError(false);
  };

  /**
   * When the user clicks away from the Cell, this:
   * - handles updating the formula sheet data in Sheet
   * - handles evaluating the current content of the Cell and also updating the Sheet.
   *
   * @author rishavsarma5
   */
  const handleBlur = () => {
    // only updates if new input is different from old input (in case user just clicks on the cell)
    if (value !== prevValue) {
      onFormulaUpdate(value, cellId);
      evaluateAndUpdate();
    } else {
      setValue(cellValue);
    }
  };

  /**
   * When the user clicks onto a Cell, this replaces the current input with
   * the formula version if it exists, so the user can edit the formula.
   *
   * @author rishavsarma5
   */
  const handleFocus = () => {
    // only displays formula if it exists
    if (formulaData[cellId]) {
      setPrevValue(formulaData[cellId]);
      setValue(formulaData[cellId]);
    }
  };

  /**
   * When the user presses Enter, this calls handleBlur to update and evaluate the Cell.
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} event - react object for detecting key press
   *
   * @author rishavsarma5
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleBlur();
    }
  };

  /**
   * This tries to evaluate the input of the cell, by parsing and evaluating it (given classes).
   * It also has error checking for if the evaluation fails and tells the Cell to clear the input
   * and display a red box.
   *
   * @author rishavsarma5
   */
  const evaluateAndUpdate = () => {
    // edge-case handling
    if (value === "") {
      onUpdate("", cellId);
      return;
    }
    // important for allowing the Evaluator to get the values of other Cells
    evaluator.setContext(sheetData);
    let result: string = "";
    let isError = false;
    try {
      const parsedNode = parser.parse(value);
      result = evaluator.evaluate(parsedNode);
      //console.log('Evaluation Result:', result);
    } catch (error) {
      isError = true;
    }

    // if there is an error, clears input, resets formula, and sets error to be shown
    if (isError) {
      result = "";
      setValue(result);
      onFormulaUpdate(result, cellId);
      setError(true);
    }
    onUpdate(result, cellId);
    setPrevValue(result);
  };

  /**
   * Renders the cell UI.
   * 
   * @author rishavsarma5
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
        onChange={handleChange} // triggers when the user types anything
        onBlur={handleBlur} // triggers when user clicks away
        onKeyDown={handleKeyDown} // triggers when user presses a key
        onFocus={handleFocus} // triggers when user clicks onto cell
        className="cell-input"
        style={{ color: isUpdated ? "blue" : "inherit" }}
      />
    </td>
  );
};

export default Cell;
