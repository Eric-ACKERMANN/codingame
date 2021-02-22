/////////// 1-ERE METHODE //////////////

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
  }

  ////////// BOOST //////////
  if (
    boost === true &&
    nextCheckpointDist > 7000 &&
    nextCheckpointAngle < 5 &&
    nextCheckpointAngle > -5
  ) {
    console.log(nextCheckpointX + " " + nextCheckpointY + " " + `BOOST`);
    boost = false;
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
  console.warn("counter", counter);
  console.warn("----------------------------------");

  // CASE 1 : Cas du premier CP
  if (
    counter > 5 &&
    previousCheckpointDist === false &&
    nextCheckpointDist < 3200 &&
    nextCheckpointAngle < 10
  ) {
    console.warn("case1");
    console.log(nextCheckpointX + " " + nextCheckpointY + " " + `10`);
  }

  // CASE 2 : Avant d'arriver sur CP , le pod ralentit , cas d'un procahin checkpoint lointain avec un précédent checkpoint
  else if (
    nextCheckpointDist < 2500 &&
    previousCheckpointDist > 4000 &&
    -10 < nextCheckpointAngle < 10
  ) {
    console.warn("case2");
    console.log(nextCheckpointX + " " + nextCheckpointY + " " + `10`);
  }

  // CASE 3 : Avant d'arriver sur CP , le pod ralentit , cas d'un prochain checkpoint proche
  else if (
    previousCheckpointDist !== false &&
    nextCheckpointDist < 3000 &&
    previousCheckpointDist < 3000 &&
    nextCheckpointAngle < 100 &&
    nextCheckpointAngle > -100
  ) {
    console.warn("case3");
    console.log(nextCheckpointX + " " + nextCheckpointY + " " + `80`);
  }

  // CASE 4 : Sur le CP, cas d'un prochain CP proche
  else if (
    nextCheckpointDist < 3000 &&
    previousCheckpointDist < 3000 &&
    (nextCheckpointAngle > 100 || nextCheckpointAngle < -100)
  ) {
    console.warn("case4");
    console.log(nextCheckpointX + " " + nextCheckpointY + " " + `0`);
  }
  // CASE 5 : Sur le CP, cas d'un prochain CP proche
  else if (
    nextCheckpointDist > 3000 &&
    previousCheckpointDist < 2000 &&
    (nextCheckpointAngle > 100 || nextCheckpointAngle < -100)
  ) {
    console.warn("case5");
    console.log(nextCheckpointX + " " + nextCheckpointY + " " + `0`);
  } else {
    console.warn("gobal case");
    console.log(nextCheckpointX + " " + nextCheckpointY + " " + `100`);
  }
  counter += 1;
}
