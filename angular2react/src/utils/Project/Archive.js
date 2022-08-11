import JSZip from "jszip";

export class Archive {
  constructor() {
    this.archive = null;
  }

  async loadArchive(archive) {
    this.archive = await new JSZip().loadAsync(archive);
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

  // getFileName(file) {
  //   return file.name.split("/").slice(-1);
  // }

  // getFileParent(file) {
  //   return file.name.split("/").slice(-2, -1) || "root";
  // }

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

  // getFolder(folderName) {
  //   if (this.hasFolder(folderName) === false) {
  //     throw new Error("Folder couldn't be found");
  //   }
  //   const folder = Object.entries(this.archive.files).find((f) => {
  //     const { dir, name } = f[1];
  //     return name.split("/").splice(-1)[0] === folderName && dir === true;
  //   })[1];
  //   return folder;
  // }

  // getFilesInFolder(folderName, type = null) {
  //   if (this.hasFolder(folderName) === false) {
  //     throw new Error("Couldn't find folder");
  //   }
  // }

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
