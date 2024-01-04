import { writable } from 'svelte/store'
import type {
  AlphanumericPages,
  BlockForKeyboard
} from '../types/keyboardContent'

export const keyboardState = writable<{
  isVisible: boolean
  idMathField: string
  alphanumericLayout: AlphanumericPages
  blocks: BlockForKeyboard[]
}>({
  isVisible: false,
  idMathField: '',
  alphanumericLayout: 'AlphaLow',
  blocks: ['numbersOperations']
})
