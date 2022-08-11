import Parser from "../Parser";
import Utilities from "../../Project/Utilities";
import OutputParameter from "../../Component/Parameter/OutputParameter";
import DefaultParameter from "../../Component/Parameter/DefaultParameter";
import InputParameter from "../../Component/Parameter/InputParameter";
import InitializationExpr from "../../Project/Expression/InitializationExpr";
import Function from "../../Project/Function";
import IfExpr from "../../Project/Expression/If/IfExpr";
import Stack from "../../Project/Stack";
import WhileExpr from "../../Project/Expression/While/WhileExpr";
import IterableFor from "../../Project/Expression/For/IterableForExpr";
import NormalForExpr from "../../Project/Expression/For/NormalForExpr";

export default class TypeScriptParser extends Parser {
  constructor(project) {
    super();
    this.component = project.component;
    this.parameter = null;
    this.structure = null;
    this.stack = new Stack();
  }

  parse(tokenList) {
    this.init(tokenList);
    this.IMPORT_STATEMENTS();
    this.COMPONENT();
    this.CLASS();
  }

  IMPORT_STATEMENTS() {
    for (;;) {
      if (this.sym !== "import") break;
      this.check("import");
      if (this.sym === "{") {
        // import
        this.check("{");
        for (;;) {
          this.next(); // import object
          if (this.sym === "}") {
            this.check("}");
            break;
          }
          this.check(",");
        }
      } else {
        //Default Import

        this.next();
      }
      this.check("from");
      this.next(); // location
      if (this.sym === ";") this.check(";");
    }
  }

  COMPONENT() {
    this.check("@", "Component", "(", "{");
    this.SELECTOR();
    this.TEMPLATE_URL();
    if (this.sym === "styleUrls") {
      this.STYLE_URLS();
    }

    this.check("}");
    this.check(")");
  }

  SELECTOR() {
    this.check("selector", ":");
    this.next(); // selector
    this.check(",");
  }

  TEMPLATE_URL() {
    this.check("templateUrl", ":");
    this.next(); // Template url
    this.check(",");
  }

  STYLE_URLS() {
    this.check("styleUrls", ":", "[");
    for (;;) {
      this.component.styleUrls.push(Utilities.extractLocation(this.sym));
      this.next();
      if (this.sym === "]") {
        this.check("]");
        break;
      }
      this.check(",");
    }
  }

  CLASS() {
    console.log("CLASS");
    this.check("export", "class");
    this.componentName = this.sym; // component Name
    this.next();
    this.check("{");

    // Parameters
    this.sym === "}" ? this.check("}") : this.PARAMETERS();

    // Functions
    this.sym === "}" ? this.check("}") : this.FUNCTIONS();
  }

  PARAMETERS() {
    if (this.sym === "}") {
      return;
    } else if (this.tokens[0].name === "(") {
      this.FUNCTIONS();
      return;
    }

    switch (this.sym) {
      case "Input":
        this.INPUT();
        break;
      case "Output":
        this.OUTPUT();
        break;
      default:
        this.PARAMETER();
        break;
    }
    this.component.parameters.push(this.parameter);
    this.PARAMETERS();
  }

  INPUT() {
    console.log("Input parameter");
    this.parameter = new InputParameter();
    this.parameter.type = "Input";
    this.check("Input", "(");
    if (this.sym !== ")") {
      this.parameter.nickname = this.sym.slice(1, -1);
      this.next();
      this.check(",", "{", "static", ":", "true", "}");
    }
    this.check(")");
    this.parameter.name = this.sym;
    this.next();
    if (this.sym === ":") {
      this.next();
      this.TYPE();
    }

    this.check(";");
  }

  OUTPUT() {
    this.parameter = new OutputParameter();
    this.parameter.type = "Output";
    this.check("Output", "(");
    if (this.sym !== ")") {
      this.parameter.nickname = this.sym.slice(1, -1);
      this.next();
      this.check(",", "{", "static", ":", "true", "}");
    }
    this.check(")");
    this.parameter.name = this.sym;
    this.next();
    this.EVENT_EMITTER();
  }

  EVENT_EMITTER() {
    this.check("=", "new", "EventEmitter", "<");
    this.parameter.type = "EventEmitter<";
    while (this.sym !== ">") {
      this.parameter.type += this.sym;
      this.next();
    }
    this.parameter.type += ">";
    this.check(">", "(", ")", ";");
  }

  PARAMETER() {
    console.log("Default Parameter");
    this.parameter = new DefaultParameter();
    this.parameter.name = this.sym;
    this.next();
    if (this.sym === ":") {
      this.next();
      this.TYPE();
    }

    if (this.sym === "=") {
      this.next();
      this.INITIAL_VALUE();
    }

    this.check(";");
  }

  TYPE() {
    let type = "";
    while (this.sym !== "=" && this.sym !== ";") {
      type += this.sym;
      this.next();
    }
    this.parameter.type = type;
    switch (this.sym) {
      case "=":
        this.check("=");
        this.INITIAL_VALUE();
        break;
      default:
        break;
    }
  }

  INITIAL_VALUE() {
    let initialValue = "";
    while (this.sym !== ";") {
      initialValue += this.sym;
      this.next();
    }
    this.parameter.initialValue = initialValue;
  }

