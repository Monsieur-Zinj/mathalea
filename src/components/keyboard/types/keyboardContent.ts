import { specialKeys, numeric } from '../layouts/keyboardBlocks'
import { keys } from '../layouts/keycaps'
export type Keys = keyof typeof keys
export type KeysList = Keys[]

export interface CompleteKeysList {
  inline: KeysList
  block: KeysList
}

export interface KeyboardBlock {
  keycaps: CompleteKeysList,
  cols: number
}

export class Keyboard {
  blocks: KeyboardBlock[] = [specialKeys]

  constructor (kb: KeyboardBlock = numeric) {
    this.blocks.push(kb)
  }

  add = (kb: KeyboardBlock):Keyboard => {
    this.blocks.push(kb)
    return this
  }

  length = ():number => this.blocks.length
}
