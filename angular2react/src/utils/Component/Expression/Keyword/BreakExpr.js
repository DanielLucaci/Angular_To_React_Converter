import Expression from "../Expression";

class BreakExpr extends Expression {
  constructor(depth) {
    super("break", depth);
    this.keyword = "break";
  }
}

export default BreakExpr;
