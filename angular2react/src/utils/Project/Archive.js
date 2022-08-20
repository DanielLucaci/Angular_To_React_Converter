import JSZip from "jszip";

export class Archive {
  constructor() {
    this.archive = null;
  }

  /**
   * Loads an archive asynchronously.
   * @param {*} archive - the archive with the Angular project  
   */
  async loadArchive(archive) {
    this.archive = await new JSZip().loadAsync(archive);
  }

  /**
   * Checks if the archive contains a specific folder 
   * @param {string} folderName - the name of the folder 
   * @returns - true if the folder was found, false otherwise 
   */
  hasFolder(folderName) {
    const index = Object.entries(this.archive.files).findIndex((folder) => {
      const { dir, name } = folder[1];
      return name.split("/").includes(folderName) && dir === true;
    });
    return index === -1 ? false : true;
  }

  /**
   * Checks if the archive contains a specific file 
   * @param {string} fileName - the name of the file 
   * @returns true if the file was found, false otherwise
   */
  hasFile(fileName) {
    const index = Object.entries(this.archive.files).findIndex((file) => {
      const { dir, name } = file[1];
      return name.split("/").splice(-1)[0] === fileName && dir === false;
    });
    return index === -1 ? false : true;
  }

  /**
   * Searches a file in the archive and returns a reference to it 
   * Throws an error if no file with the specified name was found 
   * @param {string} fileName - the name of the file 
   * @returns A reference to the file 
   */
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

  /**
   * Collects general information about a file and returns it 
   * @param {string} fileName - the name of the file 
   * @returns An object with the collected information  
   */
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

  /**
   * Checks if the archive containing the Angular project is valid, i.e. 
   * it contains the 'App' component and the 'src' folder.
   * @returns true if the aforementioned conditions are met, false otherwise  
   */
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
