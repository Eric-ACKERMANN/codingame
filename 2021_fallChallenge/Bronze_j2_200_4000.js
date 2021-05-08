const ENDGAME_PARAMETER = 5;
const Prioritary_Target = [25, 22, 19, 34, 31, 28];
const COST_2_TO_3_LIMIT = 12;

// Définition of the Player
class Player {
  constructor() {
    this.sun = 0;
    this.score = 0;
    this.waiting = false;
    this.myTrees = [];
    this.action = "WAIT";
    this.costToSeed = 0;
    this.cost0to1 = 0;
    this.cost1to2 = 0;
    this.cost2to3 = 0;
    this.expectedSun = 0;
    this.isWaiting = false;
  }

  getTrees() {
    this.myTrees = game.trees.filter((e) => e.isMine);
    this.defineGrowCost();
  }

  defineGrowCost() {
    this.cost2to3 = 7;
    this.cost1to2 = 3;
    this.cost0to1 = 1;
    this.costToSeed = 0;
    for (let tree of this.myTrees) {
      switch (tree.size) {
        case 0:
          this.costToSeed++;
          break;
        case 1:
          this.cost0to1++;
          break;
        case 2:
          this.cost1to2++;
          break;
        case 3:
          this.cost2to3++;
          break;
        default:
          console.error("Tree of wrong size");
      }
    }
  }

  seed(game) {
    // Pour planter, on regarde la size du tree. On tourne sur chaque tree, et on détermine celui qui a le meilleur arbre à planter.
    let target = {
      sourceCellIndex: false,
      targetCellIndex: false,
      richness: false,
    };
    for (let tree of this.myTrees) {
      let tempTarget = {
        sourceCellIndex: false,
        targetCellIndex: false,
        richness: false,
      };
      // 1 On cherche la solution de l'arbre
      let size = tree.size;
      // 1.1.1 On passe les arbres de taille 0 car ils ne peuvent planter
      if (size === 0) continue;
      // 1.2 On détermine tous ses voisins
      let neighbors = Array.from(tree.twoCaseNeighbors);
      if (size > 2)
        neighbors = neighbors.concat(Array.from(tree.threeCaseNeighbors));

      // 1.3 On trie en fonction de la richesse du sol
      neighbors.sort((a, b) => game.board[a].richness - game.board[b].richness);
      // 1.4 On prend le plus riche ou il est possible de planter

      for (let cellIndex of neighbors) {
        if (game.trees.some((e) => e.cellIndex === cellIndex)) continue;
        tempTarget = {
          sourceCellIndex: tree.cellIndex,
          targetCellIndex: cellIndex,
          richness: game.board[cellIndex].richness,
        };

        //2 On regarde si elle est meilleure que celle actuelle

        if (tempTarget.richness > target.richness) {
          target = tempTarget;
        }
      }
    }

    if (target.sourceCellIndex !== false && target.sourceCellIndex >= 0) {
      return `SEED ${target.sourceCellIndex} ${target.targetCellIndex}`;
    } else {
      return false;
    }
  }

  growTo(size) {
    let cost = 0;
    let action = "";
    switch (size) {
      case 1:
        cost = this.cost0to1;
        action = "GROW";
        break;
      case 2:
        cost = this.cost1to2;
        action = "GROW";
        break;
      case 3:
        cost = this.cost2to3;
        action = "GROW";
        break;
      case 4:
        cost = 4;
        action = "COMPLETE";
        break;
      default:
        console.error("Cost problem");
    }

    if (this.myTrees.some((e) => e.size === size - 1) && this.sun >= cost) {
      let trees = this.myTrees.filter((e) => e.size === size - 1);
      return `${action} ${trees[0].cellIndex}`;
    } else return false;
  }

  defineAction(game) {
    // 2.On regarde si il y a un arbre de size 3 et si oui on le complete

    let action = "";
    if (this.cost2to3 > COST_2_TO_3_LIMIT) {
      action = this.growTo(4);
    }
    // 4. Si on peut faire pousser un arbre de 1 à 2, alors on le fait
    if (game.endgame && !action) action = this.growTo(4);
    if (!action) action = this.growTo(3);
    // 3. Si on peut faire pousser un arbre de 1 à 2, alors on le fait
    if (!action) action = this.growTo(2);
    // 3. Si on peut faire pousser un arbre de 1 à 2, alors on le fait
    if (!action) action = this.growTo(1);

    // 5. Si on peut lancer une graine, alors on lance une graine
    if (!action) action = this.seed(game);
    // 6. Sinon on WAIT
    if (!action) action = "WAIT";
    if (action === false) action = "WAIT";
    console.error(action);
    return action;
  }
}

