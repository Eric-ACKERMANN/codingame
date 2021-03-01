// TO DO :
// 1. Optimiser le DFS
// 1.4 Dans un cas ou on ne fait rien,  il ne sert à rien de recréer des doubles etc...
// 2. Prendre en compte les rochers

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
  size() {
    return this.length;
  }
  clear() {
    this.length = [];
  }

  toString() {
    return this.items.toString();
  }
}

class Square {
  constructor(position, type, weight) {
    this.position = position;
    this.type = Number(type);
    this.canMove = true;
    this.isExit = false;
    this.TOP = false;
    this.LEFT = false;
    this.RIGHT = false;
    this.weight = weight;
    this.doubled = false;
  }

  addWeight(stack) {
    switch (this.type) {
      case 8:
      case 10:
      case 11:
      case 12:
      case 13:
        this.weight = this.weight + 1;
        //   for (let i = 0; i < stack.length; i++) {
        //    stack[i].grid.board[this.position.y][this.position.x].weight++;
        //   }
        break;
    }
  }

  isDouble() {
    if (!this.doubled) {
      switch (this.type) {
        case 8:
        case 10:
        case 11:
        case 12:
        case 13:
          return true;
      }
      return false;
    } else return false;
  }

  willTossOutOfBoard(grid, entrance) {
    const height = grid.height;
    const width = grid.width;

    const exit = this.returnExit(entrance);
    const newPosition = this.returnNextPosition(exit);

    if (
      newPosition.x < 0 ||
      newPosition.y < 0 ||
      newPosition.x >= width ||
      newPosition.y >= height
    ) {
      return true;
    } else return false;
  }

  returnNextPosition(exit) {
    let newPosition = { ...this.position };
    if (exit === "LEFT") {
      newPosition.x = newPosition.x - 1;
    } else if (exit === "RIGHT") {
      newPosition.x = newPosition.x + 1;
    } else if (exit === "BOTTOM") {
      newPosition.y = newPosition.y + 1;
    }
    return newPosition;
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

  // renvoie la sortie en fonction de l'entrée et du type du bloc
  returnExit(entrance) {
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

class Grid {
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
        board[i][j] = new Square({ x: j, y: i }, grid[i][j], 0);
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
        copyBoard[i][j] = new Square(
          { x: j, y: i },
          board[i][j].type,
          board[i][j].weight
        );
        copyBoard[i][j].initializeSquare(this.EX, this.height);
      }
    }
    this.board = copyBoard;
  }
}

class Situation {
  constructor(id, position, entrance, grid, actionHistory) {
    this.id = id;
    this.action = { left: true, right: true, nothing: true };
    this.position = position;
    this.entrance = entrance;
    this.grid = grid;
    this.actionHistory = actionHistory ? actionHistory : [];
    this.double = false;
  }

  copySituation() {
    let newSit = new Situation(
      this.id,
      { ...this.position },
      this.entrance,
      this.grid,
      new Array(this.actionHistory.length)
    );
    newSit.double = true;
    newSit.grid.createBoardCopy(this.grid.board);
    for (let i = 0; i < newSit.actionHistory.length; i++) {
      newSit.actionHistory[i] = { ...this.actionHistory[i] };
    }

    return newSit;
  }

  doubleSituation(block) {
    if (this.actionHistory.length < 1) {
      return false;
    }
    let rank = false;
    for (let i = 0; i < this.actionHistory.length; i++) {
      if (this.actionHistory[i].action === "NOTHING") {
        rank = i;
        break;
      }
    }
    // si on a pas trouvé de "WAIT" alors on continue
    if (rank === false) {
      return false;
    }
    // On a trouvé un "WAIT", on crée un double de la situation

    let copySituation = this.copySituation();
    copySituation.actionHistory[rank].action = "LEFT";
    copySituation.actionHistory[rank].position = {
      x: block.position.x,
      y: block.position.y,
    };
    copySituation.grid.board[block.position.y][block.position.x].applyAction(
      "left"
    );
    copySituation.grid.board[block.position.y][block.position.x].doubled = true;
    console.warn(
      "copied block with double:",
      copySituation.grid.board[block.position.y][block.position.x]
    );
    return copySituation;
  }

  getCurrentBlock() {
    return this.grid.board[this.position.y][this.position.x];
  }

  returnNextPosition(exit) {
    let newPosition = { ...this.position };
    if (exit === "LEFT") {
      newPosition.x = newPosition.x - 1;
    } else if (exit === "RIGHT") {
      newPosition.x = newPosition.x + 1;
    } else if (exit === "BOTTOM") {
      newPosition.y = newPosition.y + 1;
    }
    return newPosition;
  }

  updateAction(blockType, blockDoubled) {
    if (blockDoubled) {
      this.action.right = false;
      this.action.nothing = false;
    }
    if (blockType <= 0) {
      this.action.left = false;
      this.action.right = false;
    }
    switch (Math.abs(blockType)) {
      case 2:
      case 3:
      case 4:
      case 5:
        this.action.left = false;
        break;
      case 1:
        this.action.left = false;
        this.action.right = false;
        break;
    }
  }
}

class History {
  constructor() {
    this.situations = [];
  }

  add(object) {
    this.situations.push(object);
  }

  peek(id) {
    for (let i = 0; i < this.situations.length; i++) {
      if (situations[i].id === id) {
        return situations[i];
      }
    }
  }

