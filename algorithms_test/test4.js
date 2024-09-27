function calculateDiagonalDifference(matrix) {
  const n = matrix.length;
  let primaryDiagonalSum = 0;
  let secondaryDiagonalSum = 0;

  for (let i = 0; i < n; i++) {
    primaryDiagonalSum += matrix[i][i];
    secondaryDiagonalSum += matrix[i][n - i - 1];
  }

  return primaryDiagonalSum - secondaryDiagonalSum;
}

const matrix = [
  [1, 2, 0, 1],
  [4, 5, 6, 2],
  [7, 8, 9, 3],
  [2, 3, 5, 4],
];
const result = calculateDiagonalDifference(matrix);
console.log(result);
