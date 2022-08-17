import ConditionalExpr from "../ConditionalExpr";

class WhileExpr extends ConditionalExpr {
  constructor(depth) {
    super("while", depth);
  }
}

export default WhileExpr;
