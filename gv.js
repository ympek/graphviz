/* global Canvas */
/* global EdgeSet */
/* global UndoRedo */

// Tasks:
// TODO Refactoring to beautiful code
// TODO implement Ctrl+Z
// TODO prettier CSS and stuff
// TODO Themes
// TODO import/export graph
// TODO highlighting vertices and edges binded with controls;
// TODO Rewrite in React/Redux

// Operation register = OpStack

// resizable canvas is a goal.
// controls - i can show and hide, and canvas resize accordingly.

let dom = {};
dom.canvas = document.getElementsByTagName("canvas")[0];
dom.vertices = document.getElementById("vertices");
dom.edges = document.getElementById("edges");
dom.history = document.getElementById("history");
dom.lastSelectedVertices = document.getElementById("selected");

// resize
// canvas is blurred this way.
// dom.canvas.setAttribute('width', getComputedStyle(dom.canvas, null).getPropertyValue("width"));
// dom.canvas.setAttribute('height', getComputedStyle(dom.canvas, null).getPropertyValue("height"));
let undo = new UndoRedo();
let vertices = [];
let edges = new EdgeSet();
const canvas = new Canvas(dom.canvas);

const Ops = {
  OP_ADD_VERTEX: "add vertex",
  OP_DEL_VERTEX: "del vertex",

  OP_CONNECT: "connect vertices"
}

const Highlight = {
  HL_NONE: "white",
  HL_MOUSEOVER: "yellow",
  HL_SELECTED_PRIMARY: "red",
  HL_SELECTED_SECONDARY: "orange",
  HL_MOUSEOVER_AND_SELECTED: "blue"
}

const Keyboard = {
  KEY_C: 67,
  KEY_D: 68,
  KEY_U: 85
};

const selection = new Selection();

let labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function handleKeyUp(event) {
  switch (event.keyCode) {
    case Keyboard.KEY_C:
      connectTwoSelectedVertices();
      break;
    case Keyboard.KEY_D:
      deleteSelectedPrimaryVertex();
      break;
    case Keyboard.KEY_U:
      undoLastOperation();
      break;
  }
}

function deleteSelectedPrimaryVertex() {
  if (selection.isAnyVertexSelectedAsPrimary()) {
    undo.pushOp(Ops.OP_DEL_VERTEX, { x: vertices[selection.primary].x, y: vertices[selection.primary].y });
    deleteVertex(selection.primary);
  }
}

function deleteVertex(v) {
  console.log("dupa", v);
  // vertices.splice(v, 1);
  delete vertices[v];
  edges.deleteByVertex(v);
  selection.clearFor(v);
}

function connectTwoSelectedVertices() {
  if (selection.areTwoVerticesSelected()) {
    edges.push([selection.primary, selection.secondary]);
  } else {
    console.error("Select two vertices if you want to connect.");
  }
}

function disconnectVertices(v1, v2) {
  edges.deleteBetween(v1, v2)
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


function calculateVertexColor(v, i) {
  // pretty ugly code my friend.
  // HIGHLY SKILL ED DEVLOPER UGHHHH
  let color = Highlight.HL_NONE;

  if (v.isUnderCursor) {
    color = Highlight.HL_MOUSEOVER;
  }
  if (selection.isSelectedAsSecondary(i)) {
    color = Highlight.HL_SELECTED_SECONDARY;
  }
  if (selection.isSelectedAsPrimary(i)) {
    color = Highlight.HL_SELECTED_PRIMARY;
  }
  if (v.isUnderCursor && selection.isSelected(i)) {
    color = Highlight.HL_MOUSEOVER_AND_SELECTED;
  }
  return color;
  // FizzBuzz vibes here.
}

let vertexWasSelectedWhenMouseDownEventOccured = false;

function handleMouseDown() {
  vertices.forEach(function (v, i) {
    if (v.isUnderCursor) {
      selection.select(i);
      vertexWasSelectedWhenMouseDownEventOccured = true;
      return false;
    }
  });
}

function handleMouseUp(event) {
  // event move.
}

function handleClick(event) {
  // this is actually select or create.
  // create if something wasn't there.
  // CREATE = in fact create + select.
  var pos = getMousePos(event);
  console.log("KLIK");

  if (vertexWasSelectedWhenMouseDownEventOccured)
  {
    vertexWasSelectedWhenMouseDownEventOccured = false;
    return;
    // select
    // mousedown event
  } else {
    // new is also selected immidiately;w;...
    addVertex(pos);
    let newlyAddedVertexId = vertices.length - 1;
    undo.pushOp(Ops.OP_ADD_VERTEX, { vertexId: newlyAddedVertexId });
    selection.select(newlyAddedVertexId);
  }
}

function addVertex(pos) {
  vertices.push({
    x: pos.x,
    y: pos.y,
    r: 10, // todo make konfigurable. OR?? zoom.
  });
}

function isCursorInsideVertexPos(mousePos, v)
{
  return mousePos.x >= (v.x - v.r) && mousePos.x <= (v.x + v.r)
    && mousePos.y >= (v.y - v.r) && mousePos.y <= (v.y + v.r);
}

function highlightVertexUnderCursor(mousePos) {
  vertices.forEach(function (v) {
    v.isUnderCursor = false;
    if (isCursorInsideVertexPos(mousePos, v))
    {
      v.isUnderCursor = true;
    }
  });
}

function handleMouseMove(event) {
  let pos = getMousePos(event);

  if (vertexWasSelectedWhenMouseDownEventOccured) {
    let curr = vertices[selection.primary];
    curr.x = pos.x;
    curr.y = pos.y;
  } else {
    highlightVertexUnderCursor(pos);
  }
}

function undoLastOperation() {
  console.log("Undo");
  // this is getting super ugly , i  like that.
  let operation = undo.popOp();
  console.log(operation);
  switch (operation.id) {
    case Ops.OP_ADD_VERTEX:
      deleteVertex(operation.props.vertexId);
    case Ops.OP_DEL_VERTEX:
      addVertex({ x: operation.props.x, y: operation.props.y });
  }
  // polymorphism later;
  // operation.execute(vertices, edges);
}

function updateDomState() {
  dom.edges.innerHTML = "";
  dom.vertices.innerHTML = "";
  dom.history.innerHTML = "";
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

  // undo redo
  undo.forEach(function (op) {
    let li = document.createElement("li");
    li.innerHTML = op.id;
    dom.history.appendChild(li);
  });

  let d = document.createElement("div");
  d.innerHTML = selection.primary;
  dom.lastSelectedVertices.appendChild(d);

  d = document.createElement("div");
  d.innerHTML = selection.secondary;
  dom.lastSelectedVertices.appendChild(d);
}

function tick() {
  // dom.update();
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
dom.canvas.addEventListener("mouseup", handleMouseUp);
document.addEventListener("keyup", handleKeyUp);
