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
  inline: ['a', 'x', 'b', 'y', 'c', 'z'],
  block: ['a', 'b', 'c', 'x', 'y', 'z']
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
