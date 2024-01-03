import { checkFeedback, getQuestions, inputAnswer, runTest } from '../../helpers/run'
import type { Page } from 'playwright'
import Hms from '../../../../src/modules/Hms'

async function test (page: Page) {
  const urlExercice = 'http://localhost:5173/alea/?uuid=5f315&id=6D11&n=20&i=1'
  const questions = await getQuestions(page, urlExercice)

  for (const question of questions) {
    let reponse = ''
    const regex = /(.+)\+(.+)=/
    const expression = question.katex.elements[0][0]
    const match = expression.match(regex)

    if (match) {
      const d1 = Hms.fromString(match[1])
      const d2 = Hms.fromString(match[2])
      if (question.isCorrect) {
        reponse = d1.add(d2).toString()
      } else {
        reponse = d1.add(d2).add(d1).toString()
      }
    } else {
      throw new Error('Pas de match')
    }

    await inputAnswer(page, question, reponse)
  }
  await checkFeedback(page, questions)
  return true
}

runTest(test, import.meta.url, { pauseOnError: false })
