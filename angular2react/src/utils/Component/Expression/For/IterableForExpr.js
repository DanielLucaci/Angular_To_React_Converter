import ForExpr from "./ForExpr";

class IterableFor extends ForExpr { 
    constructor(depth) { 
        super("iterable for", depth);
        this.iterable = '';
        this.word = '';
    }
}

export default IterableFor;