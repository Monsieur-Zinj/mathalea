import { areaMetricUnits, areaOtherUnits, lengthUnits, massUnits, volumeMetricUnits, volumeOtherUnits } from './unitsSystem'

const basicKeys = {
  // ================== numbers
  0: { display: '0' },
  1: { display: '1' },
  2: { display: '2' },
  3: { display: '3' },
  4: { display: '4' },
  5: { display: '5' },
  6: { display: '6' },
  7: { display: '7' },
  8: { display: '8' },
  9: { display: '9' },
  // ================== operations
  ADD: {
    display: '+',
    insert: '+'
  },
  SUB: {
    display: '—',
    insert: '-'
  },
  MULT: {
    display: '$\\times$',
    insert: '\\times'
  },
  DIV: {
    display: '$\\div$',
    insert: '\\div'
  },
  FRAC: {
    display: '$\\frac{\\square}{\\square}$',
    insert: '\\frac{#@}{#1}'
  },
  SQRT: {
    // eslint-disable-next-line no-useless-escape
    display: '$\\sqrt{\\square}$',
    insert: '\\sqrt{#1}'
  },
  SQ: {
    display: '$\\square^2$',
    insert: '^2'
  },
  CUBE: {
    display: '$x^3$',
    insert: '^3'
  },
  POW: {
    display: '$\\square^\\square$',
    insert: '#@^{#0}'
  },
  'e^': {
    display: '$e^{\\square}$',
    insert: 'e^{#0}'
  },
  LOG: {
    display: '$\\log(\\square)$',
    insert: '\\log(#0)'
  },
  LN: {
    display: '$\\ln(\\square)$',
    insert: '\\ln(#0)'
  },
  INDICE: {
    display: '$\\square_\\square$',
    insert: '#@_{#0}'
  },
  POW10: {
    display: '$\\times10^\\square$',
    insert: '$$\\times10^#0$$'
  },
  // ================== functions
  COS: {
    display: 'cos',
    insert: '\\cos(#0)'
  },
  SIN: {
    display: 'sin',
    insert: '\\sin(#0)'
  },
  TAN: {
    display: 'tan',
    insert: '\\tan(#0)'
  },
  // ================== symbols
  COMMA: {
    display: ',',
    insert: '{,}'
  },
  POINT: {
    display: '.'
  },
  SPACE: {
    display: '$\\tiny\\text{espace}$',
    insert: '\\,'
  },
  '(': {
    display: '(',
    insert: '\\lparen'
  },
  ')': {
    display: ')',
    insert: '\\rparen'
  },
  PARENTHESES: {
    display: '()',
    insert: '\\lparen#0\\rparen'
  },
  '{': {
    display: '{',
    insert: '$$\\{$$'
  },
  '}': {
    display: '}',
    insert: '$$\\}$$'
  },
  '[': {
    display: '[',
    insert: '$[$'
  },
  ']': {
    display: ']',
    insert: '$]$'
  },
  '=': {
    display: '='
  },
  DEG: {
    display: '°'
  },
  DEGCELSIUS: {
    display: '°C',
    insert: '°C'
  },
  ANG: {
    display: '$\\widehat{\\square}$',
    insert: '$$\\widehat{#0}$$'
  },
  PERCENT: {
    display: '%',
    insert: '\\%'
  },
  COLON: {
    display: ':'
  },
  SEMICOLON: {
    display: ';'
  },
  LESS: {
    display: '<'
  },
  GREAT: {
    display: '>'
  },
  LESSEQ: {
    display: '$\\leqslant$',
    insert: '$$\\leqslant$$'
  },
  GREATEQ: {
    display: '$\\geqslant$',
    insert: '$$\\geqslant$$'
  },
  IN: {
    display: '$\\in$',
    insert: '$$\\in$$'
  },
  AST: {
    display: '*',
    insert: '$$\\ast$$'
  },
  SLASH: {
    display: '/',
    insert: '\\slash'
  },
  BACKSLASH: {
    display: '\\',
    insert: '\\backslash'
  },
  QUOTE: {
    display: '\'',
    insert: '{\\:\\text{\'}\\:}'
  },
  DBLQUOTE: {
    display: '"',
    insert: '{\\:\\text{"}\\:}'
  },
  INTPOINT: {
    display: '?',
    insert: '{\\:\\text{?}\\:}'
  },
  EXCPOINT: {
    display: '!',
    insert: '{\\:\\text{!}\\:}'
  },
  AROBASE: {
    display: '@',
    insert: '{\\:\\text{@}\\:}'
  },
  HASH: {
    display: '#',
    insert: '{\\:\\text{#}\\:}'
  },
  DOLLAR: {
    display: '$',
    insert: '{\\:\\text{\\$}\\:}'
  },
  AND: {
    display: '&',
    insert: '{\\:\\text{\\&}\\:}'
  },
  OR: {
    display: '|',
    insert: '{\\:\\text{|}\\:}'
  },
  TILDE: {
    display: '~',
    insert: '$$\\sim$$'
  },
  BRACKETS: {
    display: '$[\\square]$',
    insert: '$$[#0]$$'
  },
  BRACES: {
    display: '$\\{\\square\\}$',
    insert: '$$\\{#0\\}$$'
  },
  VECT: {
    display: '$\\overrightarrow{\\square}$',
    insert: '$$\\overrightarrow#0$$'
  },
  INFTY: {
    display: '$\\infty$',
    insert: '\\infty'
  },
  // ================== letters
  a: { display: 'a' },
  b: { display: 'b' },
  c: { display: 'c' },
  d: { display: 'd' },
  e: { display: 'e' },
  f: { display: 'f' },
  g: { display: 'g' },
  h: { display: 'h' },
  i: { display: 'i' },
  j: { display: 'j' },
  k: { display: 'k' },
  l: { display: 'l' },
  m: { display: 'm' },
  n: { display: 'n' },
  o: { display: 'o' },
  p: { display: 'p' },
  q: { display: 'q' },
  r: { display: 'r' },
  s: { display: 's' },
  t: { display: 't' },
  u: { display: 'u' },
  v: { display: 'v' },
  w: { display: 'w' },
  x: { display: 'x' },
  y: { display: 'y' },
  z: { display: 'z' },
  A: { display: 'A' },
  B: { display: 'B' },
  C: { display: 'C' },
  D: { display: 'D' },
  E: { display: 'E' },
  F: { display: 'F' },
  G: { display: 'G' },
  H: { display: 'H' },
  I: { display: 'I' },
  J: { display: 'J' },
  K: { display: 'K' },
  L: { display: 'L' },
  M: { display: 'M' },
  N: { display: 'N' },
  O: { display: 'O' },
  P: { display: 'P' },
  Q: { display: 'Q' },
  R: { display: 'R' },
  S: { display: 'S' },
  T: { display: 'T' },
  U: { display: 'U' },
  V: { display: 'V' },
  W: { display: 'W' },
  X: { display: 'X' },
  Y: { display: 'Y' },
  Z: { display: 'Z' },
  // ================== maths letters
  xMath: { display: '$x$', insert: 'x' },
  yMath: { display: '$y$', insert: 'y' },
  zMath: { display: '$z$', insert: 'z' },
  aMath: { display: '$a$', insert: 'a' },
  bMath: { display: '$b$', insert: 'b' },
  cMath: { display: '$c$', insert: 'c' },
  iMath: { display: '$i$', insert: 'i' },
  kMath: { display: '$k$', insert: 'k' },
  nMath: { display: '$n$', insert: 'n' },
  // ================== greek letters
  PI: {
    display: '$\\pi$',
    insert: '\\pi'
  },
  ALPHA: {
    display: 'α',
    insert: '\\alpha'
  },
  BETA: {
    display: 'β',
    insert: '\\beta'
  },
  GAMMA: {
    display: 'γ',
    insert: '\\gamma'
  },
  DELTA: {
    display: 'δ',
    insert: '\\delta'
  },
  EPSILON: {
    display: 'ε',
    insert: '\\epsilon'
  },
  THETA: {
    display: 'θ',
    insert: '\\theta'
  },
  LAMBDA: {
    display: 'λ',
    insert: '\\lambda'
  },
  OMEGA: {
    display: 'ω',
    insert: '\\omega'
  },
  // ================== hours, minutes, secondes
  HOUR: { display: 'h', insert: '{\\:\\text{h}\\:}' },
  MIN: { display: 'min', insert: '{\\:\\text{min}\\:}' },
  SEC: { display: 's', insert: '{\\:\\text{s}\\:}' },
  // ================== special keys
  BACK: {
    display: '<i class="bx bx-arrow-back"/>',
    command: ['performWithFeedback', 'moveToPreviousChar']
  },
  FWD: {
    display: '<i class="bx bx-arrow-back bx-rotate-180"/>',
    command: ['performWithFeedback', 'moveToNextChar']
  },
  CLOSE: {
    display: '<i class="bx bx-window-close"/>',
    command: 'closeKeyboard'
  },
  DEL: {
    display: '⌫',
    command: ['performWithFeedback', 'deleteBackward']
  },
  ABC: {
    display: 'ABC'
  },
  abc: {
    display: 'abc'
  },
  NUM: {
    display: '?123'
  },
  // =================== sets
  COMP: {
    display: '$\\mathbb{C}$',
    insert: '\\mathbb{C}'
  },
  REAL: {
    display: '$\\mathbb{R}$',
    insert: '\\mathbb{R}'
  },
  RATIO: {
    display: '$\\mathbb{Q}$',
    insert: '\\mathbb{Q}'
  },
  REL: {
    display: '$\\mathbb{Z}$',
    insert: '\\mathbb{Z}'
  },
  INTEG: {
    display: '$\\mathbb{N}$',
    insert: '\\mathbb{N}'
  },
  EMPTY: {
    display: '$\\emptyset$',
    insert: '\\emptyset'
  },
  UNION: {
    display: '$\\cup$',
    insert: '\\cup'
  },
  INTER: {
    display: '$\\cap$',
    insert: '\\cap'
  },
  // =================== functions
  LIM: {
    display: '$\\lim\\limits_{\\square\\to\\square}$',
    insert: '$$\\lim_{#0\\to\\ #1}}$$'
  },
  FCT: {
    display: '$f(\\square)$',
    insert: '$$f(#0)$$'
  },
  SIGMA: {
    display: '$\\sum\\limits_{\\square}^{\\square}$',
    insert: '$$\\sum_#0^#1$$'
  },
  INT: {
    display: '$\\int_{\\square}^{\\square}$',
    insert: '$$\\int_#0^#1$$'
  },
  // =================== probabilities
  BINOM: {
    display: '$\\tbinom{\\square}{\\square}$',
    insert: '$$\\tbinom{#0}{#1}$$'
  },
  PROB: {
    display: '$P_{\\square}({\\square})$',
    insert: '$$P_{#0}({#1})$$'
  },
  OVERLINE: {
    display: '$\\overline{\\square}$',
    insert: '$$\\overline{#0}$$'
  },
  VRAI: {
    display: '$\\text{Vrai}$',
    insert: '\\text{Vrai}'
  },
  FAUX: {
    display: '$\\text{Faux}$',
    insert: '\\text{Faux}'
  }
}

