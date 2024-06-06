import { FormulaNode, FunctionCallNode, INode, NumberNode, OperationNode, ReferenceNode, StringNode } from "./Nodes";
import Tokenizer from "./Tokenizer";

class Parser {
  private index: number;
  private tokens: string[];

  constructor() {
    this.index = 0;
    this.tokens = [];
  }

  parse(formula: string): INode {
    this.tokens = new Tokenizer().tokenize(formula);
    this.index = 0;
    if (this.tokens.length > 0 && this.tokens[0] === "=") {
      this.consume("=");
      return new FormulaNode(this.parseExpression());
    } else {
      return this.parseTerm();
    }
  }

  private consume(expected: string): void {
    if (this.tokens[this.index] === expected) {
      this.index++;
    } else {
      throw new Error(
        `Expected ${expected}, but found ${this.tokens[this.index]}`
      );
    }
  }

  private parseTerm(): INode {
    const token = this.tokens[this.index];
    if (this.isNumber(token)) {
      this.index++;
      return new NumberNode(parseFloat(token));
    } else if (this.isString(token)) {
      this.index++;
      return new StringNode(token.slice(1, -1).replace(/\\"/g, '"'));
    } else if (this.isReference(token)) {
      this.index++;
      return new ReferenceNode(token);
    } else if (this.isFunction(token)) {
      return this.parseFunction();
    } else {
      throw new Error(`Unexpected token: ${token}`);
    }
  }

  private parseExpression(): INode {
    let node = this.parseTerm();
    while (
      this.index < this.tokens.length &&
      this.isOperator(this.tokens[this.index])
    ) {
      const operator = this.tokens[this.index];
      this.index++;
      const rightNode = this.parseTerm();
      node = new OperationNode(node, operator, rightNode);
    }
    return node;
  }

  private parseFunction(): INode {
    const func = this.tokens[this.index].slice(0, -1); // Remove '('
    this.index++;
    const args = [];
    while (this.tokens[this.index] !== ")") {
      args.push(this.parseExpression());
      if (this.tokens[this.index] === ",") {
        this.index++;
      }
    }
    this.consume(")");
    return new FunctionCallNode(func, args);
  }

  private isNumber(token: string): boolean {
    return /^\d+(\.\d+)?$/.test(token);
  }

  private isString(token: string): boolean {
    return /^".*"$/.test(token);
  }

  private isReference(token: string): boolean {
    return /^[A-Z]+\d+$/.test(token);
  }

  private isOperator(token: string): boolean {
    return /^[+\-*/<>=&|,:]$/.test(token);
  }

  private isFunction(token: string): boolean {
    return /^[A-Z]+\($/.test(token);
  }
}

export default Parser;
