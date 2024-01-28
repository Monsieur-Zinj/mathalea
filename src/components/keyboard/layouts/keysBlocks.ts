import { keys } from '../lib/keycaps'
import type {
  BlockForKeyboard,
  CompleteKeysList,
  KeyboardBlock,
  KeysList
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
  inline: ['a', 'b', 'c', 'x', 'y', 'z', 'k', 'n', 'i'],
  block: ['a', 'x', 'k', 'b', 'y', 'n', 'c', 'z', 'i']
}
const basicOperationCaps: CompleteKeysList = {
  inline: ['ADD', 'SUB', 'MULT', 'DIV', 'SQ', 'FRAC', '(', ')'],
  block: ['ADD', 'SUB', 'MULT', 'DIV', 'SQ', 'FRAC', '(', ')']
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
  inline: Object.keys(lengthUnitsKeys) as KeysList,
  block: Object.keys(lengthUnitsKeys) as KeysList
}

const areasUnitsKeys = Object.keys(keys).filter(k => k.includes('AREA')).reduce((prev, k) => Object.assign(prev, { [k]: keys[k] }), {})
const areasCaps: CompleteKeysList = {
  inline: Object.keys(areasUnitsKeys) as KeysList,
  block: Object.keys(areasUnitsKeys) as KeysList
}

const volumesUnitsKeys = Object.keys(keys).filter(k => k.includes('VOLUME')).reduce((prev, k) => Object.assign(prev, { [k]: keys[k] }), {})
const volumesCaps: CompleteKeysList = {
  inline: Object.keys(volumesUnitsKeys) as KeysList,
  block: Object.keys(volumesUnitsKeys) as KeysList
}

const capacitiesUnitsKeys = Object.keys(keys).filter(k => k.includes('CAPACITY')).reduce((prev, k) => Object.assign(prev, { [k]: keys[k] }), {})
const capacitiesCaps: CompleteKeysList = {
  inline: Object.keys(capacitiesUnitsKeys) as KeysList,
  block: Object.keys(capacitiesUnitsKeys) as KeysList
}

const massesUnitsKeys = Object.keys(keys).filter(k => k.includes('MASS')).reduce((prev, k) => Object.assign(prev, { [k]: keys[k] }), {})
const massesCaps: CompleteKeysList = {
  inline: Object.keys(massesUnitsKeys) as KeysList,
  block: Object.keys(massesUnitsKeys) as KeysList
}

export const specialKeys: KeyboardBlock = {
  keycaps: specialKeysCaps,
  cols: 1,
  title: 'Touches spéciales',
  isUnits: false
}
export const numbers: KeyboardBlock = {
  keycaps: numbersCaps,
  cols: 3,
  title: 'Nombres',
  isUnits: false
}
export const numbersOperations: KeyboardBlock = {
  keycaps: numbersOperationsCaps,
  cols: 4,
  title: 'Nombres+Opérations',
  isUnits: false
}

export const variables: KeyboardBlock = {
  keycaps: variableCaps,
  cols: 3,
  title: 'Variables',
  isUnits: false
}

export const basicOperations: KeyboardBlock = {
  keycaps: basicOperationCaps,
  cols: 2,
  title: 'Opérations de base',
  isUnits: false
}

export const fullOperations: KeyboardBlock = {
  keycaps: fullOperationCaps,
  cols: 4,
  title: 'Opérations complexes',
  isUnits: false
}

export const hms: KeyboardBlock = {
  keycaps: hmsCaps,
  cols: 1,
  title: 'Temps',
  isUnits: true
}

export const greek: KeyboardBlock = {
  keycaps: greekCaps,
  cols: 2,
  title: 'Lettres grecques',
  isUnits: false
}

export const trigo: KeyboardBlock = {
  keycaps: trigoCaps,
  cols: 1,
  title: 'Trigonométrie',
  isUnits: false
}
export const advanced: KeyboardBlock = {
  keycaps: advancedCaps,
  cols: 5,
  title: 'Fonctions avancées',
  isUnits: false
}

export const lengths: KeyboardBlock = {
  keycaps: lengthsCaps,
  cols: 2,
  title: 'Longueurs',
  isUnits: true
}

export const areas: KeyboardBlock = {
  keycaps: areasCaps,
  cols: 3,
  title: 'Aires',
  isUnits: true
}

export const volumes: KeyboardBlock = {
  keycaps: volumesCaps,
  cols: 2,
  title: 'Volumes',
  isUnits: true
}

export const capacities: KeyboardBlock = {
  keycaps: capacitiesCaps,
  cols: 2,
  title: 'Capacités',
  isUnits: true
}

export const masses: KeyboardBlock = {
  keycaps: massesCaps,
  cols: 2,
  title: 'Masses',
  isUnits: true
}

// eslint-disable-next-line no-unused-vars
export const keyboardBlocks: { [key in Exclude<BlockForKeyboard, 'alphanumeric'>]: KeyboardBlock } = {
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
  capacities,
  masses
}
