import Expression from "./Expression";

class DeclarationExpr extends Expression {
  constructor() {
    super("declaration");
    this.scope = "";
    this.variable = "";
    this.datatype = "";
  }
}

export default DeclarationExpr;
