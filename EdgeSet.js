/* exported EdgeSet */
class EdgeSet {
  constructor() {
    this.edges = [];
    // I know it should be different.
    // Patience, please.
    this.hashes = [];
  }

  hash(pair) {
    pair.sort(this.compareNumbers);
    return pair.join("_");
  }

  compareNumbers(a, b) {
    return a - b;
  }

  deleteByVertex(v) {
    let edgesToDelete = [];
    this.edges.forEach(function (edge, i) {
      if (edge[0] == v || edge[1] == v) {
        edgesToDelete.push(i);
      }
    });

    edgesToDelete.forEach((edgeIndex) => {
      delete this.edges[edgeIndex];
    });
  }

  push(edge) {
    let hash = this.hash(edge);
    if (this.hashes.indexOf(hash) === -1) {
      this.hashes.push(hash);
      this.edges.push(edge);
    }
  }

  forEach(func) {
    this.edges.forEach(func);
  }
};

