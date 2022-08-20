import Utilities from "../../Project/Utilities";
import { Tokenizer } from "../../Tokenizer/Tokenizer";
import TextBuilder from "../TextBuilder";

class DOMBuilder {
  constructor() {
    this.textBuilder = new TextBuilder();
  }

  get text() { 
    return this.textBuilder.text;
  }

  iterationBegin() {
    if (this.tree.iteration !== null) {
      this.textBuilder.add("{\n").addEmptySpaces(this.tree.depth + 1);
      const { iterator, iterable } = this.tree.iteration;
      this.textBuilder
        .add(iterable, ".map((", iterator, ", index) => {\n")
        .addEmptySpaces(this.tree.depth + 2)
        .add("return (\n");
    }
  }

  iterationEnd() {
    if (this.tree.iteration !== null) {
      this.textBuilder
        .addEmptySpaces(this.tree.depth + 2)
        .add(")\n")
        .addEmptySpaces(this.tree.depth + 1)
        .add("})}\n");
    }
  }

  conditionalBegin() {
    if (this.tree.condition.type === "if") {
      this.textBuilder
        .removeLastRow()
        .addEmptySpaces(this.tree.depth - 2)
        .add("{\n")
        .addEmptySpaces(this.tree.depth - 1);
      new Tokenizer().getTokenList(this.tree.condition.expr).length >= 3
        ? this.textBuilder.add("(", this.tree.condition.expr, ") ")
        : this.textBuilder.add(this.tree.condition.expr, " ");

      this.tree.condition.hasElse
        ? this.textBuilder.add("?", " (", "\n")
        : this.textBuilder.add("&&", " (", "\n");

      this.textBuilder.addEmptySpaces(this.tree.depth);
    }
  }

  conditionalEnd() {
    if (this.tree.condition.type !== "") {
      if (this.tree.condition.type === "else") this.textBuilder.removeLastRow();
      this.textBuilder.addEmptySpaces(this.tree.depth - 1).add(")");
      if (this.tree.condition.hasElse) {
        this.textBuilder.add(" : (\n");
      } else {
        this.textBuilder
          .add("\n")
          .addEmptySpaces(this.tree.depth - 2)
          .add("}\n");
      }
    }
  }

  tagBegin() {
    this.textBuilder.add("<", this.tree.name);
  }

  tagEnd() {
    if (this.tree.name !== "ng-template" && this.tree.name !== "") {
      this.textBuilder.add("</", this.tree.name, ">\n");
    }
  }

  ngContent() {
    if (this.tree.name === "ng-content") {
      this.textBuilder
        .removeLastRow()
        .addEmptySpaces(this.tree.depth)
        .add("{ children }\n");
      return true;
    }
    return false;
  }

  addClasses() {
    if (this.tree.classes.length !== 0) {
      this.textBuilder.add(" className='");
      this.tree.classes.forEach((c, index) => {
        this.textBuilder.add(c, index < this.tree.classes.length - 1 ? " " : "");
      });
      this.textBuilder.add("'");
    }
  }

  addId() {
    if (this.tree.id.name !== "")
      this.textBuilder.add(" id='", this.tree.id.name, "'");
  }

  addDefaultAttributes() {
    this.tree.attributes.forEach((attr) => {
      if (attr.name === "for") attr.name = "htmlFor";
      this.textBuilder.add(" ", attr.name, "=", attr.value, " ");
    });
  }

  addTwoWayBinding() {
    let ngModel = this.tree.ngModel;
    if (ngModel !== null) {
      ngModel = ngModel.slice(1, -1);
      this.textBuilder
        .add(" value={", ngModel, "}")
        .add(" onChange={change", Utilities.capitalize(ngModel), "Handler}");
    }
  }

  addEvents() {
    const events = this.tree.events;
    events.forEach((ev) => {
      this.textBuilder.add(" ", ev.name, "={", ev.value, "}");
    });
  }

  addNewLine() {
    if (this.tree.children.length !== 0 || this.tree.selfEnclosed) {
      this.textBuilder.add("\n");
    }
  }

  bindFunctions(bindObj) {
    return { 
      addClasses: this.addClasses.bind(bindObj),
      addDefaultAttributes: this.addDefaultAttributes.bind(bindObj),
      addEvents: this.addEvents.bind(bindObj),
      addId: this.addId.bind(bindObj),
      addNewLine: this.addNewLine.bind(bindObj),
      addTwoWayBinding: this.addTwoWayBinding.bind(bindObj),
      conditionalBegin: this.conditionalBegin.bind(bindObj),
      conditionalEnd: this.conditionalEnd.bind(bindObj),
      iterationBegin: this.iterationBegin.bind(bindObj),
      iterationEnd: this.iterationEnd.bind(bindObj),
      ngContent: this.ngContent.bind(bindObj),
      tagBegin: this.tagBegin.bind(bindObj),
      tagEnd: this.tagEnd.bind(bindObj),
    }
  }

  traversal(tree) {
    const f = this.bindFunctions({
      textBuilder: this.textBuilder,
      tree: tree,
    });
    if (tree.name !== "root") {
      this.textBuilder.addEmptySpaces(tree.depth);
      if (tree.name === "") {
        // Check for replacements
        tree.text = Utilities.replaceParantheses(tree.text);

        // Text between the paragraphs
        this.textBuilder.add(tree.text, "\n");
      } else {
        f.iterationBegin();
        f.conditionalBegin();
        if (tree.name !== "ng-template") {
          if (f.ngContent()) return;
          f.tagBegin();
          f.addClasses();
          f.addId();
          f.addTwoWayBinding();
          f.addEvents();
          f.addDefaultAttributes();
          if (tree.selfEnclosed) this.textBuilder.add(" /");
          this.textBuilder.add(">");
          f.addNewLine();
        } else {
          this.textBuilder.removeLastRow();
        }
      }
    }
    tree.children.forEach((child) => this.traversal(child));
    if (tree.name !== "root") {
      if (tree.selfEnclosed === true) {
        f.addNewLine();
        return;
      }
      if (tree.children.length !== 0) this.textBuilder.addEmptySpaces(tree.depth);
      f.tagEnd();
      f.conditionalEnd();
      f.iterationEnd();
    }
  }
}

export default DOMBuilder;
