export default class Builder { 
    constructor(name, folders) { 
        this.name = name;
        this.folders = folders;
        this.location = folders.root;
        this.text = '';
    }

    createFile() {
        this.location.file(this.name, this.text);
    }
}