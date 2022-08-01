import State from "./State";

/*
Keywords - true | false | null | undefined |
          try | catch | finally | throw 
          if | else | while | for | do | 
          switch | case | continue | break | default 
          let | const | var | new | void | instanceof | typeof
          class | function | implements | extends | interface | enum | this
          private | protected | public | return | super | static
          debugger | delete |
          export | import | package |
          async | await | 
          in | of | with | yield
*/

/* 
 Operators -  + | - | * | / | % | ** | ^ | | | & | ~ | = |
              += | -= | *= | /= | %= | **= | ^= | |= | &= | ! | != | !== | == | === | ++ | --
              >> | << | <<= | >>= | >>> | >>>= | >= | <=
              ?? | ??= | || | ||= | && | &&= | ?. | !. | @ | #
              ...
*/

/* 
  Separators -  ( | ) | [ | ] | { | } | , | . | ; | : | ? 
*/

/* 
    String literal - '[a-zA-Z0-9 ]*' | "[a-zA-Z0-9 ]*" | `([a-zA-Z0-9 ] | ${.*})*`
*/

/*
    Number literal - [1-9][0-9]* | 0 | [1-9][0-9]*.[0-9]* | 0.[0-9]* 
*/

/*
  Identifier - [a-zA-Z][a-zA-Z0-9_]*
*/

export default class DFA {
    constructor() {
      this.currentState = State.State0;
      this.acceptedStates = [
        State.State1,
        State.State2,
        State.State3,
        State.State4,
        State.State5,
        State.State6,
        State.State7,
        State.State8,
        State.State9,
        State.State10,
        State.State11,
        State.State12,
        State.State13,
        State.State14,
        State.State15,
        State.State16,
        State.State17,
        State.State18,
        State.State19,
        State.State20,
        State.State21,
        State.State22,
        State.State23,
        State.State24,
        State.State25,
        State.State27,
        State.State30,
        State.State32,
      ];
      this.map = new Map();
      this.createMap();
    }
  
    setState(newState) {
      this.currentState = newState;
    }
  
