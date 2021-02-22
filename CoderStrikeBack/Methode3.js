/////////// 3-EME METHODE //////////////
let previousCheckpointDist = false;

// Coordonnées des différents checkpoints
let checkpoints = [];
// Variable permettant de savoir si un tour complet a était fait
let completeLap = false;

// Variable qui permet de savoir si le boost est disponible
let boostAvailable = true;
// Distance entre pod et target minimal pour le boost
let distanceBoost = 5000;
// Width of CP 600, adjusted to 550 for precision lack
let CPwidth = 250;
// Tableau reliant distance et vitesse à donner
const distanceLimits = [
  { distance: 100000, acceleration: 100 },
  { distance: 1750, acceleration: 100 },
  { distance: 1200, acceleration: 70 },
  { distance: 1000, acceleration: 50 },
  { distance: 750, acceleration: 25 }
];
// Angle de rupture
let ruptureAngle = 90;

// Fonction pour calculer la distance entre 2 points A et B.
const distanceBetween = (a, b) => Math.hypot(a.X - b.X, a.Y - b.Y);

// Il s'agit de remplir le tableau avec les coordonnées des checkpoints
// Vérifier si un objet se situe dans le tableau
const isNewCheckpoint = function(checkpoints, nextCheckpoint) {
  for (let i = 0; i < checkpoints.length; i++) {
    if (
      arePositionsEqual(checkpoints[i], nextCheckpoint) &&
      indexOf(nextCheckpoint, checkpoints) !== checkpoints.length - 1
    ) {
      return false;
    } else {
      continue;
    }
  }
  return true;
};

// Savoir si 2 positions sont les mêmes
const arePositionsEqual = function(position1, position2) {
  if (position1.X === position2.X && position1.Y === position2.Y) {
    return true;
  } else return false;
};

// Renvoyer l'index d'une position qui se trouve dans le tableau des checkpoints
const indexOf = function(position, checkpoints) {
  for (let i = 0; i < checkpoints.length; i++) {
    if (arePositionsEqual(checkpoints[i], position)) {
      return i;
    } else continue;
  }
  return -1;
};

// Récupèrer le CP suivant
const getNextCP = function(index, checkpoints) {
  if (index !== checkpoints.length - 1) {
    return checkpoints[index + 1];
  } else return checkpoints[0];
};

// déterminer le point le plus proche, entre une cible (point2) de rayon "radius" et un point1.
const findTarget = function(point1, point2, radiusPoint2) {
  let targetX;
  // Soit la droite de coefficient directeur y = a*x + b, qui relie le point1 et le point2
  let a = (point2.Y - point1.Y) / (point2.X - point1.X);
  // b = y - a * x
  let b = point1.Y - a * point1.X;

  // Les 2 intersections ont donc pour x
  let x1 = point2.X + radiusPoint2 / Math.sqrt(1 + a * a);
  let x2 = point2.X - radiusPoint2 / Math.sqrt(1 + a * a);

  let y1 = a * x1 + b;
  let y2 = a * x2 + b;

  // Soit inter1 et inter2 les 2 points d'intersection
  let inter1 = { X: x1, Y: y1 };
  let inter2 = { X: x2, Y: y2 };

  // Pour savoir quel point est le plus proche, on calcule la distance entre point1 et le point d'intersection
  let dist1 = distanceBetween(point1, inter1);
  let dist2 = distanceBetween(point1, inter2);

  // On renvoie la distance la plus faible entre les 2
  if (dist1 < dist2) {
    return inter1;
  } else {
    return inter2;
  }
};

const setTarget = function(completeLap, CP1, checkpoints, podPosition) {
  let target;
  if (completeLap === true) {
    // On récupère la position du CP dans le tableau
    let index = indexOf(CP1, checkpoints);
    // On récupère le prochain CP
    let CP2 = getNextCP(index, checkpoints);
    // On prend comme target le point le plus proche entre les 2 CP
    target = findTarget(CP2, CP1, CPwidth);
  } else {
    target = findTarget(podPosition, CP1, CPwidth);
  }
  return target;
};

const setAcceleration = function(
  podPosition,
  target,
  nextCheckpointAngle,
  completeLap
) {
  let acceleration;
  let distance;

  // Si la cible est loin, et l'angle faible, alors BOOST et pas au premier tour
  if (
    distanceBetween(podPosition, target) > distanceBoost &&
    boostAvailable &&
    nextCheckpointAngle === 0 &&
    completeLap
  ) {
    boostAvailable = false;
    return "BOOST";
  }
  if (
    nextCheckpointAngle > ruptureAngle ||
    nextCheckpointAngle < -ruptureAngle
  ) {
    acceleration = 0;
  } else {
    distance = distanceBetween(podPosition, target);
    for (let i = 0; i < distanceLimits.length; i++) {
      if (distance < distanceLimits[i].distance) {
        acceleration = distanceLimits[i].acceleration;
      }
    }
  }

  return acceleration;
};

// game loop
while (true) {
  /* ------------ DONNEES AU DEMARRAGE DU TOUR ------------ */
  var inputs = readline().split(" ");
  // Position of the pod
  const podPosition = { X: parseInt(inputs[0]), Y: parseInt(inputs[1]) };

  // Position of the next checkpoint
  const CP1 = {
    X: parseInt(inputs[2]),
    Y: parseInt(inputs[3])
  };

  // Distance to next checkpoint
  const nextCheckpointDist = parseInt(inputs[4]);

  // angle between your pod orientation and the direction of the next checkpoint
  const nextCheckpointAngle = parseInt(inputs[5]);

  var inputs = readline().split(" ");
  // Opponent position
  const opponentPosititon = { X: parseInt(inputs[0]), Y: parseInt(inputs[1]) };

  /* ------------ FIN DONNEES AU DEMARRAGE DU TOUR ------------ */

  /* ------------ DEBUT DES CALCULS POUR DTERMINER COMPORTEMENT POUR CE TOUR ------------ */

  // Le prochain checkpoint est il nouveau ?
  if (indexOf(CP1, checkpoints) === -1) {
    checkpoints.push(CP1);
  } else if (indexOf(CP1, checkpoints) !== checkpoints.length - 1) {
    completeLap = true;
  }

  // On définit la cible
  let target = setTarget(completeLap, CP1, checkpoints, podPosition);
  // On définit l'accélération à donner

  // L'accélération dépend de la distance avec la target, l'angle et c'est tout.
  let acceleration = setAcceleration(
    podPosition,
    target,
    nextCheckpointAngle,
    completeLap
  );
  console.log(
    `${Math.round(target.X)} ${Math.round(target.Y)} ${acceleration}`
  );
} // fin du while
