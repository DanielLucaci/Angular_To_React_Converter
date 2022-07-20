class Token { 
    constructor(props) {
        this.name = props.name;
        this.type = props.type;
        this.line = props.line;
        this.column = props.column;
    }
}

export default Token;