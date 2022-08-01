import ConditionalExpr from "../ConditionalExpr";

class ForExpr extends ConditionalExpr { 
    constructor() { 
        super('for');
        this.iterator = '';
    }
}

export default ForExpr;