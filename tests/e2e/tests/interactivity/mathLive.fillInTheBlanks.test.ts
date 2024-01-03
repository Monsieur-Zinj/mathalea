import { checkFeedback, getQuestions, inputAnswer, runTest } from '../../helpers/run'
import type { Page } from 'playwright'

async function test6N20 (page: Page) {
  const urlExercice = 'http://localhost:5173/alea/?uuid=3bdcd&id=6N20-3&alea=vBuv&i=1'
  const questions = await getQuestions(page, urlExercice)

  for (const question of questions) {
    const mathField = question.mathField
    const cleanMathField = mathField.replaceAll('\\,', '')
    const regex = /(\d+)/g
    const [, numString, denString] = cleanMathField.match(regex) as [string, string, string]
    const num = Number(numString)
    const den = Number(denString)
    let a, b : number
    if (question.isCorrect) {
      a = Math.floor(num / den)
      b = Math.ceil(num / den)
    } else {
      a = Math.floor(num / den) - 1
      b = Math.floor(num / den) + 1
    }
    const reponse = [a.toString(), b.toString()]
    await inputAnswer(page, question, reponse)
  }
  await checkFeedback(page, questions)
  return true
}

runTest(test6N20, import.meta.url)
