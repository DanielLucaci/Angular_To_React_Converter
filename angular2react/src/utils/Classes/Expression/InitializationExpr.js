import Expression from "./Expression";

class InitializationExpr extends Expression {
  constructor() {
    super("initialization");
    this.scope = "";
    this.variable = "";
    this.value = "";
  }
}

export default InitializationExpr;
