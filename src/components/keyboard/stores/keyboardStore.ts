import { writable } from 'svelte/store'
import type { AlphanumericPages } from '../types/keyboardContent'

export const keyboardState = writable<{ isVisible: boolean, idMathField: string, alphanumericLayout: AlphanumericPages}>({ isVisible: false, idMathField: '', alphanumericLayout: 'AlphaLow' })
