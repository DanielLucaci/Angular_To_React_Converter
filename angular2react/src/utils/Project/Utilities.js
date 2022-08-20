export default class Utilities {
  /**
   * Extracts the filename and the filepath for a specific location
   * @param {string} location - The full location of a file 
   * @returns An object with the name and the path of the file 
   */
  static extractLocation(location) {
    const fileName = location.split("/")[-1];
    const filePath = location.slice(0, -1);
    return {
      name: fileName,
      path: filePath,
    };
  }

  /**
   * Transforms the name of a React selector (PascalCase) to a Angular specific name (with '-' between individual word)
   * @param {string} name - The name of the component 
   * @returns The corresponding name of the Angular component 
   */
  static componentToSelector(name) {
    return name
      .split(/(?=[A-Z])/)
      .map((str) => str.toLowerCase())
      .join("-");
  }

  /**
   * Transforms the name of an Angular selector to PascalCase 
   * @param {string} name - The name of the selector
   * @returns The corresponding PascalCase identifier  
   */
  static selectorToComponent(name) {
    return name
      .split("-")
      .slice(1)
      .map((str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      })
      .join("");
  }

  /**
   * Removes the 'Component' ending from a React component . E.g. AppComponent -> App 
   * @param {name} name - The name of the component  
   * @returns The corresponding name without the 'Component' ending 
   */
  static removeComponent(name) {
    return name
      .split(/(?=[A-Z])/)
      .slice(0, -1)
      .join("");
  }

  /**
   * Computes the relative path from the first path to the second path
   * E.g. If pathName1 = 'src/components/header' and pathName2 = 'src/app' it returns ['..', '..', 'app']; 
   * @param {string} pathName1 - The first path  
   * @param {string} pathName2 - The second path 
   * @returns An array representing the relative path 
   */
  static getRelativePath(pathName1, pathName2) {
    let path1 = pathName1.split("/");
    let path2 = pathName2.split("/").reverse();

    let location = path2.shift();
    let found = path1.includes(location);
    let path = [];
    while (!found) {
      path.push("..");
      location = path2.shift();
      found = path1.includes(location);
    }

    return path.concat(path1.slice(path2.length + 1));
  }

  /**
   * Capitalizes a string.
   * @param {name} string - The string to be capitalized  
   * @returns The corresponding capitalized string 
   */
  static capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * Uses regex to transform double brackets to single brackets.
   * E.g. if the string is '{{ this.price }}' it returns '{ this.price }'
   * With other words this function transforms Angular binding to React binding   
   * @param {*} string - The string to be transformed 
   * @returns The transformed string 
   */
  static replaceParantheses(string) {
    return string.replace(/\{\{([^}}]*)\}\}/g, "{$1}");
  }
}
