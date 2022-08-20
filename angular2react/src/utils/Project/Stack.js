export default class Stack {
  constructor() {
    this.items = [];
  }

  /**
   * Pushes a new element onto the stack
   * @param {*} element - The element to be appended to the stack
   */
  push(element) {
    this.items.push(element);
  }

  /**
   * @returns - the length of the stack
   */
  get length() { 
    return this.items.length;
  }

  /**
   * Return top most element in the stack and removes it from the stack
   * Throws an error if stack is empty
   * @returns - the top most element in the stack
   */
  pop() {
    if (this.items.length === 0) 
      throw new Error('Stack is empty');
    return this.items.pop();
  }

  /**
   * Return the topmost element from the stack but doesn't delete it.
   * @returns the topmost element from the stack  
   */
  peek() {
    return this.items[this.items.length - 1];
  }

  /**
   * Checks if the stack is empty
   * @returns true if stack is empty, false otherwise 
   */
  isEmpty() {
    return this.items.length === 0;
  }
}
