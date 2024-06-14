import {
  FormulaNode,
  FunctionCallNode,
  ExpressionNode,
  NumberNode,
  OperationNode,
  ReferenceNode,
  StringNode,
} from "./Nodes";

/**
 * Creates a evalutor for the parsing of the different node objects
 * @author eduardo-ruiz-garay
 */
class Evaluator {
  private static instance: Evaluator;
  private context: { [key: string]: string } = {};

  constructor() {}

  /**
   * Singleton patter for getInstance
   *
   * @returns an instance of the object
   * @author eduardo-ruiz-garay
   */
  public static getInstance() {
    if (Evaluator.instance == null) {
      Evaluator.instance = new Evaluator();
    }

    return Evaluator.instance;
  }

  /**
   * Allows the sheet data to populate the context hashmap
   *
   * @param context hash map of the sheet data
   * @author eduardo-ruiz-garay
   */
  public setContext(context: { [key: string]: string }) {
    this.context = context;
  }

  /**
   * Returns the value of a particular reference to the hashmap.
   *
   * @param reference
   * @returns
   * @author eduardo-ruiz-garay
   */
  public getContextValue(reference: string): string {
    return this.context[reference];
  }

  /**
   * Returns a boolean for if a range operation exists in the function call node.
   *
   * @param expressions the expressions of a function call node
   * @returns boolean
   * @author rishavsarma5
   */
  public checkForRangeOp(expressions: ExpressionNode[]): boolean {
    for (const exp of expressions) {
      if (exp instanceof OperationNode) {
        if (exp.op === ":") {
          return true;
        } else {
          continue;
        }
      }
    }
    return false;
  }

  /**
   * Returns the Expression Node with the range operation in the function call node.
   *
   * @param expressions the expressions of a function call node
   * @returns OperationNode<ExpressionNode> | null
   * @author rishavsarma5
   */
  public getRangeOpEx(expressions: ExpressionNode[]): OperationNode<ExpressionNode> | null {
    for (const exp of expressions) {
      if (exp instanceof OperationNode) {
        if (exp.op === ":") {
          return exp;
        } else {
          continue;
        }
      }
    }
    return null;
  }

  /**
   * Added evaluate to the expression node based on the expressionNodes.
   *
   * @param node ExpressionNode
   * @returns
   * @author eduardo-ruiz-garay
   */
  evaluate(node: ExpressionNode): string {
    if (node instanceof FunctionCallNode) {
      // ensures range op is handled
      if (this.checkForRangeOp(node.expressions)) {
        const rangeExp = this.getRangeOpEx(node.expressions);
        if (rangeExp) {
          const args =  this.rangeOp(rangeExp).map((arg: number) =>
            arg.toString()
          );
          const result = this.applyFunc(node.func, args);
          return typeof result === "number" ? result.toString() : result;
        } else {
          throw new Error(`Could not access range op: ${rangeExp}`);
        }
      } else {
        const args = node.expressions.map((arg: ExpressionNode) =>
          this.evaluate(arg)
        );
        const result = this.applyFunc(node.func, args);
        return typeof result === "number" ? result.toString() : result;
      }
    } else if (node instanceof NumberNode) {
      return node.value.toString();
    } else if (node instanceof StringNode) {
      return node.value;
    } else if (node instanceof ReferenceNode) {
      if (this.context[node.ref] === "") {
        return node.ref;
      } else {
        return this.context[node.ref];
      }
    } else if (node instanceof OperationNode) {
      const left = this.evaluate(node.left);
      const right = this.evaluate(node.right);
      const result = this.applyOp(node.op, left, right);
      return typeof result === "number" ? result.toString() : result;
    } else if (node instanceof FormulaNode) {
      return this.evaluate(node.expression);
    } else {
      throw new Error(`Unknown node type: ${node}`);
    }
  }

  /**
   * Added the application operation
   *
   * @param op operation identifier
   * @param left left string value
   * @param right right string
   * @returns the sting or number
   * @author eduardo-ruiz-garay
   */
  private applyOp(op: string, left: string, right: string): number | string {
    switch (op) {
      case "+":
        return this.toNumber(left) + this.toNumber(right);
      case "-":
        return this.toNumber(left) - this.toNumber(right);
      case "*":
        return this.toNumber(left) * this.toNumber(right);
      case "/":
        if (this.toNumber(right) === 0) throw new Error("Division by zero");
        return this.toNumber(left) / this.toNumber(right);
      case "<":
        return this.toNumber(left) < this.toNumber(right) ? 1 : 0;
      case ">":
        return this.toNumber(left) > this.toNumber(right) ? 1 : 0;
      case "=":
        return left === right ? 1 : 0;
      case "<>":
        return left === right ? 0 : 1;
      case "&":
        return (this.toNumber(left) & this.toNumber(right)) !== 0 ? 1 : 0;
      case "|":
        return (this.toNumber(left) | this.toNumber(right)) === 1 ? 1 : 0;
      default:
        throw new Error(`Unknown operator: ${op}`);
    }
  }

