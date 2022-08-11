import Parser from "../Parser";
import Utilities from "../../Project/Utilities";
import OutputAttr from "../../Component/Attribute/OutputParameter";
import DefaultAttr from "../../Component/Attribute/DefaultAttr";
import InputAttr from "../../Component/Attribute/InputAttr";
import InitializationExpr from "../../Component/Expression/InitializationExpr";
import Function from "../../Component/Function";
import IfExpr from "../../Component/Expression/If/IfExpr";
import Stack from "../../Project/Stack";
import WhileExpr from "../../Component/Expression/While/WhileExpr";
import IterableFor from "../../Component/Expression/For/IterableForExpr";
import NormalForExpr from "../../Component/Expression/For/NormalForExpr";
import Parameter from "../../Component/Parameter";
import AssignmentExpr from "../../Component/Expression/AssignmentExpr";

export default class TypeScriptParser extends Parser {
  constructor(project) {
    super();
    this.component = project.component;
    this.attribute = null;
    this.scope = new Stack();
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
    this.sym === "}" ? this.check("}") : this.ATTRIBUTES();

    // Functions
    this.sym === "}" ? this.check("}") : this.FUNCTIONS();
  }

  ATTRIBUTES() {
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
        this.ATTRIBUTE();
        break;
    }
    this.ATTRIBUTES();
  }

  INPUT() {
    console.log("Input parameter");
    let attr = new InputAttr();
    attr.type = "Input";
    this.check("Input", "(");
    if (this.sym !== ")") {
      attr.nickname = this.sym.slice(1, -1);
      this.next();
      this.check(",", "{", "static", ":", "true", "}");
    }
    this.check(")");
    attr.name = this.sym;
    this.next();
    if (this.sym === ":") {
      this.next();
      this.TYPE(attr);
    }
    this.check(";");
    this.component.attributes.push(attr);
  }

  OUTPUT() {
    let attr = new OutputAttr();
    attr.type = "Output";
    this.check("Output", "(");
    if (this.sym !== ")") {
      attr.nickname = this.sym.slice(1, -1);
      this.next();
      this.check(",", "{", "static", ":", "true", "}");
    }
    this.check(")");
    attr.name = this.sym;
    this.next();
    this.check("=", "new", "EventEmitter", "<");
    attr.type = "EventEmitter<";
    while (this.sym !== ">") {
      attr.type += this.sym;
      this.next();
    }
    attr.type += ">";
    this.check(">", "(", ")", ";");
    this.component.attributes.push(attr);
  }

  ATTRIBUTE() {
    let attr = new DefaultAttr();
    attr.name = this.sym;
    this.next();
    if (this.sym === ":") {
      this.next();
      this.TYPE(attr);
    }

    if (this.sym === "=") {
      this.next();
      this.INITIAL_VALUE(attr);
    }

    this.check(";");
    this.component.attributes.push(attr);
  }

  TYPE(attr) {
    let type = "";
    while (this.sym !== "=" && this.sym !== ";") {
      type += this.sym;
      this.next();
    }
    attr.type = type;
  }

  INITIAL_VALUE(attr) {
    let initialValue = "";
    while (this.sym !== ";") {
      initialValue += this.sym;
      this.next();
    }
    attr.initialValue = initialValue;
  }

  /* Function */
  FUNCTIONS() {
    let func = new Function();
    func.name = this.sym;
    if (func.name === "constructor" || func.name === "ngOnInit")
      this.component.hasConstructor = true;

    this.next();
    this.check("(");
    while (this.sym !== ")") {
      let parameter = new Parameter();
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
    this.scope.push(func);
    this.check(")");
    this.check("{");
    this.STATEMENTS();

    // Add the function to the component
    this.component.functions.push(this.scope.peek());
    this.scope.pop();
    this.check("}");
    if (this.sym !== "}") this.FUNCTIONS();
  }

  STATEMENTS() {
    this.STATEMENT();

    if (this.sym === "}") {
      if (this.scope.length === 1) return;
      this.scope.pop();
      this.STATEMENTS();
    }
  }

  STATEMENT() {
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
      case "this":
        this.ASSIGNMENT_STMT();
        break;
      default:
        break;
    }
  }

  ASSIGNMENT_STMT() {
    let expr = new AssignmentExpr();
    if (this.sym === "this") {
      this.check("this");
      this.check(".");
    }

    this.checkType("identifier");
    expr.assignee = this.sym;
    this.next();
    this.check("=");

    while (this.sym !== ";") {
      if (this.sym === "this") this.check("this", ".");

      if (this.type === "identifier") expr.dependencies.push(this.sym);
      expr.value += this.sym;
      this.next();
    }
    this.check(";");
    this.scope.peek().statements.push(expr);
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
    this.scope.statements.push(expr);
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
    this.scope.push(expr);
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
    this.scope.push(expr);
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
    this.scope.push(expr);
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
    this.scope.push(expr);
  }
}