  FUNCTIONS() {
    let func = new Function();
    func.name = this.sym;
    this.next();
    this.check("(");
    while (this.sym !== ")") {
      let parameter = {
        name: "",
        type: "",
        defaultValue: "",
      };

      // PARAMETER NAME
      parameter.name = this.sym;
      this.next();

      // PARAMETER TYPE
      if (this.sym === ":") {
        this.check(":");
        let stop = false;
        while (!stop) {
          switch (this.sym) {
            case ",":
            case "=":
            case ")":
              stop = true;
              break;
            default:
              parameter.type += this.sym;
              this.next();
              break;
          }
        }
      }

      // DEFAULT VALUE
      if (this.sym === "=") {
        this.check("=");
        let stop = false;
        while (!stop) {
          switch (this.sym) {
            case ",":
            case ")":
              stop = true;
              break;
            default:
              parameter.defaultValue += this.sym;
              this.next();
              break;
          }
        }
      }
      func.parameters.push(parameter);
      if (this.sym === ",") this.check(",");
    }
    this.stack.push(func);
    this.check(")");
    this.check("{");
    this.STATEMENTS();

    // Add the function to the component
    this.component.functions.push(this.stack.peek());
    this.stack.pop();
    if (this.sym !== "}") this.FUNCTIONS();
    else console.log(this.sym);
  }

  STATEMENTS() {
    this.STATEMENT();

    if (this.sym === "}") {
      console.log("Stack length is " + this.stack.length);
      if (this.stack.length === 1) return;
      this.stack.pop();
      this.STATEMENTS();
    }
  }

  STATEMENT() {
    console.log("STATEMENT");
    this.structure = this.stack.peek();
    console.log(this.sym);
    switch (this.sym) {
      case "let":
      case "var":
      case "const":
        this.INITIALIZATION();
        break;
      case "while":
      case "for":
      case "if":
      case "switch":
        this.CONDITIONAL();
        break;
      default:
        break;
    }
  }

  INITIALIZATION() {
    console.log("INITIALIZATION");
    let expr = new InitializationExpr();
    switch (this.sym) {
      case "let":
        expr.scope = "let";
        break;
      case "var":
        expr.scope = "var";
        break;
      case "const":
        expr.const = "const";
        break;
      default:
        break;
    }
    this.next();
    expr.variable = this.sym;
    this.next();
    this.check("=");
    while (this.sym !== ";") {
      if (this.sym === "this") {
        this.check("this", ".");
      } else {
        expr.value += this.sym;
        this.next();
      }
    }
    this.check(";");
    this.structure.statements.push(expr);
  }

  CONDITIONAL() {
    switch (this.sym) {
      case "if":
        this.IF_STATEMENT();
        break;
      case "while":
        this.WHILE_STATEMENT();
        break;
      case "for":
        this.FOR_STATEMENT();
        break;
      case "switch":
        this.SWITCH_STATEMENT();
        break;
      default:
        break;
    }
  }

  IF_STATEMENT() {
    let expr = new IfExpr();

    this.check("if");
    this.check("(");
    while (this.sym !== ")") {
      if (this.sym === "this") {
        this.check("this", ".");
      } else {
        expr.condition += this.sym;
        this.next();
      }
    }
    this.check(")");
    this.check("{");
    this.structure.push(expr);
    this.stack.push(expr);
  }

  WHILE_STATEMENT() {
    let expr = new WhileExpr();

    this.check("while");
    this.check("(");
    while (this.sym !== ")") {
      if (this.sym === "this") {
        this.check("this", ".");
      } else {
        expr.condition += this.sym;
        this.next();
      }
    }
    this.check(")");
    this.check("{");
    this.structure.statements.push(expr);
    this.stack.push(expr);
  }

  FOR_EXPR() {
    this.check("for");
    this.check("(");
    this.check("let");
    if (this.tokens[0].name === "of") {
      this.ITERABLE_FOR_EXPR();
    } else if (this.tokens[0].name === "=") {
      this.NORMAL_FOR_EXPR();
    } else {
      this.next();
      throw new Error(
        `Unknown symbol ${this.sym} at line ${this.line}, column ${this.column}. Expected '=' or 'of'`
      );
    }
  }

  NORMAL_FOR_EXPR() {
    let expr = new NormalForExpr();
    expr.iterator = this.sym;
    this.check("=");

    // Initial value
    while (this.sym !== ";") {
      if (this.sym === "this") {
        this.check("this", ".");
      } else {
        expr.initialValue += this.sym;
        this.next();
      }
    }
    this.check(";");

    // Stop Condition
    this.check(expr.iterator);
    expr.stopCondition += expr.iterator;
    while (this.sym !== ";") {
      if (this.sym === "this") {
        this.check("this", ".");
      } else {
        expr.stopCondition += this.sym;
        this.next();
      }
    }
    this.check(";");

    // Increment
    this.check(expr.iterator);
    expr.increment += expr.iterator;
    while (this.sym !== ")") {
      if (this.sym === "this") {
        this.check("this", ".");
      } else {
        expr.stopCondition += this.sym;
        this.next();
      }
    }

    this.check(")");
    this.check("{");
    this.structure.statements.push(expr);
    this.stack.push(expr);
  }

  ITERABLE_FOR_EXPR() {
    let expr = new IterableFor();
    expr.iterator = this.sym;
    this.next();
    this.check("of");
    if (this.sym === "this") {
      this.check("this", ".");
    }

    expr.iterable = this.sym;
    this.next();
    this.check(")");
    this.check("{");
    this.structure.statements.push(expr);
    this.stack.push(expr);
  }
}
