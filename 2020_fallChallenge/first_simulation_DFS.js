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

// Fonction qui renvoie la somme des élements de 2 tableaux
function sum(inv, delta) {
  let sum = 0;
  inv.forEach((e, index) => {
    sum = sum + e + delta[index];
  });
  return sum;
}

// Fonction qui additionne un à un les élemtns de 2 tableaux et renvoie le tableau;
function newSum(inv, delta) {
  let newSum = new Array(inv.length);
  inv.forEach((el, index) => {
    newSum[index] = el + delta[index];
  });
  return newSum;
}

// Function qui vérifie que ca donne pas plus de 3 pour les ingédients de type 1,2,3
function limit(inv, delta) {
  const limit = 3;
  let bool = true;
  inv.forEach((p, index) => {
    if (index > 0 && p + delta[index] > limit) {
      bool = false;
    }
  });

  return bool;
}

// Fonction qui fait une copie d'un tableau d'objets
function createVirt(array) {
  let arrayVirt = new Array(array.length);
  array.forEach((el, index) => {
    arrayVirt[index] = new Spell(
      el.id,
      el.delta,
      el.repeatable,
      el.taxCount,
      el.tomeIndex
    );
  });
  return arrayVirt;
}

// Pré-game variables

// Un compteur
let compteur = 0;

class Ingredient {
  constructor(value, stock) {
    this.value = value;
    this.stock = stock;
  }
}

class Inventory {
  constructor() {
    this.ingredients = [
      new Ingredient(0, 3),
      new Ingredient(1, 0),
      new Ingredient(2, 0),
      new Ingredient(3, 0),
    ];
  }

  brewable(Merch) {
    const stocks = this.ingredients.map((e) => {
      return e.stock;
    });
    for (let i = 0; i < Merch.inventory.length; i++) {
      const { delta, id } = Merch.inventory[i];
      if (usable(stocks, delta)) {
        return id;
      }
    }
    return false;
  }
}

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
  isCastable(inv, spell) {
    if (
      usable(inv, spell.delta) &&
      sum(inv, spell.delta) <= 10 &&
      spell.castable
    ) {
      return true;
    }
    return false;
  }
}

// SB
class SpellBook {
  constructor() {
    this.inventory = [];
  }
  updateSB(id, delta, castable, repeatable, taxCount, tomeIndex) {
    const SBIds = this.inventory.map((e) => {
      return e.id;
    });
    if (!SBIds.includes(id)) {
      this.inventory.push(
        new Spell(id, delta, repeatable, taxCount, tomeIndex)
      );
    } else {
      const index = SBIds.indexOf(id);
      this.inventory[index].castable = castable;
    }
  }
  // Méthode qui permet de définir si un sort est castable
  // Un sort est castable si il est dispo, et si en l'utilisant on ne dépasse 10 unité dans l'inventaire, et si on a les ingredients pour le lancer
  castable(array) {
    for (let i = 0; i < this.inventory.length; i++) {
      const { castable, delta } = this.inventory[i];
      const stocks = array.ingredients.map((e) => {
        return e.stock;
      });
      const sumIngredients = sum(stocks, delta);
      const spellUsable = usable(stocks, delta);
      // limit sert à ne pas avoir plus de 3 fois le même ingrédient d'un type 1,2 ou 3
      const limitIng = limit(stocks, delta);

      if (castable && spellUsable && sumIngredients <= 10 && limitIng) {
        return this.inventory[i].id;
      }
    }
    return false;
  }

  findLowestSpell() {
    this.inventory.sort((a, b) => {
      return a.tomeIndex - b.tomeIndex;
    });
    return this.inventory[0].id;
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
class Merchandise {
  constructor() {
    this.inventory = [];
  }
  // Méthode qui permet de mettre le tableau des merchandises à jour
  updateMerch(id, delta, price) {
    const MerchIds = this.inventory.map((e) => {
      return e.id;
    });
    if (!MerchIds.includes(id)) {
      this.inventory.push(new Potion(id, delta, price));
    }
  }
}

// Me, Op
class Player {
  constructor() {
    this.score = 0;
    this.scoreHistory = [];
    this.hasScoreChanged = false;
    this.inventory = new Inventory();
    this.spellBook = new SpellBook();
    this.action = "WAIT";
    // La target est un id
    this.target = 0;
  }

  // Méthode qui met le score du joueur à jour, stocke le score dans l'historique des scores, et vérifie si le score du joueur a changé
  updateScore(score) {
    this.score = score;
    const scorePrevious = this.scoreHistory[this.scoreHistory.length - 1];
    this.scoreHistory.push(score);
    if (scorePrevious !== score) {
      this.hasScoreChanged = true;
    }
  }
  // Méthode qui sert à mettre à jour l'inventaire de l'adversaire. Pour le moment ne sert à rien, main
  updateInventory(array) {
    for (let i = 0; i < array.length; i++) {
      this.inventory.ingredients[i].stock = array[i];
    }
  }

  loop = (inv, SpellBookInv, target, action = new Array(), lapCost = 0) => {
    console.warn("LAPCOST", lapCost);
    console.warn("inv", inv);
    // Cas ou c'est bon
    if (usable(inv, target)) {
      let newAction = [...action];
      newAction.push("BREWABLE");
      return { lapCost, newAction };
    }

    for (let i = 0; i < SpellBookInv.length; i++) {
      const spell = SpellBookInv[i];
      if (spell.isCastable(inv, spell)) {
        let newSpellBookInv = createVirt(SpellBookInv);
        let newSpell = newSpellBookInv[i];
        newSpell.castable = 0;
        let newInv = newSum(inv, newSpell.delta);
        let newAction = [...action];
        newAction.push("CAST " + newSpell.id);
        const newlapCost = lapCost + 1;
        this.loop(newInv, newSpellBookInv, target, newAction, newlapCost);
      }
    }
    // Aucun sort n'est jetable
    // SI la dernière action était un REST, alors on arrête, c'est qu'on est bloqué
    if (action[action.length - 1] !== "REST") {
      let newAction = [...action];
      newAction.push("REST");
      let newSpellBookInv = createVirt(SpellBookInv);
      newSpellBookInv.forEach((el) => {
        el.castable = 1;
      });
      const newLapCost = lapCost + 1;
      this.loop(inv, newSpellBookInv, target, newAction, newLapCost);
    }
  };

  simulation() {
    let SpellBookInv = createVirt(this.spellBook.inventory);

    let MeInvStock = this.inventory.ingredients.map((e) => {
      return e.stock;
    });
    // On force la target
    const targetDelta = Merch.inventory[0].delta;
    const targetId = Merch.inventory[0].id;
    console.warn("inv", MeInvStock, "target", targetDelta);
    const { lapCost, action, id } = this.loop(
      MeInvStock,
      SpellBookInv,
      targetDelta
    );
    console.error({ lapCost, action, id });
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

let Merch = new Merchandise();
let Grimoire = new SpellBook();

// game loop
while (true) {
  const actionCount = parseInt(readline()); // the number of spells and recipes in play
  let id = 0;
  // On réinitialise l'inventaire de merch au début de chaque tour
  Merch.inventory = [];
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
      Merch.updateMerch(actionId, delta, price);
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
      Me.updateScore(score);
      Me.updateInventory([inv0, inv1, inv2, inv3]);
    }
    if (i === 1) {
      Op.updateScore(score);
      Op.updateInventory([inv0, inv1, inv2, inv3]);
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
