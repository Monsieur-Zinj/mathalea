import Decimal from 'decimal.js'
import { checkFeedback, getQuestions, inputAnswer, runTest } from '../../helpers/run'
import type { Page } from 'playwright'

async function test (page: Page) {
  const urlExercice = 'localhost:5173/alea/?uuid=4ce2d&id=3P10-1&n=20&i=1&s=2'
  // 3P10-1 uniquement dans le cas de la recherche du taux de variation
  const questions = await getQuestions(page, urlExercice)

  for (const question of questions) {
    const k = new Decimal(question.katex.elements[0][0].replace(',', '.'))
    let taux = k.minus(1).times(100)
    let reponse = ''
    if (!question.isCorrect) {
      taux = taux.times(-1)
    }
    reponse = taux.greaterThan(0) ? '+' + taux.toNumber() + '%' : taux.toNumber() + '%'
    await inputAnswer(page, question, reponse)
  }
  await checkFeedback(page, questions)
  return true
}

runTest(test, import.meta.url)
