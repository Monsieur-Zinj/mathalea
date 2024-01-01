export const keys = {
  // ================== numbers
  0: { key: '0' },
  1: { key: '1' },
  2: { key: '2' },
  3: { key: '3' },
  4: { key: '4' },
  5: { key: '5' },
  6: { key: '6' },
  7: { key: '7' },
  8: { key: '8' },
  9: { key: '9' },
  // ================== operations
  ADD: {
    key: '+',
    insert: '+'
  },
  SUB: {
    key: '—',
    insert: '-'
  },
  MULT: {
    key: '$\\times$',
    insert: '\\times'
  },
  DIV: {
    key: '$\\div$',
    insert: '\\div'
  },
  FRAC: {
    key: '$\\frac{\\square}{\\square}$',
    insert: '\\frac{#@}{#1}'
  },
  SQRT: {
    // eslint-disable-next-line no-useless-escape
    key: '$\\sqrt{\\square}$',
    insert: '\\sqrt{#@}'
  },
  SQ: {
    key: '$x^2$',
    insert: '^2'
  },
  CUBE: {
    key: '$x^3$',
    insert: '^3'
  },
  POW: {
    key: '$x^\\square$',
    insert: '#@^{#0}'
  },
  POW10: {
    key: '$10^\\square$',
    insert: '$$\\times10^#0$$'
  },
  // ================== functions
  COS: {
    key: 'cos',
    insert: '\\cos(#0)'
  },
  SIN: {
    key: 'sin',
    insert: 'sin(#0)'
  },
  TAN: {
    key: 'tan',
    insert: 'tan(#0)'
  },
  // ================== symbols
  ',': {
    key: ','
  },
  '(': {
    key: '(',
    insert: '\\lparen'
  },
  ')': {
    key: ')',
    insert: '\\rparen'
  },
  '=': {
    key: '='
  },
  DEG: {
    key: '°'
  },
  ANG: {
    key: '$\\widehat{\\square}$',
    insert: '$$\\widehat{#0}$$'
  },
  PERCENT: {
    key: '%'
  },
  COLON: {
    key: ':'
  },
  SEMICOLON: {
    key: ';'
  },
  // ================== letters
  a: { key: 'a' },
  b: { key: 'b' },
  c: { key: 'c' },
  d: { key: 'd' },
  e: { key: 'e' },
  f: { key: 'f' },
  g: { key: 'g' },
  h: { key: 'h' },
  i: { key: 'i' },
  j: { key: 'j' },
  k: { key: 'k' },
  l: { key: 'l' },
  m: { key: 'm' },
  n: { key: 'n' },
  o: { key: 'o' },
  p: { key: 'p' },
  q: { key: 'q' },
  r: { key: 'r' },
  s: { key: 's' },
  t: { key: 't' },
  u: { key: 'u' },
  v: { key: 'v' },
  w: { key: 'w' },
  x: { key: 'x' },
  y: { key: 'y' },
  z: { key: 'z' },
  A: { key: 'A' },
  B: { key: 'B' },
  C: { key: 'C' },
  D: { key: 'D' },
  E: { key: 'E' },
  F: { key: 'F' },
  G: { key: 'G' },
  H: { key: 'H' },
  I: { key: 'I' },
  J: { key: 'J' },
  K: { key: 'K' },
  L: { key: 'L' },
  M: { key: 'M' },
  N: { key: 'N' },
  O: { key: 'O' },
  P: { key: 'P' },
  Q: { key: 'Q' },
  R: { key: 'R' },
  S: { key: 'S' },
  T: { key: 'T' },
  U: { key: 'U' },
  V: { key: 'V' },
  W: { key: 'W' },
  X: { key: 'X' },
  Y: { key: 'Y' },
  Z: { key: 'Z' },
  // ================== greek letters
  PI: {
    key: 'π',
    insert: '\\pi'
  },
  ALPHA: {
    key: 'α',
    insert: '\\alpha'
  },
  BETA: {
    key: 'β',
    insert: '\\beta'
  },
  GAMMA: {
    key: 'γ',
    insert: '\\gamma'
  },
  DELTA: {
    key: 'δ',
    insert: '\\delta'
  },
  EPSILON: {
    key: 'ε',
    insert: '\\epsilon'
  },
  THETA: {
    key: 'θ',
    insert: '\\theta'
  },
  LAMBDA: {
    key: 'λ',
    insert: '\\lambda'
  },
  OMEGA: {
    key: 'ω',
    insert: '\\omega'
  },
  // ================== hours, minutes, secondes
  HOUR: { key: 'h', insert: '{\\:\\text{h}\\:}' },
  MIN: { key: 'min', insert: '{\\:\\text{min}\\:}' },
  SEC: { key: 's', insert: '{\\:\\text{s}\\:}' },
  // ================== special keys
  BACK: {
    key: '<i class="bx bx-arrow-back"/>',
    command: ['performWithFeedback', 'moveToPreviousChar']
  },
  FWD: {
    key: '<i class="bx bx-arrow-back bx-rotate-180"/>',
    command: ['performWithFeedback', 'moveToNextChar']
  },
  CLOSE: {
    key: '<i class="bx bx-x"/>',
    command: 'closeKeyboard'
  },
  DEL: {
    key: '&#x232b;',
    command: ['performWithFeedback', 'deleteBackward']
  }
}

export const KEYCAP_WIDTH = {
  sm: 20,
  md: 40
}
export const GAP_BETWEEN_BLOCKS = {
  sm: 16,
  md: 48
}
export const GAP_BETWEEN_KEYS = {
  sm: 4,
  md: 8
}

export const SM_BREAKPOINT = 768
