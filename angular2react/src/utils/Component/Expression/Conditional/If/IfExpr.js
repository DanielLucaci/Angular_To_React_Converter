import ConditionalExpr from "../ConditionalExpr";

class IfExpr extends ConditionalExpr { 
    constructor(depth) {
        super('if', depth);
        this.condition = '';
    }
}

export default IfExpr;