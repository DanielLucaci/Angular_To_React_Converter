import AppModuleParser from "../Parser/AppModule/AppModuleParser";
import HTMLParser from "../Parser/HTML/HTMLParser";
import Utilities from "./Utilities";
import TypeScriptParser from "../Parser/TypeScript/TypeScriptParser";
import IndexHTMLBuilder from "../Builders/HTML/IndexHTMLBuilder";
import IndexJSBuilder from "../Builders/JavaScript/IndexJsBuilder";
import { Tokenizer } from "../Tokenizer/Tokenizer";
import ComponentBuilder from "../Builders/JSX/ComponentBuilder";

class Project {
  constructor(archive, folders) {
    this.location = null;
    this.tokenizer = new Tokenizer();
    this.component = null;
    this.length = 0;
    this.index = 0;
    this.components = [];
    this.status = {
      message: "",
      percentage: 0,
      isRunning: true,
    };
    this.archive = archive;
    this.folders = folders;
  }

  getComponentByName(name) {
    return this.components.find((c) => c.name === name);
  }

  updateComponentsPath() {
    this.components.forEach((c) => {
      const { name } = c;
      console.log(name);

      // Get the coresponding path;
      let { path } = this.archive.getFileInfo(
        `${Utilities.componentToSelector(name)}.component.html`
      );

      if (name !== "App") {
        (path = path.split("/"))[1] = "components";
        c.path = path.join("/");
      } else {
        c.path = path.split("/").slice(0, 1).join("/");
      }
    });
  }

  async addGlobalStyle() {
    this.status = {
      ...this.status,
      message: "Adding global styles",
      percentage: 10,
    };
    const file = this.archive.getFile("styles.css");
    if (file !== null)
      this.folders.src.file("index.css", await file.async("string"));
    await Utilities.sleep(2000);
  }

  getToLocation() {
    // Get to the location
    let location = this.folders.src;
    if (this.component.name !== "App") {
      let { path: compPath } = this.component;
      compPath = compPath.split("/").slice(1); // delete src;
      while (compPath.length !== 0)
        location = location.folder(compPath.shift());
    }
    return location;
  }

  addChildrenComponents(queue) {
    this.component.subComponents.forEach((subComp) => {
      queue.push(this.getComponentByName(subComp));
    });
  }

  async parseAppModule() {
    // Parse app.module.ts first
    this.status = {
      ...this.status,
      message: "Parsing 'app.module.ts'",
      percentage: 5,
    };
    await this.parse("app.module.ts", new AppModuleParser(this));
    await Utilities.sleep(2000);
  }

  async addCssFile(location, name) {
    if (this.archive.hasFile(`${name}.component.css`)) {
      location.file(
        `${Utilities.capitalize(name)}.css`,
        await this.archive.getFile(`${name}.component.css`).async("string")
      );
    }
  }

  async createComponent(location, domTree) {
    const { name: compName } = this.component;
    await location.file(
      `${compName}.js`,
      new ComponentBuilder(domTree, this).createComponent()
    );
    console.log("Create Component Finished");
  }

  async parseComponent(name) {
    // TypeScript File
    let newPercentage = 10 + this.index * this.length;
    let fileName = `${name}.component.ts`;
    this.status = {
      ...this.status,
      message: `Parsing ${fileName}`,
      percentage: newPercentage,
    };
    console.log(newPercentage);

    await Utilities.sleep(2000);
    await this.parse(`${fileName}`, new TypeScriptParser(this));

    // HTML File
    newPercentage = Math.floor(newPercentage + this.length / 4);
    fileName = `${name}.component.html`;
    await Utilities.sleep(2000);
    let domTree = await this.parse(`${fileName}`, new HTMLParser(this));

    this.status = {
      ...this.status,
      message: `Parsing ${fileName}`,
      percentage: newPercentage,
    };
    console.log(newPercentage);

    // Create Component
    newPercentage = Math.floor(newPercentage + this.length / 4);
    this.status = {
      ...this.status,
      message: `Creating ${this.component.name} component`,
      percentage: newPercentage,
    };
    console.log(newPercentage);
    let location = this.getToLocation();
    await Utilities.sleep(2000);
    await this.createComponent(location, domTree);

    // Add the css file
    newPercentage = Math.floor(newPercentage + this.length / 4);
    this.status = {
      ...this.status,
      message: `Adding css file for ${fileName}`,
      percentage: newPercentage,
    };
    console.log(newPercentage);
    await Utilities.sleep(2000);
    await this.addCssFile(location, name);
  }

  async build() {
    new IndexHTMLBuilder(this.folders);
    new IndexJSBuilder(this.folders);

    try {
      await this.parseAppModule();
      this.length = 80 / this.components.length;
      console.log("Length is " + this.length);
      this.updateComponentsPath();

      await this.addGlobalStyle();

      let queue = [this.getComponentByName("App")];

      while (queue.length !== 0) {
        this.component = queue.shift();

        // Mark component as visited
        if (this.component.visited === true) continue;
        else this.component.visited = true;

        // Parse Components
        await this.parseComponent(
          Utilities.componentToSelector(this.component.name)
        );

        // Add children component
        this.addChildrenComponents(queue);
        this.index++;
      }

      if (this.status.isRunning) {
        this.status.percentage = 100;
        this.folders.createArchive();
      }
    } catch (e) {
      console.log(e.stack);
      this.status.isRunning = false;
      throw new Error(e.message);
    }
  }

  async parse(name, parser) {
    const file = this.archive.getFile(name);
    const content = await file.async("string");
    const tokenList = this.tokenizer.getTokenList(content);
    return parser.parse(tokenList);
  }

  cancel() {
    this.status = {
      ...this.status,
      isRunning: false,
    };
  }
}

export default Project;
