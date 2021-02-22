/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

const LON = readline();
const LAT = readline();
const N = parseInt(readline());
const defibList = [];
const user = {
  LON: Number(LON.replace(",", ".")),
  LAT: Number(LAT.replace(",", "."))
};

const distanceBetween = function(point1, point2) {
  const x = (point2.LON - point1.LON) * Math.cos((point1.LAT + point2.LAT) / 2);
  const y = point2.LAT - point1.LAT;

  const dist = Math.sqrt(x * x + y * y) * 6371;

  return dist;
};
for (let i = 0; i < N; i++) {
  const DEFIB = readline();
  let DEFIBarr = DEFIB.split(";");
  defibList.push({
    number: DEFIBarr[0],
    name: DEFIBarr[1],
    LON: Number(DEFIBarr[4].replace(",", ".")),
    LAT: Number(DEFIBarr[5].replace(",", "."))
  });
}

defibList.forEach(function(element) {
  element.distance = distanceBetween(user, {
    LON: element.LON,
    LAT: element.LAT
  });
});

let answer = defibList.sort(function(a, b) {
  return a.distance - b.distance;
})[0];

// Write an action using console.log()
// To debug: console.error('Debug messages...');

console.log(answer.name);
