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
 */
class Evaluator {
  private static instance: Evaluator;
  private context: { [key: string]: string } = {};

  constructor() {}

  /**
   * Singleton patter for getInstance
   *
   * @returns an instance of the object
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
   */
  public setContext(context: { [key: string]: string }) {
    this.context = context;
  }

  /**
   * Returns the value of a particular reference to the hashmap.
   *
   * @param reference
   * @returns
   */
  public getContextValue(reference: string): string {
    return this.context[reference];
  }

  evaluate(node: ExpressionNode): string {
    if (node instanceof NumberNode) {
      return node.value.toString();
    } else if (node instanceof StringNode) {
      return node.value;
    } else if (node instanceof ReferenceNode) {
      return this.context[node.ref] ?? node.ref;
    } else if (node instanceof OperationNode) {
      const left = this.evaluate(node.left);
      const right = this.evaluate(node.right);
      const result = this.applyOp(node.op, left, right);
      return typeof result === "number" ? result.toString() : result;
    } else if (node instanceof FunctionCallNode) {
      const args = node.expressions.map((arg: ExpressionNode) =>
        this.evaluate(arg)
      );
      const result = this.applyFunc(node.func, args);
      return typeof result === "number" ? result.toString() : result;
    } else if (node instanceof FormulaNode) {
      return this.evaluate(node.expression);
    } else {
      throw new Error(`Unknown node type: ${node}`);
    }
  }

  private applyOp(
    op: string,
    left: string,
    right: string
  ): number | string | string[] {
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

  private rangeOp(left: string, right: string): string[] {
    console.log(right, left);
    return [""];
  }

  private toNumber(value: string): number {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      return num;
    } else {
      throw new Error(`Value cannot be converted to a number: ${value}`);
    }
  }

  private applyFunc(func: string, args: string[]): number | string {
    const toNumbers = (args: string[]): number[] => {
      return args.map((arg) => this.toNumber(arg));
    };

    switch (func) {
      case "IF":
        return this.toNumber(args[0]) !== 0
          ? this.toNumber(args[1])
          : this.toNumber(args[2]);
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
        console.log(args);
        return this.copyFunction(args);
      case "DEBUG":
        console.log(args[0]);
        return args[0];
      default:
        throw new Error(`Unknown function: ${func}`);
    }
  }

  private sum(args: number[]): number {
    return args.reduce((acc, val) => acc + val, 0);
  }

  private average(args: number[]): number {
    return this.sum(args) / args.length;
  }

  private copyFunction(args: string[]): string {
    const val: string = args[0];
    const newPlace: string = args[1];
    this.context[newPlace] = val;
    return val;
  }
}
export default Evaluator;
