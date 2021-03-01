// DFS de base, fonctionne mais ne permet pas de résoudre des grands puzzle car trop gourmand. A optimiser.
// Ne prend pas en compte les rochers

// TOOLS

class Stack extends Array {
  enqueue(element) {
    this.push(element);
  }
  // pop removes last element
  destack() {
    return this.pop();
  }
  isEmpty() {
    return this.length == 0;
  }
  //peek takes the last element
  peek() {
    return this[this.length - 1];
  }
}

class Square {
  constructor(position, type) {
    this.position = position;
    this.type = Number(type);
    this.canMove = true;
    this.isExit = false;
    this.TOP = false;
    this.LEFT = false;
    this.RIGHT = false;
  }

  applyAction(action) {
    const type = Math.abs(this.type);
    if (action === "left") {
      switch (type) {
        case 3:
        case 5:
        case 7:
        case 8:
        case 9:
        case 11:
        case 12:
        case 13:
          this.type = type - 1;
          break;
        case 2:
        case 4:
          this.type = type + 1;
          break;
        case 6:
          this.type = 9;
          break;
        case 10:
          this.type = 13;
          break;
        default:
          break;
      }
    } else if (action === "right") {
      switch (type) {
        case 3:
        case 5:
          this.type = type - 1;
          break;
        case 2:
        case 4:
        case 6:
        case 7:
        case 8:
        case 10:
        case 11:
        case 12:
          this.type = type + 1;
          break;
        case 9:
          this.type = 6;
          break;
        case 13:
          this.type = 10;
          break;
        default:
          break;
      }
    }
    this.initializeEntrance();
  }

  initializeSquare(xPosOfExit, heightOfBoard) {
    // Determine if the square can be rotated or not
    if (this.type <= 0) this.canMove = false;
    // Determine if this is Exit
    if (
      xPosOfExit &&
      this.position.y === heightOfBoard - 1 &&
      this.position.x === xPosOfExit
    ) {
      this.isExit = true;
    }
    // Determine entrance type
    this.initializeEntrance();
  }

  initializeEntrance() {
    const type = Math.abs(this.type);
    switch (type) {
      case 1:
        this.TOP = true;
        this.LEFT = true;
        this.RIGHT = true;
        break;
      case 2:
      case 6:
      case 8:
        this.TOP = false;
        this.LEFT = true;
        this.RIGHT = true;

        break;
      case 3:
      case 10:
      case 11:
        this.TOP = true;
        this.LEFT = false;
        this.RIGHT = false;

        break;
      case 4:
      case 7:
        this.TOP = true;
        this.LEFT = false;
        this.RIGHT = true;

        break;
      case 5:
      case 9:
        this.TOP = true;
        this.LEFT = true;
        this.RIGHT = false;
        break;
      case 12:
        this.TOP = false;
        this.LEFT = false;

        this.RIGHT = true;
        break;
      case 13:
        this.TOP = false;
        this.LEFT = true;
        this.RIGHT = false;

        break;
      default:
        this.TOP = false;
        this.LEFT = false;
        this.RIGHT = false;

        break;
    }
  }

  // Détermine la sortie en fonction du type et de l'entrée
  determineExit(entrance) {
    const type = Math.abs(this.type);
    if (entrance === "LEFT") {
      switch (type) {
        case 2:
        case 6:
          return "RIGHT";
        case 1:
        case 5:
        case 8:
        case 9:
        case 13:
          return "BOTTOM";
        default:
          return false;
      }
    } else if (entrance === "RIGHT") {
      switch (type) {
        case 2:
        case 6:
          return "LEFT";
        case 1:
        case 4:
        case 7:
        case 8:
        case 12:
          return "BOTTOM";
        default:
          return false;
      }
    } else {
      switch (type) {
        case 4:
        case 10:
          return "LEFT";
        case 5:
        case 11:
          return "RIGHT";
        case 1:
        case 3:
        case 7:
        case 9:
          return "BOTTOM";
        default:
          return false;
      }
    }
  }
  // Determine si on peut sortir d'un block
  canEnter(exitOldBlock) {
    if (exitOldBlock === "LEFT" && this.RIGHT) {
      return "RIGHT";
    } else if (exitOldBlock === "RIGHT" && this.LEFT) {
      return "LEFT";
    } else if (exitOldBlock === "BOTTOM" && this.TOP) {
      return "TOP";
    } else {
      return false;
    }
  }
}

class Board {
  constructor(width, height, EX) {
    this.width = width;
    this.height = height;
    this.board = [];
    this.EX = EX;
  }

  initializeBoard(grid) {
    let board = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
      board[i] = new Array(this.width);
      for (let j = 0; j < this.width; j++) {
        board[i][j] = new Square({ x: j, y: i }, grid[i][j]);
        board[i][j].initializeSquare(this.EX, this.height);
      }
    }
    this.board = board;
  }

  createBoardCopy(board) {
    let copyBoard = new Array(board.length);
    for (let i = 0; i < board.length; i++) {
      copyBoard[i] = new Array(board[i].length);
      for (let j = 0; j < board[i].length; j++) {
        copyBoard[i][j] = new Square({ x: j, y: i }, board[i][j].type);
        copyBoard[i][j].initializeSquare(this.EX, this.height);
      }
    }
    this.board = copyBoard;
  }
}

// Classe qui définit un Personnage, ou un boulet
class Character {
  constructor() {
    this.position = {};
    this.entrance = false;
    this.stack = [];
  }
  setPosition(pos, entrance) {
    this.position = pos;
    this.entrance = entrance;
  }

