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
import STMT from "./STMT_TYPE";
import DeclarationExpr from "../../Component/Expression/DeclarationExpr";
import ElseIfExpr from "../../Component/Expression/If/ElseIfExpr";
import ElseExpr from "../../Component/Expression/If/ElseExpr";
import SwitchExpr from "../../Component/Expression/Switch/SwitchExpr";
import FunctionCallExpr from "../../Component/Expression/FunctionCallExpr";
import CaseExpr from "../../Component/Expression/Switch/CaseExpr";
import DefaultExpr from "../../Component/Expression/Switch/DefaultExpr";
import BreakExpr from "../../Component/Expression/Keyword/BreakExpr";
import ContinueExpr from "../../Component/Expression/Keyword/ContinueExpr";

export default class TypeScriptParser extends Parser {
  constructor(project) {
    super();
    this.component = project.component;
    this.attribute = null;
    this.function = null;
    this.depth = 0;
    this.scope = new Stack();
  }

  parse(tokenList) {
    this.init(tokenList);
    this.IMPORT_STATEMENTS();
    this.COMPONENT();
    this.CLASS();
    console.log(this.component);
  }

  extractFromStack() {
    this.scope.pop();
    this.depth--;
  }

  addToStack(expr) {
    this.scope.push(expr);
    this.depth++;
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
    this.function = new Function();
    this.function.name = this.sym;
    if (
      this.function.name === "constructor" ||
      this.function.name === "ngOnInit"
    )
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
      this.func.parameters.push(parameter);
      if (this.sym === ",") this.check(",");
    }
    this.check(")", "{");

