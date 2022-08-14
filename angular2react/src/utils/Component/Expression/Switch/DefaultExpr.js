import Expression from "../Expression";

class DefaultExpr extends Expression {
    constructor(depth) {
        super("default", depth);
        this.statements = [];
    }
}

export default DefaultExpr;