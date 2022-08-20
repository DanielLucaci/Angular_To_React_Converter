class TextBuilder {
  constructor() {
    this.text = "";
  }

  /**
   * Adds count * 2 empty spaces to the text. 
   * @param {number} count 
   * @returns a reference to the current object.
   */
  addEmptySpaces(count) {
    for (let i = 0; i < count; i++) this.text += "  ";
    return this;
  }

  /**
   * Removes the last row from the text.
   * @returns a reference to the current object.
   */
  removeLastRow() {
    this.text = this.text.split("\n").slice(0, -1).join("\n") + "\n";
    return this;
  }

  /**
   * Appends every string from an array to the text. 
   * @param  {...string} strings - an array with strings
   * @returns a reference to the current object. 
   */
  add(...strings) {
    strings.forEach((string) => (this.text += string));
    return this;
  }
}

export default TextBuilder;
