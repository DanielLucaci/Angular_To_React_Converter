import ConditionalExpr from "../ConditionalExpr";

class ElseIfExpr extends ConditionalExpr { 
    constructor(depth) {
        super('else if', depth);
        this.condition = '';
    }
}

export default ElseIfExpr;