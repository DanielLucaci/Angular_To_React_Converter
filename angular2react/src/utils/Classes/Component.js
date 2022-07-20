export default class Component {
    constructor(name) { 
        this.name = name;
        this.selector = '';
        this.templateUrl = '';
        this.styleUrls = [];
        this.subComponents = [];
        this.params = [];
        this.functions = [];
        this.visited = false;
    }
}