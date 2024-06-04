import React, { useState } from "react";
import "../styles/Cell.css";

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
const Cell: React.FC<CellProps> = ({ cellId, initialValue, onUpdate }) => {
  // sets state for cell
  const [value, setValue] = useState(initialValue);

  /**
 * @description On the change in input of a cell, it will update its state and call onUpdate,
 * which communicates the change to the Sheet so the Sheet can update its state.
 * 
 * @author rishavsarma5
 */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onUpdate(newValue, cellId);
  };

  // html for rendering a cell
  return (
    <td key={cellId} className="cell">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="cell-input"
      />
    </td>
  );
};

export default Cell;
