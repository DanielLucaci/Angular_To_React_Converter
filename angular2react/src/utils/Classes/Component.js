export default class Component {
  constructor(name) {
    this.name = name;
    this.selector = "";
    this.templateUrl = "";
    this.path = "";
    this.styleUrls = [];
    this.subComponents = [];
    this.parameters = [];
    this.functions = [];
    this.visited = false;
    this.hasNgContent = false;
  }
}
