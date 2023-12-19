import type { BlockLayout, CustomKeyboard, KeysList } from '../types/KBContent'

const specialKeys: KeysList = ['BACK', 'FWD', 'DEL', 'CLOSE']
const numericCapsForNumPad: KeysList = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, ',', 'FRAC']
const numericCapsInLine: KeysList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, ',', 'FRAC']
const numericBlock: BlockLayout = {
  content: numericCapsForNumPad,
  layout: { numOfCols: 3, numOfRows: 4 }
}
const numericInLine = {
  content: numericCapsInLine,
  layout: {
    numOfCols: numericCapsInLine.length,
    numOfRows: 1
  }
}
export const specialKeysBlock: BlockLayout = {
  content: specialKeys,
  layout: {
    numOfCols: 1,
    numOfRows: 4
  }
}
export const specialKeysInLine: BlockLayout = {
  content: specialKeys,
  layout: {
    numOfCols: specialKeys.length,
    numOfRows: 1
  }
}

// Keyboard declaration
export const numeric: CustomKeyboard = [numericBlock]
export const numeric2: CustomKeyboard = [numericInLine]
