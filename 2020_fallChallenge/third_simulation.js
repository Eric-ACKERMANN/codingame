// Utils

// inv=[1,2,3,4] , delta=[3,4,5,6], retourne true si la différence de chaque element des tableaux est positive ou nulle
function usable(inv, delta) {
  let bool = true;
  inv.forEach((p, index) => {
    if (p + delta[index] < 0) {
      bool = false;
    }
  });
  return bool;
}

// Fonction qui renvoie suivant facteur demandé :
// la somme des élements de deux tableaux
// Le tableau dont chaque élément est la somme des élements correspondant de chaque tableau
function sumArrayElement(inv, delta) {
  let sum = 0;
  inv.forEach((e, index) => {
    sum = sum + e + delta[index];
  });
  return sum;
}

// Fonction qui additionne un à un les élemtns de 2 tableaux et renvoie le tableau;
function sumArray(inv, delta) {
  let sumArray = new Array(inv.length);
  inv.forEach((el, index) => {
    sumArray[index] = el + delta[index];
  });
  return sumArray;
}

// Pré-game variables

// Un compteur
let compteur = 0;

class Spell {
  constructor(id, delta, repeatable, taxCount, tomeIndex) {
    this.id = id;
    this.delta = delta;
    this.castable = 1;
    this.repeatable = repeatable;
    if (typeof taxCount === "number" && typeof tomeIndex === "number") {
      this.taxCount = taxCount || 0;
      this.tomeIndex = tomeIndex || 0;
    }
  }
  // Un sort est castable si :
  // 1. On a les ressources pour le lancer
  // 2. La somme des ingrédients en résultat est inf à 10
  // 3. il est castable
  isCastable(inv) {
    if (
      usable(inv, this.delta) &&
      sumArrayElement(inv, this.delta) <= 10 &&
      this.castable
    ) {
      return true;
    }
    return false;
  }
}

// SB
class SpellBook {
  constructor(list = []) {
    this.list = list;
    this.deltas = [];
  }

  // Updates SpellBook with spells and spells state
  updateSB(id, delta, castable, repeatable, taxCount, tomeIndex) {
    const SBIds = this.list.map((e) => {
      return e.id;
    });
    if (!SBIds.includes(id)) {
      this.list.push(new Spell(id, delta, repeatable, taxCount, tomeIndex));
      this.deltas.push(delta);
    } else {
      const index = SBIds.indexOf(id);
      this.list[index].castable = castable;
    }

    // On détermine le tableau des deltas
  }

  // Trouver l'id du spell avec le tomeIndex le plus bas
  findLowestSpell() {
    this.list.sort((a, b) => {
      return a.tomeIndex - b.tomeIndex;
    });
    return this.list[0].id;
  }

  // Créer une copie de la liste des sorts
  duplicateList() {
    let newArray = new Array(this.list.length);
    this.list.forEach((el, index) => {
      newArray[index] = new Spell(
        el.id,
        el.delta,
        el.repeatable,
        el.taxCount,
        el.tomeIndex
      );
    });
    return newArray;
  }

  setAllSpellCastable() {
    this.list.forEach((el) => {
      el.castable = 1;
    });
  }
}

class Potion {
  constructor(id, delta, price) {
    this.id = id;
    this.delta = delta;
    this.price = price;
  }
}

//Merch
class Shop {
  constructor() {
    this.list = [];
  }
  // Méthode qui permet de mettre le shop à jour
  setList(id, delta, price) {
    const ListIds = this.list.map((e) => {
      return e.id;
    });
    if (!ListIds.includes(id)) {
      this.list.push(new Potion(id, delta, price));
    }
  }
}

// Me, Op
class Player {
  constructor() {
    this.score = 0;
    this.scoreHistory = [];
    this.ScoreHasChanged = false;
    this.stock = [3, 0, 0, 0];
    this.spellBook = new SpellBook();
    this.action = "WAIT";
    // La target est un id
    this.target = 0;
  }

  // Méthode qui met le score du joueur à jour, stocke le score dans l'historique des scores, et vérifie si le score du joueur a changé
  setScore(score) {
    this.score = score;
    const scorePrevious = this.scoreHistory[this.scoreHistory.length - 1];
    this.scoreHistory.push(score);
    if (scorePrevious !== score) {
      this.ScoreHasChanged = true;
    }
  }

  simulation() {
    // Pour chaque potion, on détermine la potion la plus rapide à avoir
    // On loop sur chaque potion et on détermine le nbre de tours nécessaire
    for (let i = 0; i < Merch.list.length; i++) {
      const { delta } = Merch.list[i];
      // On détermine l'écart avec notre inventaire
      const goal = sumArray(Me.stock, delta);
      // On loope sur les sorts pour savoir combien il en faut;
    }
  }

