import Expression from "./Expression";

class AssignmentExpr extends Expression{
    constructor() { 
        super('assignment');
        this.assignee = '';
        this.value = '';
        this.dependencies = [];
    }
}

export default AssignmentExpr;