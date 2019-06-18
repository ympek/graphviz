/* exported EdgeSet */
class EdgeSet {
  constructor() {
    this.edges = {};
  }

  hash(pair) {
    pair.sort(this.compareNumbers);
    return pair.join("_");
  }

  compareNumbers(a, b) {
    return a - b;
  }

  deleteBetween(v1, v2) {
    let edge = [v1, v2].sort(this.compareNumbers)
    let hash = this.hash(edge)
    delete edges[hash];
  }

  deleteByVertex(v) {
    let edgesToDelete = [];
    Object.keys(this.edges).forEach((hash) => {
      if (this.edges[hash][0] == v || this.edges[hash][1] == v) {
        edgesToDelete.push(hash);
      }
    });

    edgesToDelete.forEach((hash) => {
      delete this.edges[hash]
    });
  }

  push(edge) {
    let hash = this.hash(edge);
    this.edges[hash] = edge;
  }

  forEach(func) {
    Object.keys(this.edges).forEach((hash) => {
      func(this.edges[hash], hash);
    });
  }
};

