import ForExpr from "./ForExpr";

class NormalForExpr extends ForExpr {
  constructor(depth) {
    super("for", depth);
    this.stopCondition = "";
    this.initialValue = "";
    this.increment = "";
  }
}

export default NormalForExpr;