class Trees {
  constructor(
    cellIndex,
    size,
    isMine,
    isDormant,
    oneCaseNeighbors,
    twoCaseNeighbors,
    threeCaseNeighbors
  ) {
    this.cellIndex = cellIndex;
    this.size = size;
    this.isMine = isMine;
    this.isDormant = isDormant;
    this.oneCaseNeighbors = oneCaseNeighbors;
    this.twoCaseNeighbors = twoCaseNeighbors;
    this.threeCaseNeighbors = threeCaseNeighbors;
  }
}

// Définition of the Game
class Game extends Array {
  constructor() {
    super();
    this.gameLength = 24;
    this.last3round = false;
    this.endgame = false;
    this.nutrients = 0;
    this.board = [];
    this.possibleActions = [];
    this.trees = new Array();
    this.day = 0;
    this.numberOfTrees = 0;
    this.sunDirection = 0;
  }
  setNeighbors() {
    for (let cell of this.board) {
      cell.setNeighbors(this.board);
    }
  }

  setEndgame() {
    if (this.gameLength - this.day < ENDGAME_PARAMETER) {
      this.endgame = true;
    }
  }
}

// Définition of a Cell of the board
class Cell {
  constructor(index, richness, neighbors) {
    this.index = index;
    this.richness = richness;
    this.neighbors = neighbors;
    this.oneCaseNeighbors = new Set();
    this.twoCaseNeighbors = new Set();
    this.threeCaseNeighbors = new Set();
  }

  setNeighbors(board) {
    for (let neighbor of this.neighbors) {
      if (neighbor >= 0) {
        this.oneCaseNeighbors.add(neighbor);
      } else {
        continue;
      }
    }
    for (let oneCaseNeighbor of this.oneCaseNeighbors) {
      const neighbors = board[oneCaseNeighbor].neighbors;
      for (let neighbor of neighbors) {
        if (
          neighbor < 0 ||
          neighbor === this.index ||
          this.oneCaseNeighbors.has(neighbor)
        ) {
          continue;
        } else {
          this.twoCaseNeighbors.add(neighbor);
        }
      }
    }
    for (let twoCaseNeighbors of this.twoCaseNeighbors) {
      const neighbors = board[twoCaseNeighbors].neighbors;
      for (let neighbor of neighbors) {
        if (
          neighbor < 0 ||
          this.oneCaseNeighbors.has(neighbor) ||
          this.twoCaseNeighbors.has(neighbor)
        ) {
          continue;
        } else {
          this.threeCaseNeighbors.add(neighbor);
        }
      }
    }
  }
}

const numberOfCells = parseInt(readline()); // 37
let game = new Game();
let player = new Player();
let opponent = new Player();
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
  game.board.push(
    new Cell(index, richness, [neigh0, neigh1, neigh2, neigh3, neigh4, neigh5])
  );
}
// Set neighbors for each Cell of the board
game.setNeighbors();

// game loop
while (true) {
  game.day = parseInt(readline()); // the game lasts 24 days: 0-23
  game.setEndgame();
  game.nutrients = parseInt(readline()); // the base score you gain from the next COMPLETE action
  var inputs = readline().split(" ");
  player.sun = parseInt(inputs[0]); // your sun points
  player.score = parseInt(inputs[1]); // your current score
  var inputs = readline().split(" ");
  opponent.sun = parseInt(inputs[0]); // opponent's sun points
  opponent.score = parseInt(inputs[1]); // opponent's score
  opponent.isWaiting = inputs[2] !== "0"; // whether your opponent is asleep until the next day
  game.numberOfTrees = parseInt(readline()); // the current amount of trees
  game.sunDirection = game.day % 6;
  game.trees = [];
  for (let i = 0; i < game.numberOfTrees; i++) {
    var inputs = readline().split(" ");
    const cellIndex = parseInt(inputs[0]); // location of this tree
    const size = parseInt(inputs[1]); // size of this tree: 0-3
    const isMine = inputs[2] !== "0"; // 1 if this is your tree
    const isDormant = inputs[3] !== "0"; // 1 if this tree is dormant
    game.trees.push(
      new Trees(
        cellIndex,
        size,
        isMine,
        isDormant,
        game.board[cellIndex].oneCaseNeighbors,
        game.board[cellIndex].twoCaseNeighbors,
        game.board[cellIndex].threeCaseNeighbors
      )
    );
  }

  // Update le tableau des arbres du joueur
  player.getTrees(game);
  // On définit l'action
  let action = player.defineAction(game);

  game.possibleActions = [];
  const numberOfPossibleAction = parseInt(readline());
  for (let i = 0; i < numberOfPossibleAction; i++) {
    const possibleAction = readline();
    game.possibleActions.push(possibleAction);
  }

  // Write an action using console.log()
  // To debug: console.error('Debug messages...');

  // GROW cellIdx | SEED sourceIdx targetIdx | COMPLETE cellIdx | WAIT <message>
  console.log(action);
}
