const array = [{ a: 1 }, { a: 2 }, { a: 3 }];
const array2 = [6, 4, 5];
let test = array.map((e) => {
  return e.a;
});

console.log(array.map((e) => e.a).includes(2));
