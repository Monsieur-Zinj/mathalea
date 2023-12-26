import type { Locator } from 'playwright'

export type Question = {
  feedback?: 'OK' | 'KO'
  id: string // du type 0Q0
  innerText: string
  isCorrect: boolean
  locator: Locator
}