  control() {
    return this.situations.map((e) => {
      return e.id;
    });
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

  simulation(grid) {
    let HISTORY = new History();
    let stack = new Stack();
    const situation = new Situation(0, this.position, this.entrance, grid);
    HISTORY.add(situation);
    stack.enqueue(situation);
    let counter = 0;
    loopWhile: while (!stack.isEmpty()) {
      counter = counter + 1;
      console.warn("counter", counter);
      console.warn(stack.length);
      // On prend le dernier élement du stack et on l'enlève
      const situation = stack.peek();
      stack.destack();

      // On détermine comment on sort du block actuel
      const currentBlock = situation.getCurrentBlock();
      const exit = currentBlock.returnExit(situation.entrance);
      // On détermine la nouvelle position
      const nextPosition = situation.returnNextPosition(exit);

      let nextBlock = situation.grid.board[nextPosition.y][nextPosition.x];
      // Est-ce le dernier bloc ? Si oui, on finit la simulation, si non on continue
      if (nextBlock.isExit) {
        stack.enqueue(situation);
        console.warn(situation.actionHistory);
        console.warn("Gagné");
        break loopWhile;
      }

      // On pondère le bloc suivant
      // nextBlock.addWeight(stack);

      // On regarde si le bloc suivant est un doubleur, et si il a déja été doublé
      if (nextBlock.isDouble()) {
        console.warn("nextBlock that passes isDouble :", nextBlock.position);
        const doubleSituation = situation.doubleSituation(nextBlock);
        console.warn("hey");
        //console.warn("doubleSituation sur :", doubleSituation.position)
        if (doubleSituation) {
          stack.enqueue(doubleSituation);
          console.warn("stack length after double case :", stack.length);
        }
      }

      // Suivant le type du bloc, on enlève des cas de loop à la situation
      situation.updateAction(nextBlock.type, nextBlock.doubled);

      // On loop sur les actions
      loopAction: for (const property in situation.action) {
        counter = counter + 1;
        if (situation.action[property] === false) {
          continue;
        }

        if (property === "right" || property === "left") {
          // On crée un block idem à celui qu'on devrait changer pour tester la property

          let newBlock = new Square(
            { x: nextPosition.x, y: nextPosition.y },
            nextBlock.type,
            nextBlock.weight
          );

          newBlock.initializeSquare();
          newBlock.applyAction(property);
          // On test si on peut y rentrer, si on peut on continue, si on peut pas on arrête la boucle
          const canEnterNewBlock = newBlock.canEnter(exit);
          if (!canEnterNewBlock) {
            continue loopAction;
          }

          // Le nouveau bloc nous enverra t-il hors plateau , si oui alors je ne continue pas (sauf si c'est la sortie), si non ?
          if (newBlock.willTossOutOfBoard(situation.grid, canEnterNewBlock)) {
            continue;
          }
          // On recrée une nouvelle grid et on change le bloc dans la grid, en remplacant le bloc existant par un nouveau
          const newGrid = new Grid(
            situation.grid.width,
            situation.grid.height,
            situation.grid.EX
          );
          newGrid.createBoardCopy(grid.board);
          newGrid.board[nextPosition.y][nextPosition.x] = newBlock;
          // On crée une nouvelle situation à enregistrer
          const newSituation = new Situation(
            counter,
            nextPosition,
            canEnterNewBlock,
            newGrid,
            [...situation.actionHistory]
          );
          HISTORY.add(newSituation);
          // On enregistre l'action et on met la nouvelle situation dans la liste, si on peut pas, on fait rien
          newSituation.actionHistory.push(
            new Action(nextPosition, property.toUpperCase())
          );
          stack.enqueue(newSituation);
        }

        if (property === "nothing") {
          const canEnterNextBlock = nextBlock.canEnter(exit);
          if (!canEnterNextBlock) {
            continue loopAction;
          }
          // Le nouveau bloc nous enverra t-il hors plateau , si oui alors je ne continue pas (sauf si c'est la sortie), si non ?
          if (nextBlock.willTossOutOfBoard(grid, canEnterNextBlock)) {
            continue;
          }
          // On crée une nouvelle situation à enregistrer
          const newSituation = new Situation(
            counter,
            nextPosition,
            canEnterNextBlock,
            situation.grid,
            [...situation.actionHistory]
          );
          HISTORY.add(newSituation);
          // On enregistre l'action et on met la nouvelle situation dans la liste, si on peut pas, on fait rien
          newSituation.actionHistory.push(
            new Action(nextPosition, property.toUpperCase())
          );
          stack.enqueue(newSituation);
        }
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
let map = [];
for (let i = 0; i < H; i++) {
  const LINE = readline().split(" ");
  // represents a line in the grid and contains W integers. Each integer represents one room of a given type.
  map.push([...LINE]);
}
const EX = parseInt(readline()); // the coordinate along the X axis of the exit.

// board creation and initialization
let grid = new Grid(W, H, EX);
grid.initializeBoard(map);
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
  let actions = Indiana.simulation(grid);

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
      grid.board[Y][X].applyAction(action.toLowerCase());
      // One line containing on of three commands: 'X Y LEFT', 'X Y RIGHT' or 'WAIT'
      console.log(`${X} ${Y} ${action}`);
    }
  } else {
    console.log("WAIT");
  }
}
