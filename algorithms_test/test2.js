function longestWord(sentence) {
  const words = sentence.split(" ");
  let longest = "";
  let maxLength = 0;

  words.forEach((word) => {
    if (word.length > maxLength) {
      longest = word;
      maxLength = word.length;
    }
  });

  return longest;
}

const sentence = "Saya sangat senang mengerjakan soal algoritma";
const longestWordInSentence = longestWord(sentence);
console.log(longestWordInSentence);
