export default class Directors { 
    constructor(name) { 
        this.name = name;
        this.parent = null;
        this.children = [];
        this.files = [];
    }
}