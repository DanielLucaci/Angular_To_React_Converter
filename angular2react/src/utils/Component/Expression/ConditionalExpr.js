import Expression from "./Expression";

class ConditionalExpr extends Expression {
  constructor(type, depth) {
    super(type, depth);
    this.condition = "";
    this.statements = [];
  }
}

export default ConditionalExpr;
