import { ExpressionNode, FormulaNode, FunctionCallNode, OperationNode, ReferenceNode } from "../functions/Nodes";
import Parser from "../functions/Parser";
import { SheetDataMap } from "../types";

const findDependencies = (sheetData: SheetDataMap, cellId: string): string[] => {
    const cellValue = sheetData[cellId];
    const dependencies: string[] = [];
  
    // Example implementation (adapt based on your formula parsing logic)
    // This is a basic implementation and should be enhanced for actual usage
    const parsedNode: ExpressionNode = Parser.getInstance().parse(cellValue);

    //console.log(`parsed node: ${JSON.stringify(parsedNode)}`);

    // Function to recursively find dependencies
    const traverseNode = (node: ExpressionNode) => {
        if (node instanceof ReferenceNode) {
            dependencies.push(node.ref); // Add reference to dependencies
        } else if (node instanceof FunctionCallNode) {
            // Recursively traverse function call nodes
            for (const expr of node.expressions) {
              traverseNode(expr);
            }
        } else if (node instanceof FormulaNode) {
            // Recursively traverse function call nodes
            traverseNode(node.expression);
        } else if (node instanceof OperationNode) {
            // Recursively traverse operation nodes
            traverseNode(node.left);
            traverseNode(node.right);
        }
    };

    traverseNode(parsedNode); // Start traversal
    //console.log(JSON.stringify(dependencies))
    return dependencies;
  };

export default findDependencies;
