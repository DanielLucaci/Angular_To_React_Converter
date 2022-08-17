import Statement from "./Statement";

class AssignmentStmt extends Statement {
  constructor(depth) {
    super("assignment", depth);
    this.value = "";
  }
}

export default AssignmentStmt;