  calculateNextPosition(position, exit) {
    let newPosition = { ...position };
    if (exit === "LEFT") {
      newPosition.x = newPosition.x - 1;
    } else if (exit === "RIGHT") {
      newPosition.x = newPosition.x + 1;
    } else if (exit === "BOTTOM") {
      newPosition.y = newPosition.y + 1;
    }
    return newPosition;
  }

  simulation(grid) {
    console.warn("Enter the simulation");
    let stack = new Stack();

    const situation = {
      action: { left: true, right: true, nothing: true },
      position: this.position,
      entrance: this.entrance,
      grid: grid,
      actionHistory: [],
    };
    const result = [];
    stack.enqueue(situation);
    let counter = 0;
    loopWhile: while (!stack.isEmpty()) {
      counter = counter + 1;
      //console.warn("counter",counter)
      // 1.On prend le dernier élement du stack et on l'enlève
      const situation = stack.peek();
      stack.destack();
      console.warn(situation.position);
      // console.warn("situation action", situation.actionHistory);
      // 2.On détermine comment on sort du block actuel
      const currentBlock =
        situation.grid.board[situation.position.y][situation.position.x];
      const exit = currentBlock.determineExit(situation.entrance);
      // console.warn("exit : ", exit);
      // 3.On détermine la nouvelle position
      const nextPosition = this.calculateNextPosition(situation.position, exit);
      // console.warn("nextPosition", nextPosition);
      // 4. Est-ce le dernier bloc ? Si oui, on finit la simulation, si non on continue
      if (situation.grid.board[nextPosition.y][nextPosition.x].isExit) {
        stack.enqueue(situation);
        // console.warn("Gagné");
        break loopWhile;
      }

      // 7. On loop sur les actions
      loopAction: for (const property in situation.action) {
        //  console.warn("Action tested", property);
        const { position, entrance, grid } = situation;
        let block = grid.board[nextPosition.y][nextPosition.x];

        // 8. Si property = "left" ou "right" et type de black <=0 alors on annule
        if ((property === "left" || property === "right") && block.type <= 0) {
          //  console.warn("action aborted", property);
          continue;
        }

        // 9. On crée un block idem à celui qu'on devrait changer pour tester la property
        let newBlock = new Square(
          { x: nextPosition.x, y: nextPosition.y },
          block.type
        );
        // console.warn("newBlock avant", newBlock.type);
        newBlock.initializeSquare();
        newBlock.applyAction(property);
        //  console.warn("newBlock après", newBlock.type);
        // 10. On test si on peut y rentrer, si on peut on continue, si on peut pas on arrête la boucle
        // console.warn("exit", exit);
        const canEnterNewBlock = newBlock.canEnter(exit);
        // console.warn("canEnterNewBlock", canEnterNewBlock);
        if (!canEnterNewBlock) {
          //  console.warn("action aborted", property);
          continue;
        }
        // 11. On recrée une nouvelle grid et on change le bloc dans la grid, en remplacant le bloc existant par un nouveau
        const newGrid = new Board(grid.width, grid.height, grid.EX);
        newGrid.createBoardCopy(grid.board);
        newGrid.board[nextPosition.y][nextPosition.x] = newBlock;
        // 12. On crée une nouvelle situation à enregistrer
        let newSituation = {
          action: { left: true, right: true, nothing: true },
          position: nextPosition,
          entrance: canEnterNewBlock,
          grid: newGrid,
          actionHistory: [...situation.actionHistory],
        };
        // 12. On enregistre l'action et on met la nouvelle situation dans la liste, si on peut pas, on fait rien
        newSituation.actionHistory.push(
          new Action(nextPosition, property.toUpperCase())
        );
        stack.enqueue(newSituation);
      }
    }
    const final_sit = stack.peek();
    return final_sit.actionHistory;
  }
}

class Action {
  constructor(position, property) {
    this.position = position;
    this.action = property;
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
let board = new Board(W, H, EX);
board.initializeBoard(grid);
// Character creation and initialization
let Indiana = new Character();

// game loop
while (true) {
  var inputs = readline().split(" ");
  const XI = parseInt(inputs[0]);
  const YI = parseInt(inputs[1]);
  const POSI = inputs[2];
  const R = parseInt(readline()); // the number of rocks currently in the grid.
  console.warn(R);
  Indiana.setPosition({ x: XI, y: YI }, POSI);
  if (R > 0) {
    var rocks = new Array(R);
  }

  for (let i = 0; i < R; i++) {
    var inputs = readline().split(" ");
    const XR = parseInt(inputs[0]);
    const YR = parseInt(inputs[1]);
    const POSR = inputs[2];
    rocks[i] = new Character({ x: XR, y: YR }, POSR);
  }
  let actions = Indiana.simulation(board);

  // Write an action using console.log()
  // To debug: console.error('Debug messages...');

  if (actions.length > 0) {
    const X = actions[0].position.x;
    const Y = actions[0].position.y;
    const action = actions[0].action;
    // On met à jour la grid

    if (action === "NOTHING") {
      console.log("WAIT");
    } else {
      board.board[Y][X].applyAction(action.toLowerCase());
      // One line containing on of three commands: 'X Y LEFT', 'X Y RIGHT' or 'WAIT'
      console.log(`${X} ${Y} ${action}`);
    }
  } else {
    console.log("WAIT");
  }
}
