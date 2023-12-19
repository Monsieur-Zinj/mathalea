import { keys } from '../keys/keycaps'
import type { KeyboardLayout } from './KBLayouts'
export type Keys = keyof typeof keys
export type KeysList = Keys[]
export type BlockLayout = {
  content: Keys[],
  layout: KeyboardLayout
}
export type CustomKeyboard = BlockLayout[]
