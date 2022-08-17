class Expression { 
    constructor(type, depth) {
        this.type = type;
        this.depth = depth;
        this.dependencies = [];
    }
}

export default Expression;