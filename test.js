let pos1 = { x: 1, y: 1 };

let pos2 = { ...pos1 };

pos2.x = 3;

console.log(pos2);
console.log(pos1);