    this.component.functions.push(this.function);
    this.addToStack(this.function);
    this.STATEMENTS();
    this.check("}");
    this.extractFromStack();
    if (this.sym !== "}") this.FUNCTIONS();
  }

  STATEMENTS() {
    while (this.sym === "}") {
      if (this.scope.length === 1) return;
      if (
        this.scope.peek().type === "default" ||
        this.scope.peek().type === "case"
      )
        this.extractFromStack();
      this.check("}");
      this.extractFromStack();
    }
    this.STATEMENT();
    this.STATEMENTS();
  }

  getStatementType() {
    if (this.sym === "case") return STMT.CASE;
    if (this.sym === "default") return STMT.DEFAULT;
    if (this.sym === "break" || this.sym === "continue") return STMT.KEYWORD;

    let index = this.tokens.indexOf(
      this.tokens.find((token) => {
        if (["switch", "for", "while", "if", "else"].includes(this.sym))
          return token.name === "{";
        return token.name === ";";
      })
    );
    let statement = this.tokens.slice(0, index + 1).map((token) => token.name);
    statement.unshift(this.sym);

    if (statement.includes("if")) {
      if (statement.includes("else")) return STMT.ELSE_IF;
      return STMT.IF;
    } else if (statement.includes("else")) {
      return STMT.ELSE;
    } else if (statement.includes("while")) {
      return STMT.WHILE;
    } else if (statement.includes("for")) {
      if (statement.includes("of") || statement.includes("in"))
        return STMT.ITERABLE_FOR;
      return STMT.FOR;
    } else if (statement.includes("switch")) {
      return STMT.SWITCH;
    } else {
      // Function call
      if (statement.slice(-2, -1)[0] === ")") return STMT.FUNCTION_CALL;

      // Assignment
      if (statement.includes("=")) {
        if (["let", "var", "const"].includes(statement[0]))
          return STMT.INITIALIZATION;

        let index = statement.indexOf("=");
        let stmtCopy = statement.slice(0, index);
        for (let token of stmtCopy) {
          let attr = this.component.attributes.find(
            (attr) => attr.name === token && attr instanceof DefaultAttr
          );
          if (attr) return STMT.STATE_UPDATE;
        }
      }

      if (["let", "var", "const"].includes(statement[0]))
        return statement.DECLARATION;
    }
  }

  STATEMENT() {
    let type = this.getStatementType();
    switch (type) {
      case STMT.IF:
        this.IF_STMT();
        break;
      case STMT.ELSE_IF:
        this.ELSE_IF_STMT();
        break;
      case STMT.ELSE:
        this.ELSE_STMT();
        break;
      case STMT.FOR:
        this.FOR_EXPR();
        break;
      case STMT.ITERABLE_FOR:
        this.ITERABLE_FOR_EXPR();
        break;
      case STMT.WHILE:
        this.WHILE_STMT();
        break;
      case STMT.SWITCH:
        this.SWITCH_STMT();
        break;
      case STMT.FUNCTION_CALL:
        this.FUNCTION_CALL_STMT();
        break;
      case STMT.INITIALIZATION:
        this.INITIALIZATION_STMT();
        break;
      case STMT.STATE_UPDATE:
        this.STATE_UPDATE_STMT();
        break;
      case STMT.DECLARATION:
        this.DECLARATION_STMT();
        break;
      case STMT.CASE:
        this.CASE_STMT();
        break;
      case STMT.DEFAULT:
        this.DEFAULT_STMT();
        break;
      case STMT.KEYWORD:
        this.KEYWORD_STMT();
        break;
      default:
        break;
    }
  }

  ASSIGNMENT_STMT() {
    let expr = new AssignmentExpr(this.depth);
    if (this.sym === "this") this.check("this", ".");

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

  CASE_STMT() {
    if (this.scope.peek().type !== "switch") this.extractFromStack();
    let expr = new CaseExpr(this.depth);
    this.check("case");
    while (this.sym !== ":") {
      expr.value += this.sym;
      this.next();
    }
    this.check(":");
    this.scope.peek().statements.push(expr);
    this.addToStack(expr);
  }

  DEFAULT_STMT() {
    if (this.scope.peek().type !== "switch") this.extractFromStack();
    let expr = new DefaultExpr(this.depth);
    this.check("default");
    this.check(":");
    this.scope.peek().statements.push(expr);
    this.addToStack(expr);
  }

  KEYWORD_STMT() {
    let expr = null;
    if (this.sym === "break") expr = new BreakExpr(this.depth);
    else expr = new ContinueExpr(this.depth);
    this.next();
    this.check(";");
    this.scope.peek().statements.push(expr);
  }

  STATE_UPDATE_STMT() {
    let expr = new AssignmentExpr(this.depth);
    if (this.sym === "this") this.check("this", ".");
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

  SWITCH_STMT() {
    let expr = new SwitchExpr(this.depth);
    this.check("switch", "(");
    if (this.sym === "this") this.check("this", ".");
    while (this.sym !== ")") {
      expr.condition += this.sym;
      this.next();
    }

    this.check(")", "{");
    this.scope.peek().statements.push(expr);
    this.addToStack(expr);
  }

  FUNCTION_CALL_STMT() {
    let expr = new FunctionCallExpr(this.depth);
    if (this.sym === "this") this.check("this", ".");

    while (this.sym !== "(") {
      if (this.sym !== "emit") {
        this.checkType("identifier");
        expr.identifier += this.sym;
      }
      this.next();
      if (this.sym === ".") {
        this.check(".");
        expr.identifier += ".";
      }
    }

    this.check("(");
    while (this.sym !== ")") {
      let parameter = "";
      while (this.sym !== "," && this.sym !== ")") {
        if (this.sym === "this") this.check("this", ".");
        parameter += this.sym;
        this.next();
      }
      expr.parameters.push(parameter);
    }
    this.check(")", ";");
    this.scope.peek().statements.push(expr);
  }

  DECLARATION_STMT() {
    let expr = new DeclarationExpr(this.depth);
    expr.scope = this.sym;
    this.next();
    this.checkType("identifier");
    expr.variable = this.sym;
    this.next();
    if (this.sym === ":") {
      this.check(":");
      while (this.sym !== ";") {
        expr.datatype += this.sym;
        this.next();
      }
    }
    this.check(";");
    this.scope.peek().statements.push(expr);
  }

  INITIALIZATION_STMT() {
    let expr = new InitializationExpr(this.depth);
    expr.scope = this.sym;
    this.next();
    expr.variable = this.sym;
    this.next();
    if (this.sym === ":") {
      this.check(":");
      while (this.sym !== "=") {
        expr.datatype += this.sym;
        this.next();
      }
    }
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
    this.scope.peek().statements.push(expr);
  }

  IF_STMT() {
    let expr = new IfExpr(this.depth);

    this.check("if", "(");
    while (this.sym !== ")") {
      if (this.sym === "this") {
        this.check("this", ".");
      } else {
        expr.condition += this.sym;
        this.next();
      }
    }
    this.check(")", "{");
    this.scope.peek().statements.push(expr);
    this.addToStack(expr);
  }

  ELSE_IF_STMT() {
    let expr = new ElseIfExpr(this.depth);
    this.check("else", "if", "(");
    while (this.sym !== ")") {
      if (this.sym === "this") {
        this.check("this", ".");
      } else {
        expr.condition += this.sym;
        this.next();
      }
    }
    this.check(")", "{");
    this.scope.peek().statements.push(expr);
    this.addToStack(expr);
  }

  ELSE_STMT() {
    let expr = new ElseExpr(this.depth);
    this.check("else", "{");
    this.scope.peek().statements.push(expr);
    this.addToStack(expr);
  }

  WHILE_STMT() {
    let expr = new WhileExpr(this.depth);

    this.check("while", "(");
    while (this.sym !== ")") {
      if (this.sym === "this") {
        this.check("this", ".");
      } else {
        if (this.type === "operator") expr.condition += " " + this.sym + " ";
        else expr.condition += this.sym;
        this.next();
      }
    }
    this.check(")", "{");
    this.scope.peek().statements.push(expr);
    this.addToStack(expr);
  }

  FOR_EXPR() {
    let expr = new NormalForExpr(this.depth);
    this.check("for", "(", "let");
    expr.iterator = this.sym;
    this.next();
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
        expr.increment += this.sym;
        this.next();
      }
    }

    this.check(")", "{");
    this.scope.peek().statements.push(expr);
    this.addToStack(expr);
  }

  ITERABLE_FOR_EXPR() {
    let expr = new IterableFor(this.sym);
    this.check("for", "(", "let");
    expr.iterator = this.sym;
    this.next();
    expr.word = this.sym;
    this.next();
    if (this.sym === "this") this.check("this", ".");

    while (this.sym !== ")") {
      expr.iterable += this.sym;
      this.next();
    }
    this.check(")", "{");
    this.scope.peek().statements.push(expr);
    this.addToStack(expr);
  }
}
