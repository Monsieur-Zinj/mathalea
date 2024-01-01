import { specialKeys, numeric } from '../layouts/keyboardBlocks'
import { GAP_BETWEEN_KEYS, KEYCAP_WIDTH, keys } from '../layouts/keycaps'
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

  /**
   * Ajoute un bloc de touche au clavier
   * @param kb {KeyboardBlock} bloc de touches à ajouter
   * @returns le clavier lui-même (on peut donc chaîner cette fonction)
   */
  add = (kb: KeyboardBlock):Keyboard => {
    this.blocks.push(kb)
    return this
  }

  /**
   * Retrouve le nombre de blocs dans le clavier
   * @returns nombre de blocs dans le clavier
   */
  numberOfBlocks = (): number => this.blocks.length

  /**
   * Construit un tableau dont les éléments sont le nombre de touche par bloc
   * @returns nombre de touches par bloc (liste de nombres)
   */
  numberOfKeysPerBlock = (): number[] => {
    const result: number[] = []
    for (const block of this.blocks) {
      result.push(block.keycaps.inline.length)
    }
    return result
  }

  /**
   * Calcule le nombre total de touches dans le clavier
   * @returns nombre total de touches
   */
  numberOfKeys = (): number => this.numberOfKeysPerBlock().reduce((prev, current) => prev + current)
}

export const inLineBlockWidth = (block: KeyboardBlock, mode: 'sm' | 'md'): number => {
  const numberOfKeys = block.keycaps.inline.length
  // console.log('nb of keys: ' + numberOfKeys + ' / key width: ' + KEYCAP_WIDTH[mode]s + ' / gap between keys: ' + GAP_BETWEEN_KEYS[mode])
  return numberOfKeys * KEYCAP_WIDTH[mode] + (numberOfKeys - 1) * GAP_BETWEEN_KEYS[mode]
}
