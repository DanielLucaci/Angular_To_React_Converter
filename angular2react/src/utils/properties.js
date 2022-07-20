class Properties {
    constructor() { 
        this.components = [];
        this.imports = [];
        this.providers = [];
    };

    getComponentByName(name) { 
        return this.components.find(c => c.name === name);
    }
}

let properties = new Properties();
export default properties;