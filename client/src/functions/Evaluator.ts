class Evaluator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private context: { [key: string]: any }) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evaluate(node: any): any {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const args = node.args.map((arg: any) => this.evaluate(arg));
      return this.applyFunc(node.func, args);
    } else if (node instanceof FormulaNode) {
      return this.evaluate(node.expr);
    } else {
      throw new Error(`Unknown node type: ${node}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applyOp(op: string, left: any, right: any): any {
    switch (op) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        if (right === 0) throw new Error("Division by zero");
        return left / right;
      case "<":
        return left < right ? 1 : 0;
      case ">":
        return left > right ? 1 : 0;
      case "=":
        return left === right ? 1 : 0;
      case "<>":
        return left !== right ? 1 : 0;
      case "&":
        return left && right ? 1 : 0;
      case "|":
        return left || right ? 1 : 0;
      case ":":
        // Handle ranges if applicable
        return [left, right];
      default:
        throw new Error(`Unknown operator: ${op}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applyFunc(func: string, args: any[]): any {
    switch (func) {
      case "IF":
        return args[0] !== 0 ? args[1] : args[2];
      case "SUM":
        return args.reduce((sum, arg) => sum + arg, 0);
      case "MIN":
        return Math.min(...args);
      case "MAX":
        return Math.max(...args);
      case "AVG":
        return args.reduce((sum, arg) => sum + arg, 0) / args.length;
      case "CONCAT":
        return args.join("");
      case "DEBUG":
        return args[0];
      default:
        throw new Error(`Unknown function: ${func}`);
    }
  }
}

class NumberNode {
  constructor(public value: number) {}
}

class StringNode {
  constructor(public value: string) {}
}

class ReferenceNode {
  constructor(public ref: string) {}
}

class OperationNode {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public left: any, public op: string, public right: any) {}
}

class FunctionCallNode {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public func: string, public args: any[]) {}
}

class FormulaNode {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public expr: any) {}
}

export default Evaluator;
