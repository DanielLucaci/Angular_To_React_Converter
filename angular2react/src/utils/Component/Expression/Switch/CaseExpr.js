import Expression from "../Expression";

class CaseExpr extends Expression {
    constructor(depth) {
        super("case", depth);
        this.value = "";
        this.statements = [];
    }
}

export default CaseExpr;