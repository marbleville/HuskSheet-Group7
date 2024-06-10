import {
  ExpressionNode,
  FormulaNode,
  NumberNode,
  StringNode,
  ReferenceNode,
  OperationNode,
  FunctionCallNode,
} from "./Nodes";

/**
 * Parses the tokens into different nodes based on priority.
 */
class Parser {
  /**
   * Checks whether the token is a function
   *
   * @param token string token
   * @returns boolean for regex
   */
  private isFunction(token: string): boolean {
    return /^=(IF|SUM|MIN|AVG|MAX|CONCAT|DEBUG)$/.test(token);
  }

  /**
   * Checks whether a token is an operator.
   *
   * @param token string token
   * @returns boolean for regex
   */
  private isOperator(token: string): boolean {
    return /^[+\-*/<>=&|:]+$/.test(token);
  }

  /**
   * Checks whether a token is a reference.
   *
   * @param token string token
   * @returns boolean for regex
   */
  private isReference(token: string): boolean {
    return /^\$[A-Z]+\d+$/.test(token);
  }

  /**
   * Checks whether a token is a number.
   *
   * @param token string token
   * @returns boolean for regex
   */
  private isNumber(token: string): boolean {
    return /^-?\d+(\.\d+)?$/.test(token);
  }

  /**
   * Checks whether a token is a string.
   *
   * @param token string token
   * @returns boolean for regex
   */
  private isString(token: string): boolean {
    return /^[^()\s,]+$/.test(token);
  }

  private static instance: Parser;

  private index: number;
  private tokens: string[];

  constructor() {
    this.index = 0;
    this.tokens = [];
  }

  //Singleton setup
  public static getInstance() {
    if (Parser.instance == null) {
      Parser.instance = new Parser();
    }
    return Parser.instance;
  }

  /**
   * Parses the tockens into distinct ExpressionNodes.
   *
   * @param tokens takes in the tokens from the Tokenizer
   * @returns a expressionode  based on the priority
   */
  parse(tokens: string[]): ExpressionNode {
    this.index = 0;
    this.tokens = tokens;
    const resultNode =
      this.tokens.length > 0 && this.tokens[0] === "="
        ? this.parseFormula()
        : this.parseTerm();
    return resultNode;
  }

  /**
   * Creates a formula node with the expression if the starting term is a =.
   *
   * @returns a new formula node and then parses the rest.
   */
  private parseFormula(): ExpressionNode {
    this.consume("=");
    return new FormulaNode(this.parseOperation());
  }

  /**
   * Increases the index if the token is the expected value.
   *
   * @param expected depending on the expression has a unique identifier
   */
  private consume(expected: string): void {
    if (this.tokens[this.index] === expected) {
      this.index++;
    } else {
      throw new Error(
        `Expected ${expected}, but found ${this.tokens[this.index]}`
      );
    }
  }

  /**
   * Takes in a fucntion and makes a new expression node.
   *
   * @returns Expression node
   */
  private parseFunction(): ExpressionNode {
    const func = this.tokens[this.index].replace(/^=/, "");
    this.index++;
    this.consume("(");
    const expressions = [];
    while (this.tokens[this.index] !== ")") {
      expressions.push(this.parseOperation());
      if (this.tokens[this.index] === ",") {
        this.index++;
      }
    }
    this.consume(")");
    return new FunctionCallNode(func, expressions);
  }

  /**
   * Parses the expression into an expression node with right node and left node, operator
   *
   * @returns Expression node
   */
  private parseOperation(): ExpressionNode {
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

  /**
   * Divies up the expressions based on their token first
   *
   * @returns Expression node
   */
  private parseTerm(): ExpressionNode {
    const token = this.tokens[this.index];
    if (this.isFunction(token)) {
      return this.parseFunction();
    } else if (this.isNumber(token)) {
      this.index++;
      return new NumberNode(parseFloat(token));
    } else if (this.isReference(token)) {
      this.index++;
      return new ReferenceNode(token);
    } else if (token === "(") {
      return this.parseParentheses();
    } else if (token === "-") {
      return this.parseNegativeNum();
    } else if (this.isString(token)) {
      this.index++;
      return new StringNode(token);
    } else {
      throw new Error(`Unexpected token: ${token}`);
    }
  }

  /**
   * Takes in the parenthesis and makes new expression node.
   *
   * @returns Expression node
   */
  private parseParentheses(): ExpressionNode {
    this.consume("(");
    const nestedNode: ExpressionNode = this.parseOperation();
    this.consume(")");
    return nestedNode;
  }

  /**
   * Creates a Number node after the string number
   *
   * @returns Expression Node
   */
  private parseNegativeNum(): ExpressionNode {
    let numStr = this.tokens[this.index];
    this.consume("-");
    numStr += this.tokens[this.index];
    this.index++;
    return new NumberNode(parseFloat(numStr));
  }
}

export default Parser;
