import ConditionalExpr from "../ConditionalExpr";

class IfExpr extends ConditionalExpr { 
    constructor() {
        super('if');
        this.condition = '';
    }
}

export default IfExpr;