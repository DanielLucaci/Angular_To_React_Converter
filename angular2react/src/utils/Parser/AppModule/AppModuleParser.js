import Parser from "../Parser";
import Component from "../../Component/Component";
import Utilities from "../../Project/Utilities";

class AppModuleParser extends Parser {
  constructor(project) { 
    super();
    this.project = project;
    this.filename = 'app.module.ts';
  }

  parse(tokenList) {
    this.init(tokenList);
    this.IMPORT_STATEMENTS();
  }

  addNewComponent(newComponent) {
    this.project.components.push(newComponent);
  }

  IMPORT_STATEMENTS() {
    try {
      for (;;) {
        this.check("import", "{");
        this.next();
        this.check("}", "from");
        this.next();
        this.check(";");
      }
    } catch (e) {
      this.NG_MODULE();
    }
  }

  NG_MODULE() {
    this.check("@", "NgModule", "(", "{");
    this.DECLARATIONS();
    this.IMPORTS();
    this.PROVIDERS();
    this.BOOTSTRAP();
    this.check("}", ")");
    this.EXPORT_STATEMENT();
  }

  DECLARATIONS() {
    this.check("declarations", ":", "[");
    let found = false;

    // Iterate over every single component
    for (;;) {
      // Check for 'AppComponent'
      if (this.sym === "AppComponent") found = true;

      // Add the new component
      this.addNewComponent(new Component(Utilities.removeComponent(this.sym)));
      this.next();
      if (this.sym === "]") break;
      else this.check(",");
    }
    if (!found) {
      throw new Error("AppComponent was not found in declarations");
    }
    this.check("]", ",");
  }

  IMPORTS() {
    this.check("imports", ":", "[");
    for (;;) {
      // Iterate over all imports
      if (this.sym === "]") break;
      this.next();
      if (this.sym === ",") this.next();
    }
    this.check("]", ",");
  }

  PROVIDERS() {
    this.check("providers", ":", "[");
    for (;;) {
      if (this.sym === "]") break;

      this.next();
      if (this.sym === ",") this.next();
    }
    this.check("]", ",");
  }

  BOOTSTRAP() {
    this.check("bootstrap", ":", "[", "AppComponent", "]");
  }

  EXPORT_STATEMENT() {
    this.check("export", "class", "AppModule", "{", "}");
  }
}

export default AppModuleParser;
