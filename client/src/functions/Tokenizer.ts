/**
 * Takes in the cell data and creates tokens for the parser to loop through and set priority.
 */
class Tokenizer {
  private static instance: Tokenizer;

  //Creates a mapping with the type and the regex that accompanies it.
  private static tokenSpec: [string, RegExp][] = [
    ["FUNCTION", /^=(IF|SUM|MIN|AVG|MAX|CONCAT|DEBUG)/], // Matches functions
    ["OPERATOR", /^[+\-*/=:&|]/], // Matches operators (excluding < and > for now)
    ["COMBINED_OPERATOR", /^[<>]+/], // Matches combined < and > operators
    ["NUMBER", /^-?\d+(\.\d+)?/], // Matches numbers
    ["LPAREN", /^\(/], // Matches left parenthesis
    ["RPAREN", /^\)/], // Matches right parenthesis
    ["REFERENCE", /^\$[A-Z]+\d+/], // Matches cell references and ranges
    ["STRING", /^[^()\s,]+/], // Matches strings
    ["COMMA", /^,/], // Matches commas
    ["WHITESPACE", /^\s+/], // Matches whitespace
  ];

  //Loops over the index of a possible number
  protected index: number;
  protected formula: string;

  //Singleton pattern to create an instance and pass it.
  public static getInstance() {
    if (Tokenizer.instance == null) {
      Tokenizer.instance = new Tokenizer();
    }
    return Tokenizer.instance;
  }

  // Initilizes the Tokenizer with a index of one and an empty formula for default cases
  constructor() {
    this.index = 0;
    this.formula = "";
  }

  /**
   * Finds the next expression and produces the string of tokens with the different expressions and
   *  handles incorrect parentheses maybe better with a stack but works.
   *
   * @param formula string formula from the sheet data
   * @returns the set of tokens formed by regex
   */
  tokenize(formula: string): string[] {
    this.index = 0;
    this.formula = formula;
    const tokens: string[] = [];
    let openParenthesesCount = 0;

    while (this.index < this.formula.length) {
      const token = this.nextToken();
      if (token !== null) {
        tokens.push(token);
        if (token === "(") {
          openParenthesesCount++;
        } else if (token === ")") {
          openParenthesesCount--;
          if (openParenthesesCount < 0) {
            throw new Error("Unmatched closing parenthesis");
          }
        }
      } else {
        throw new Error(
          `Unexpected token at index ${this.index} in formula: ${this.formula}`
        );
      }
    }
    if (openParenthesesCount !== 0) {
      throw new Error("Unmatched closing parenthesis");
    }

    return tokens;
  }

  /**
   * Gets the next token based on the index and returns if it is null or string based on the regex.
   * Also removes whitespace based on the match it gets.
   *
   * @returns string if the token is recognized in regex else null
   */
  protected nextToken(): string | null {
    const substr = this.formula.substring(this.index);
    for (const [type, regex] of Tokenizer.tokenSpec) {
      const match = regex.exec(substr);
      if (match !== null) {
        this.index += match[0].length;
        if (type !== "WHITESPACE") {
          return match[0];
        } else {
          return this.nextToken();
        }
      }
    }
    return null;
  }
}

export default Tokenizer;
