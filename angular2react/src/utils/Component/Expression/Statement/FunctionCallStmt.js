import Statement from "./Statement";

class FunctionCallStmt extends Statement {
  constructor(depth) {
    super("function call", depth);
    this.parameters = [];
  }
}

export default FunctionCallStmt;
