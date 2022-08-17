import ConditionalExpr from "../ConditionalExpr";

class SwitchExpr extends ConditionalExpr {
  constructor(depth) {
    super("switch", depth);
  }
}

export default SwitchExpr;