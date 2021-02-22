/////////// 2-EME METHODE //////////////

let previousCheckpointX = 0;
let previousCheckpointY = 0;
let previousCheckpointAngle = false;
let previousCheckpointDist = false;
// Coordonnées des différents checkpoints
let previousCheckpoints = [];
// Distance au dernier checkpoint passé
let counter = 0;
let boost = true;
let thrust = 100;
// Calcul de la distance au précédent checkpoint
const distanceLastCheckpoint = function(oldCP, podX, podY) {
  return (distanceToOldCheckpoint = Math.pow(
    Math.pow(podX - oldCP.X, 2) + Math.pow(podY - oldCP.Y, 2),
    0.5
  ));
};

let count1 = 0;
let count2 = 0;
let count3 = 0;
let count4 = 0;
let countLimit = 4;
let angledePuissMax = 40;
let angledAcceleration = 90;
// game loop
while (true) {
  var inputs = readline().split(" ");

  const x = parseInt(inputs[0]);
  const y = parseInt(inputs[1]);
  const nextCheckpointX = parseInt(inputs[2]); // x position of the next check point
  const nextCheckpointY = parseInt(inputs[3]); // y position of the next check point
  const nextCheckpointDist = parseInt(inputs[4]); // distance to the next checkpoint
  const nextCheckpointAngle = parseInt(inputs[5]); // angle between your pod orientation and the direction of the next checkpoint
  var inputs = readline().split(" ");
  const opponentX = parseInt(inputs[0]);
  const opponentY = parseInt(inputs[1]);

  // previouscheckpoint, how to build it
  if (previousCheckpoints.length < 1) {
    previousCheckpoints.push({ X: nextCheckpointX, Y: nextCheckpointY });
  }
  if (
    previousCheckpoints[previousCheckpoints.length - 1].X !== nextCheckpointX
  ) {
    previousCheckpoints.push({ X: nextCheckpointX, Y: nextCheckpointY });
    count1 = 0;
    count2 = 0;
    count3 = 0;
    count4 = 0;
  }

  // Distance au précédent checkpoint
  if (previousCheckpoints.length >= 2) {
    previousCheckpointDist = distanceLastCheckpoint(
      previousCheckpoints[previousCheckpoints.length - 2],
      x,
      y
    );
  }
  console.warn("----------------------------------");
  console.warn("DATA WHITH WHICH BOT TAKES DECISION");
  console.warn("nextCheckpointDist", nextCheckpointDist);
  console.warn("nextCheckpointAngle", nextCheckpointAngle);
  console.warn("nextCheckpointDist", nextCheckpointDist);
  console.warn("previouscheckpointDist", previousCheckpointDist);
  console.warn("angledAcceleration", angledAcceleration);
  console.warn("angledePuissMax", angledePuissMax);
  console.warn("----------------------------------");

  ///////// BOOST ///////
  if (
    boost === true &&
    nextCheckpointDist > 7000 &&
    nextCheckpointAngle < 5 &&
    nextCheckpointAngle > -5
  ) {
    console.log(nextCheckpointX + " " + nextCheckpointY + " " + `BOOST`);
    boost = false;
  }
  // On crée des cercles autour des checkpoints
  let thrustNext = 0;
  let thrustPrevious = 0;
  // On a nextCheckpointDist et previousCheckpointDist
  if (nextCheckpointDist >= 8000) {
    thrustNext = 100;
    angledAcceleration = 80;
    angledePuissMax = 40;
  } else if (7000 <= nextCheckpointDist && nextCheckpointDist < 8000) {
    thrustNext = 100;
    angledAcceleration = 90;
    angledePuissMax = 80;
  } else if (6000 <= nextCheckpointDist && nextCheckpointDist < 7000) {
    thrustNext = 100;
    angledAcceleration = 60;
    angledePuissMax = 50;
  } else if (5000 <= nextCheckpointDist && nextCheckpointDist < 6000) {
    thrustNext = 100;
    angledAcceleration = 60;
    angledePuissMax = 30;
  } else if (4000 <= nextCheckpointDist && nextCheckpointDist < 5000) {
    thrustNext = 100;
    angledAcceleration = 55;
    angledePuissMax = 20;
  } else if (3000 <= nextCheckpointDist && nextCheckpointDist < 4000) {
    thrustNext = 100;
    angledAcceleration = 40;
    angledePuissMax = 20;
  } else if (2000 <= nextCheckpointDist && nextCheckpointDist < 3000) {
    count1++;
    if (count1 >= countLimit) {
      thrustNext = 100;
    } else {
      thrustNext = 80;
      angledAcceleration = 50;
      angledePuissMax = 20;
    }
  } else if (1000 <= nextCheckpointDist && nextCheckpointDist < 2000) {
    count2++;
    if (count2 >= countLimit) {
      thrustNext = 100;
    } else {
      thrustNext = 80;
      angledAcceleration = 30;
      angledePuissMax = 10;
    }
  } else if (500 <= nextCheckpointDist && nextCheckpointDist < 1000) {
    count3++;
    if (count3 >= countLimit) {
      thrustNext = 100;
    } else {
      thrustNext = 60;
      angledAcceleration = 10;
      angledePuissMax = 9;
    }
  } else if (0 <= nextCheckpointDist && nextCheckpointDist < 500) {
    count4++;
    if (count4 >= countLimit) {
      thrustNext = 100;
    } else {
      thrustNext = 100;
    }
  }

  /////// Angle Factor///////

  // De 45 à 180 , on divise

  let totalStep = angledAcceleration - angledePuissMax;
  if (Math.abs(nextCheckpointAngle) < angledePuissMax) {
    angleFactor = 1;
  } else if (Math.abs(nextCheckpointAngle) > angledAcceleration) {
    angleFactor = 0;
  } else {
    angleFactor =
      (angledAcceleration - Math.abs(nextCheckpointAngle)) / totalStep;
    console.warn(angleFactor);
  }

  console.log(
    `${nextCheckpointX} ${nextCheckpointY} ${Math.round(
      angleFactor * thrustNext
    )}`
  );
} // fin du while
