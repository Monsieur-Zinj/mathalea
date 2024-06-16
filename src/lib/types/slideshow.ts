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
  stringNbOfVues: string
  stringDureeTotale: string
  timer: number | undefined
}
