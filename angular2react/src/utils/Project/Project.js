import AppModuleParser from "../Parser/AppModule/AppModuleParser";
import HTMLParser from "../Parser/HTML/HTMLParser";
import Utilities from "./Utilities";
import TypeScriptParser from "../Parser/TypeScript/TypeScriptParser";
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
    this.error = "";
    this.archive = archive;
    this.folders = folders;
  }

  getComponentByName(name) {
    return this.components.find((c) => c.name === name);
  }

  sleep(ms) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        this.status.isRunning ? res("") : rej("");
      }, ms);
    });
  }

  updateComponentsPath() {
    this.components.forEach((c) => {
      const { name } = c;

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

  updateStatus(message, percentage) {
    this.status = {
      ...this.status,
      message,
      percentage,
    };
  }

  async addGlobalStyle() {
    this.updateStatus("Adding global styles", 6);
    const file = this.archive.getFile("styles.css");
    if (file !== null)
      this.folders.src.file("index.css", await file.async("string"));
    await this.sleep(500);
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
    this.updateStatus("Parsing 'app.module.ts'", 3);
    await this.sleep(500);
    await this.parse("app.module.ts", new AppModuleParser(this));
  }

  async addCssFile(location, name) {
    if (this.archive.hasFile(`${name}.component.css`)) {
      let newName = name
        .split("-")
        .map((s) => Utilities.capitalize(s))
        .join("");
      location.file(
        `${newName}.css`,
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
  }

  async parseComponent(name) {
    // TypeScript File
    let newPercentage = 10 + this.index * this.length;
    let fileName = `${name}.component.ts`;
    this.updateStatus(`Parsing ${fileName}`, newPercentage);
    await this.sleep(500);
    await this.parse(`${fileName}`, new TypeScriptParser(this));

    // HTML File
    newPercentage = Math.floor(newPercentage + this.length / 4);
    fileName = `${name}.component.html`;
    this.updateStatus(`Parsing ${fileName}`, newPercentage);
    await this.sleep(500);

    let domTree = await this.parse(`${fileName}`, new HTMLParser(this));

    // Create Component
    newPercentage = Math.floor(newPercentage + this.length / 4);
    this.updateStatus(
      `Creating ${this.component.name} component`,
      newPercentage
    );
    let location = this.getToLocation();
    await this.sleep(500);
    await this.createComponent(location, domTree);

    // Add the css file
    newPercentage = Math.floor(newPercentage + this.length / 4);
    this.updateStatus(
      `Adding styling for ${this.component.name}`,
      newPercentage
    );
    await this.sleep(500);
    await this.addCssFile(location, name);
  }

  async build() {
    try {
      // Parse App Module 
      await this.parseAppModule();
      this.length = 80 / this.components.length;
      this.updateComponentsPath();

      // Add Global Styles
      await this.addGlobalStyle();

      // Add App component to the queue
      let queue = [this.getComponentByName("App")];

      // While there are components 
      while (queue.length !== 0) {
        // Extract first component 
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

      this.updateStatus("Creating archive", 90);
      await this.sleep(500);
      if (this.status.isRunning) {
        this.folders.createArchive();
      }

      this.updateStatus("Finished", 100);
      await this.sleep(500);
    } catch (e) {
      this.status.isRunning = false;
      this.error = e.message;
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
      percentage: 0,
      message: "",
      isRunning: false,
    };
  }
}

export default Project;
