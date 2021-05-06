// Définition of the Player
class Player {
  constructor() {
    this.sun = 0;
    this.score = 0;
    this.waiting = false;
    this.myTrees = [];
    this.action = "WAIT";
    this.cost2to3 = 0;
    this.cost1to2 = 0;
    this.expectedSun = 0;
  }
  // Met à jour le joueur en début de tour
  updatePlayer(sun, score, waiting) {
    this.sun = sun;
    this.score = score;
    if (waiting) this.waiting = waiting;
  }

  getTrees() {
    this.myTrees = game.boardWithTree
      .filter((e) => e.myTree)
      .sort((a, b) => b.richness - a.richness);

    this.defineGrowCost();
  }

  defineGrowCost() {
    this.cost2to3 = 7;
    this.cost1to2 = 3;
    for (let tree in this.myTrees) {
      if (tree.size === 2) {
        this.cost1to2++;
      }
      if (tree.size === 3) {
        this.cost2to3++;
      }
    }
  }
  defineAction(game, ennemy) {
    // 1. Si on peut COMPLETE, on COMPLETE

    // 2. Si on peut faire pousser un arbre de 2 à 3, alors on le fait
    if (this.myTrees.some((e) => e.size === 2) && this.sun >= this.cost2to3) {
      let size2 = this.myTrees.filter((e) => e.size === 2);
      return `GROW ${size2[0].index}`;
    }

    // 1.1 On regarde si il y a un arbre de size 3 et si oui on le complete
    if (this.myTrees.some((e) => e.size === 3) && this.sun > 3) {
      let size3 = this.myTrees.filter((e) => e.size === 3);
      return `COMPLETE ${size3[0].index}`;
    }

    // 3. Si on peut faire pousser un arbre de 1 à 2, alors on le fait
    if (this.myTrees.some((e) => e.size === 1) && this.sun >= this.cost1to2) {
      let size1 = this.myTrees.filter((e) => e.size === 1);
      return `GROW ${size1[0].index}`;
    }

    // 3. Sinon on WAIT
    return "WAIT";
  }
}

// Définition of the Game
class Game extends Array {
  constructor() {
    super();
    this.nutrients = 0;
    this.board = new Array(37);
    this.boardWithTree = new Array();
    this.day = 0;
    this.isNewDay = false;
    this.numberOfTrees = 0;
  }
  isNewDay(day) {
    if (day > this.day) {
      this.isNewDay = true;
    } else {
      this.isNewDay = false;
    }
  }

  updateGame(day, nutrients, numberOfTrees) {
    if (day > this.day) {
      this.isNewDay = true;
    } else {
      this.isNewDay = false;
    }
    this.day = day;
    this.nutrients = nutrients;
    this.numberOfTrees = numberOfTrees;
  }

  // Trie le tableau en fonction des size
  sortBoard() {
    this.board.sort((a, b) => a.size - b.size);
  }

  // Nettoie le board en enlevant les arbres morts
  cleanBoard(treeCheck) {
    for (let cell of this.board) {
      if (!treeCheck.includes(cell.index)) {
        cell.hasTree = false;
        cell.myTree = false;
        cell.ennemyTree = false;
      }
    }
  }

  // Ressort un tableau qui n'a que des arbres
  sortCellsWithTree() {
    this.boardWithTree = this.board.filter((e) => e.hasTree);
  }
}

// Définition of a Cell of the board
class Cell {
  constructor(index, richness) {
    this.index = index;
    this.richness = richness;
    this.hasTree = false;
    this.size = 0;
    this.ennemyTree = false;
    this.myTree = false;
  }

  updateCell(size, isMine, isDormant) {
    this.hasTree = true;
    this.size = size;
    if (isMine > 0) {
      this.myTree = true;
    } else {
      this.ennemyTree = true;
    }
  }
}

const numberOfCells = parseInt(readline()); // 37
let game = new Game();
let player = new Player();
let ennemy = new Player();
for (let i = 0; i < numberOfCells; i++) {
  var inputs = readline().split(" ");
  const index = parseInt(inputs[0]); // 0 is the center cell, the next cells spiral outwards
  const richness = parseInt(inputs[1]); // 0 if the cell is unusable, 1-3 for usable cells
  const neigh0 = parseInt(inputs[2]); // the index of the neighbouring cell for each direction
  const neigh1 = parseInt(inputs[3]);
  const neigh2 = parseInt(inputs[4]);
  const neigh3 = parseInt(inputs[5]);
  const neigh4 = parseInt(inputs[6]);
  const neigh5 = parseInt(inputs[7]);
  game.board[i] = new Cell(index, richness);
}

// game loop
while (true) {
  const day = parseInt(readline()); // the game lasts 24 days: 0-23
  const nutrients = parseInt(readline()); // the base score you gain from the next COMPLETE action
  var inputs = readline().split(" ");
  const sun = parseInt(inputs[0]); // your sun points
  const score = parseInt(inputs[1]); // your current score
  var inputs = readline().split(" ");
  const oppSun = parseInt(inputs[0]); // opponent's sun points
  const oppScore = parseInt(inputs[1]); // opponent's score
  const oppIsWaiting = inputs[2] !== "0"; // whether your opponent is asleep until the next day
  const numberOfTrees = parseInt(readline()); // the current amount of trees

  // Implémente les Players et le Game
  // On incrémente le jour, si nouveau jour on met le paramètre nouveau jour à true;
  game.updateGame(day, nutrients, numberOfTrees);
  player.updatePlayer(sun, score);
  ennemy.updatePlayer(oppSun, oppScore, oppIsWaiting);

  let treeCheck = [];
  for (let i = 0; i < numberOfTrees; i++) {
    var inputs = readline().split(" ");
    const cellIndex = parseInt(inputs[0]); // location of this tree
    const size = parseInt(inputs[1]); // size of this tree: 0-3
    const isMine = inputs[2] !== "0"; // 1 if this is your tree
    const isDormant = inputs[3] !== "0"; // 1 if this tree is dormant
    treeCheck.push(cellIndex);
    // Implémente les cases du board ou il y a un arbre
    game.board[cellIndex].updateCell(size, isMine, isDormant);
  }
  // On repasse pour enelever les arbres qui ont disparu
  game.cleanBoard(treeCheck);
  // Update le tableau des arbres
  game.sortCellsWithTree();
  // Update le tableau des arbres du joueur
  player.getTrees(game);
  // On définit l'action
  let action = player.defineAction(game, ennemy);

  const numberOfPossibleMoves = parseInt(readline());
  for (let i = 0; i < numberOfPossibleMoves; i++) {
    const possibleMove = readline();
  }

  // Write an action using console.log()
  // To debug: console.error('Debug messages...');

  // GROW cellIdx | SEED sourceIdx targetIdx | COMPLETE cellIdx | WAIT <message>
  console.log(action);
}
