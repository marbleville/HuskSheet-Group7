import React, { useState } from "react";
import "../styles/Cell.css";
//import Parser from "../functions/Parser";

/**
 * @description This is the Props object used for communicating between a Cell and the Sheet.
 *
 * @author rishavsarma5
 */
interface CellProps {
  cellId: string;
  initialValue: string;
  onUpdate: (value: string, cellId: string) => void;
}

/**
 * @description Represents a Cell that user can edit in a Sheet.
 * Renders the cell and has logic to update the Sheet state based on changed input.
 *
 * @author rishavsarma5
 */
const Cell: React.FC<CellProps> = React.memo(
  ({ cellId, initialValue, onUpdate }) => {
    // sets state for cell
    const [value, setValue] = useState(initialValue);
    const [prevValue, setPrevValue] = useState(initialValue);

    /**
     * @description On the change in input of a cell, it will update its state and call onUpdate,
     * which communicates the change to the Sheet so the Sheet can update its state.
     *
     * @author rishavsarma5
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      // TODO: Handle Formula/Expression Evaluation here
      // Start with handling functions that begin with =___(), then move to
      // Create a parser function that checks whether there is a formula or

      /*
      console.log(newValue);
      const parser = new Parser();
      console.log(parser.parse(""));

      const result = parser.parse("=IF(1, SUM(1, 2, 3), 0)");
      console.log(result); // Outputs: 6

      function parseSumFunction(input: string) {
        let sum = 0;
        // console.log(input.substring(0, 5));
        if (input.substring(0, 5) === "=sum(") {
          const vals: string[] = input
            .substring(5, input.length - 1)
            .split(",");
          // console.log(input.substring(5, input.length - 1));
          for (let i = 0; i < vals.length; i++) {
            const val: number = Number.parseInt(vals[i]);
            console.log(val);
            sum = sum + val;
          }
        }
        return sum;
      }
      console.log(parseSumFunction(newValue));
      const formulatedVal = parseSumFunction(newValue).toString();
      */
      setValue(newValue);
    };

    const handleBlur = () => {
      if (value !== prevValue) {
        onUpdate(value, cellId);
        setPrevValue(value);
      }
    };

    // html for rendering a cell
    return (
      <td key={cellId} className="cell">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className="cell-input"
        />
      </td>
    );
  }
);

export default Cell;
