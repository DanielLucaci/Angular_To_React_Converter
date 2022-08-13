import ForExpr from "./ForExpr";

class NormalForExpr extends ForExpr {
  constructor() {
    super();
    this.stopCondition = "";
    this.initialValue = "";
    this.increment = "";
  }
}

export default NormalForExpr;
