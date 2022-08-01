export default class Utilities {
  static extractLocation(location) {
    const fileName = location.split("/")[-1];
    const filePath = location.slice(0, -1);
    return {
      name: fileName,
      path: filePath,
    };
  }

  static componentToSelector(name) {
    return name
      .split(/(?=[A-Z])/)
      .map((str) => str.toLowerCase())
      .join("-");
  }

  static selectorToComponent(name) {
    return name
      .split("-")
      .slice(1)
      .map((str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      })
      .join("");
  }

  static removeComponent(name) {
    return name
      .split(/(?=[A-Z])/)
      .slice(0, -1)
      .join("");
  }

  static getRelativePath(pathName1, pathName2) {
    let path1 = pathName1.split("/");
    let path2 = pathName2.split("/").reverse();
    console.log("Path1: ");
    console.log(path1);
    console.log("Path2: ");
    console.log(path2);

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

  static capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static replaceParantheses(string) {
    return string.replace(/\{\{([^}}]*)\}\}/g, "{$1}");
  }

  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
