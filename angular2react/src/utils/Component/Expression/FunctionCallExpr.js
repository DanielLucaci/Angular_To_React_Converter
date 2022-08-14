import Expression from "./Expression";

class FunctionCallExpr extends Expression {
    constructor(depth) {
        super('function call', depth);
        this.parameters = [];
        this.identifier = "";
    }
}

export default FunctionCallExpr;