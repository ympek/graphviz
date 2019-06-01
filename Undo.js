/* exported Undo */
class Undo {
  constructor() {
    this.ops = [];
  }

  pushOp(opId, opProps) {
    this.ops.push({
      id: opId,
      props: opProps
    })
  }

  popOp() {
    return this.ops.pop()
  }
};

