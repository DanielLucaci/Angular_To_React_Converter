import Parser from "../Parser";
import Stack from "../../Classes/Stack";
import Utilities from "../../Classes/Utilities";
import defaultHTMLElements from "./utils/defaultElements";
import HTMLElement from "./utils/HTMLElement";
import HTMLClass from "./utils/HTMLClass";
import HTMLStyle from "./utils/HTMLStyle";
import Token from "../../Tokenizer/Token";

export default class HTMLParser extends Parser {
  constructor(project) {
    super();
    this.depth = 0;
    this.component = project.component;
    this.root = new HTMLElement("root", -1);
    this.element = this.root;
    this.stack = new Stack();
    this.label = "";
    this.project = project;
  }

  parse(tokenList) {
    this.init(tokenList);
    this.stack.push(this.root);
    this.HTML_ELEMENT();
    return this.root;
  }

  addNewClass(htmlClass) {
    this.stack.peek().classes.push(htmlClass);
  }

  addElementOnTheStack(element) {
    this.stack.peek().children.push(element);
    this.stack.push(element);
  }

  extractElementFromStack() {
    this.stack.pop();
    this.element = this.stack.peek();
  }

  HTML() {
    this.check("html");
  }

  stop() {
    this.stack.pop();
    if (!this.stack.isEmpty()) {
      throw new Error(`Invalid element ${this.stack.peek().name}`);
    }
  }

  createNewElement(name) {
    return new HTMLElement(name, this.depth);
  }

  incrementDepth(depth = 1) {
    this.depth += depth;
  }

  decrementDepth(depth = 1) {
    this.depth -= depth;
  }

  HTML_ELEMENT() {
    this.TAG_BEGINNING();
    this.TAG_ENDING();
    if (this.tokens.length === 0) {
      this.stop();
      return;
    }
    switch (this.sym) {
      case "<":
        this.HTML_ELEMENT();
        break;
      default:
        this.CONTENT();
        break;
    }
  }

  TAG_BEGINNING() {
    this.check("<");
    switch (this.sym) {
      case "!": // !DOCTYPE html
        this.DOCTYPE();
        break;
      case "/": // End of element
        this.END_OF_ELEMENT();
        break;
      default: //  New Element found
        this.NEW_ELEMENT_FOUND();
        break;
    }
  }

  TAG_ENDING() {
    switch (this.sym) {
      case ">": // element ending;
        this.check(">");
        break;
      case "/":
        this.stack.pop();
        this.decrementDepth();
        this.element.selfEnclosed = true;
        this.check("/", ">"); // self enclosed element
        break;
      default:
        break;
    }
  }

  CLASS() {
    this.check("class", "=");
    this.sym
      .slice(1, -1)
      .split(" ")
      .forEach((c) => this.addNewClass(c));
    this.next();
  }

  ID() {
    this.check("id", "=");
    this.stack.peek().id = this.sym.slice(1, -1);
    this.next();
  }

  STYLE() {
    this.check("style", "=");
    for (let s of this.sym.slice(1, -1).split(";")) {
      let style = new HTMLStyle();
      let [property, value] = s.replace(/\s/g, "").split(":");
      property = property.slice(1, -1);
      if (property.includes("-")) {
        let newProperty = "";
        property = property.split("-");
        if (property[0] === "-") {
          property.shift();
        }
        newProperty = property.shift();
        for (let props of property) {
          newProperty += props.capitalize();
        }
        style.property = newProperty;
      } else {
        style.property = property;
      }
      style.value = value;
      this.element.styles.push(style);
    }
    this.next();
  }

  CONTENT() {
    this.addElementOnTheStack(new HTMLElement("", this.depth));

    this.incrementDepth();
    while (this.sym !== "<" && this.tokens.length >= 0) {
      this.stack.peek().appendText(this.sym);
      let offset = this.column + this.sym.length;
      this.check(this.sym);

      for (let i = 0; i < this.column - offset; i++) {
        this.stack.peek().appendText(" ");
      }
    }

    this.stack.pop();
    this.decrementDepth();

    this.tokens.length !== 0 ? this.HTML_ELEMENT() : this.stop();
  }

  DOCTYPE() {
    this.check("!");
    switch (this.sym) {
      case "DOCTYPE":
      case "doctype":
        this.next();
        this.HTML();
        break;
      default:
        break;
    }
  }

