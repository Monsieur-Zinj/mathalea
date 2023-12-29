import { checkFeedback, getQuestions, inputAnswer, runTest } from '../../helpers/run'
import FractionEtendue from '../../../../src/modules/FractionEtendue.js'
import type { Page } from 'playwright'
import { clean, getFraction } from 'helpers/text'

async function test (page: Page) {
  const urlExercice = 'http://localhost:5173/alea/?uuid=91d72&id=5N10&n=5&d=10&s=3&s2=false&alea=OvFO&i=1&cd=1'
  const questions = await getQuestions(page, urlExercice)

  for (const question of questions) {
    let reponse

    const innerText = clean(question.innerText, ['virgules'])
    if (innerText.includes('décimale')) { // on donne une fraction
      const { num, den } = await getFraction(question)
      reponse = question.isCorrect ? (Number(num) / Number(den)).toFixed(3) : (Number(den) / Number(num)).toFixed(3)
    } else { // on donne un nombre décimal
      const chunks = innerText.match(/[\d,]+/g)
      if (chunks !== null) {
        const nombre = Number(chunks[chunks.length - 1].replace(',', '.'))
        if (nombre != null) { // on fabrique la réponse
          const fraction = new FractionEtendue(nombre)
          reponse = question.isCorrect ? `${fraction.num}/${fraction.den}` : `${fraction.den}/${fraction.num}`
        }
      }
    }

    await inputAnswer(page, question.id, reponse)
  }
  await checkFeedback(page, questions)
  return true
}

runTest(test, import.meta.url, { pauseOnError: false })
