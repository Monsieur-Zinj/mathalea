import { checkFeedback, getQuestions, inputAnswer, runTest } from '../../helpers/run'
import type { Page } from 'playwright'
import { KatexHandler } from '../../helpers/KatexHandler'

async function test (page: Page) {
  const urlExercice = 'http://localhost:5173/alea/?uuid=f8f4e&id=5N13&n=10&d=10&s=11&s2=false&i=1&cd=1' // Mettre ici l'url de l'exercice (éventuellement avec la graine mais push sans la graine)
  const questions = await getQuestions(page, urlExercice)
  for (const question of questions) {
    const katexFrac = new KatexHandler(page, question, { has: page.locator('mfrac') })
    const fraction = await katexFrac.getFraction()
    const { num, den } = fraction ?? { num: undefined, den: undefined }
    if (num == null || den == null) throw Error(`getFraction n'a pas trouvé la fraction : ${fraction}`)
    const [n, d] = [num, den].map(Number)
    let reponse
    for (const diviseur of [2, 3, 5, 7, 11, 13, 17]) {
      if (n % diviseur === 0 && d % diviseur === 0) {
        reponse = question.isCorrect
          ? `${(n / diviseur).toFixed(0)}/${(d / diviseur).toFixed(0)}`
          : `${(n / diviseur).toFixed(0)}/${(d).toFixed(0)}`
        break
      }
    }
    if (reponse == null) throw Error(`Je n'ai pas réussi à simplifier ${fraction}`)
    await inputAnswer(page, question, reponse)
  }
  await checkFeedback(page, questions)
  return true
}

runTest(test, import.meta.url, { pauseOnError: true }) // true pendant le développement, false ensuite
