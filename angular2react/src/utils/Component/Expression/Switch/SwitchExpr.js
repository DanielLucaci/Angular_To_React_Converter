import ConditionalExpr from "../ConditionalExpr";

class SwitchExpr extends ConditionalExpr {
  constructor() {
    super("switch");
    this.branches = [];
    this.default = [];
  }
}

export default SwitchExpr;