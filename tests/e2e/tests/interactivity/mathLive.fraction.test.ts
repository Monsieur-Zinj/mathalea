import { checkFeedback, getInnerText, getQuestions, inputAnswer, runTest } from '../../helpers/run'
import FractionEtendue from '../../../../src/modules/FractionEtendue.js'
import type { Page } from 'playwright'

async function test (page: Page) {
  const urlExercice = 'http://localhost:5173/alea/?uuid=91d72&id=5N10&n=5&d=10&s=3&s2=false&alea=OvFO&i=1&cd=1'
  const { nbQuestions, questions, isCorrect } = await getQuestions(page, urlExercice)

  for (let i = 0; i < nbQuestions; i++) {
    const { innerText, questionId } = await getInnerText(questions[i])
    let reponse

    if (innerText.includes('décimale')) { // on donne une fraction
      const numLocator = questions[i].locator('span:nth-child(1) > span > span.katex-mathml > math > semantics > mrow > mstyle > mfrac > mn').first()
      const denLocator = questions[i].locator('span:nth-child(1) > span > span.katex-mathml > math > semantics > mrow > mstyle > mfrac > mn').nth(1)
      if (numLocator == null || denLocator == null) throw Error('y a pas deux <mn> ! ')
      const num = await numLocator.textContent()
      const den = await denLocator.textContent()
      reponse = isCorrect[i] ? (Number(num) / Number(den)).toFixed(3) : (Number(den) / Number(num)).toFixed(3)
    } else { // on donne un nombre décimal
      const chunks = innerText.match(/[\d,]+/g)
      if (chunks !== null) {
        const nombre = Number(chunks[chunks.length - 1].replace(',', '.'))
        if (nombre != null) { // on fabrique la réponse
          const fraction = new FractionEtendue(nombre)
          reponse = isCorrect[i] ? `${fraction.num}/${fraction.den}` : `${fraction.den}/${fraction.num}`
        }
      }
    }

    await inputAnswer(page, questionId, reponse)
  }
  await checkFeedback(page, isCorrect)
  return true
}

runTest(test, import.meta.url)
