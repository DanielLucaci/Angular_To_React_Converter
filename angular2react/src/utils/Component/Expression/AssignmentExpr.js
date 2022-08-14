import Expression from "./Expression";

class AssignmentExpr extends Expression {
  constructor(depth) {
    super("assignment", depth);
    this.assignee = "";
    this.value = "";
    this.dependencies = [];
  }
}

export default AssignmentExpr;
