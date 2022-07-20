export default class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    // push element into the items
    this.items.push(element);
  }

  pop() {
    // return top most element in the stack
    // and removes it from the stack
    // Throws an error if stack is empty
    if (this.items.length === 0) 
      throw new Error('Stack is empty');
    return this.items.pop();
  }

  peek() {
    // return the top most element from the stack
    // but does'nt delete it.
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    // return true if stack is empty
    return this.items.length === 0;
  }
}
