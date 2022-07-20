export default class HTMLElement {
  constructor(name, depth) {
    this.name = name;
    this.style = false;
    this.class = false;
    this.id = false;
    this.text = "";
    this.depth = depth;
    this.children = [];
  }
}
