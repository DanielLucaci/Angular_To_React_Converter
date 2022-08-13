import ConditionalExpr from "../ConditionalExpr";

class ElseExpr extends ConditionalExpr { 
    constructor() {
        super('else');
    }
}

export default ElseExpr;