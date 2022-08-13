import Expression from "./Expression";

class ConditionalExpr extends Expression {
  constructor(type) {
    super(type);
    this.condition = "";
    this.statements = [];
  }
}

export default ConditionalExpr;
