import React, { useState, useEffect } from "react";
import "../styles/Cell.css";

interface CellProps {
  cellId: string;
  initialValue: string;
  onUpdate: (value: string, cellId: string) => void;
  cellValue: string;
  isUpdated: boolean;
}

// Inside the Cell component
const Cell: React.FC<CellProps> = ({
  cellId,
  initialValue,
  onUpdate,
  cellValue,
  isUpdated
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(cellValue);
  }, [cellValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  const handleBlur = () => {
    onUpdate(value, cellId);
  };

  return (
    <td key={cellId} className={`cell ${isUpdated ? 'updated-cell' : ''}`}>
      <input
        type="text"
        value={value ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        className="cell-input"
        style={{ color: isUpdated ? 'red' : 'inherit' }}
      />
    </td>
  );
};


export default Cell;
