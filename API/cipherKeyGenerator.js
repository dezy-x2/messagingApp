class KeyGen {
  alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    ",",
    ".",
    " ",
    "/",
    "<",
    ">",
    "?",
    ";",
    ":",
    "[",
    "]",
    "{",
    "}",
    "|",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "-",
    "=",
    "~",
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "+",
  ];

  doubleChecker(key) {
    let totalMatches = 0;
    for (let j = 0; j < key.length; j++) {
      for (let k = 0; k < key.length; k++) {
        let miniMatches = 0;
        for (let i = 0; i < key[k].length; i++) {
          if (k !== j) {
            if (key[k][i] === key[j][i]) {
              miniMatches++;
            }
          }
          if (miniMatches > 2) {
            totalMatches += 1;
          }
        }
      }
    }
    if (totalMatches > 0) {
      return false;
    }
    return true;
  }

  keyGenerator() {
    let key = [];
    for (let i = 0; i < this.alphabet.length; i++) {
      let littleKey = "";
      for (let j = 0; j < 3; j++) {
        littleKey += this.alphabet[
          Math.floor(Math.random() * this.alphabet.length)
        ];
      }
      key.push(littleKey);
    }
    if (!this.doubleChecker(key)) {
      return this.keyGenerator();
    }
    return key;
  }
}

module.exports = KeyGen;
