import ConditionalExpr from "../ConditionalExpr";

class ForExpr extends ConditionalExpr { 
    constructor(type, depth) { 
        super(type, depth);
        this.iterator = '';
    }
}

export default ForExpr;