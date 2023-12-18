/* eslint-disable no-unused-vars */
export type BlockPosition = 'left' | 'center' | 'right'
export type RowPosition = 'row0' | 'row1' | 'row2' | 'row3'
export interface KeyCap {
  key: string
  insert?: string
  command?: string | string[]
}
export type BlockContent = {
  [R in RowPosition]?: KeyCap[]
}
export type KeyboardLayout = {
  [B in BlockPosition]?: BlockContent
}
