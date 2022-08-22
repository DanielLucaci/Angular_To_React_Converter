import Utilities from "../../Project/Utilities";
import DefaultAttr from "../../Component/Attribute/DefaultAttr";
import InputAttr from "../../Component/Attribute/InputAttr";
import OutputAttr from "../../Component/Attribute/OutputParameter";
import DOMBuilder from "../HTML/DOMBuilder";
import { Tokenizer } from "../../Tokenizer/Tokenizer";

class ComponentBuilder {
  constructor(tree, project) {
    this.dom = new DOMBuilder();
    this.dom.traversal(tree);
    this.text = "";
    this.component = project.component;
    this.project = project;
    this.tree = tree;
  }

  addImports() {
    const { path: componentPath } = this.component;

    this.component.subComponents.forEach((subComp) => {
      const { path: subComponentPath, name: subComponentName } =
        this.project.getComponentByName(subComp);
      let relativePath = Utilities.getRelativePath(
        subComponentPath,
        componentPath
      );
      if (relativePath[0] !== "..") relativePath.unshift(".");
      this.addText("import ", subComponentName, " from ").addText(
        `'${relativePath.join("/")}/${subComponentName}';\n`
      );
    });
  }

  addStyling() {
    if (this.component.styleUrls.length > 0)
      this.text += `import './${this.component.name}.css';\n`;
  }

  addHooks() {
    let hooks = [];
    if (this.component.attributes.some((param) => param instanceof DefaultAttr))
      hooks.push("useState");

    if (this.component.hasConstructor) hooks.push("useEffect");

    if (hooks.length !== 0) {
      this.addText("import { ");
      hooks.forEach((hook) => this.addText(hook, ", "));
      this.text = this.text.slice(0, -2);
      this.addText(" } from 'react';\n");
    }
  }

  addAttributes() {
    this.component.attributes
      .filter((param) => param instanceof DefaultAttr)
      .forEach((param) => {
        this.text += `const [${param.name}, set${Utilities.capitalize(
          param.name
        )}] = useState(${param.initialValue});\n`;
      });
  }

  addDefinition() {
    this.addText("\nconst ", this.component.name, " = (");
    this.addProps();
    this.addText(") => {\n");
  }

  addProps() {
    let props = [];

    if (this.component.hasNgContent) props.push("children");

    this.component.attributes
      .filter(
        (param) => param instanceof InputAttr || param instanceof OutputAttr
      )
      .forEach((param) => {
        let prop = param.name;
        if (param.nickname !== "") prop += ":" + param.nickname;
        props.push(prop);
      });

    if (props.length !== 0) {
      this.addText("{ ");
      props.forEach((prop) => {
        this.addText(prop, ", ");
      });
      this.text = this.text.slice(0, -2);
      this.addText(" }");
    }
  }

  addExport() {
    this.addText("export default ", this.component.name, ";");
  }

  addJSX() {
    let tabs = 2;
    let reactFragment = false;

    this.addText("\nreturn (\n");
    if (this.tree.children.length > 1) {
      // React Fragment Needed
      tabs = 3;
      reactFragment = true;
      this.addText("\t<div>\n");
    }
    this.dom.text.split("\n").forEach((line) => {
      for (let i = 0; i < tabs; i++) this.text += "  ";
      this.text += line + "\n";
    });
    this.text = this.text.slice(0, -tabs - 1);
    if (reactFragment === true) this.addText("  </div>\n");

    this.addText("  );\n}\n\n");
  }

  addText(...symbols) {
    symbols.forEach((symbol) => (this.text += symbol));
    return this;
  }

  addConstructor() {
    const constructor = this.component.functions.filter(
      (f) => f.name === "constructor"
    )[0];

    if (!constructor) return;

    this.addUseEffect(constructor);
    let index = this.component.functions.indexOf(constructor);
    this.component.functions.splice(index, 1);
  }

  addNgOnInit() {
    const ngOnInit = this.component.functions.filter(
      (f) => f.name === "ngOnInit"
    )[0];

    if (!ngOnInit) return;

    this.addUseEffect(ngOnInit);
    let index = this.component.functions.indexOf(ngOnInit);
    this.component.functions.splice(index, 1);
  }

  addUseEffect(stmt) {
    this.addSpaces(stmt.depth).addText("useEffect(() => {");
    const dependencies = this.extractDependencies(stmt);
    this.addStatement(stmt);
    this.addSpaces(stmt.depth).addText("}, [");
    dependencies.forEach((dep) => this.addText(dep, ", "));
    if (dependencies.length > 0) this.text = this.text.slice(0, -2);
    this.addText("])\n");
  }

  extractDependencies(expr) {
    const dependencies = [];
    const variables = [];
    let queue = [];
    queue.push(expr);
    while (queue.length > 0) {
      let stmt = queue.shift();
      if (stmt.type === "assignment" || stmt.type === "initialization") {
        if (!variables.includes(stmt.variable)) variables.push(stmt.variable);
      }

      if (stmt.dependencies) {
        stmt.dependencies.forEach((dep) => {
          if (!variables.includes(dep) && !dependencies.includes(dep)) {
            dependencies.push(dep);
          }
        });
      }

      if (stmt.statements)
        stmt.statements.forEach((statement) => queue.push(statement));
    }
    return dependencies;
  }

  addFunctions() {
    this.component.functions.forEach((func) => this.addFunction(func));
  }

