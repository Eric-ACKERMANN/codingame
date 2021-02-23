// In progress , not resolved

// TOOLS

class Stack extends Array {
  push(element) {
    this.push(element);
  }
  // pop removes last element
  pop() {
    return this.pop();
  }
  isEmpty() {
    return this.length == 0;
  }
  //peek takes the last element
  peek() {
    return this[this.length - 1];
  }
  size() {
    return this.length;
  }
  clear() {
    this = [];
  }

  toString() {
    return this.items.toString();
  }
}
class Type {
  constructor() {}
  setType() {}
}

class Square {
  constructor(position, type) {
    this.position = position;
    this.type = type;
    this.canMove = true;
    this.isExit = false;
    this.TOP = false;
    this.LEFT = false;
    this.RIGHT = false;
  }

  initializeSquare(xPosOfExit, heightOfBoard) {
    // Determine if the square can be rotated or not
    if (this.type <= 0) this.canMove = false;
    // Determine if this is Exit
    if (
      this.position.y === heightOfBoard - 1 &&
      this.position.x === xPosOfExit
    ) {
      this.isExit = true;
    }
    // Determine entrance type
    this.initializeEntrance();
  }

  initializeEntrance() {
    switch (Math.abs(this.type)) {
      case 1:
        this.TOP = true;
        this.LEFT = true;
        this.RIGHT = true;
        break;
      case (2, 6, 8):
        this.LEFT = true;
        this.RIGHT = true;
        break;
      case (3, 10, 11):
        this.TOP = true;
        break;
      case (4, 7):
        this.TOP = true;
        this.RIGHT = true;
        break;
      case (5, 9):
        this.TOP = true;
        this.LEFT = true;
        break;
      case 12:
        this.LEFT = true;
      case 13:
        this.RIGHT = true;
      default:
        this.RIGHT = false;
        this.LEFT = false;
        this.TOP = false;
    }
  }

  returnMovement(entrance) {
    let result = {};
    switch (this.type) {
      case (1, 3, 4, 5, 7, 8, 9, 12, 13):
        result = { x: 0, y: 1 };
        break;
      case (4, 10):
        result = { x: -1, y: 1 };
        break;
      case (5, 11):
        result = { x: 1, y: 1 };
        break;
      case (2, 8):
        if (entrance === "LEFT") {
          result = { x: 1, y: 0 };
        } else if (entrance === "RIGHT") {
          result = { x: -1, y: 0 };
        }
        break;
      default:
        result = { x: 0, y: 0 };
    }
    return result;
  }
}

class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.board = [];
  }

  initializeBoard(grid, EX) {
    let board = new Array(this.height);

    for (let i = 0; i < this.height; i++) {
      board[i] = new Array(this.width);
      for (let j = 0; j < this.width; j++) {
        board[i][j] = new Square({ x: j, y: i }, grid[i][j]);
        board[i][j].initializeSquare(EX, this.height);
      }
    }
    this.board = board;
  }
}

// Classe qui définit un Personnage, ou un boulet
class Character {
  constructor() {
    this.position = {};
    this.entrance = false;
  }
  setPosition(pos, entrance) {
    this.position = pos;
    this.entrance = entrance;
  }
}
// Classe d'objets qui définissent un tour
class Turn {
  constructor(characterPosition, grid, history) {
    this.grid = grid;
    this.characterPosition = characterPosition;
    this.history = history;
  }
}

//////// Initialisation de la partie

var inputs = readline().split(" ");
const W = parseInt(inputs[0]); // number of columns.
const H = parseInt(inputs[1]); // number of rows.
let grid = [];
for (let i = 0; i < H; i++) {
  const LINE = readline().split(" ");
  // represents a line in the grid and contains W integers. Each integer represents one room of a given type.
  grid.push([...LINE]);
}
const EX = parseInt(readline()); // the coordinate along the X axis of the exit.

// board creation and initialization
let board = new Board(W, H);
board.initializeBoard(grid, EX);
// Character creation and initialization
let Indiana = new Character();

