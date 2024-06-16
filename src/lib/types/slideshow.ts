import type { NumberRange } from '../types'

export type DataFromSettings = {
  currentQuestion: number
  divTableDurationsQuestions: HTMLDivElement | undefined
  durationGlobal: number | undefined
  formatQRCodeIndex: NumberRange<0, 2>
  isManualModeActive: boolean
  isSameDurationForAll: boolean
  QRCodeWidth: number
  questionNumber: number
  nbOfVues: NumberRange<1, 4>
  stringDureeTotale: string
  timer: number | undefined
}
