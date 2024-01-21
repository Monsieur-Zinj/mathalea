import Decimal from 'decimal.js'
import { checkFeedback, getQuestions, inputAnswer, runTest } from '../../helpers/run'
import type { Page } from 'playwright'

async function test (page: Page) {
  const urlExercice = 'http://localhost:5173/alea/?uuid=a0d16&id=4C32&n=20&d=10&s=1&s2=3&alea=N1tD&i=1&cd=1'
  const questions = await getQuestions(page, urlExercice)

  for (const question of questions) {
    const a = new Decimal(question.katex.elements[0][0].replace(',', '.'))
    Decimal.set({ toExpNeg: 0 })
    Decimal.set({ toExpPos: 0 })
    let reponse = ''
    if (question.isCorrect) {
      reponse = a.toString().replace('e', '*10^')
    } else {
      reponse = a.mul(-1).toString().replace('e', '*10^')
    }
    await inputAnswer(page, question, reponse)
  }
  await checkFeedback(page, questions)
  return true
}

runTest(test, import.meta.url)
