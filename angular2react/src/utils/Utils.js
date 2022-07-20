import { Tokenizer } from "./Tokenizer/Tokenizer";
import JSZip from "jszip";
import properties from "./properties";
import AppModuleParser from "./Parser/AppModule/AppModuleParser";
import HTMLParser from "./Parser/HTML/HTMLParser";
import Utilities from "./Utilities";
import Directors from "./Directors";

export class Archive {
  constructor(folders) {
    this.tokenizer = new Tokenizer();
    this.component = null;
    this.urlTree = null;
    this.folder = folders;
    this.text = "";
    this.dirTree = new Directors("src");
    this.archive = null;
    this.location = null;
  }

  traversal(tree) {
    if (tree.name !== "root") {
      for (let i = 0; i < tree.depth; i++) this.text += "  ";
      if (tree.name === "") {
        // Text between the paragraphs
        this.text += tree.text + "\n";
      } else {
        this.text += "<" + tree.name;
        if (tree.class !== false) {
          this.text += " className=" + tree.class;
        }
        if (tree.id !== false) this.text += " id=" + tree.id + " ";
        this.text += ">";
        if (tree.children.length !== 0) {
          this.text += "\n";
        }
      }
    }
    tree.children.forEach((child) => this.traversal(child));
    if (tree.name !== "root") {
      if (tree.children.length !== 0) {
        for (let i = 0; i < tree.depth; i++) this.text += "  ";
      }
      if (tree.name !== "") this.text += "</" + tree.name + ">\n";
    }
  }

  async compute() {
    // Parse app.module.ts first
    await this.parse("app.module.ts", new AppModuleParser());

    // Iterate over every file and add their path
    this.dirTree.children.push(new Directors("src"));

    properties.components.forEach((c) => {
      const { name } = c;

      // Get the coresponding path;
      let { path } = this.getFileInfo(
        `${Utilities.componentToSelector(name)}.component.html`
      );

      (path = path.split("/"))[1] = "components";
      c.path = path.join("/");
    });

    this.component = properties.getComponentByName("App");
    this.component.visited = true;

    // Parse AppComponent
    await this.parse("app.component.html", new HTMLParser(this.component));
    this.traversal(this.urlTree);
    console.log(this.text);
    /*
    // Construct App.js
    this.folder.src.file("App.js", this.createComponent("App.js"));
    if (this.hasFile("app.component.css")) {
      this.folder.src.file(
        "App.modules.css",
        await this.getFile("app.component.css").async("string")
      );
    }
    this.text = "";

    // Add global class
    const file = this.getFile("styles.css");
    if (file !== null)
      this.folder.src.file("index.css", await file.async("string"));

    let order = [];
    // Add the direct children of app.js
    this.component.subComponents.forEach((subComp) => {
      order.push(properties.getComponentByName(subComp));
    });

    while (order.length !== 0) {
      // there are still components left
      // Extract current component;
      this.component = order.shift();

      // The component has already been parsed
      if (this.component.visited === true) continue;
      this.component.visited = true;

      let name = Utilities.componentToSelector(this.component.name);

      //await this.parse(`${name}.component.ts`, new TypeScriptParser());
      await this.parse(
        `${name}.component.html`,
        new HTMLParser(this.component)
      );

      this.traversal(this.urlTree);

      // Get to the location
      let location = this.folder.src;

      let { name: compName, path: compPath } = this.component;
      compPath = compPath.split("/").slice(1); // delete src;
      while (compPath.length !== 0)
        location = location.folder(compPath.shift());

      location.file(`${compName}.js`, this.createComponent(compName));

      // Check if there is any css file
      if (this.hasFile(`${name}.component.css`)) {
        location.file(
          `${name.toUpperCase()}.modules.css`,
          await this.getFile(`${name}.component.css`).async("string")
        );
      }

      this.component.subComponents.forEach((subComp) => {
        order.push(properties.getComponentByName(subComp));
      });
    }
    this.folder.createArchive();
    */
  }

  async parse(name, parser) {
    const file = this.getFile(name);
    const content = await file.async("string");
    this.urlTree = parser.parse(this.tokenizer.getTokenList(content));
  }

  async loadArchive(archive) {
    const jszip = new JSZip();
    this.archive = await jszip.loadAsync(archive);
  }

