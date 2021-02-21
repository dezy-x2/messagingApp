class Cipher {
  encryptionKey = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
    i: 8,
    j: 9,
    k: 10,
    l: 11,
    m: 12,
    n: 13,
    o: 14,
    p: 15,
    q: 16,
    r: 17,
    s: 18,
    t: 19,
    u: 20,
    v: 21,
    w: 22,
    x: 23,
    y: 24,
    z: 25,
    " ": 26,
    ",": 27,
    ".": 28,
    "/": 29,
    "<": 30,
    ">": 31,
    "?": 32,
    ";": 33,
    "'": 34,
    ":": 35,
    '"': 36,
    "[": 37,
    "]": 38,
    "\\": 39,
    "{": 40,
    "}": 41,
    "|": 42,
    "`": 43,
    1: 44,
    2: 45,
    3: 46,
    4: 47,
    5: 48,
    6: 49,
    7: 50,
    8: 51,
    9: 52,
    0: 53,
    "~": 54,
    "!": 55,
    "@": 56,
    "#": 57,
    $: 58,
    "%": 59,
    "^": 60,
    "&": 61,
    "*": 63,
    "(": 64,
    ")": 65,
    "-": 66,
    "=": 67,
    _: 68,
    "+": 69,
    A: 70,
    B: 71,
    C: 72,
    D: 73,
    E: 74,
    F: 75,
    G: 76,
    H: 77,
    I: 78,
    J: 79,
    K: 80,
    L: 81,
    M: 82,
    N: 83,
    O: 83,
    P: 84,
    Q: 85,
    R: 86,
    S: 87,
    T: 88,
    U: 89,
    V: 90,
    W: 91,
    X: 92,
    Y: 93,
    Z: 94,
  };

  encrypter(sentence, level = 1, keyList) {
    let starter = sentence;
    let final = "";
    for (let i = level; i > 0; i--) {
      for (let letter of starter) {
        for (let key of Object.keys(this.encryptionKey)) {
          if (letter === key) {
            final += keyList[this.encryptionKey[key]];
          }
        }
      }
      starter = final;
      final = "";
    }
    return [starter, keyList];
  }

  decrypter(sentence, level = 1, keyList) {
    let starter = sentence;
    let final = "";
    for (let i = level; i > 0; i--) {
      for (let i = 0; i < starter.length; i += 3) {
        for (let key of Object.keys(this.encryptionKey)) {
          if (keyList[this.encryptionKey[key]] === starter.slice(i, i + 3)) {
            final += key;
          }
        }
      }
      starter = final;
      final = "";
    }
    return starter;
  }
}

export default Cipher;
