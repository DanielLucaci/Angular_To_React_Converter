import Statement from "./Statement";

class DeclarationStmt extends Statement {
  constructor(depth) {
    super("declaration", depth);
    this.scope = "";
    this.variable = "";
    this.datatype = "";
  }
}

export default DeclarationStmt;
