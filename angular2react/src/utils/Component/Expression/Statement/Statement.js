import Expression from "../Expression";

class Statement extends Expression {
  constructor(type, depth) {
    super(type, depth);
    this.variable = "";
  }
}

export default Statement;
