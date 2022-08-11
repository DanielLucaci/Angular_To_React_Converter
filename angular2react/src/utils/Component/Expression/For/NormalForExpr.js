import ForExpr from "./ForExpr";

class NormalForExpr extends ForExpr {
  constructor() {
    super();
    this.stopCondition = "";
    this.increment = "";
  }
}

export default NormalForExpr;
