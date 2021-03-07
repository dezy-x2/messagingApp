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
    A: 26,
    B: 27,
    C: 28,
    D: 29,
    E: 30,
    F: 31,
    G: 32,
    H: 33,
    I: 34,
    J: 35,
    K: 36,
    L: 37,
    M: 38,
    N: 39,
    O: 40,
    P: 41,
    Q: 42,
    R: 43,
    S: 44,
    T: 45,
    U: 46,
    V: 47,
    W: 48,
    X: 49,
    Y: 50,
    Z: 51,
    ",": 52,
    ".": 53,
    " ": 54,
    "/": 55,
    "<": 56,
    ">": 57,
    "?": 58,
    ";": 59,
    ":": 60,
    "[": 61,
    "]": 62,
    "{": 63,
    "}": 64,
    "|": 65,
    1: 66,
    2: 67,
    3: 68,
    4: 69,
    5: 70,
    6: 71,
    7: 72,
    8: 73,
    9: 74,
    0: 75,
    "-": 76,
    "=": 77,
    "~": 78,
    "!": 79,
    "@": 80,
    "#": 81,
    $: 82,
    "%": 83,
    "^": 84,
    "&": 85,
    "*": 86,
    "(": 87,
    ")": 88,
    _: 89,
    "+": 90,
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

      console.log(`\n\n${final}\n\n`)
      starter = final;
      final = "";
    }
    console.log(`\n\n${starter}\n\n${keyList}\n\n${sentence}`)
    return [starter, ...keyList];
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
