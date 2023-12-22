import type {
  CompleteKeysList,
  KeyboardBlock
} from '../types/keyboardContent'

// Keycaps lists
export const specialKeysCaps: CompleteKeysList = {
  inline: ['BACK', 'FWD', 'DEL', 'CLOSE'],
  block: ['BACK', 'FWD', 'DEL', 'CLOSE']
}
const numericCaps: CompleteKeysList = {
  inline: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, ',', 'FRAC'],
  block: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, ',', 'FRAC']
}
const variableCaps: CompleteKeysList = {
  inline: ['a', 'b', 'c', 'x', 'y', 'z'],
  block: ['a', 'x', 'b', 'y', 'c', 'z']
}
const basicOperationCaps: CompleteKeysList = {
  inline: ['ADD', 'SUB', 'MULT', 'DIV', '(', ')'],
  block: ['ADD', 'SUB', 'MULT', 'DIV', '(', ')']
}
const fullOperationCaps: CompleteKeysList = {
  inline: ['ADD', 'SUB', 'MULT', 'DIV', '(', ')', 'SQRT', 'SQ', 'POW'],
  block: ['ADD', 'SUB', 'SQRT', 'MULT', 'DIV', 'SQ', '(', ')', 'POW']
}

export const specialKeys: KeyboardBlock = {
  keycaps: specialKeysCaps,
  cols: 1
}
export const numeric: KeyboardBlock = {
  keycaps: numericCaps,
  cols: 3
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
  cols: 3
}