  END_OF_ELEMENT() {
    this.check("/");
    switch (this.sym) {
      case "app":
        this.END_OF_CHILD_COMPONENT();
        this.decrementDepth();
        break;
      case "ng":
        this.END_OF_NG_ELEMENT();
        break;
      default:
        this.check(this.stack.peek().name);
        if (this.element.condition.type !== "") this.decrementDepth(3);
        else this.decrementDepth();
        break;
    }
    this.extractElementFromStack();
  }

  END_OF_CHILD_COMPONENT() {
    this.check("app");
    let name = this.stack.peek().name;
    name = "app-" + Utilities.componentToSelector(name);
    name
      .split("-")
      .slice(1)
      .forEach((s) => this.check("-", s));
  }

  END_OF_NG_ELEMENT() {
    this.check("ng", "-"); // ng-template
    switch (this.sym) {
      case "template":
        this.next();
        if (this.label === this.element.label) this.label = "";
        this.decrementDepth(2);
        break;
      case "content":
        this.next();
        this.decrementDepth();
        break;
      default:
        throw new Error(
          `Unknown symbol ${this.sym} at line ${this.line}, column ${this.column}. Expected 'template' or 'content'`
        );
    }
  }

  NEW_ELEMENT_FOUND() {
    let tagName = "";
    switch (this.sym) {
      case "app":
        tagName = this.CHILD_COMPONENT();
        break;
      case "ng":
        tagName = this.NG_ELEMENT();
        break;
      default:
        tagName = this.DEFAULT_ELEMENT();
        break;
    }

    if (!tagName.startsWith("ng")) {
      this.addElementOnTheStack(this.createNewElement(tagName));
      this.element = this.stack.peek();
    }

    if (tagName !== "ng-template") {
      this.incrementDepth();
    }
    this.ATTRIBUTES();
  }

  ATTRIBUTES() {
    for (;;) {
      if (this.sym === "/" || this.sym === ">") {
        break;
      }
      switch (this.sym) {
        case "id":
          this.ID();
          break;
        case "class":
          this.CLASS();
          break;
        case "style":
          this.STYLE();
          break;
        case "[": // Property binding or two-way binding
          this.PROPERTY_BINDING();
          break;
        case "(": // Event Binding
          this.EVENT_BINDING();
          break;
        case "*": // Directives
          this.check("*");
          if (this.sym === "ngIf") this.NG_IF();
          else if (this.sym === "ngFor") this.NG_FOR();
          else
            throw new Error(
              `Unknown directive found ${this.sym}. Expected 'ngIf' or 'ngFor'`
            );
          break;
        default: // Default HTML Attribute
          this.DEFAULT_ATTR();
          break;
      }
    }
  }

  CHILD_COMPONENT() {
    let tagName;
    this.check("app");
    tagName = "app";
    while (this.sym === "-") {
      this.next();
      tagName += "-" + this.sym;
      this.next();
    }
    const compName = Utilities.selectorToComponent(tagName);
    const comp = this.project.getComponentByName(compName);

    // Child component not found
    if (comp === null) throw new Error("Unknown component found " + this.sym);
    // Child component exists
    else {
      this.component.subComponents.push(compName);
      tagName = compName;
    }
    return tagName;
  }

  DEFAULT_ELEMENT() {
    let tagName = this.sym;

    // Check if the element exists
    if (!defaultHTMLElements.includes(this.sym)) {
      throw new Error("Unknown tag found" + this.sym);
    } else {
      this.next();
    }
    return tagName;
  }

  NG_ELEMENT() {
    this.check("ng", "-");
    switch (this.sym) {
      case "template": // ng-template
        this.NG_TEMPLATE();
        return "ng-template";
      case "content": // ng-content
        this.NG_CONTENT();
        return "ng-content";
      default:
        throw new Error(
          `Unknown token ${this.sym} found at line ${this.line}, column ${this.column}. Expected 'template' or 'content'`
        );
    }
  }

  NG_TEMPLATE() {
    this.check("template", "#", this.label);
    this.incrementDepth(2);
    this.element.depth++;
    this.addElementOnTheStack(this.createNewElement("ng-template"));
    this.element = this.stack.peek();
    this.element.label = this.label;
    this.element.condition.type = "else";
  }

