import ConditionalExpr from "../ConditionalExpr";

class SwitchExpr extends ConditionalExpr {
  constructor() {
    super("switch");
    this.branches = [];
  }
}

export default SwitchExpr;