  createComponent(name) {
    let tabs = 2;
    let reactFragment = false;

    let appJs = "";
    const { path: componentPath } = this.component;

    this.component.subComponents.forEach((subComp) => {
      const { path: subComponentPath, name: subComponentName } =
        properties.getComponentByName(subComp);
      let relativePath = Utilities.getRelativePath(
        subComponentPath,
        componentPath
      );
      if (relativePath[0] !== "..") relativePath.unshift(".");

      appJs += `import ${subComponentName} from ${relativePath.join("/")};`;
    });

    appJs += `const ${name} = () => {\n  return (\n`;
    if (this.urlTree.children.length > 1) {
      // React Fragment Needed
      tabs = 3;
      reactFragment = true;
      appJs += "    <>\n";
    }
    this.text.split("\n").forEach((line) => {
      for (let i = 0; i < tabs; i++) appJs += "  ";
      appJs += line + "\n";
    });
    appJs = appJs.slice(0, -tabs - 1);
    if (reactFragment === true) {
      appJs += "  </>\n";
    }
    appJs += "  );\n";
    appJs += "}\n\n";
    appJs += `export default ${name};`;
    return appJs;
  }

  createTree() {
    // const files = this.orderByDepth();
    // files.forEach((file) => {
    //   const { name, parent, isDirectory } = this.getFileInfo(file.name);
    //   const { directories: dirs } = this.directoryTree;
    //   if (isDirectory) {
    //     // is a directory
    //     dirs.push(name);
    //     this.directoryTree[name] = {
    //       children: [],
    //       parent: parent,
    //       files: [],
    //     };
    //     this.directoryTree[parent].children.push(name);
    //   } else {
    //     // is a file
    //     this.directoryTree[parent].files.push(name);
    //   }
    // });
  }

  getDepth(file) {
    return file.name.split("/").length;
  }

  orderByDepth() {
    return Object.entries(this.archive.files)
      .map((file) => file[1])
      .sort((file1, file2) => {
        const depth1 = this.getDepth(file1);
        const depth2 = this.getDepth(file2);
        if (depth1 > depth2) {
          return 1;
        } else if (depth1 === depth2) {
          return 0;
        } else {
          return -1;
        }
      });
  }

  hasFolder(folderName) {
    const index = Object.entries(this.archive.files).findIndex((folder) => {
      const { dir, name } = folder[1];
      return name.split("/").includes(folderName) && dir === true;
    });
    return index === -1 ? false : true;
  }

  hasFile(fileName) {
    const index = Object.entries(this.archive.files).findIndex((file) => {
      const { dir, name } = file[1];
      return name.split("/").splice(-1)[0] === fileName && dir === false;
    });
    return index === -1 ? false : true;
  }

  getFileName(file) {
    return file.name.split("/").slice(-1);
  }

  getFileParent(file) {
    return file.name.split("/").slice(-2, -1) || "root";
  }

  getFile(fileName) {
    if (this.hasFile(fileName) === false) {
      throw new Error("File couldn't be found!");
    }
    const file = Object.entries(this.archive.files).find((file) => {
      const { dir, name } = file[1];
      return name.split("/").splice(-1)[0] === fileName && dir === false;
    })[1];
    return file;
  }

  getFolder(folderName) {
    if (this.hasFolder(folderName) === false) {
      throw new Error("Folder couldn't be found");
    }
    const folder = Object.entries(this.archive.files).find((f) => {
      const { dir, name } = f[1];
      return name.split("/").splice(-1)[0] === folderName && dir === true;
    })[1];
    return folder;
  }

  getFilesInFolder(folderName, type = null) {
    if (this.hasFolder(folderName) === false) {
      throw new Error("Couldn't find folder");
    }
  }

  getFileInfo(fileName) {
    let file = this.getFile(fileName);
    let data = file.name.split("/");
    if (file.dir) {
      data = data.slice(0, -1);
    }
    const name = data.slice(-1)[0];
    const path = data.slice(0, -1).join("/");
    const format = name.split(".").slice(-1)[0];
    const parent = data.slice(-2, -1)[0] || "root";
    const isDirectory = file.dir;
    return {
      name,
      path,
      format,
      parent,
      isDirectory,
    };
  }

  isValid() {
    let requiredFiles = [
      "app.component.html",
      "app.component.ts",
      "app.module.ts",
    ];
    requiredFiles.forEach((file) => {
      if (!this.hasFile(file)) {
        throw new Error(`File ${file} is missing`);
      }
    });
    if (!this.hasFolder("src")) {
      throw new Error('Folder "src" is missing');
    }
    return true;
  }
}
