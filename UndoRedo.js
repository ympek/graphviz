/* exported UndoRedo */
class UndoRedo {
  constructor() {
    this.ops = [];
  }

  pushOp(opId, opProps = {}) {
    this.ops.push({
      id: opId,
      props: opProps
    })
  }

  popOp() {
    return this.ops.pop()
  }

  forEach(func) {
    this.ops.forEach(func);
  }
};

