import Statement from "./Statement";

class InitializationStmt extends Statement{
  constructor(depth) {
    super("initialization", depth);
    this.value = "";
    this.scope = "";
    this.datatype = "";
  }
}

export default InitializationStmt;
