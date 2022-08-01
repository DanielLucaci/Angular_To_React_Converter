import HTMLId from "./HTMLId";

export default class HTMLElement {
  constructor(name, depth) {
    this.name = name;
    this.styles = [];
    this.classes = [];
    this.attributes = [];
    this.id = new HTMLId();
    this.text = "";
    this.depth = depth;
    this.children = [];
    this.iteration = null;
    this.selfEnclosed = false;
    this.condition = {
      expr: "",
      type: "",
      hasElse: false,
    };
    this.label = "";
  }

  appendText(newText) {
    this.text += newText;
  }
}
