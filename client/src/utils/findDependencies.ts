import {
  ExpressionNode,
  FormulaNode,
  FunctionCallNode,
  OperationNode,
  ReferenceNode,
} from "../functions/Nodes";
import Parser from "../functions/Parser";
import { SheetDataMap } from "../types";

/**
 * Parses a cell's value and recursively looks for any other cell references that are dependencies.
 *
 * @param {SheetDataMap} sheetData
 *        The current sheet data
 * @param {string} cellId
 *        The ref of the cell
 * @returns {string[]}
 *        array of all dependencies (cell refs)
 *
 * @author rishavsarma5
 */
const findDependencies = (
  sheetData: SheetDataMap,
  cellId: string
): string[] => {
  const cellValue = sheetData[cellId];
  const dependencies: string[] = [];

  const parsedNode: ExpressionNode = Parser.getInstance().parse(cellValue);

  // Function to recursively find dependencies
  const traverseNode = (node: ExpressionNode) => {
    if (node instanceof ReferenceNode) {
      if (node.ref !== cellId) {
        dependencies.push(node.ref); // Add reference to dependencies
      }
    } else if (node instanceof FunctionCallNode) {
      // Recursively traverse function call nodes
      for (const expr of node.expressions) {
        traverseNode(expr);
      }
    } else if (node instanceof FormulaNode) {
      // Recursively traverse formula nodes
      traverseNode(node.expression);
    } else if (node instanceof OperationNode) {
      // Recursively traverse operation nodes
      traverseNode(node.left);
      traverseNode(node.right);
    }
  };

  traverseNode(parsedNode);

  console.log(`cell ${cellId} has ${dependencies.length} dependencies`);
  return dependencies;
};

export default findDependencies;
