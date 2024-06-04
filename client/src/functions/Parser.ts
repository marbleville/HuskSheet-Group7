class Parser {
  private index: number;
  private tokens: string[];

  constructor() {
    this.index = 0;
    this.tokens = [];
  }

  tokenize(formula: string): string[] {
    const regex = /[()+\-*/<>=&|,:]|\w+|\d+|"[^"]*"|'[^']*'/g;
    return formula.match(regex) || [];
  }

  parse(formula: string): string {
    //Check whether the formula has a function or expression.
    return formula;
  }
}

export default Parser;
