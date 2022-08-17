import Statement from "./Statement";

class StateUpdateStmt extends Statement {
  constructor(depth) {
    super("state update", depth);
    this.value = "";
  }
}

export default StateUpdateStmt;
