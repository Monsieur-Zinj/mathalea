import { keys } from '../layouts/keycaps'
import type { KeyboardLayout } from './keyboardLayouts'
export type Keys = keyof typeof keys
export type KeysList = Keys[]
export type BlockLayout = {
  content: Keys[],
  layout: KeyboardLayout
}
export type CustomKeyboard = BlockLayout[]
