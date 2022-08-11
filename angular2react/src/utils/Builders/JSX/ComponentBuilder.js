import Utilities from "../../Project/Utilities";
import DefaultAttr from "../../Component/Attribute/DefaultAttr";
import InputAttr from "../../Component/Attribute/InputAttr";
import OutputAttr from "../../Component/Attribute/OutputParameter";
import DOMBuilder from "../HTML/DOMBuilder";

class ComponentBuilder {
  constructor(tree, project) {
    this.domBuilder = new DOMBuilder();
    this.text = "";
    this.component = project.component;
    this.project = project;
    this.tree = tree;
    this.domBuilder.traversal(this.tree);
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
      this.addText("import", " ", subComponentName, " ", "from", " ");
      this.addText(`${relativePath.join("/")}/${subComponentName}'`);
      this.addText("\n");
    });
  }

  addStyling() {
    if (this.component.styleUrls.length > 0)
      this.text += `import './${this.component.name}.css'\n`;
  }

  addHooks() {
    let hooks = [];
    if (this.component.attributes.some((param) => param instanceof DefaultAttr))
      hooks.push("useState");

    if (this.component.hasConstructor) hooks.push("useEffect");

    if (hooks.length !== 0) {
      this.addText("import", " ", "{", " ");
      hooks.forEach((hook) => this.addText(hook, ",", " "));
      this.text = this.text.slice(0, -2);
      this.addText(" ", "}", " ", "from", " ", "'react'", ";", "\n");
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
    this.addText("\n", "const", " ", this.component.name, "=", " ", "(");
    this.addProps();
    this.addText(")", " ", "=>", " ", "{", "\n");
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
      this.addText("{", " ");
      props.forEach((prop) => {
        this.addText(prop, ",", " ");
      });
      this.text = this.text.slice(0, -2);
      this.addText(" ", "}");
    }
  }

  addExport() {
    this.addText("export", " ", "default", " ", this.component.name, ";");
  }

  addJSX() {
    let tabs = 2;
    let reactFragment = false;

    this.addText("\n", "return", " ", "(", "\n");
    if (this.tree.children.length > 1) {
      // React Fragment Needed
      tabs = 3;
      reactFragment = true;
      this.addText("\t", "<", ">", "\n");
    }
    this.domBuilder.dom.split("\n").forEach((line) => {
      for (let i = 0; i < tabs; i++) this.text += "  ";
      this.text += line + "\n";
    });
    this.text = this.text.slice(0, -tabs - 1);
    if (reactFragment === true) this.addText(" ", " ", "<", "/", ">", "\n");

    this.addText("  ", ")", ";", "\n", "}", "\n", "\n");
  }

  addConstructor() {
    // Get constructor
    const constructor = this.component.functions.filter(
      (f) => f.name === "constructor"
    )[0];

    if (!constructor) return;
    console.log(constructor);

    constructor.statements.forEach((stmt) => {
      switch (stmt.type) {
        case "assignment":
          this.addUseEffect(stmt);
          break;
        default:
          break;
      }
    });
  }

  addText(...symbols) {
    symbols.forEach((symbol) => (this.text += symbol));
  }

  addNgOnInit() {
    const ngOnInit = this.component.functions.filter(
      (f) => f.name === "ngOnInit"
    )[0];

    if (ngOnInit === null) return;

    ngOnInit.statements.forEach((stmt) => {
      switch (stmt.type) {
        case "assignment":
          this.addUseEffect(stmt);
          break;
        default:
          break;
      }
    });
  }

  addUseEffect(stmt) {
    this.addText("\n", "useEffect", "(", "(", ")", " ",  "=>", " ", "{", "\n", "\t");
    this.addText("set", Utilities.capitalize(stmt.assignee));
    this.addText("(", stmt.value, ")", ";", "\n", "}", ",", " ", "[");
    stmt.dependencies.forEach((dependency) => this.addText(dependency, ",", " "));
    if (stmt.dependencies.length > 0) this.text = this.text.slice(0, -2);
    this.addText("]", ")", "\n", "\n");
  }

  addFunctions() {}

  createComponent() {
    this.addImports();
    this.addStyling();
    this.addHooks();
    this.addDefinition();
    this.addAttributes();
    this.addConstructor();
    //  this.addNgOnInit();
    this.addFunctions();
    this.addJSX();
    this.addExport();

    console.log(this.text);

    return this.text;
  }
}

export default ComponentBuilder;
