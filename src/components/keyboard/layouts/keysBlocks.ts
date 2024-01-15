import { keys } from '../lib/keycaps'
import type {
  BlockForKeyboard,
  CompleteKeysList,
  KeyboardBlock
} from '../types/keyboardContent'

// Keycaps lists
export const specialKeysCaps: CompleteKeysList = {
  inline: ['BACK', 'FWD', 'DEL', 'CLOSE'],
  block: ['BACK', 'FWD', 'DEL', 'CLOSE']
}
const numbersCaps: CompleteKeysList = {
  inline: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'COMMA', 'PI'],
  block: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, 'COMMA', 'PI']
}
const numbersOperationsCaps: CompleteKeysList = {
  inline: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'COMMA', 'PI', 'DIV', 'MULT', 'SUB', 'ADD'],
  block: [7, 8, 9, 'DIV', 4, 5, 6, 'MULT', 1, 2, 3, 'SUB', 0, 'COMMA', 'PI', 'ADD']
}
const variableCaps: CompleteKeysList = {
  inline: ['a', 'b', 'c', 'x', 'y', 'z'],
  block: ['a', 'x', 'b', 'y', 'c', 'z']
}
const basicOperationCaps: CompleteKeysList = {
  inline: ['ADD', 'SUB', 'MULT', 'DIV', '=', 'FRAC', '(', ')'],
  block: ['ADD', 'SUB', 'MULT', 'DIV', '=', 'FRAC', '(', ')']
}
const fullOperationCaps: CompleteKeysList = {
  inline: ['ADD', 'SUB', 'MULT', 'DIV', 'FRAC', '=', '(', ')', 'SQRT', 'SQ', 'CUBE', 'POW', 'POW10', 'DEG', 'PERCENT', 'SEMICOLON'],
  block: ['ADD', 'SUB', 'SQ', 'SQRT', 'MULT', 'DIV', 'CUBE', 'DEG', '(', ')', 'POW', 'PERCENT', '=', 'FRAC', 'POW10', 'SEMICOLON']
}
const hmsCaps: CompleteKeysList = {
  inline: ['HOUR', 'MIN', 'SEC'],
  block: ['HOUR', 'MIN', 'SEC']
}
const greekCaps: CompleteKeysList = {
  inline: ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON', 'THETA', 'LAMBDA', 'OMEGA'],
  block: ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON', 'THETA', 'LAMBDA', 'OMEGA']
}

const trigoCaps: CompleteKeysList = {
  inline: ['COS', 'SIN', 'TAN', 'ANG'],
  block: ['COS', 'SIN', 'TAN', 'ANG']
}

const advancedCaps: CompleteKeysList = {
  inline: [
    'FCT', 'LIM', 'INT', 'SIGMA', 'BINOM', //
    'UNION', 'INTER', 'INFTY', 'EMPTY', 'PROB', //
    'VECT', 'BRACKETS', 'BRACES', 'LESSEQ', 'GREATEQ', //
    'COMP', 'REAL', 'RATIO', 'REL', 'INTEG'
  ],
  block: [
    'FCT', 'LIM', 'INT', 'SIGMA', 'BINOM', //
    'UNION', 'INTER', 'INFTY', 'EMPTY', 'PROB', //
    'VECT', 'BRACKETS', 'BRACES', 'LESSEQ', 'GREATEQ', //
    'COMP', 'REAL', 'RATIO', 'REL', 'INTEG'
  ]
}

const lengthUnitsKeys = Object.keys(keys).filter(k => k.includes('LENGTH')).reduce((prev, k) => Object.assign(prev, { [k]: keys[k] }), {})
const lengthsCaps: CompleteKeysList = {
  inline: Object.keys(lengthUnitsKeys),
  block: Object.keys(lengthUnitsKeys)
}

const areasUnitsKeys = Object.keys(keys).filter(k => k.includes('AREA')).reduce((prev, k) => Object.assign(prev, { [k]: keys[k] }), {})
const areasCaps: CompleteKeysList = {
  inline: Object.keys(areasUnitsKeys),
  block: Object.keys(areasUnitsKeys)
}

const volumesUnitsKeys = Object.keys(keys).filter(k => k.includes('VOLUME')).reduce((prev, k) => Object.assign(prev, { [k]: keys[k] }), {})
const volumesCaps: CompleteKeysList = {
  inline: Object.keys(volumesUnitsKeys),
  block: Object.keys(volumesUnitsKeys)
}

const massesUnitsKeys = Object.keys(keys).filter(k => k.includes('MASS')).reduce((prev, k) => Object.assign(prev, { [k]: keys[k] }), {})
const massesCaps: CompleteKeysList = {
  inline: Object.keys(massesUnitsKeys),
  block: Object.keys(massesUnitsKeys)
}

export const specialKeys: KeyboardBlock = {
  keycaps: specialKeysCaps,
  cols: 1
}
export const numbers: KeyboardBlock = {
  keycaps: numbersCaps,
  cols: 3
}
export const numbersOperations: KeyboardBlock = {
  keycaps: numbersOperationsCaps,
  cols: 4
}

export const variables: KeyboardBlock = {
  keycaps: variableCaps,
  cols: 2
}

export const basicOperations: KeyboardBlock = {
  keycaps: basicOperationCaps,
  cols: 2
}

export const fullOperations: KeyboardBlock = {
  keycaps: fullOperationCaps,
  cols: 4
}

export const hms: KeyboardBlock = {
  keycaps: hmsCaps,
  cols: 1
}

export const greek: KeyboardBlock = {
  keycaps: greekCaps,
  cols: 2
}

export const trigo: KeyboardBlock = {
  keycaps: trigoCaps,
  cols: 1
}
export const advanced: KeyboardBlock = {
  keycaps: advancedCaps,
  cols: 5
}

export const lengths: KeyboardBlock = {
  keycaps: lengthsCaps,
  cols: 2
}

export const areas: KeyboardBlock = {
  keycaps: areasCaps,
  cols: 3
}

export const volumes: KeyboardBlock = {
  keycaps: volumesCaps,
  cols: 3
}

export const masses: KeyboardBlock = {
  keycaps: massesCaps,
  cols: 2
}

// eslint-disable-next-line no-unused-vars
export const keyboardBlocks: { [key in BlockForKeyboard]: KeyboardBlock } = {
  numbers,
  numbersOperations,
  greek,
  trigo,
  hms,
  fullOperations,
  basicOperations,
  variables,
  advanced,
  lengths,
  areas,
  volumes,
  masses
}
