import Tokenizer from "../../../client/src/functions/Tokenizer";

// Tests the singleton is working correctly
describe("Tokenizer tests", () => {
  let tokenizer: Tokenizer;
  beforeEach(() => {
    tokenizer = Tokenizer.getInstance();
  });

  describe("Tokenizer Singleton tests", () => {
    it("should return an instance of Tokenizer", () => {
      const instance = Tokenizer.getInstance();
      expect(instance).toBeInstanceOf(Tokenizer);
    });

    it("should return the same instance for multiple calls", () => {
      const instance1 = Tokenizer.getInstance();
      const instance2 = Tokenizer.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  // Makes a mock to test next token works properly
  class MockTokenizer extends Tokenizer {
    public testNextToken(formula: string): string | null {
      this.index = 0;
      this.formula = formula;
      return this.nextToken();
    }
  }

  describe("Tokenizer nextToken tests", () => {
    it("should return the next token correctly", () => {
      const tokenizer = new MockTokenizer();
      const testCases = [
        { formula: "123", expected: "123" },
        { formula: '"hello"', expected: '"hello"' },
        { formula: "=SUM(A1, A2)", expected: "=SUM" },
        { formula: "(A1)", expected: "(" },
        { formula: "A1", expected: "A1" },
        { formula: " ", expected: null },
      ];

      testCases.forEach(({ formula, expected }) => {
        const result = tokenizer.testNextToken(formula);
        expect(result).toBe(expected);
      });
    });
  });

  describe("Tokenizer tests for formulas", () => {
    const testCases: { func: string; expected: string[] }[] = [
      { func: "=IF(1, 2)", expected: ["=IF", "(", "1", ",", "2", ")"] },
      { func: "=SUM", expected: ["=SUM"] },
      { func: "=MIN", expected: ["=MIN"] },
      { func: "=AVG(A1, A2)", expected: ["=AVG", "(", "A1", ",", "A2", ")"] },
      { func: "=MAX(A1, A2)", expected: ["=MAX", "(", "A1", ",", "A2", ")"] },
      { func: "=CONCAT", expected: ["=CONCAT"] },
      { func: "=DEBUG", expected: ["=DEBUG"] },
      {
        func: "=DEBUG(SUM(1))",
        expected: ["=DEBUG", "(", "SUM", "(", "1", ")", ")"],
      },
    ];

    testCases.forEach(({ func, expected }) => {
      it(`Checks that tokenizer works properly for: ${func}`, () => {
        const res: string[] = tokenizer.tokenize(func);
        expect(res).toEqual(expected);
      });
    });

    it("Checks that tokenizer for functions works properkly", () => {
      const func: string = "=IF(1, 2)";
      const res: string[] = tokenizer.tokenize(func);
      const expected = ["=IF", "(", "1", ",", "2", ")"];
      expect(res).toEqual(expected);
    });
  });

  // Not sure to handle <<>, <<>>
  describe("Tokenizer tests for operators", () => {
    const testCases: { op: string; expected: string[] }[] = [
      { op: "1+1", expected: ["1", "+", "1"] },
      { op: "1++1", expected: ["1", "+", "+", "1"] },
      { op: "1+-1", expected: ["1", "+", "-", "1"] },
      { op: "1-1", expected: ["1", "-", "1"] },
      { op: "1/1", expected: ["1", "/", "1"] },
      { op: "1*1", expected: ["1", "*", "1"] },
      { op: "<", expected: ["<"] },
      { op: ">", expected: [">"] },
      { op: "=", expected: ["="] },
      { op: ">=", expected: [">", "="] },
      { op: "<>", expected: ["<>"] },
      // { op: "<<>", expected: ["<", "<>"] },
      // { op: "<<>>", expected: ["<", "<>", ">"] },
      { op: "&", expected: ["&"] },
      { op: "|", expected: ["|"] },
      { op: "1:1", expected: ["1", ":", "1"] },
    ];

    testCases.forEach(({ op: func, expected }) => {
      it(`Checks that tokenizer works properly for: ${func}`, () => {
        const res: string[] = tokenizer.tokenize(func);
        expect(res).toEqual(expected);
      });
    });
    // Should this be passing?
    it("Checks for error handling", () => {
      const op: string = "<<>>";
      const res: string[] = tokenizer.tokenize(op);
      const expected = ["<<>>"];
      expect(res).toEqual(expected);
    });
  });

  describe("Tokenizer tests for combined operators", () => {
    it("Checks that tokenizer for expression for (", () => {
      const func: string = "=1 <> 1";
      const res: string[] = tokenizer.tokenize(func);
      const expected = ["=", "1", "<>", "1"];
      expect(res).toEqual(expected);
    });
  });

  // Discuss if we want -1 or - , 1
  describe("Tokenizer tests for numbers", () => {
    const testCases: { numbers: string; expected: string[] }[] = [
      { numbers: "1", expected: ["1"] },
      { numbers: "1000000000", expected: ["1000000000"] },
      { numbers: "-1", expected: ["-", "1"] },
      { numbers: "1.00001", expected: ["1.00001"] },
    ];

    testCases.forEach(({ numbers: func, expected }) => {
      it(`Checks that tokenizer works properly for: ${func}`, () => {
        const res: string[] = tokenizer.tokenize(func);
        expect(res).toEqual(expected);
      });
    });
  });

  describe("Tokenizer tests for parentheses", () => {
    const testCases: { paretheses: string; expected: string[] }[] = [
      // Throw error instead
      // { paretheses: "(", expected: ["("] },
      { paretheses: "()", expected: ["(", ")"] },
      // { paretheses: ")", expected: [")"] },
      { paretheses: "(())", expected: ["(", "(", ")", ")"] },
    ];

    testCases.forEach(({ paretheses: func, expected }) => {
      it(`Checks that tokenizer works properly for: ${func}`, () => {
        const res: string[] = tokenizer.tokenize(func);
        expect(res).toEqual(expected);
      });
    });
  });

  describe("Tokenizer tests for references", () => {
    const testCases: { reference: string; expected: string[] }[] = [
      { reference: "$A1", expected: ["$A1"] },
      { reference: "$AA11", expected: ["$AA11"] },
      { reference: "$BA1", expected: ["$BA1"] },
      //throw error
      // { reference: "$A1B1", expected: ["1.00001"] },
      // Should it be A1 or $A1
      { reference: "$A1", expected: ["$A1"] },
    ];

    testCases.forEach(({ reference: func, expected }) => {
      it(`Checks that tokenizer works properly for: ${func}`, () => {
        const res: string[] = tokenizer.tokenize(func);
        expect(res).toEqual(expected);
      });
    });
  });

  describe("Tokenizer tests for strings", () => {
    const testCases: { reference: string; expected: string[] }[] = [
      { reference: "hello", expected: ["hello"] },
      { reference: "Agello1", expected: ["Agello1"] },
      { reference: "$1s", expected: ["$1s"] },
      { reference: "hello world", expected: ["hello", "world"] },
    ];

    testCases.forEach(({ reference: func, expected }) => {
      it(`Checks that tokenizer works properly for: ${func}`, () => {
        const res: string[] = tokenizer.tokenize(func);
        expect(res).toEqual(expected);
      });
    });
  });

  describe("Tokenizer tests for comma", () => {
    const testCases: { reference: string; expected: string[] }[] = [
      { reference: ",", expected: [","] },
      { reference: ",,", expected: [",", ","] },
    ];

    testCases.forEach(({ reference: func, expected }) => {
      it(`Checks that tokenizer works properly for: ${func}`, () => {
        const res: string[] = tokenizer.tokenize(func);
        expect(res).toEqual(expected);
      });
    });
  });

  describe("Tokenizer tests for whitespaces", () => {
    const testCases: { reference: string; expected: string[] }[] = [
      //throws error
      // { reference: " ", expected: [""] },
      { reference: "A gello1", expected: ["A", "gello1"] },
    ];

    testCases.forEach(({ reference: func, expected }) => {
      it(`Checks that tokenizer works properly for: ${func}`, () => {
        const res: string[] = tokenizer.tokenize(func);
        expect(res).toEqual(expected);
      });
    });
  });
});
