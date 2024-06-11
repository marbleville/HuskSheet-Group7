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
	 * @returns
	 */
	parse(formula: string): ExpressionNode {
		this.index = 0;
		this.tokens = Tokenizer.getInstance().tokenize(formula);
		for (const token of this.tokens) {
			console.log(`token: ${token}`);
		}
		const resultNode =
			this.tokens.length > 0 && this.tokens[0] === "="
				? this.parseFormula()
				: this.parseTerm();
		console.log("Parsed ExpressionNode:", JSON.stringify(resultNode, null, 2));
		return resultNode;
	}

	private parseFormula(): ExpressionNode {
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

	private parseNestedExpression(): ExpressionNode {
		this.consume("(");
		const nestedNode: ExpressionNode = this.parseExpression();
		this.consume(")");
		return nestedNode;
	}

	private parseNegativeNum(): ExpressionNode {
		let numStr = this.tokens[this.index];
		this.consume("-");
		numStr += this.tokens[this.index];
		this.index++;
		return new NumberNode(parseFloat(numStr));
	}

	private parseFunction(): ExpressionNode {
		const func = this.tokens[this.index].replace(/^=/, "");
		this.index++;
		this.consume("(");
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
		return /^"([^"]*)"|^[^+\-*/=:&|<>\s(),]+/.test(token);
	}

	private isReference(token: string): boolean {
		return /^\$[A-Z]+\d+$/.test(token);
	}

	private isOperator(token: string): boolean {
		return /^[+\-*/<>=&|:]+$/.test(token);
	}

	private isFunction(token: string): boolean {
		return /^(=)?(IF|SUM|MIN|AVG|MAX|CONCAT|COPY|DEBUG)$/.test(token);
	}
}

export default Parser;
