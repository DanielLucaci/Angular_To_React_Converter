export default class Component {
  constructor(name) {
    this.name = name;
    this.path = "";
    this.styleUrls = [];
    this.subComponents = [];
    this.attributes = [];
    this.functions = [];
    this.ngModel = [];
    this.visited = false;
    this.hasConstructor = false;
    this.hasNgContent = false;
  }
}