const massUnitsKeys: Record<string, { display: string, insert: string }> = {}
for (const unit of massUnits.units) {
  const k = `MASS ${unit.symbol}`
  massUnitsKeys[k] = {
    display: unit.symbol,
    insert: unit.insert
  }
}

const lengthUnitsKeys: Record<string, { display: string, insert: string }> = {}
for (const unit of lengthUnits.units) {
  const k = `LENGTH ${unit.symbol}`
  lengthUnitsKeys[k] = {
    display: unit.symbol,
    insert: unit.insert
  }
}

const areaUnitsKeys: Record<string, { display: string, insert: string }> = {}
for (const unit of [...areaMetricUnits.units, ...areaOtherUnits.units]) {
  const k = `AREA ${unit.symbol}`
  areaUnitsKeys[k] = {
    display: unit.symbol,
    insert: unit.insert
  }
}

const volumeUnitsKeys: Record<string, { display: string, insert: string }> = {}
for (const unit of volumeMetricUnits.units) {
  const k = `VOLUME' ${unit.symbol}`
  volumeUnitsKeys[k] = {
    display: unit.symbol,
    insert: unit.insert
  }
}

const capacityUnitsKeys: Record<string, { display: string, insert: string }> = {}
for (const unit of volumeOtherUnits.units) {
  const k = `CAPACITY ${unit.symbol}`
  capacityUnitsKeys[k] = {
    display: unit.symbol,
    insert: unit.insert
  }
}

export const keys = { ...basicKeys, ...lengthUnitsKeys, ...massUnitsKeys, ...areaUnitsKeys, ...volumeUnitsKeys, ...capacityUnitsKeys }
