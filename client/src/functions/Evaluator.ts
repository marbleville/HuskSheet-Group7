import {
  FormulaNode,
  FunctionCallNode,
  INode,
  NumberNode,
  OperationNode,
  ReferenceNode,
  StringNode,
} from "./Nodes";

type Context = { [key: string]: number | string };

class Evaluator {
  private static instance: Evaluator;
  constructor(private context: Context) {}

  public static getInstance() {
    if (Evaluator.instance == null) {
      Evaluator.instance = new Evaluator({});
    }

    return Evaluator.instance;
  }

  evaluate(node: INode): number | string {
    if (node instanceof NumberNode) {
      return node.value;
    } else if (node instanceof StringNode) {
      return node.value;
    } else if (node instanceof ReferenceNode) {
      return this.context[node.ref];
    } else if (node instanceof OperationNode) {
      const left = this.evaluate(node.left);
      const right = this.evaluate(node.right);
      return this.applyOp(node.op, left, right);
    } else if (node instanceof FunctionCallNode) {
      const args = node.args.map((arg: INode) => this.evaluate(arg));
      return this.applyFunc(node.func, args);
    } else if (node instanceof FormulaNode) {
      return this.evaluate(node.expr);
    } else {
      throw new Error(`Unknown node type: ${node}`);
    }
  }

  private applyOp(
    op: string,
    left: number | string,
    right: number | string
  ): number | string {
    switch (op) {
      case "+":
        return (left as number) + (right as number);
      case "-":
        return (left as number) - (right as number);
      case "*":
        return (left as number) * (right as number);
      case "/":
        if (right === 0) throw new Error("Division by zero");
        return (left as number) / (right as number);
      case "<":
        return (left as number) < (right as number) ? 1 : 0;
      case ">":
        return (left as number) > (right as number) ? 1 : 0;
      case "=":
        return left === right ? 1 : 0;
      default:
        throw new Error(`Unknown operator: ${op}`);
    }
  }

  private applyFunc(func: string, args: (number | string)[]): number | string {
    switch (func) {
      case "IF":
        return args[0] !== 0 ? args[1] : args[2];
      case "SUM":
        if (args.every((arg) => typeof arg === "number")) {
          return this.sum(args as number[]);
        } else {
          throw new Error(`SUM function requires numeric arguments`);
        }
      case "MIN":
        return Math.min(...this.toNumbers(args));
      case "MAX":
        return Math.max(...this.toNumbers(args));
      case "AVG":
        if (args.every((arg) => typeof arg === "number")) {
          return this.average(args as number[]);
        } else {
          throw new Error(`AVG function requires numeric arguments`);
        }
      case "CONCAT":
        return args.join("");
      case "DEBUG":
        return args[0];
      default:
        throw new Error(`Unknown function: ${func}`);
    }
  }

  private sum(args: number[]): number {
    return args.reduce((acc, val) => {
      if (typeof val === "number") {
        return acc + val;
      } else {
        throw new Error(
          `SUM function requires numeric arguments, but found: ${val}`
        );
      }
    }, 0);
  }

  private average(args: (number | string)[]): number {
    const numbers = this.toNumbers(args);
    const total = numbers.reduce((acc, val) => acc + val, 0);
    return total / numbers.length;
  }

  private toNumbers(args: (number | string)[]): number[] {
    return args.map((arg) => {
      if (typeof arg === "number") {
        return arg;
      } else {
        const num = parseFloat(arg);
        if (!isNaN(num)) {
          return num;
        } else {
          throw new Error(
            `Function requires numeric arguments, but found: ${arg}`
          );
        }
      }
    });
  }
}

export default Evaluator;