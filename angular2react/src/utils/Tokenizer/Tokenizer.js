import Token from "./Token";
import keywords from "./keywords";
import tokenTypes from "./TokenTypes";
import DFA from "./DFA";

export class Tokenizer {
  constructor() {
    this.tokenizer = new DFA();
  }

  getTokenList(text) {
    let tokenList = [];
    text.split(/\r?\n/).forEach((row, index) => {
      tokenList.push(...this.tokenize(row, index));
    });
    return tokenList;
  }

  tokenize(row, index) {
    let rowCopy = row;
    row = row.trim();
    let tokenList = [];

    while (row !== "") {
      let token = this.tokenizer.nextToken(row);
      if (token === "") {
        console.log("Found null token");
      }
      let props = {
        type: null,
        name: token,
        line: index,
        column: rowCopy.indexOf(row),
      };

      if (keywords.includes(token)) {
        props.type = "keyword";
      } else {
        for (let type of tokenTypes) {
          if (type.states.includes(this.tokenizer.currentState)) {
            props.type = type.name;
            break;
          }
        }
      }
      // Create new token
      const newToken = new Token(props);

      // Reset DFA
      this.tokenizer.reset();

      // Delete token from row
      row = row.substring(token.length, row.length).trimStart();
      tokenList.push(newToken);
    }
    return tokenList;
  }
}
