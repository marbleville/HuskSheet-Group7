import {
  ExpressionNode,
  FormulaNode,
  NumberNode,
  StringNode,
  ReferenceNode,
  OperationNode,
  FunctionCallNode,
} from "./Nodes";
import Tokenizer from "./Tokenizer";

/**
 * Parses the tokens into different nodes based on priority.
 * @author eduardo-ruiz-garay
 */
class Parser {
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
   * @param formula takes in the string from the user
   * @returns the parsed formula into expression nodes
   * @author eduardo-ruiz-garay
   */
  parse(formula: string): ExpressionNode {
    this.index = 0;
    this.tokens = Tokenizer.getInstance().tokenize(formula);
    const resultNode =
      this.tokens.length > 0 && this.tokens[0] === "="
        ? this.parseFormula()
        : this.parseTerm();
    return resultNode;
  }

  /**
   * Parses the = at the start
   *
   * @returns new Expression node
   *  @author eduardo-ruiz-garay
   */
  private parseFormula(): ExpressionNode {
    this.consume("=");
    return new FormulaNode(this.parseExpression());
  }

  /**
   * Increases the index as it finds a value to consume
   *
   * @param expected string value for the identifier
   *  @author eduardo-ruiz-garay
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
   * Parses the term of the expression node
   *
   * @returns new Expression Node
   * @author eduardo-ruiz-garay
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
      return this.parseNestedExpression();
    } else if (token === "-") {
      return this.parseNegativeNum();
    } else if (this.isString(token)) {
      this.index++;
      return new StringNode(token);
    } else {
      throw new Error(`Unexpected token: ${token}`);
    }
  }

  /**|
   * Parse the expressionns wiht the term and returns the operation
   * @author eduardo-ruiz-garay
   */
  private parseExpression(): ExpressionNode {
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
   * Consumes the parentheses.
   *
   * @returns new Expression node
   * @author eduardo-ruiz-garay
   */
  private parseNestedExpression(): ExpressionNode {
    this.consume("(");
    const nestedNode: ExpressionNode = this.parseExpression();
    this.consume(")");
    return nestedNode;
  }

  /**
   * Parses a negative number into a number node.
   *
   * @returns number node with the values
   * @author eduardo-ruiz-garay
   */
  private parseNegativeNum(): ExpressionNode {
    let numStr = this.tokens[this.index];
    this.consume("-");
    numStr += this.tokens[this.index];
    this.index++;
    return new NumberNode(parseFloat(numStr));
  }

  /**
   * Parses functions into expression node function call.
   *
   * @returns function call node
   * @author eduardo-ruiz-garay
   */
  private parseFunction(): ExpressionNode {
    const func = this.tokens[this.index].replace(/^=/, "");
    this.index++;
    this.consume("(");
    const args = [];
    while (this.tokens[this.index] !== ")") {
      const arg = this.parseExpression();
      if (arg instanceof StringNode) {
        // Trim double quotes if present
        arg.value = arg.value.replace(/^"(.*)"$/, "$1");
      }
      args.push(arg);
      if (this.tokens[this.index] === ",") {
        this.index++;
      }
    }
    this.consume(")");
    return new FunctionCallNode(func, args);
  }

  /**
   * Takes in the number as string and asks if the number matches the regex.
   *
   * @param token string value
   * @returns t or f for number
   * @author eduardo-ruiz-garay
   */
  private isNumber(token: string): boolean {
    return /^-?\d+(\.\d+)?$/.test(token);
  }

  /**
   * Takes in the string and asks if the number matches the regex.
   *
   * @param token string value
   * @returns t or f for number
   * @author eduardo-ruiz-garay
   */
  private isString(token: string): boolean {
    return /^"([^"]*)"|^[^+\-*/=:&|<>\s(),]+/.test(token);
  }

  /**
   * Takes in the reference and asks if the number matches the regex.
   *
   * @param token string value
   * @returns t or f for number
   * @author eduardo-ruiz-garay
   */
  private isReference(token: string): boolean {
    return /^\$[a-zA-Z]+\d+$/.test(token);
  }

  /**
   * Takes in the operator and asks if the number matches the regex.
   *
   * @param token string value
   * @returns t or f for number
   * @author eduardo-ruiz-garay
   */
  private isOperator(token: string): boolean {
    return /^[+\-*/<>=&|:]+$/.test(token);
  }

  /**
   * Takes in the number as string and asks if the number matches the regex.
   *
   * @param token string value
   * @returns t or f for number
   * @author eduardo-ruiz-garay
   */
  private isFunction(token: string): boolean {
    return /^(=)?(IF|SUM|MIN|AVG|MAX|CONCAT|COPY|DEBUG)$/.test(token);
  }
}

export default Parser;
