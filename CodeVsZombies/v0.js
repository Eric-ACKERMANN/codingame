/**
 * Save humans, destroy zombies!
 **/

// Foncitons pures
function setIsDeadToTrue(array) {
  array.forEach((element) => (element.isDead = true));
  return array;
}

function calcDistance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function calcTurn(dist, distPerTurn) {
  return Math.ceil(dist / distPerTurn);
}

// CLASS
class Human {
  constructor(position, id) {
    this.position = position;
    this.id = id;
    this.isDead = false;
    this.distToAllMob = [];
    this.killingMob = {};
    this.turnToDeath = Number;
  }

  isAlive() {
    this.isDead = false;
  }

  setDistanceToAllMobs(mobs) {
    let distToAllMob = [];
    mobs.forEach((mob) => {
      if (mob.isDead === false) {
        const dist = calcDistance(mob.position, this.position);
        distToAllMob.push({
          mob: mob,
          distance: dist,
          turnToContact: calcTurn(dist, 400),
        });
      }
    });
    this.distToAllMob = distToAllMob;
  }

  setKillingMob() {
    // On détermine le mob responsable de la mort
    let killingMob = {};
    let minDist = 100000;
    // console.warn("distToAllMob",this.distToAllMob)
    this.distToAllMob.forEach((mob) => {
      if (
        mob.mob.isInterceptable &&
        mob.mob.isDead === false &&
        mob.distance < minDist
      ) {
        minDist = mob.distance;
        this.killingMob = mob;
        this.turnToDeath = mob.turnToContact;
      }
    });
  }
}

class Hero extends Human {
  constructor(position) {
    super(position);
    this.positionNext = position;
    this.range = 2000;
    this.closestZombiePositionNext = undefined;
  }

  setClosestZombie(array) {
    let distanceMini = 100000;
    let id = 1000;
    for (let i = 0; i < array.length; i++) {
      if (array[i].isDead === false) {
        const distance = calcDistance(array[i].positionNext, this.position);

        if (distance < distanceMini) {
          distanceMini = distance;
          id = i;
        }
      }
    }
    this.closestZombiePositionNext = array[id].positionNext;
  }
  // FONCTION QUI DETERMINE LA PROCHAINE POSITION
  // Pour le moment on vise la future position du plus proche zombie
  setPositionNext(pos) {
    this.positionNext = pos;
  }
}

class Zombie extends Human {
  constructor(position, positionNext, id) {
    super(position, id);
    this.positionNext = positionNext;
    this.isDead = false;
    this.distanceToHeroNext = 0;
    this.isInterceptable = true;
  }

  setDistanceToHeroNext(AshPosition) {
    this.distanceToHeroNext = calcDistance(this.positionNext, AshPosition);
  }

  update(position, positionNext, AshPos) {
    this.isDead = false;
    this.position = position;
    this.positionNext = positionNext;
    this.distanceToHeroNext = this.setDistanceToHeroNext(positionNext, AshPos);
    this.isInterceptable = true;
  }
}

// Stratégie 2
function findNextHumanToDie(humans) {
  let nextToDie = {};
  for (let i = 0; i < humans.length; i++) {
    if (humans[i].isDead === false) {
      nextToDie = humans[i];
    }
  }
  humans.forEach((human) => {
    if (human.isDead === false && human.turnToDeath < nextToDie.turnToDeath) {
      nextToDie = human;
    }
  });
  return nextToDie;
}

function findZombieToTarget(human, zombies) {
  return zombies[human.killingMob.mob.id];
}

function setTrajectory(killer, victim) {
  const n = victim.turnToDeath;
  let trajectory = [];
  let position = { ...killer.position };
  const dirX = killer.positionNext.x - killer.position.x;
  const dirY = killer.positionNext.y - killer.position.y;
  const dir = { x: dirX, y: dirY };
  for (let i = 0; i < n; i++) {
    const newPos = {};
    newPos.x = position.x + i * dirX;
    newPos.y = position.y + i * dirY;
    trajectory.push(newPos);
  }
  trajectory.push(victim.position);
  return trajectory;
}

function setInterception(traj, pos) {
  for (let i = 0; i < traj.length; i++) {
    const dist = calcDistance(pos, traj[i]);
    if (dist < 2000 + i * 1000) {
      return { isInterceptable: true, pos: traj[i] };
    }
  }
  return { isInterceptable: false };
}

// INITIALISATION DE LA PARTIE
// Création du héro
let Ash = new Hero();
let humans = [];
let zombies = [];
let compteur = 0;

