import type { NumberRange } from '../types'

export type DataFromSettings = {
  currentQuestion: number
  formatQRCodeIndex: NumberRange<0, 2>
  isManualModeActive: boolean
  QRCodeWidth: number
  questionNumber: number
  nbOfVues: NumberRange<1, 4>
  timer: number | undefined
}
