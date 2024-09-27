function longestWordInSentence(sentence) {
  const words = sentence.split(" ");
  let longestWord = "";

  for (let word of words) {
    if (word.length > longestWord.length) {
      longestWord = word;
    }
  }

  return `${longestWord} (${longestWord.length} character)`;
}

const sentence = "Saya sangat senang mengerjakan soal algoritma";
console.log(longest(sentence));
