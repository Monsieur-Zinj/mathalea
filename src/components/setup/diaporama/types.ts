import type Exercice from '../../../exercices/Exercice'
import { type IntegerInRange0to2 } from '../../../lib/types/integerInRange'

export type DataFromSettings = {
  currentQuestion: number
  formatQRCodeIndex: IntegerInRange0to2
  QRCodeWidth: number
}

export type Vue = {
  consigne: string
  question: string
  correction: string
}

export type Slide = {
  exercise: Exercice
  isSelected: boolean
  vues: Vue[]
}

export type Slideshow = {
  slides: Slide[]
  currentQuestion: number
  selectedQuestionsNumber: number
}
