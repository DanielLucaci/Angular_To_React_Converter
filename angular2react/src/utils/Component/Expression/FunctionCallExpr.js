import Expression from "./Expression";

class FunctionCallExpr extends Expression {
    constructor() {
        super('function call');
        this.parameters = [];
        this.identifier = "";
    }
}

export default FunctionCallExpr;