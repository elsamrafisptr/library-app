function countOccurrences(inputArray, queryArray) {
  const frequency = {};
  const result = [];

  inputArray.forEach((item) => {
    frequency[item] = (frequency[item] || 0) + 1;
  });

  queryArray.forEach((queryItem) => {
    result.push(frequency[queryItem] || 0);
  });

  return result;
}

const input = ["xc", "dz", "bbb", "dz", "dz", "bbb", "cc"];
const query = ["bbb", "ac", "dz", "cc"];
const output = countOccurrences(input, query);
console.log(output);
