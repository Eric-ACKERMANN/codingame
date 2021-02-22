const setAction = function () {
  // 2eme SCENARIO : Qui permet d'apprendre des sorts
  // 1. On apprend le premier Spell
  let idLearn = Grimoire.findLowestSpell();
  console.error("id", idLearn);
  this.action = "LEARN";
  this.target = idLearn;
  return;

  // 1ER SCENARIO : Qui emmene jusque Bronze
  // 1. On regarde si on peut faire une potion, si oui on la fait, si non instruction suivante
  const idMerch = this.inventory.brewable(Merch);
  if (idMerch) {
    console.error("BREW");
    this.action = "BREW";
    this.target = idMerch;
    return;
  }
  // 2. On lance le premier sort disponible
  const idSpell = this.spellBook.castable(this.inventory);
  if (idSpell) {
    console.error("CAST");
    this.action = "CAST";
    this.target = idSpell;
    return;
  }
  this.action = "REST";
  this.target = 0;
  return;
};
