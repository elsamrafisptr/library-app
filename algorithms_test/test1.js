function reverseStringWithNumberLoop(str) {
  let reversed = "";
  let number = "";

  for (let i = str.length - 1; i >= 0; i--) {
    if (isNaN(str[i])) {
      reversed += str[i];
    } else {
      number = str[i] + number;
    }
  }
  return reversed + number;
}

const string = "NEGIE1";
const result = reverseStringWithNumberLoop(string);
console.log(result);
