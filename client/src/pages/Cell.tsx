import React, { useState, useEffect } from "react";
import "../styles/Cell.css";

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
  isUpdated
}) => {
  const [value, setValue] = useState(cellValue);
  const [prevValue, setPrevValue] = useState(cellValue);
  const [error, setError] = useState(false);

  useEffect(() => {
    setValue(cellValue);
  }, [cellValue])


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setPrevValue(value);
    setValue(newValue);
    setError(false);
  };

  const handleBlur = () => {
    if (value !== prevValue) {
      console.log(`called onUpdate with value ${value} for cell ${cellId}`);
      onUpdate(value, cellId);
    }
  };

  const handleFocus = () => {
    console.log(`clicked on cell to replace it with ${sheetData[cellId]}`);
    setValue(sheetData[cellId]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log(`called onUpdate with value ${value} for cell ${cellId}`);
      handleBlur();
    }
  };

  // useEffect(() => {
  //   evaluator.setContext(sheetData);
  //   let result: string = "";
  //   let isError = false;
  
  //   try {
  //     const parsedNode = parser.parse(value);
  //     result = evaluator.evaluate(parsedNode);
  //   } catch (error) {
  //     isError = true;
  //     result = value; // Keep the original value if evaluation fails
  //   }
  
  //   if (isError) {
  //     setError(true);
  //   } else {
  //     setError(false);
  //     onUpdate(result, cellId); // Update the sheetData with the evaluated result
  //   }
  // }, [sheetData]);

  // const evaluate = () => {
  //   // if (value === "") {
  //   //   onUpdate("", cellId);
  //   //   return;
  //   // }
  //   evaluator.setContext(sheetData);
  //   let result: string = "";
  //   let isError = false;

  //   try {
  //     const parsedNode = parser.parse(value);
  //     result = evaluator.evaluate(parsedNode);
  //     console.log('Evaluation Result:', result);
  //   } catch (error) {
  //     isError = true;
  //   }

  //   if (isError) {
  //     result = value;
  //     setError(true);
  //     // setTimeout(() => {
  //     //   setError(false);
  //     // }, ERROR_TIMEOUT);
  //   }
  //   //onUpdate(result, cellId);
  //   setValue(result);
  //   setPrevValue(result);
  // };

  return (
    <td key={cellId} className={`cell ${error ? 'error' : ''} ${isUpdated ? 'updated-cell' : ''}`}>
      <input
        type="text"
        value={value ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        className="cell-input"
        style={{ color: isUpdated ? 'blue' : 'inherit' }}
      />
    </td>
  );
};


export default Cell;
