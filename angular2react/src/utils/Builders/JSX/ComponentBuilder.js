import Utilities from "../../Classes/Utilities";
import DefaultParameter from "../../Classes/Parameter/DefaultParameter";
import InputParameter from "../../Classes/Parameter/InputParameter";
import OutputParameter from "../../Classes/Parameter/OutputParameter";
import DOMBuilder from "../HTML/DOMBuilder";

class ComponentBuilder {
  constructor(tree, project) {
    this.domBuilder = new DOMBuilder();
    this.component = project.component;
    this.project = project;
    this.tree = tree;
    this.domBuilder.traversal(this.tree);
  }

  createComponent() {
    console.log('Create component called');
    let name = this.component.name;

    let tabs = 2;
    let reactFragment = false;

    let appJs = "";
    const { path: componentPath } = this.component;

    this.component.subComponents.forEach((subComp) => {
      const { path: subComponentPath, name: subComponentName } =
        this.project.getComponentByName(subComp);
      let relativePath = Utilities.getRelativePath(
        subComponentPath,
        componentPath
      );
      if (relativePath[0] !== "..") relativePath.unshift(".");

      appJs += `import ${subComponentName} from '${relativePath.join(
        "/"
      )}/${subComponentName}';\n`;
    });

    console.log(this.component);

    if (this.component.styleUrls.length > 0) {
      appJs += `import './${this.component.name}.css'\n`;
    }

    if (
      this.component.parameters.some(
        (param) => param instanceof DefaultParameter
      )
    ) {
      appJs += "import { useState } from 'react';\n";
    }
    appJs += "\n";
    appJs += `const ${name} = ({`;
    if (this.component.hasNgContent) {
      appJs += " children";
    }
    this.component.parameters
      .filter(
        (param) =>
          param instanceof InputParameter || param instanceof OutputParameter
      )
      .forEach((param) => {
        appJs += ", " + param.name;
        if (param.nickname !== "") {
          appJs += ":" + param.nickname;
        }
      });

    appJs += " }) => {\n";

    this.component.parameters
      .filter((param) => param instanceof DefaultParameter)
      .forEach((param) => {
        appJs += `const [${param.name}, set${Utilities.capitalize(
          param.name
        )}] = useState(${param.initialValue});\n`;
      });

    appJs += "return (\n";
    if (this.tree.children.length > 1) {
      // React Fragment Needed
      tabs = 3;
      reactFragment = true;
      appJs += "    <>\n";
    }
    this.domBuilder.dom.split("\n").forEach((line) => {
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
    console.log(appJs);
    return appJs;
  }
}

export default ComponentBuilder;