  // Input : a Stock , a spellBook, and the Id of a spell that is in the spellbook
  // Output : New Stock (not entrance stock modified), !!!
  // Modify : The spellbook that is in entrance
  sim_SpellCast(stock, spellBook, spell) {
    const newStock = sumArray(stock, spell.delta);
    spellBook.list.forEach((el) => {
      if (el.id === spell.id) {
        el.castable = 0;
      }
    });
    return newStock;
  }

  //Méthode qui permet d'utiliser le premier sort disponible
  // Input : liste des sorts, stock
  // Output : le sort à utiliser. Si pas de sort utilisable, renvoie false
  setFirstSpellOrRest(spell_list, stock) {
    for (let i = 0; i < spell_list.length; i++) {
      const spell = spell_list[i];
      if (spell.isCastable(stock)) return spell;
    }
    return { id: "REST" };
  }

  setAction() {
    //3ème Scénario , Simulation (sans grimoire, adversaire, ou sort répétable);
    this.simulation();
    this.action = "WAIT";
    this.target = "";
  }
}

let Me = new Player();
let Op = new Player();

let Merch = new Shop();
let Grimoire = new SpellBook();

// game loop
while (true) {
  const actionCount = parseInt(readline()); // the number of spells and recipes in play
  let id = 0;
  // On réinitialise l'inventaire de merch au début de chaque tour
  Merch.list = [];
  // On réinitialise le grimoire au début de chaque tour
  Grimoire.inventory = [];
  for (let i = 0; i < actionCount; i++) {
    var inputs = readline().split(" ");
    const actionId = parseInt(inputs[0]); // the unique ID of this spell or recipe
    const actionType = inputs[1]; // in the first league: BREW; later: CAST, OPPONENT_CAST, LEARN, BREW
    const delta0 = parseInt(inputs[2]); // tier-0 ingredient change
    const delta1 = parseInt(inputs[3]); // tier-1 ingredient change
    const delta2 = parseInt(inputs[4]); // tier-2 ingredient change
    const delta3 = parseInt(inputs[5]); // tier-3 ingredient change
    const price = parseInt(inputs[6]); // the price in rupees if this is a potion
    const tomeIndex = parseInt(inputs[7]); // in the first two leagues: always 0; later: the index in the tome if this is a tome spell, equal to the read-ahead tax
    const taxCount = parseInt(inputs[8]); // in the first two leagues: always 0; later: the amount of taxed tier-0 ingredients you gain from learning this spell
    const castable = inputs[9] !== "0"; // in the first league: always 0; later: 1 if this is a castable player spell
    const repeatable = inputs[10] !== "0"; // for the first two leagues: always 0; later: 1 if this is a repeatable player spell

    const delta = [delta0, delta1, delta2, delta3];
    if (actionType === "BREW") {
      Merch.setList(actionId, delta, price);
    }
    if (actionType === "CAST") {
      Me.spellBook.updateSB(actionId, delta, castable, repeatable);
    }
    if (actionType === "OPPONENT_CAST") {
      Op.spellBook.updateSB(actionId, delta, castable);
    }
    if (actionType === "LEARN") {
      Grimoire.updateSB(
        actionId,
        delta,
        castable,
        repeatable,
        taxCount,
        tomeIndex
      );
    }
  }
  for (let i = 0; i < 2; i++) {
    var inputs = readline().split(" ");
    const inv0 = parseInt(inputs[0]); // tier-0 ingredients in inventory
    const inv1 = parseInt(inputs[1]);
    const inv2 = parseInt(inputs[2]);
    const inv3 = parseInt(inputs[3]);
    const score = parseInt(inputs[4]); // amount of rupees

    if (i === 0) {
      Me.setScore(score);
      Me.stock = [inv0, inv1, inv2, inv3];
    }
    if (i === 1) {
      Op.setScore(score);
      Op.stock = [inv0, inv1, inv2, inv3];
    }
  }

  Me.setAction();

  // Write an action using console.log()
  // To debug: console.error('Debug messages...');

  compteur = compteur + 1;
  // in the first league: BREW <id> | WAIT; later: BREW <id> | CAST <id> [<times>] | LEARN <id> | REST | WAIT
  switch (Me.action) {
    case "BREW":
    case "CAST":
    case "LEARN":
      console.log(Me.action + " " + Me.target);
      break;
    default:
      console.log(Me.action);
  }
}
