class Tokenizer {
  private static instance: Tokenizer;

  //Creates a mapping with the type and the regex that accompanies it.
  private static tokenSpec: [string, RegExp][] = [
    ["FUNCTION", /^=(IF|SUM|MIN|AVG|MAX|CONCAT|DEBUG)/], // Matches functions
    ["NUMBER", /^-?\d+(\.\d+)?/], // Matches numbers
    ["OPERATOR", /^[+\-*/<>=&|:]/], // Matches operators
    ["LPAREN", /^\(/], // Matches left parenthesis
    ["RPAREN", /^\)/], // Matches right parenthesis
    ["REFERENCE", /^\$[A-Z]+\d+(:\$[A-Z]+\d+)?/], // Matches cell references and ranges
    ["STRING", /^[^()\s,]+/], // Matches strings
    ["COMMA", /^,/], // Matches commas
    ["WHITESPACE", /^\s+/], // Matches whitespace
  ];

  //Loops over the index of a possible number
  private index: number;
  private formula: string;

  public static getInstance() {
    if (Tokenizer.instance == null) {
      Tokenizer.instance = new Tokenizer();
    }

    return Tokenizer.instance;
  }

  constructor() {
    this.index = 0;
    this.formula = "";
  }

  tokenize(formula: string): string[] {
    this.index = 0; // Reset index for new tokenization
    this.formula = formula;
    const tokens: string[] = [];

    while (this.index < this.formula.length) {
      const token = this.nextToken();
      if (token) {
        tokens.push(token);
      } else {
        throw new Error(
          `Unexpected token at index ${this.index} in formula: ${this.formula}`
        );
      }
    }

    return tokens;
  }

  nextToken(): string | null {
    const substr = this.formula.substring(this.index);
    for (const [type, regex] of Tokenizer.tokenSpec) {
      const match = regex.exec(substr);
      //console.log(`type ${type} match ${match}`);
      if (match) {
        /*
        for (const m of match) {
          console.log(`part of match: ${m}`);
        }
        */
        this.index += match[0].length;
        if (type !== "WHITESPACE") {
          return match[0];
        } else {
          // Skip whitespace and continue tokenization
          return this.nextToken();
        }
      }
    }
    return null;
  }
}

export default Tokenizer;