  addFunction(func) {
    this.addText("\nconst ", func.name, " = (");
    for (let param of func.parameters) {
      this.addText(param.name);
      if (param.defaultValue !== "") this.addText(" = ", param.defaultValue);
      this.addText(", ");
    }
    if (func.parameters.length > 0) this.text = this.text.slice(0, -2);
    this.addText(") => {");

    if (func.statements.length > 0)
      func.statements.forEach((stmt) => this.addStatement(stmt));
    this.addText("\n}\n");
  }

  addIfExpr(expr) {
    this.addSpaces(expr.depth).addText("if (", expr.condition, ") {");
  }

  addElseIfExpr(expr) {
    this.addText(" else if (", expr.condition, ") {");
  }

  addElseExpr() {
    this.addText(" else {");
  }

  addForExpr(expr) {
    this.addSpaces(expr.depth)
      .addText("for (let ", expr.iterator, " = ", expr.initialValue, "; ")
      .addText(expr.stopCondition, "; ")
      .addText(expr.increment, ") {");
  }

  addIterableForExpr(expr) {
    this.addSpaces(expr.depth)
      .addText("for (let ", expr.iterator)
      .addText(" ", expr.word, " ")
      .addText(expr.iterable, ") {");
  }

  addSwitchExpr(expr) {
    this.addSpaces(expr.depth).addText("switch (", expr.condition, ") {");
  }

  addCaseExpr(expr) {
    this.addSpaces(expr.depth).addText("case ", expr.value, ":");
  }

  addDefaultExpr(expr) {
    this.addSpaces(expr.depth).addText("default:");
  }

  addWhileExpr(expr) {
    this.addSpaces(expr.depth).addText("while (", expr.condition, ") {");
  }

  addFunctionCallStmt(stmt) {
    this.addSpaces(stmt.depth).addText(stmt.variable, "(");
    for (let param of stmt.parameters) {
      this.addText(param, ", ");
    }
    this.text = this.text.slice(0, -2);
    this.addText(");");
  }

  addInitializationStmt(stmt) {
    this.addSpaces(stmt.depth)
      .addText(stmt.scope, " ", stmt.variable)
      .addText(" = ", stmt.value, ";");
  }

  addDeclarationStmt(stmt) {
    this.addSpaces(stmt.depth).addText(stmt.scope, " ", stmt.variable, ";");
  }

  addAssignmentStmt(stmt) {
    this.addSpaces(stmt.depth).addText(stmt.variable, " = ", stmt.value, ";");
  }

  addStateUpdateStmt(stmt) {
    this.addSpaces(stmt.depth).addText(
      "set",
      Utilities.capitalize(stmt.variable),
      "("
    );
    for (let d of stmt.dependencies) {
      if (d === stmt.variable) {
        this.addText("(prev", Utilities.capitalize(stmt.variable), ") => ");
        break;
      }
    }
    let valueTokens = new Tokenizer()
      .getTokenList(stmt.value)
      .map((token) => token.name);
    for (let token of valueTokens) {
      if (token === stmt.variable) {
        this.addText("prev", Utilities.capitalize(stmt.variable));
      } else {
        this.addText(token);
      }
    }
    this.addText(");");
  }

  addKeywordStmt(expr) {
    this.addSpaces(expr.depth).addText(expr.keyword, ";");
  }

  addExpression(expr) {
    switch (expr.type) {
      case "if":
        this.addIfExpr(expr);
        break;
      case "else if":
        this.addElseIfExpr(expr);
        break;
      case "else":
        this.addElseExpr();
        break;
      case "for":
        this.addForExpr(expr);
        break;
      case "iterable for":
        this.addIterableForExpr(expr);
        break;
      case "switch":
        this.addSwitchExpr(expr);
        break;
      case "case":
        this.addCaseExpr(expr);
        break;
      case "default":
        this.addDefaultExpr(expr);
        break;
      case "while":
        this.addWhileExpr(expr);
        break;
      case "function call":
        this.addFunctionCallStmt(expr);
        break;
      case "declaration":
        this.addDeclarationStmt(expr);
        break;
      case "initialization":
        this.addInitializationStmt(expr);
        break;
      case "assignment":
        this.addAssignmentStmt(expr);
        break;
      case "state update":
        this.addStateUpdateStmt(expr);
        break;
      case "break":
      case "continue":
        this.addKeywordStmt(expr);
        break;
      default:
        break;
    }
  }

  closeExpression(expr) {
    switch (expr.type) {
      case "if":
      case "else if":
      case "else":
      case "while":
      case "for":
      case "iterable for":
      case "switch":
        this.addSpaces(expr.depth).addText("}");
        break;
      default:
        break;
    }
  }

  addStatement(expr) {
    this.addExpression(expr);
    if (expr.statements)
      expr.statements.forEach((stmt) => this.addStatement(stmt));
    this.closeExpression(expr);
  }

  addSpaces(count) {
    this.addText("\n");
    for (let i = 0; i < count; i++) this.addText("  ");
    return this;
  }

  addTwoWayBinding() {
    this.component.ngModel.forEach((value) => {
      value = Utilities.capitalize(value.slice(1, -1));
      this.addText("\nconst change", value, "Handler = (e) => {\n");
      this.addText("\tset", value, "(e.target.value);\n");
      this.addText("}\n");
    });
  }

  createComponent() {
    this.addImports();
    this.addStyling();
    this.addHooks();
    this.addDefinition();
    this.addAttributes();
    this.addConstructor();
    this.addNgOnInit();
    this.addTwoWayBinding();
    this.addFunctions();
    this.addJSX();
    this.addExport();
    return this.text;
  }
}

export default ComponentBuilder;
