import Parser from "../functions/Parser";
import Evaluator from "../functions/Evaluator";
import { SheetDataMap } from "../types";

const parser = Parser.getInstance();
const evaluator = Evaluator.getInstance();

const evaluateCellInput = async (
  sheetData: SheetDataMap,
  cellId: string
): Promise<string> => {
  const cellValue = sheetData[cellId];

  // Set the context for the evaluator to use the current sheet data
  evaluator.setContext(sheetData);

  try {
    const parsedNode = parser.parse(cellValue); // Parse the cell value
    const result = evaluator.evaluate(parsedNode); // Evaluate the parsed expression
    return result.toString(); // Convert result to string (assuming it's a string)
  } catch (error) {
    console.error(`Error evaluating cell ${cellId}:`, error);
    return cellValue; // Return original value if evaluation fails
  }
};

export default evaluateCellInput;