    createMap() {
      this.map.set(State.State0, (c) => {
        if (c === "_" || ("a" <= c && c <= "z") || ("A" <= c && c <= "Z")) {
          return State.State1;
        }
  
        if ("1" <= c && c <= "9") {
          return State.State30;
        }
  
        switch (c) {
          case "+":
            return State.State2;
          case "-":
            return State.State4;
          case "*":
            return State.State6;
          case "/":
          case "%":
          case "^":
            return State.State7;
          case ">":
            return State.State8;
          case "<":
            return State.State10;
          case "&":
            return State.State11;
          case "|":
            return State.State12;
          case ".":
            return State.State13;
          case "?":
            return State.State16;
          case "!":
            return State.State18;
          case "~":
            return State.State21;
          case "=":
            return State.State22;
          case "@":
          case "#":
            return State.State23;
          case "(":
          case ")":
          case "[":
          case "]":
          case "{":
          case "}":
          case ",":
          case ":":
          case ";":
            return State.State25;
          case "'":
            return State.State26;
          case '"':
            return State.State28;
          case "`":
            return State.State29;
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State1, (c) => {
        if (
          c === "_" ||
          ("a" <= c && c <= "z") ||
          ("A" <= c && c <= "Z") ||
          (c >= "0" && c <= "9")
        ) {
          return State.State1;
        } else {
          return State.State_ERROR;
        }
      });
  
      this.map.set(State.State2, (c) => {
        // '+'
        switch (c) {
          case "+":
            return State.State3; // "++"
          case "=":
            return State.State24; // "+="
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State3, (c) => State.State_ERROR);
  
      this.map.set(State.State4, (c) => {
        // '-'
        switch (c) {
          case "-":
            return State.State5; // "--"
          case "=":
            return State.State24; // "-="
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State6, (c) => {
        // '*'
        switch (c) {
          case "*":
            return State.State7; // '**'
          case "=":
            return State.State24; // '*='
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State7, (c) => {
        // op
        switch (c) {
          case "=":
            return State.State24; // "op="
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State8, (c) => {
        // '>'
        switch (c) {
          case "=":
            return State.State24; // ">="
          case ">":
            return State.State9; // ">>"
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State9, (c) => {
        // ">>"
        switch (c) {
          case "=":
            return State.State24; // ">>="
          case ">":
            return State.State7; // ">>>"
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State10, (c) => {
        // '<'
        switch (c) {
          case "<":
            return State.State7; // "<<"
          case "=":
            return State.State24; // "<="
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State11, (c) => {
        // "&"
        switch (c) {
          case "&":
            return State.State7; // "&&"
          case "=":
            return State.State24; // "&="
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State12, (c) => {
        // '|'
        switch (c) {
          case "|":
            return State.State7; // "||"
          case "=":
            return State.State24; // "|="
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State13, (c) => {
        // '.'
        switch (c) {
          case ".":
            return State.State14; // ".."
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State14, (c) => {
        // ".."
        switch (c) {
          case ".":
            return State.State15; // "..."
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State15, (c) => State.State_ERROR);
  
      this.map.set(State.State16, (c) => {
        // '?'
        switch (c) {
          case "?":
            return State.State7; // "??"
          case ".":
            return State.State17; // "?."
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State17, (c) => State.State_ERROR);
  
      this.map.set(State.State18, (c) => {
        // '!'
        switch (c) {
          case ".":
            return State.State19; // "!."
          case "=":
            return State.State7; // "!="
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State18, (c) => State.State_ERROR);
  
      this.map.set(State.State19, (c) => State.State_ERROR);
  
      this.map.set(State.State20, (c) => State.State_ERROR);
  
      this.map.set(State.State21, (c) => State.State_ERROR);
  
      this.map.set(State.State22, (c) => {
        // '='
        switch (c) {
          case "=":
            return State.State7; // "=="
          default:
            return State.State_ERROR;
        }
      });
  
      this.map.set(State.State23, (c) => State.State_ERROR);
  
      this.map.set(State.State24, (c) => State.State_ERROR);
  
      this.map.set(State.State25, (c) => State.State_ERROR);
  
      this.map.set(State.State26, (c) => {
        // "'"
        switch (c) {
          case "'":
            return State.State27;
          default:
            return State.State26;
        }
      });
  
      this.map.set(State.State27, (c) => State.State_ERROR);
  
      this.map.set(State.State28, (c) => {
        // '"'
        switch (c) {
          case '"':
            return State.State27;
          default:
            return State.State28;
        }
      });
  
      this.map.set(State.State29, (c) => {
        // '`'
        switch (c) {
          case "`":
            return State.State27;
          default:
            return State.State29;
        }
      });
  
      this.map.set(State.State30, (c) => {
        // '1-9'
        if ("0" <= c && c <= "9") {
          return State.State30;
        } else if (c === ".") {
          return State.State31;
        } else {
          return State.State_ERROR;
        }
      });
  
      this.map.set(State.State31, (c) => {
        if ("0" <= c && c <= "9") {
          return State.State32;
        } else {
          return State.State_ERROR;
        }
      });
  
      this.map.set(State.State32, (c) => {
        if ("0" <= c && c <= "9") {
          return State.State32;
        } else {
          return State.State_ERROR;
        }
      });
    }
  
    reset() {
      this.currentState = State.State0;
    }
  
    nextToken(line) {
      let index = 0,
        lastIndex = -1;
      let charArr = line.trim().split("");
      while (index < charArr.length) {
        this.setState(this.map.get(this.currentState)(charArr[index++]));
        if (this.acceptedStates.includes(this.currentState)) {
          lastIndex = index;
        } else if (this.currentState === State.State_ERROR) {
          if (lastIndex !== -1) {
            return line.substr(0, lastIndex);
          }
          return null;
        }
      }
      return line.substr(0, lastIndex);
    }
  }