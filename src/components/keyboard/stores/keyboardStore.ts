import { writable } from 'svelte/store'
import type {
  AlphanumericPages,
  BlockForKeyboard
} from '../types/keyboardContent'

export const keyboardState = writable<{
  isVisible: boolean
  isInLine: boolean
  idMathField: string
  alphanumericLayout: AlphanumericPages
  blocks: BlockForKeyboard[]
}>({
  isVisible: false,
  isInLine: false,
  idMathField: '',
  alphanumericLayout: 'AlphaLow',
  blocks: ['numbersOperations']
})