  /**
   * The range operation creates a array of the values
   *
   * @param node Expression Node
   * @returns the list of values in the range
   * @author eduardo-ruiz-garay
   */
  private rangeOp(node: OperationNode<ExpressionNode>): number[] {
    const res: number[] = [];
    if (
      node.left instanceof ReferenceNode &&
      node.right instanceof ReferenceNode &&
      node.op === ":"
    ) {
      // Get col and row of the reference
      let rowStart = "";
      let colStart = "";
      for (let i = 1; i < node.left.ref.length; i++) {
        if (!/^-?\d+(\.\d+)?$/.test(node.left.ref.charAt(i))) {
          rowStart += node.left.ref.charAt(i);
        } else {
          colStart += node.left.ref.charAt(i);
        }
      }

      let rowEnd = "";
      let colEnd = "";
      for (let i = 1; i < node.right.ref.length; i++) {
        if (!/^-?\d+(\.\d+)?$/.test(node.right.ref.charAt(i))) {
          rowEnd += node.right.ref.charAt(i);
        } else {
          colEnd += node.right.ref.charAt(i);
        }
      }

      const cStart = this.columnLetterToNumber(rowStart) - 1;
      const cEnd = this.columnLetterToNumber(rowEnd) - 1;

      for (let i = cStart; i <= cEnd; i++) {
        for (let j = parseInt(colStart); j <= parseInt(colEnd); j++) {
          const fcol = this.getHeaderLetter(i);
          const str = "$" + fcol + j.toString();
          const value = this.context[`${str}`];
          res.push(value ? parseInt(value) : 0);
        }
      }
    }
    return res;
  }

  /**
   * Get the header value of the string.
   *
   * @param curr take in a numer for columns
   * @returns the string reference
   * @author eduardo-ruiz-garay
   */
  getHeaderLetter = (curr: number): string => {
    let currentCol = curr;
    let letters = "";
    while (currentCol >= 0) {
      const remainder = currentCol % 26;
      letters = String.fromCharCode(65 + remainder) + letters;
      currentCol = Math.floor(currentCol / 26) - 1;
    }

    return letters;
  };

  /**
   * Turns the column letter to number.
   *
   * @param column
   * @returns the number value
   * @author eduardo-ruiz-garay
   */
  columnLetterToNumber(column: string): number {
    let number = 0;
    for (let i = 0; i < column.length; i++) {
      number = number * 26 + (column.charCodeAt(i) - "A".charCodeAt(0) + 1);
    }
    return number;
  }

  /**
   * Checks if the string is not a number if it isnt then return the number
   *
   * @param value string of number
   * @returns number by parsing the value
   * @author eduardo-ruiz-garay
   */
  private toNumber(value: string): number {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      return num;
    } else {
      throw new Error(`Value cannot be converted to a number: ${value}`);
    }
  }

  /**
   * Checks if the function is a type and then does the opperation.
   *
   * @param func string for func
   * @param args args for the string
   * @returns number or string of the function
   * @author eduardo-ruiz-garay
   */
  private applyFunc(func: string, args: string[]): number | string {
    // func to check that all args can be converted to a number
    const toNumbers = (args: string[]): number[] => {
      return args.map((arg) => this.toNumber(arg));
    };

    // switch to match functions to defined ones
    switch (func) {
      case "IF":
        return this.toNumber(args[0]) !== 0 ? args[1] : args[2];
      case "SUM":
        return this.sum(toNumbers(args));
      case "MIN":
        return Math.min(...toNumbers(args));
      case "MAX":
        return Math.max(...toNumbers(args));
      case "AVG":
        return this.average(toNumbers(args));
      case "CONCAT":
        return args.join("");
      case "COPY":
        return this.copyFunction(args);
      case "DEBUG":
        return args[0];
      default:
        throw new Error(`Unknown function: ${func}`);
    }
  }

  /**
   * Adds the numbers in the array
   *
   * @param args numbers
   * @returns new sum value
   * @author eduardo-ruiz-garay
   */
  private sum(args: number[]): number {
    return args.reduce((acc, val) => acc + val, 0);
  }

  /**
   *
   * @param args
   * @returns
   */
  private average(args: number[]): number {
    return this.sum(args) / args.length;
  }

  /**
   * Takes in the new value which can be anything then change the second
   *
   * @param args the target new place
   * @returns string of the old target
   * @author eduardo-ruiz-garay
   */
  private copyFunction(args: string[]): string {
    const val: string = args[0];
    const newPlace: string = args[1];
    this.context[newPlace] = val;

    return this.context[newPlace];
  }
}
export default Evaluator;
