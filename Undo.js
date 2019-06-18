/* exported UndoRedo */
class UndoRedo {
  constructor() {
    this.ops = [];
  }

  pushOp(opId) {
    this.ops.push(opId);
  }

  popOp() {
    return this.ops.pop()
  }
};