  NG_CONTENT() {
    this.check("content");
    this.addElementOnTheStack(this.createNewElement("ng-content"));
    this.element = this.stack.peek();
    this.component.hasNgContent = true;
    this.incrementDepth();
  }

  DEFAULT_ATTR() {
    let attrName = this.sym;
    this.next();
    this.check("=");
    let attrValue = this.sym;
    this.element.attributes.push({
      name: attrName,
      value: attrValue,
    });
    this.next();
  }

  PROPERTY_BINDING() {
    switch (this.sym) {
      case "ngStyle":
        this.NG_STYLE();
        break;
      case "ngClass":
        this.NG_CLASS();
        break;
      default: // any random property
        break;
    }
  }

  NG_STYLE() {
    this.check("ngStyle", "]", "=");

    let styles = this.sym.slice(1, -1).replace(/\s/g, "").split(",");
    for (let s of styles) {
      let style = new HTMLStyle();
      let [property, value] = s.replace(/\s/g, "").split(":");
      property = property.slice(1, -1);
      if (property.includes("-")) {
        let newProperty = "";
        property = property.split("-");
        if (property[0] === "-") {
          property.shift();
        }
        newProperty = property.shift();
        for (let props of property) {
          newProperty += props.capitalize();
        }
        style.property = newProperty;
      } else {
        style.property = property;
      }
      style.value = value;
      this.element.styles.push(style);
    }
  }

  NG_CLASS() {
    this.check("ngClass", "]", "=");
    switch (this.sym[0]) {
      case "[": //Array of classes
        this.ARRAY_OF_CLASSES();
        break;
      case "{": // Object of classes
        this.OBJECT_OF_CLASSES();
        break;
      case "'": // default classes
        this.DEFAULT_CLASS_ENUM();
        break;
      default:
        break;
    }
  }

  ARRAY_OF_CLASSES() {
    let classArray = this.sym.slice(1, -1).split(",");
    classArray.forEach((className) => {
      let newClass = new HTMLClass();
      newClass.name = className;
      this.element.classes.push(newClass);
    });
    this.next();
  }

  OBJECT_OF_CLASSES() {
    let classArray = this.sym.slice(1, -1).split(",");
    classArray.forEach((classes) => {
      const [name, condition] = classes.split(":");
      let newClass = new HTMLClass();
      newClass.name = name;
      newClass.condition = condition;
      this.element.classes.push(newClass);
    });
    this.next();
  }

  DEFAULT_CLASS_ENUM() {
    let classArray = this.sym.slice(1, -1).split(" ");
    classArray.forEach((className) =>
      this.element.classes.push(new HTMLClass(className))
    );
    this.next();
  }

  EVENT_BINDING() {}

  NORMAL_ATTR() {}

  NG_IF() {
    this.element.condition = {};
    this.check("ngIf", "=");

    let condition = this.sym;
    condition = condition.slice(1, -1).split(";");
    const ifCond = condition[0];
    let elseCond = "";
    try {
      elseCond = condition[1]
        .split(" ")
        .filter((token) => token !== "")
        .map((token) => new Token({ name: token }));
    } catch (e) {}

    this.element.depth += 2;
    this.incrementDepth(2);
    this.element.condition.type = "if";
    this.element.condition.expr = ifCond;
    if (elseCond !== "") {
      this.tokens.unshift(...elseCond);
      this.next();
      this.check("else");
      this.element.condition.hasElse = true;

      // Extract label
      this.tokens.unshift(new Token({ name: this.sym.slice(1) }));
      this.tokens.unshift(new Token({ name: this.sym[0] }));

      this.next();
      this.check("#");
      this.label = this.sym;
      this.next();
    }
  }

  NG_FOR() {
    this.check("ngFor", "=");
    this.sym
      .slice(1, -1)
      .split(";")
      .forEach((slice) => {
        slice
          .split(" ")
          .reverse()
          .forEach((token) => {
            this.tokens.unshift(new Token({ name: token }));
          });
      });

    this.element.iteration = {};
    this.next();
    this.check("let");
    this.element.iteration.iterator = this.sym;
    this.next();
    this.check("of");
    this.element.iteration.iterable = this.sym;
    this.next();
  }
}
