import type Exercice from '../../../exercices/Exercice'

export type Vue = {
  consigne: string
  question: string
  correction: string
  consigneSvgs: string[]
  questionSvgs: string[]
  correctionSvgs: string[]
  consigneText: string
  questionText: string
  correctionText: string
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

export type Serie = {
  consignes: string[]
  questions: string[]
  corrections: string[]
}
