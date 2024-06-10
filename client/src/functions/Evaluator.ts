import {
  FormulaNode,
  FunctionCallNode,
  ExpressionNode,
  NumberNode,
  OperationNode,
  ReferenceNode,
  StringNode,
} from "./Nodes";

class Evaluator {
  private static instance: Evaluator;
  private context: { [key: string]: string } = {};

  constructor() {}

  public static getInstance() {
    if (Evaluator.instance == null) {
      Evaluator.instance = new Evaluator();
    }

    return Evaluator.instance;
  }

  public setContext(context: { [key: string]: string }) {
    this.context = context;
  }

  evaluate(node: ExpressionNode): string {
    if (node instanceof NumberNode) {
      return node.number.toString();
    } else if (node instanceof StringNode) {
      return node.value;
    } else if (node instanceof ReferenceNode) {
      return this.context[node.ref] ?? "";
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
}

export default Evaluator;
