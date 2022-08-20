export default class Parser {
  constructor() {
    this.filename = "";
    this.tokens = [];
    this.sym = null;
    this.type = null;
    this.line = null;
    this.column = null;
  }

  /**
   * Stores a copy of the 'tokenList' and extracts the first token 
   * @param {Token[]} tokenList - A list of tokens 
   */
  init(tokenList) {
    this.tokens = tokenList.concat();
    this.next();
  }

  /**
   * Checks if a sequence of tokens matches the order of tokens in tokenList
   * Throws an error if a mismatch occurs  
   * @param  {...string} symbols - An array of symbols  
   */
  check(...symbols) {
    symbols.forEach((symbol) => {
      if (this.sym !== symbol) {
        throw new Error(
          `Invalid token ${this.sym} found in ${this.filename} at line ${this.line}, column ${this.column}. It should have been ${symbol}`
        );
      }
      this.next();
    });
  }

  /**
   * Checks if the type of the current token matches the type stored in the 'type' parameter
   * Throws an error if a type mismatch occurs 
   * @param {string} type - The type of the token . Can be 'identifier', 'string', 'operator' etc. 
   */
  checkType(type) {
    if (this.type !== type) {
      throw new Error(
        `Unknown symbol ${this.sym} found in ${this.filename} at line ${this.line}, column ${this.column}. Expected an ${type}`
      );
    }
  }

  /**
   * Extract one token from the token list.  
   */
  next() {
    let nextToken = this.tokens.shift();
    if (nextToken === undefined) return;
    ({
      name: this.sym,
      type: this.type,
      line: this.line,
      column: this.column,
    } = nextToken);
  }
}
