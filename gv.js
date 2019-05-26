// wyklikiwanie sobie obiektów
// interface - connect last two selected.

/* global Canvas */

// no to generalnie chyba będzie madrzej trzeba to zrobic.
// Canvas highlights moga byc zrobione a'la bitset.
// (potem zoptymalizowane do bitsetu.
// TODO implement Ctrl+Z 
// This is actually perfect use-case for React+Redux. Am I right ? ?
// TODO no duplicate edges


// ok to implement mouseDown,
// I need vertex selected primary and vertex selected alternate.

const Highlight = {
  HL_NONE: "white",
  HL_MOUSEOVER: "yellow",
  HL_SELECTED_PRIMARY: "red",
  HL_SELECTED_SECONDARY: "orange",
  HL_MOUSEOVER_AND_SELECTED: "blue"
}

let dom = {};
dom.canvas = document.getElementsByTagName("canvas")[0];

const canvas = new Canvas(dom.canvas);

dom.vertices = document.getElementById("vertices");
dom.edges = document.getElementById("edges");
dom.lastSelectedVertices = document.getElementById("selected");

let labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let vertices = [];

let lastTwo = [];
// refactor this to selectedPrimary, selectedSecondary
let selectedPrimary = -1
let selectedSecondary = -1;
let lastTwoIndex = 0;

let edges = [];

function hasTwoVerticesSelected() {
  return (selectedPrimary != -1 && selectedSecondary != -1);
}

function handleKeyUp(event) {
  // console.log("Dupa", event.keyCode);
  switch (event.keyCode) {
  case 67: // key C
    // connect lastTwo selected ( ? )
    if (hasTwoVerticesSelected()) {
      edges.push([selectedPrimary, selectedSecondary]);
    }
  }
}

function remember(vertexIndex) {
  selectedSecondary = selectedPrimary;
  selectedPrimary = vertexIndex;
}

function getMousePos(event) {
  var rect = dom.canvas.getBoundingClientRect();
  return {
    x: Math.floor((event.clientX - rect.left) / (rect.right - rect.left) * dom.canvas.width),
    y: Math.floor((event.clientY - rect.top) / (rect.bottom - rect.top) * dom.canvas.height)
  };
}

// to nie jest takie oczywiste.
// graf moze byc skierowany, lub nie.
// Jesli jest skierowany, ma znaczenie czy pushuje edge jako np [0, 3], czy [3, 0]
// jesli jest nieskierowany, [0,3] i [3,0] to jest dokladnie to samo.
// czyli jak robie forEach to nie musze sie "wracac" tzn np. kiedy dojde do vertexa B to znaczy ze z A juz jest on polaczony.

// robimy najpierw nieskierowany graf.


function connectAll() {
  for (let i = 0; i < vertices.length; i++)
  {
    for (let j = i + 1; j < vertices.length; j++)
    {
      edges.push([i, j]);
    }
  }}

function draw() {
  // draw edges first
  edges.forEach((e) => {
    canvas.drawEdge(vertices[e[0]], vertices[e[1]]);
  });

  vertices.forEach((v, i) => {
    let color = calculateVertexColor(v, i);
    canvas.drawFullCircle(v.x, v.y, v.r, color);
  });
}

function isSelectedPrimary(vertexIndex) {
  return (selectedPrimary == vertexIndex );
}

function isSelectedSecondary(vertexIndex) {
  return (selectedSecondary == vertexIndex);
}

function isSelected() {
  return (isSelectedPrimary() || isSelectedSecondary());
}

function calculateVertexColor(v, i) {
  // pretty ugly code my friend.
  // HIGHLY SKILL ED DEVLOPER UGHHHH
  let color = Highlight.HL_NONE;

  if (v.isUnderCursor) {
    color = Highlight.HL_MOUSEOVER;
  }
  if (isSelectedSecondary(i)) {
    color = Highlight.HL_SELECTED_SECONDARY;
  }
  if (isSelectedPrimary(i)) {
    color = Highlight.HL_SELECTED_PRIMARY;
  }
  if (v.isUnderCursor && isSelected(i)) {
    color = Highlight.HL_MOUSEOVER_AND_SELECTED;
  }
  return color;
}

function handleMouseDown(event) {
  // jesli mamy wybrany jakis vertex, to mozemy go tak przesuwac.

}

function handleClick(event) {
  // this is actually select or create.
  // create if something wasn't there.
  // CREATE = in fact create + select.
  var pos = getMousePos(event);
  let vertexWasSelected = false

  vertices.forEach(function (v, i) {
    console.log("going thru:");
    if (v.isUnderCursor)
    {
      console.log("IsUnder:");
      remember(i);
      vertexWasSelected = true;
      return false;
    }
  });

  console.log("KLIK");

  if (vertexWasSelected)
  {
    return;
    // select
    // mousedown event
  } else {
    // new is also selected immidiately;w;...
    vertices.push({
      x: pos.x,
      y: pos.y,
      r: 10, // todo make konfigurable. OR?? zoom.
      hl: "white"
    });

    remember(vertices.length - 1);
  }
}

function isCursorInsideVertexPos(mousePos, v)
{
  return mousePos.x >= (v.x - v.r) && mousePos.x <= (v.x + v.r)
    && mousePos.y >= (v.y - v.r) && mousePos.y <= (v.y + v.r);
}

function highlightVertexUnderCursor(mousePos)
{
  vertices.forEach(function (v) {
    v.isUnderCursor = false;
    if (isCursorInsideVertexPos(mousePos, v))
    {
      v.isUnderCursor = true;
    }
  });
}

function handleMouseMove(event)
{
  let pos = getMousePos(event);
  highlightVertexUnderCursor(pos);
}


function updateDomState() {
  // draw vertices and edges inside respective containers.
  // this already is getting so ugly i cant proceed and I will cry.
  // I lack clear goal of what I want of this.
  dom.edges.innerHTML = "";
  dom.vertices.innerHTML = "";
  dom.lastSelectedVertices.innerHTML = "";

  vertices.forEach(function (v, i) {
    let li = document.createElement("li");
    li.innerHTML = i;
    dom.vertices.appendChild(li);
  });

  edges.forEach(function (e) {
    let li = document.createElement("li");
    li.innerHTML = e;
    dom.edges.appendChild(li);
  });

  let d = document.createElement("div");
  d.innerHTML = selectedPrimary;
  dom.lastSelectedVertices.appendChild(d);

  d = document.createElement("div");
  d.innerHTML = selectedSecondary;
  dom.lastSelectedVertices.appendChild(d);
}

function tick() {
  updateDomState();
  canvas.clear();
  draw();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// attach ev listeners
dom.canvas.addEventListener("click", handleClick);
dom.canvas.addEventListener("mousemove", handleMouseMove);
dom.canvas.addEventListener("mousedown", handleMouseDown);
document.addEventListener("keyup", handleKeyUp);
