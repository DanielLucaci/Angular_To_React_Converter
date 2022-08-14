import DeclarationExpr from "./DeclarationExpr";

class InitializationExpr extends DeclarationExpr {
  constructor(depth) {
    super(depth);
    this.type = "initialization";
    this.value = "";
  }
}

export default InitializationExpr;
