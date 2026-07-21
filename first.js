// console.log(Number("123") + 7);


// let x = 0;
// console.log(!x ? "Invalid" : x);


// for (let i = 1; i <= 10; i++) if (i % 2 === 0) continue; else console.log(i);


// console.og([1, 2, 3, 4, 5].filter(num => num % 2 === 0));


// console.log([...[1, 2, 3], ...[4, 5, 6]]);


// let day = 2;
// switch (day) {
//   case 1: console.log("Sunday"); break;
//   case 2: console.log("Monday"); break;
//   case 3: console.log("Tuesday"); break;
//   case 4: console.log("Wednesday"); break;
//   case 5: console.log("Thursday"); break;
//   case 6: console.log("Friday"); break;
//   case 7: console.log("Saturday"); break;
// }


// console.log(["a", "ab", "abc"].map(str => str.length));


// function check(num) {
//   return num % 3 === 0 && num % 5 === 0 ? "Divisible by both" : "Not divisible";
// }
// console.log(check(15));


// const square = num => num * num;
// console.log(square(5));

// ----------------------------------------------------------------------------

// function personInfo({ name, age }) {
//   return `${name} is ${age} years old`;
// }
// console.log(personInfo({ name: "John", age: 25 }));


// function sum(...nums) {
//   return nums.reduce((a, b) => a + b, 0);
// }
// console.log(sum(1, 2, 3, 4, 5));



// function test() {
//   return new Promise(resolve => setTimeout(() => resolve("Success"), 3000));
// }
// test().then(console.log);


// function largest(arr) {
//   return Math.max(...arr);
// }
// console.log(largest([1, 3, 7, 2, 4]));


// function keys(obj) {
//   return Object.keys(obj);
// }
// console.log(keys({ name: "John", age: 30 }));


function words(str) {
  return str.split(" ");
}
console.log(words("The quick brown fox"));

// ------------------------------------------------------------------------------------

// 1
// (forEach) is used to loop through an array. (for/of) is more flexible because you can use (break) and (continue).

// 2
// Hoisting means JavaScript prepares declarations before running the code. TDZ means you can't use (let) or (const) before they are declared.

// 3
// (==) compares values after converting the type if needed. (===) compares both the value and the type.

// 4
// (try/catch) is used to handle errors so the program don't stop. It's useful in async code to catch errors.

// 5
// Type conversion is when you change the type yourself. Coercion is when JavaScript changes the type automatically.
