import Utilities from "../../Project/Utilities";
import { Tokenizer } from "../../Tokenizer/Tokenizer";

class DOMBuilder {
  constructor() {
    this.dom = "";
  }

  iterationBegin() {
    if (this.tree.iteration !== null) {
      this.addText("{", "\n");
      this.addEmptySpaces(this.tree.depth, 1);
      const { iterator, iterable } = this.tree.iteration;
      this.addText(iterable, ".map(", iterator, " => ", "{", "\n");
      this.addEmptySpaces(this.tree.depth, 2);
      this.addText("return", " (", "\n");
    }
  }

  iterationEnd() {
    if (this.tree.iteration !== null) {
      this.addEmptySpaces(this.tree.depth, 2);
      this.addText(")", "\n");
      this.addEmptySpaces(this.tree.depth, 1);
      this.addText("}", "\n");
    }
  }

  conditionalBegin() {
    if (this.tree.condition.type === "if") {
      this.removeLastRow();
      this.addEmptySpaces(this.tree.depth - 2);
      this.addText("{", "\n");
      this.addEmptySpaces(this.tree.depth - 1);
      new Tokenizer().getTokenList(this.tree.condition.expr).length >= 3
        ? this.addText("(", this.tree.condition.expr, ") ")
        : this.addText(this.tree.condition.expr, " ");

      this.tree.condition.hasElse
        ? this.addText("?", " (", "\n")
        : this.addText("&&", " (", "\n");

      this.addEmptySpaces(this.tree.depth);
    }
  }

  conditionalEnd() {
    if (this.tree.condition.type !== "") {
      if (this.tree.condition.type === "else") this.removeLastRow();
      this.addEmptySpaces(this.tree.depth - 1);
      this.addText(")");
      if (this.tree.condition.hasElse) {
        this.addText(" ", ":", " ", "(", "\n");
      } else {
        this.addText("\n");
        this.addEmptySpaces(this.tree.depth - 2);
        this.addText("}", "\n");
      }
    }
  }

  tagBegin() {
    this.addText("<", this.tree.name);
  }

  tagEnd() {
    if (this.tree.name !== "ng-template" && this.tree.name !== "") {
      this.addText("</", this.tree.name, ">", "\n");
    }
  }

  ngContent() {
    if (this.tree.name === "ng-content") {
      this.removeLastRow();
      this.addEmptySpaces(this.tree.depth);
      this.addText("{", " children ", "}", "\n");
      return true;
    }
    return false;
  }

  addClasses() {
    if (this.tree.classes.length !== 0) {
      this.addText(" className=", "'");
      this.tree.classes.forEach((c, index) => {
        this.addText(c, index < this.tree.classes.length - 1 ? " " : "");
      });
      this.addText("'");
    }
  }

  addId() {
    if (this.tree.id.name !== "")
      this.addText(" id=", "'", this.tree.id.name, "' ");
  }

  addDefaultAttributes() {
    this.tree.attributes.forEach((attr) =>
      this.addText(" ", attr.name, "=", attr.value, " ")
    );
  }

  addTwoWayBinding() {
    let ngModel = this.tree.ngModel;
    if (ngModel !== null) {
      ngModel = ngModel.slice(1, -1);
      this.addText(" ", "value", "=", "{", ngModel, "}");
      this.addText(
        " ",
        "onChange",
        "=",
        "{",
        "change",
        Utilities.capitalize(ngModel),
        "Handler",
        "}"
      );
    }
  }

  addEvents() {
    const events = this.tree.events;
    events.forEach((ev) => {
      this.addText(" ", ev.name, "={", ev.value, "}");
    })
  }

  addNewLine() {
    if (this.tree.children.length !== 0 || this.tree.selfEnclosed) {
      this.addText("\n");
    }
  }

  traversal(tree) {
    let bindObj = {
      tree: tree,
      addEmptySpaces: this.addEmptySpaces.bind(this),
      addText: this.addText.bind(this),
      removeLastRow: this.removeLastRow.bind(this),
    };
    if (tree.name !== "root") {
      this.addEmptySpaces(tree.depth);
      if (tree.name === "") {
        // Check for replacements
        tree.text = Utilities.replaceParantheses(tree.text);

        // Text between the paragraphs
        this.addText(tree.text, "\n");
      } else {
        this.iterationBegin.bind(bindObj)();
        this.conditionalBegin.bind(bindObj)();
        if (tree.name !== "ng-template") {
          if (this.ngContent.bind(bindObj)()) return;
          this.tagBegin.bind(bindObj)();
          this.addClasses.bind(bindObj)();
          this.addId.bind(bindObj)();
          this.addTwoWayBinding.bind(bindObj)();
          this.addEvents.bind(bindObj)();
          this.addDefaultAttributes.bind(bindObj)();
          if (tree.selfEnclosed) this.addText(" /");
          this.addText(">");
          this.addNewLine.bind(bindObj)();
        } else {
          this.removeLastRow();
        }
      }
    }
    tree.children.forEach((child) => this.traversal(child));
    if (tree.name !== "root") {
      if (tree.selfEnclosed === true) {
        this.addNewLine.bind(bindObj);
        return;
      }
      if (tree.children.length !== 0) this.addEmptySpaces(tree.depth);
      this.tagEnd.bind(bindObj)();
      this.conditionalEnd.bind(bindObj)();
      this.iterationEnd.bind(bindObj)();
    }
  }

  addEmptySpaces(count) {
    for (let i = 0; i < count; i++) this.dom += "  ";
  }

  removeLastRow() {
    this.dom = this.dom.split("\n").slice(0, -1).join("\n") + "\n";
  }

  addText(...strings) {
    strings.forEach((string) => (this.dom += string));
  }
}

export default DOMBuilder;