// game loop
while (true) {
  var inputs = readline().split(" ");
  const XI = parseInt(inputs[0]);
  const YI = parseInt(inputs[1]);
  const POSI = inputs[2];
  const R = parseInt(readline()); // the number of rocks currently in the grid.
  Indiana.setPosition({ x: XI, y: YI }, POSI);
  if (R > 0) {
    let rocks = new Array(R);
  }

  for (let i = 0; i < R; i++) {
    var inputs = readline().split(" ");
    const XR = parseInt(inputs[0]);
    const YR = parseInt(inputs[1]);
    const POSR = inputs[2];
    rocks[i] = new Character({ x: XR, y: YR }, POSR);
  }
  console.warn(grid);
  // Position Indiana is in

  let position = { x: XI, y: YI };
  // Box Indiana is in
  let boxIn = `${Math.abs(grid[YI][XI])}`;

  // DETERMINE the Box in which Indiana will arrive
  let nextBox = "";

  // We need to know X and Y (movement of this turn
  let X = 0;
  let Y = 0;

  // X and Y are determined by the box indiana is in and the pos in which he enters it
  if (boxIn === "1") {
    X = 0;
    Y = 1;
  }
  if (
    (boxIn === "2" && POSI === "LEFT") ||
    (boxIn === "5" && POSI === "TOP") ||
    (boxIn === "6" && POSI === "LEFT") ||
    (boxIn === "11" && POSI === "TOP")
  ) {
    X = 1;
    Y = 0;
  }
  if (
    (boxIn === "2" && POSI === "RIGHT") ||
    (boxIn === "4" && POSI === "TOP") ||
    (boxIn === "10" && POSI === "TOP") ||
    (boxIn === "6" && POSI === "RIGHT")
  ) {
    X = -1;
    Y = 0;
  }
  if (
    (boxIn === "3" && POSI === "TOP") ||
    (boxIn === "4" && POSI === "RIGHT") ||
    (boxIn === "5" && POSI === "LEFT") ||
    (boxIn === "7" && POSI === "TOP") ||
    (boxIn === "7" && POSI === "RIGHT") ||
    (boxIn === "8" && POSI === "LEFT") ||
    (boxIn === "8" && POSI === "RIGHT") ||
    (boxIn === "9" && POSI === "TOP") ||
    (boxIn === "9" && POSI === "LEFT") ||
    (boxIn === "12" && POSI === "RIGHT") ||
    (boxIn === "13" && POSI === "LEFT")
  ) {
    X = 0;
    Y = 1;
  }

  //Position in next round
  const positionNext = { x: position.x + X, y: position.y + Y };
  // Add the position in which he arrives
  let PosiNext = "";
  if (X === -1) {
    PosiNext = "RIGHT";
  }
  if (X === 1) {
    PosiNext = "LEFT";
  }
  if (Y === 1) {
    PosiNext = "TOP";
  }

  // Type of box in which Indiana will be
  let boxNext = `${Math.abs(grid[positionNext.y][positionNext.x])}`;
  // Check if can enter by PosiNext in this room
  let entrance = true;

  if (
    (PosiNext === "TOP" && boxNext === "2") ||
    (PosiNext === "TOP" && boxNext === "6") ||
    (PosiNext === "TOP" && boxNext === "8") ||
    (PosiNext === "TOP" && boxNext === "12") ||
    (PosiNext === "TOP" && boxNext === "13")
  ) {
    entrance = false;
  }
  if (
    (PosiNext === "LEFT" && boxNext === "3") ||
    (PosiNext === "LEFT" && boxNext === "4") ||
    (PosiNext === "LEFT" && boxNext === "7") ||
    (PosiNext === "LEFT" && boxNext === "10") ||
    (PosiNext === "LEFT" && boxNext === "11") ||
    (PosiNext === "LEFT" && boxNext === "12")
  ) {
    entrance = false;
  }
  if (
    (PosiNext === "RIGHT" && boxNext === "3") ||
    (PosiNext === "RIGHT" && boxNext === "5") ||
    (PosiNext === "RIGHT" && boxNext === "9") ||
    (PosiNext === "RIGHT" && boxNext === "10") ||
    (PosiNext === "RIGHT" && boxNext === "11") ||
    (PosiNext === "RIGHT" && boxNext === "13")
  ) {
    entrance = false;
  }

  let nextBoxCoord = `${positionNext.x} ${positionNext.y}`;
  let rotation = "";

  if (entrance === false) {
    if (PosiNext === "TOP") {
      if (
        boxNext === "2" ||
        boxNext === "6" ||
        boxNext === "8" ||
        boxNext === "12"
      ) {
        rotation = "LEFT";
      } else {
        rotation = "RIGHT";
      }
    }

    if (PosiNext === "LEFT") {
      if (boxNext === "3" || boxNext === "7" || boxNext === "10") {
        rotation = "LEFT";
      } else {
        rotation = "RIGHT";
      }
    }

    if (PosiNext === "RIGHT") {
      if (
        (boxNext === boxNext) === "3" ||
        boxNext === "9" ||
        boxNext === "11"
      ) {
        rotation = "LEFT";
      } else {
        rotation = "RIGHT";
      }
    }
  } else {
    rotation = "WAIT";
  }

  let action = "";
  if (rotation === "WAIT") {
    action = rotation;
  } else {
    action = nextBoxCoord + " " + rotation;
  }

  // Il s'agit de modifier la grid à présent en fonction de ce qu'on a fait

  //4,5,10,11,12,13
  if (rotation === "RIGHT" && boxNext === "2") {
    boxNext = "3";
  } else if (rotation === "RIGHT" && boxNext === "3") {
    boxNext = "2";
  } else if (rotation === "RIGHT" && boxNext === "5") {
    boxNext = "4";
  } else if (rotation === "RIGHT" && boxNext === "10") {
    boxNext = "11";
  } else if (rotation === "RIGHT" && boxNext === "11") {
    boxNext = "12";
  } else if (rotation === "RIGHT" && boxNext === "12") {
    boxNext = "13";
  } else if (rotation === "RIGHT" && boxNext === "13") {
    boxNext = "10";
  }

  //2,3,6,7,8,9,10,11,12
  if (rotation === "LEFT" && boxNext === "2") {
    boxNext = "3";
  } else if (rotation === "LEFT" && boxNext === "3") {
    boxNext = "2";
  } else if (rotation === "LEFT" && boxNext === "6") {
    boxNext = "9";
  } else if (rotation === "LEFT" && boxNext === "7") {
    boxNext = "6";
  } else if (rotation === "LEFT" && boxNext === "8") {
    boxNext = "7";
  } else if (rotation === "LEFT" && boxNext === "9") {
    boxNext = "8";
  } else if (rotation === "LEFT" && boxNext === "10") {
    boxNext = "13";
  } else if (rotation === "LEFT" && boxNext === "11") {
    boxNext = "10";
  } else if (rotation === "LEFT" && boxNext === "12") {
    boxNext = "11";
  }

  grid[positionNext.y][positionNext.x] = boxNext;

  // Write an action using console.log()
  // To debug: console.error('Debug messages...');

  // One line containing on of three commands: 'X Y LEFT', 'X Y RIGHT' or 'WAIT'
  console.log(action);
}
