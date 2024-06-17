import type { NumberRange } from '../../../lib/types'

export type TransitionsBetweenQuestions = {
  isActive: boolean
  isNoisy: boolean
  isQuestThenSolModeActive: boolean
  questThenQuestAndSolDisplay: boolean
  tune: '0' | '1' | '2' | '3'
}

export type DataFromSettings = {
  currentQuestion: number
  durationGlobal: number | undefined
  formatQRCodeIndex: NumberRange<0, 2>
  isManualModeActive: boolean
  QRCodeWidth: number
  nbOfVues: NumberRange<1, 4>
  timer: number | undefined
  transitionsBetweenQuestions: TransitionsBetweenQuestions
}
