class Tokenizer {
  //Creates a mapping with the type and the regex that accompanies it.
  private static tokenSpec: [string, RegExp][] = [
    // Matches one or more digits, and matches decimals
    ["NUMBER", /^\d+(\.\d+)?/],
    // Matches double quites os any size and closing
    ["STRING", /^"([^"\\]*(\\.[^"\\]*)*)"/],
    // Matches one or more uppercase letters and an opening parenthesis
    ["FUNCTION", /^[A-Z]+\(/],
    // Matches any single character
    ["OPERATOR", /^[+\-*/<>=&|,:]/],
    //Matches parethesis
    ["LPAREN", /^\(/],
    ["RPAREN", /^\)/],
    //Matches one or more uppercase letter and one or more digits
    ["REFERENCE", /^\$[A-Z]+\d+/],
    // matches spaces and tabs
    ["WHITESPACE", /^\s+/],
  ];

  //Loops over the index of a possible number
  private index: number;
  private formula: string;

  constructor() {
    this.index = 0;
    this.formula = "";
  }

  tokenize(formula: string): string[] {
    
    }

    return tokens.filter((token) => !/^WHITESPACE$/.test(token));
  }

}

export default Tokenizer;
