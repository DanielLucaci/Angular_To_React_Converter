import Parser from "../Parser";
import Stack from "../../Stack";
import Utilities from "../../Utilities";
import properties from "../../properties";
import defaultHTMLElements from "./defaultElements";
import HTMLElement from "./HTMLElement";

export default class HTMLParser extends Parser {
  constructor(component) {
    super();
    this.depth = 0;
    this.component = component;
    this.root = new HTMLElement("root", -1);
    this.element = this.root;
    this.stack = new Stack();
    this.stack.push(this.root);
  }

  parse(tokenList) {
    this.init(tokenList);
    this.HTMLelement();

    return this.root;
  }

  html() {
    this.check("html");
  }

  stop() {
    this.stack.pop();
    if (!this.stack.isEmpty()) {
      throw new Error(`Invalid element ${this.stack.peek().name}`);
    }
  }

  createNewElement() {
    return new HTMLElement(this.sym, this.depth);
  }

  HTMLelement() {
    this.check("<");
    switch (this.sym) {
      case "!": // !DOCTYPE html
        this.doctype();
        break;
      case "/": // End of element
        this.endOfElement();
        break;
      default: //  New Element found
        this.newElementFound();
        break;
    }

    this.elementProps();

    switch (this.sym) {
      case ">": // element ending;
        this.check(">");
        break;
      case "/":
        this.stack.pop();
        this.depth--;
        this.check("/");
        this.check(">");
        break;
      default:
        break;
    }
    if (this.tokens.length === 0) {
      this.stop();
      return;
    }
    switch (this.sym) {
      case "<":
        this.HTMLelement();
        break;
      default:
        this.content();
        break;
    }
  }

  class() {
    this.check("class");
    this.check("=");
    this.stack.peek().class = this.sym;
    this.next();
  }

  id() {
    this.check("id");
    this.check("=");
    this.stack.peek().id = this.sym;
    this.next();
  }

  elementProps() {
    switch (this.sym) {
      case "class":
        this.class();
        break;
      case "id":
        this.id();
        break;
      default:
        break;
    }
  }

  content() {
    const obj = new HTMLElement("", this.depth);
    this.stack.peek().children.push(obj);
    this.stack.push(obj);
    this.depth++;
    while (this.sym !== "<" && this.tokens.length >= 0) {
      this.stack.peek().text += this.sym;
      let offset = this.column + this.sym.length;
      this.check(this.sym);

      for (let i = 0; i < this.column - offset; i++) {
        this.stack.peek().text += " ";
      }
    }

    this.stack.pop();
    this.depth--;

    if (this.tokens.length !== 0) {
      this.HTMLelement();
    } else {
      this.stop();
    }
  }

  // DOCTYPE
  doctype() {
    this.check("!");
    switch (this.sym) {
      case "DOCTYPE":
      case "doctype":
        this.next();
        this.html();
        break;
      default:
        break;
    }
  }

  // End Of Element
  endOfElement() {
    this.check("/");
    this.depth--;
    if (this.sym === "app") {
      this.check("app");
      this.stack
        .peek()
        .name.split("-")
        .slice(1)
        .forEach((s) => {
          this.check("-");
          this.check(s);
        });
    } else {
      this.check(this.stack.peek().name);
    }
    this.stack.pop();
  }

  // New Element Found
  newElementFound() {
    // Custom component found
    if (this.sym === "app") {
      this.next();
      let tagName = "app";
      while (this.sym === "-") {
        this.next();
        tagName += "-" + this.sym;
        this.next();
      }
      const compName = Utilities.selectorToComponent(tagName);
      const comp = properties.components.find((c) => c.name === compName);

      // Child component not found
      if (comp === null) throw new Error("Unknown component found " + this.sym);
      // Child component exists
      else this.component.subComponents.push(compName);

      this.sym = tagName;

      // Default HTML element
    } else {
      // Check if the element exists
      if (!defaultHTMLElements.includes(this.sym))
        throw new Error("Unknown tag found" + this.sym);
    }
    const obj = this.createNewElement();
    this.stack.peek().children.push(obj);
    this.stack.push(obj);
    this.next();
    this.depth++;
  }
}
