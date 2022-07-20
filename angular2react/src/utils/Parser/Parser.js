export default class Parser {
  constructor() {
    this.tokens = [];
    this.sym = null;
    this.type = null;
    this.line = null;
    this.column = null;
  }

  init(tokenList) {
    this.tokens = tokenList.concat();
    this.next();
  }

  check(symbolName) {
    if (this.sym !== symbolName) {
      throw new Error(
        `Invalid token ${this.sym} found at line ${this.line}, column ${this.column}. It should have been ${symbolName}`
      );
    }
    this.next();
  }

  next() {
    let nextToken = this.tokens.shift();
    if(nextToken === undefined)
        return;
    this.sym = nextToken.name;
    this.line = nextToken.line;
    this.type = nextToken.type;
    this.column = nextToken.column;
  }
}
