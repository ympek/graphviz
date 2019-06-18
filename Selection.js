/* exported Selection */
class Selection {
  constructor() {
    this.primary = -1;
    this.secondary = -1;
  }

  isSelectedAsPrimary(vertexIndex) {
    return (this.primary == vertexIndex );
  }

  isSelectedAsSecondary(vertexIndex) {
    return (this.secondary == vertexIndex);
  }

  isSelected(i) {
    return (this.isSelectedAsPrimary(i) || this.isSelectedAsSecondary(i));
  }

  isAnyVertexSelectedAsPrimary() {
    return (this.primary != -1);
  }

  areTwoVerticesSelected() {
    return (this.primary != -1 && this.secondary != -1 && this.primary != this.secondary);
  }

  clearFor(v) {
    if (this.primary == v) {
      this.primary = -1;
    }
    if (this.secondary == v) {
      this.secondary = -1;
    }
  }

  select(vertexIndex) {
    this.secondary = this.primary;
    this.primary = vertexIndex;
  }
};