// game loop
while (true) {
  // Parapmètres du héro
  var inputs = readline().split(" ");
  const x = parseInt(inputs[0]);
  const y = parseInt(inputs[1]);
  // Au début du tour, mise à jour de la position de Ash
  Ash.position = { x: x, y: y };
  // On reset la distance

  // HUMAINS
  const humanCount = parseInt(readline());

  // Création  du tableau d'humains
  if (compteur === 0) {
    humans = new Array(humanCount);
  }

  // On note que tous les humains sont morts
  humans = setIsDeadToTrue(humans);

  for (let i = 0; i < humanCount; i++) {
    var inputs = readline().split(" ");
    const humanId = parseInt(inputs[0]);
    const humanX = parseInt(inputs[1]);
    const humanY = parseInt(inputs[2]);

    // 1er Tour : Création des Humains
    if (compteur === 0) {
      humans[humanId] = new Human({ x: humanX, y: humanY }, humanId);
    }

    // CHAQUE TOUR
    // On note que l'humain est en vie
    humans[humanId].isAlive();
  }

  // ZOMBIES
  const zombieCount = parseInt(readline());
  // 1er Tour : Création  du tableau de zombies
  if (compteur === 0) {
    zombies = new Array(zombieCount);
  }
  // On note que tous les zombies sont morts
  zombies = setIsDeadToTrue(zombies);

  for (let i = 0; i < zombieCount; i++) {
    var inputs = readline().split(" ");
    const zombieId = parseInt(inputs[0]);
    const zombieX = parseInt(inputs[1]);
    const zombieY = parseInt(inputs[2]);
    const zombieXNext = parseInt(inputs[3]);
    const zombieYNext = parseInt(inputs[4]);

    // 1er Tour : Création des Zombies
    if (compteur === 0) {
      zombies[zombieId] = new Zombie(
        { x: zombieX, y: zombieY },
        { x: zombieXNext, y: zombieYNext },
        zombieId
      );
    }

    // CHAQUE TOUR
    // Update du zombie (idDead to false, position, positionNext, distanceToHeroNext, isInterceptable to true)
    const position = { x: zombieX, y: zombieY };
    const positionNext = { x: zombieXNext, y: zombieYNext };
    zombies[zombieId].update(position, positionNext, Ash.position);
  }

  // STRATEGIE 2
  let bool = false;
  const zombiesCop = [...zombies];
  // console.warn("ZombiesCop", zombiesCop);
  // console.warn("humans",humans)
  let compteur2 = 0;
  while (bool === false) {
    // 1. Pour chaque Humain on détermine le nombre de tours restants avant d'être tuer
    humans.forEach((human) => {
      // 1.1 On calcule la distance avec tous les zombies
      human.setDistanceToAllMobs(zombiesCop);
      // 1.2 On détermine le zombie qui tuera et on marque le nombre de tours qu'il reste à vivre
      human.setKillingMob();
    });

    // 2. On trouve l'humain avec le moins de tour, on extrait le zombie à cibler
    nextHumanToDie = findNextHumanToDie(humans);
    // console.warn("nextHumanTodie", nextHumanToDie);
    zombieToTarget = findZombieToTarget(nextHumanToDie, zombiesCop);
    // console.warn("zombieToTarget", zombieToTarget)
    // 4. On détermine sa trajectoire et on détermine si on arrive à l'intercepter avec Ash
    // 4.1 On détermine la trajectoire du zombie dans un tableau de trajectoires
    const trajectory = setTrajectory(zombieToTarget, nextHumanToDie);
    // console.warn("trajectory",trajectory)
    // 4.2 On détermine si la trajectoire est interceptable par Ash et on en extrait le point
    contact = setInterception(trajectory, Ash.position);
    // console.warn("contact",contact)

    // 5. Si oui, on va à ce point de contact, si non on enl!ève le zombie des possibilités à étudier
    if (contact.isInterceptable === true) {
      posNext = contact.pos;
      Ash.setPositionNext(posNext);
      bool = true;
    } else {
      // console.warn("zombieToTarget", zombieToTarget)
      zombiesCop[zombieToTarget.id].isInterceptable = false;
    }
    compteur2 = compteur2 + 1;
    if (compteur2 > 30) {
      console.warn("hey");
      Ash.setClosestZombie(zombies);
      Ash.setPositionNext(Ash.closestZombiePositionNext);
      bool = true;
    }

    // Fin du while
  }

  // Incrémentation du compteur
  if (compteur === 0) compteur = compteur + 1;

  // Destination
  console.log(`${Ash.positionNext.x} ${Ash.positionNext.y}`); // Your destination coordinates
}

// To debug: console.error('Debug messages...');
