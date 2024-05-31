import React, { useState } from "react";

interface CellProps {
  cellId: string;
  initialValue: string;
  onUpdate: (value: string, cellId: string) => void;
}

const Cell: React.FC<CellProps> = ({ cellId, initialValue, onUpdate }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onUpdate(newValue, cellId);
  };

  const applyUpdate = (update: string) => {
    setValue(update);
  };

  const getCurrentUpdate = (): string => {
    return `${cellId} ${value}`;
  };

  return (
    <td key={cellId}>
      <input type="text" value={value} onChange={handleChange} />
    </td>
  );
};

export default Cell;
