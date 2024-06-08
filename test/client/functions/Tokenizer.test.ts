import Tokenizer from "../../../client/src/functions/Tokenizer";

describe('Tokenizer', () => {
  let tokenizer: Tokenizer;

  beforeEach(() => {
    tokenizer = Tokenizer.getInstance();
  });

  describe('tokenize', () => {
    test('Tokenizes a simple formula', () => {
      const formula = '$A1 1\n$a2 "help"\n$B1 -1.01\n$C4 ""\n$c1 = SUM($A1:$B1)';
      const expectedTokens = ['$A1', '1', '$a2', '"help"', '$B1', '-1.01', '$C4', '""', '$c1', '=', 'SUM', '(', '$A1', ':', '$B1', ')'];
      const tokens = tokenizer.tokenize(formula);
      expect(tokens).toEqual(expectedTokens);
    });

    test('Throws error on unmatched closing parenthesis', () => {
      const formula = '$A1 = SUM($A1:$B1))';
      expect(() => tokenizer.tokenize(formula)).toThrow('Unmatched closing parenthesis');
    });

    test('Throws error on unmatched opening parenthesis', () => {
      const formula = '$A1 = SUM(($A1:$B1)';
      expect(() => tokenizer.tokenize(formula)).toThrow('Unmatched closing parenthesis');
    });

    test('Tokenizes functions and operators correctly', () => {
      const formula = '=IF($A1 < 5, SUM($A1:$B1), "Invalid")';
      const expectedTokens = ['=', 'IF', '(', '$A1', '<', '5', ',', 'SUM', '(', '$A1', ':', '$B1', ')', ',', '"Invalid"', ')'];
      const tokens = tokenizer.tokenize(formula);
      expect(tokens).toEqual(expectedTokens);
    });

    test('Tokenizes strings with escaped quotes', () => {
      const formula = '$A1 "This is a string with escaped quotes: \\"help\\""';
      const expectedTokens = ['$A1', '"This is a string with escaped quotes: \\"help\\""'];
      const tokens = tokenizer.tokenize(formula);
      expect(tokens).toEqual(expectedTokens);
    });

    test('Tokenizes cell references and ranges correctly', () => {
      const formula = '=SUM($A1:$B10)';
      const expectedTokens = ['=', 'SUM', '(', '$A1', ':', '$B10', ')'];
      const tokens = tokenizer.tokenize(formula);
      expect(tokens).toEqual(expectedTokens);
    });
  });

  describe('nextToken', () => {
    test('Returns null for invalid token', () => {
      tokenizer.tokenize('=INVALID$A1');
      tokenizer.setIndex(7); // Pointing to 'I' in INVALID
      const token = tokenizer.nextToken();
      expect(token).toBeNull();
    });

    test('Skips whitespace correctly', () => {
      tokenizer.tokenize('$A1   $B2');
      const token1 = tokenizer.nextToken();
      expect(token1).toBe('$A1');
      const token2 = tokenizer.nextToken();
      expect(token2).toBe('$B2');
    });

    test('Returns correct token for numbers', () => {
      tokenizer.tokenize('123.45');
      const token = tokenizer.nextToken();
      expect(token).toBe('123.45');
    });

    test('Returns correct token for operators', () => {
      tokenizer.tokenize('+-*/=:&|<>');
      const expectedTokens = ['+', '-', '*', '/', '=', ':', '&', '|', '<', '>'];
      expectedTokens.forEach(expectedToken => {
        const token = tokenizer.nextToken();
        expect(token).toBe(expectedToken);
      });
    });

    test('Returns correct token for references', () => {
      tokenizer.tokenize('$A1:$B2');
      const token1 = tokenizer.nextToken();
      expect(token1).toBe('$A1');
      const token2 = tokenizer.nextToken();
      expect(token2).toBe(':');
      const token3 = tokenizer.nextToken();
      expect(token3).toBe('$B2');
    });

    test('Returns correct token for strings', () => {
      tokenizer.tokenize('"Hello" "World"');
      const token1 = tokenizer.nextToken();
      expect(token1).toBe('"Hello"');
      const token2 = tokenizer.nextToken();
      expect(token2).toBe('"World"');
    });

    test('Returns correct token for functions', () => {
      tokenizer.tokenize('=SUM($A1:$B1)');
      const token1 = tokenizer.nextToken();
      expect(token1).toBe('=');
      const token2 = tokenizer.nextToken();
      expect(token2).toBe('SUM');
    });
  });
});
