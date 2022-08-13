import Expression from "../Expression";

class CaseExpr extends Expression {
    constructor() {
        super("case");
        this.value = "";
        this.statements = [];
    }
}

export default CaseExpr;