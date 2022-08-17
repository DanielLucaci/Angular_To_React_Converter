import ConditionalExpr from "../ConditionalExpr";

class ElseExpr extends ConditionalExpr { 
    constructor(depth) {
        super('else', depth);
    }
}

export default ElseExpr;