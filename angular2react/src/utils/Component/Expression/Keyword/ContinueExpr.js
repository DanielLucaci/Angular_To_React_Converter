import Expression from "../Expression";

class ContinueExpr extends Expression {
  constructor(depth) {
    super("break", depth);
    this.keyword = "continue";
  }
}

export default ContinueExpr;
