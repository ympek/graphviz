/* exported Canvas */
class Canvas {
  constructor(canvas) {
    this.canv = canvas;
    this.ctx = canvas.getContext("2d");
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
  }

  drawCircle(x, y, r) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawFilledCircle(x, y, r) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawFullCircle(x, y, r, color = "white") {
    this.ctx.fillStyle = color;
    this.drawFilledCircle(x, y, r);
    this.ctx.fillStyle = "black";
    this.drawCircle(x, y, r);
  }

  drawEdge(verA, verB) {
    this.ctx.beginPath();
    this.ctx.moveTo(verA.x, verA.y);
    this.ctx.lineTo(verB.x, verB.y);
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
