// Pré-game variables
let myInventory = new Array(4);
let opInventory = new Array(4);

// game loop
while (true) {
  const actionCount = parseInt(readline()); // the number of spells and recipes in play
  let id = 0;
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
    console.error("");
    console.error("actionId", actionId);
    console.error("actionType", actionType);
    console.error("delta", [delta0, delta1, delta2, delta3]);
    console.error("price", price);
    console.error("castable", castable);

    id = actionId;
  }
  for (let i = 0; i < 2; i++) {
    var inputs = readline().split(" ");
    const inv0 = parseInt(inputs[0]); // tier-0 ingredients in inventory
    const inv1 = parseInt(inputs[1]);
    const inv2 = parseInt(inputs[2]);
    const inv3 = parseInt(inputs[3]);
    const score = parseInt(inputs[4]); // amount of rupees
    if (i === 0) myInventory = [inv0, inv1, inv2, inv3];
    if (i === 1) opInventory = [inv0, inv1, inv2, inv3];
  }
  console.error("myInventory", myInventory);
  console.error("opInventory", opInventory);
  // Write an action using console.log()
  // To debug: console.error('Debug messages...');

  // in the first league: BREW <id> | WAIT; later: BREW <id> | CAST <id> [<times>] | LEARN <id> | REST | WAIT
  console.log("BREW " + id);
}
