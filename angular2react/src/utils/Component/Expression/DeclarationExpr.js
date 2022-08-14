import Expression from "./Expression";

class DeclarationExpr extends Expression {
  constructor(depth) {
    super("declaration", depth);
    this.scope = "";
    this.variable = "";
    this.datatype = "";
  }
}

export default DeclarationExpr;
