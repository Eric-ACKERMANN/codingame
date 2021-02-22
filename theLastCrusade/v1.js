/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var inputs = readline().split(" ");
const W = parseInt(inputs[0]); // number of columns.
const H = parseInt(inputs[1]); // number of rows.
let grid = [];
for (let i = 0; i < H; i++) {
  const LINE = readline().split(" ");
  // represents a line in the grid and contains W integers. Each integer represents one room of a given type.
  grid.push(LINE);
}

const EX = parseInt(readline()); // the coordinate along the X axis of the exit (not useful for this first mission, but must be read).

// game loop
while (true) {
  var inputs = readline().split(" ");

  const XI = parseInt(inputs[0]);
  const YI = parseInt(inputs[1]);
  // Position in round beginning
  const position = { x: XI, y: YI };
  console.warn(position);

  const POS = inputs[2];

  // Indiana arrives in box grid[YI][XI]
  let boxIn = grid[YI][XI];
  console.warn("boxIn", boxIn);
  console.warn("POS", POS);

  // We need to know X and Y
  let X = 0;
  let Y = 0;

  // X and Y are determined by the box inidiana is in and the pos in which he enters it
  if (boxIn === "1") {
    X = 0;
    Y = 1;
  }
  if (boxIn === "2" && POS === "LEFT") {
    X = 1;
    Y = 0;
  } //1
  if (boxIn === "2" && POS === "RIGHT") {
    X = -1;
    Y = 0;
  } //2
  if (boxIn === "3" && POS === "TOP") {
    X = 0;
    Y = 1;
  } //3
  if (boxIn === "4" && POS === "TOP") {
    X = -1;
    Y = 0;
  } //2
  if (boxIn === "4" && POS === "RIGHT") {
    X = 0;
    Y = 1;
  } //3
  if (boxIn === "5" && POS === "TOP") {
    X = 1;
    Y = 0;
  } //1
  if (boxIn === "5" && POS === "LEFT") {
    X = 0;
    Y = 1;
  } //3
  if (boxIn === "6" && POS === "LEFT") {
    X = 1;
    Y = 0;
  } //1
  if (boxIn === "6" && POS === "RIGHT") {
    X = -1;
    Y = 0;
  }
  if (boxIn === "7" && POS === "TOP") {
    X = 0;
    Y = 1;
  } //3
  if (boxIn === "7" && POS === "RIGHT") {
    X = 0;
    Y = 1;
  } //3
  if (boxIn === "8" && POS === "LEFT") {
    X = 0;
    Y = 1;
  } //3
  if (boxIn === "8" && POS === "RIGHT") {
    X = 0;
    Y = 1;
  } //3
  if (boxIn === "9" && POS === "TOP") {
    X = 0;
    Y = 1;
  } //3
  if (boxIn === "9" && POS === "LEFT") {
    X = 0;
    Y = 1;
  } //3
  if (boxIn === "10" && POS === "TOP") {
    X = -1;
    Y = 0;
  } //2
  if (boxIn === "11" && POS === "TOP") {
    X = 1;
    Y = 0;
  } //1
  if (boxIn === "12" && POS === "RIGHT") {
    X = 0;
    Y = 1;
  } //3
  if (boxIn === "13" && POS === "LEFT") {
    X = 0;
    Y = 1;
  } //3

  //Position in next round
  const positionNext = { x: position.x + X, y: position.y + Y };

  // One line containing the X Y coordinates of the room in which you believe Indy will be on the next turn.
  console.log(`${positionNext.x} ${positionNext.y}`);
}
