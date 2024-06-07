import { INode, FormulaNode, NumberNode, StringNode, ReferenceNode, OperationNode, FunctionCallNode } from "./Nodes";
import Tokenizer from "./Tokenizer";

class Parser {
  private static instance: Parser;

  private index: number;
  private tokens: string[];

  constructor() {
    this.index = 0;
    this.tokens = [];
  }

  public static getInstance() {
    if (Parser.instance == null) {
      Parser.instance = new Parser();
    }
    return Parser.instance;
  }

  parse(formula: string): INode {
    this.index = 0; // Reset index for new parsing
    this.tokens = Tokenizer.getInstance().tokenize(formula);
    for (const token of this.tokens) {
      console.log(`token: ${token}`);
    }
    const resultNode = (this.tokens.length > 0 && this.tokens[0] === "=") ? this.parseFormula() : this.parseTerm();
    console.log('Parsed INode:', JSON.stringify(resultNode, null, 2));
    return resultNode;
  }

  private parseFormula(): INode {
    this.consume("=");
    return new FormulaNode(this.parseExpression());
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
      return new StringNode(token);
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
    while (this.index < this.tokens.length && this.isOperator(this.tokens[this.index])) {
      const operator = this.tokens[this.index];
      this.index++;
      const rightNode = this.parseTerm();
      node = new OperationNode(node, operator, rightNode);
    }
    return node;
  }

  private parseFunction(): INode {
    const func = this.tokens[this.index].slice(0, -1); 
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
    return /^-?\d+(\.\d+)?$/.test(token);
  }

  private isString(token: string): boolean {
    return /^[^()\s,]+$/.test(token);
  }

  private isReference(token: string): boolean {
    return /^\$[A-Z]+\d+$/.test(token);
  }

  private isOperator(token: string): boolean {
    return /^[+\-*/<>=&|,:]$/.test(token);
  }

  private isFunction(token: string): boolean {
    return /^=(IF|SUM|MIN|AVG|MAX|CONCAT|DEBUG)$/.test(token);
  }
}

export default Parser;
