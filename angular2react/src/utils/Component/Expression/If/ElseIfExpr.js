import ConditionalExpr from "../ConditionalExpr";

class ElseIfExpr extends ConditionalExpr { 
    constructor() {
        super('else if');
        this.condition = '';
    }
}

export default ElseIfExpr;