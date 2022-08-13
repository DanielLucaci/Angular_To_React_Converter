import DeclarationExpr from "./DeclarationExpr";

class InitializationExpr extends DeclarationExpr {
  constructor() {
    super("initialization");
    this.value = "";
  }
}

export default InitializationExpr;
