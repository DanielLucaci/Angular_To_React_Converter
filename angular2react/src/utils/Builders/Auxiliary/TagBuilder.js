class TagBuilder {
  constructor() {
    this.text = "";
  }

  addTag(tag) {
    if (tag.isDoctype) {
      this.text = "<!DOCTYPE html>\n";
      return this;
    }

    for (let i = 0; i < tag.tabs || 0; i++) this.text += "\t";

    if (tag.isClosed) {
      this.text += `</${tag.name}>\n`;
      return this;
    }

    this.text += `<${tag.name}`;
    const { properties: props } = tag;
    for (let prop in props) {
      this.text += ` ${prop}="${props[prop]}"`;
    }

    if (tag.selfEnclosing) {
      this.text += " /";
    }
    this.text += ">";
    if (!tag.noEndline) this.text += "\n";

    return this;
  }

  addCustomText(t) {
    this.text += t;
    return this;
  }

  addComment(comment) {
    for (let i = 0; i < comment.tabs; i++) this.text += "\t";
    this.text += "<!--";
    if (comment.isMultiLine) {
      this.text += "\n";
      const lines = comment.content.split("\n");
      for (let line of lines) {
        for (let i = 0; i < comment.tabs + 1; i++) {
          this.text += "\t";
        }
        this.text += line;
        this.text += "\n";
      }

      for (let i = 0; i < comment.tabs; i++) {
        this.text += "\t";
      }
    } else {
      this.text += comment.content;
    }
    this.text += "-->";
    if (!comment.noEndline) this.text += "\n";
    return this;
  }

  getText() {
    return this.text;
  }
}

export default TagBuilder;
