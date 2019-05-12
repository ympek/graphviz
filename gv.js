// wyklikiwanie sobie obiektów

let dom = {};
dom.canvas = document.getElementsByTagName("canvas")[0];
dom.ctx = dom.canvas.getContext("2d");

let vertices = [];

class Graph {
  constructor() {
    this.vertices = [];
    this.edges = [];
  }
}

class Circle {
  constructor() {
    // this.x =
  }
}

let labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let circles = [];

// i need mouse
function getMousePos(event) {
  var rect = dom.canvas.getBoundingClientRect();
  return {
    x: Math.floor((event.clientX - rect.left) / (rect.right - rect.left) * dom.canvas.width),
    y: Math.floor((event.clientY - rect.top) / (rect.bottom - rect.top) * dom.canvas.height)
  };
}

function drawCircle(x, y, r) {
  dom.ctx.beginPath();
  dom.ctx.arc(x, y, r, 0, 2 * Math.PI);
  dom.ctx.stroke();
  dom.ctx.closePath();
}

function drawEdge(verA, verB) {
  dom.ctx.beginPath();
  dom.ctx.moveTo(verA.x, verA.y);
  dom.ctx.lineTo(verB.x, verB.y);
  dom.ctx.stroke();
  dom.ctx.closePath();
}

// to nie jest takie oczywiste.
// graf moze byc skierowany, lub nie.
// Jesli jest skierowany, ma znaczenie czy pushuje edge jako np [0, 3], czy [3, 0]
// jesli jest nieskierowany, [0,3] i [3,0] to jest dokladnie to samo.
// czyli jak robie forEach to nie musze sie "wracac" tzn np. kiedy dojde do vertexa B to znaczy ze z A juz jest on polaczony.

let edges = [];

function connectAll() {
  for (let i = 0; i < circles.length; i++)
  {
    for (let j = i + 1; j < circles.length; j++)
    {
      edges.push([i, j]);
    }
  }
}

function draw() {
  // draw edges first
  edges.forEach((e) => {
    drawEdge(circles[e[0]], circles[e[1]]);
  });
}


function handleClick(event) {
  var pos = getMousePos(event);

  circles.push({
    x: pos.x,
    y: pos.y,
    r: 10
  });

  edges = [];
  connectAll();

  draw();

  drawCircle(pos.x, pos.y, 10);



  if (circles.length == 2)
  {
  }

  // if (opt.imageMode) {
  //   dom.ctx.drawImage(opt.img, pos.x, pos.y);
  //   opt.imageMode = false;
  // } else {
  //   var i = Math.floor(pos.x / opt.cellSize),
  //     j = Math.floor(pos.y / opt.cellSize);

  //   if (currentState[j][i] == 1) {
  //     currentState[j][i] = 0;
  //   } else {
  //     currentState[j][i] = 1;
  //   }
  //   drawField();	
  // }
}

function handleMouseMove(event)
{
  let pos = getMousePos(event);
  // if (Is inside any of existing circles
  // podswietl
}

function clearCanvas() {
  dom.ctx.clearRect(0,0,dom.canvas.width,dom.canvas.height);;
}

function tick() {
  clearCanvas();
  draw();
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

// attach ev listeners
dom.canvas.addEventListener("click", handleClick);
dom.canvas.addEventListener("mousemove", handleMouseMove);
