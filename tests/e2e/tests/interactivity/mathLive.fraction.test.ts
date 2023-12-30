import { checkFeedback, getQuestions, inputAnswer, runTest } from '../../helpers/run'
import FractionEtendue from '../../../../src/modules/FractionEtendue.js'
import type { Page } from 'playwright'
import { clean } from 'helpers/text'
import { KatexHandler } from '../../helpers/KatexHandler'

async function test (page: Page) {
  const urlExercice = 'http://localhost:5173/alea/?uuid=91d72&id=5N10&n=10&d=10&s=3&s2=false&i=1&cd=1'
  const questions = await getQuestions(page, urlExercice)

  for (const question of questions) {
    let reponse

    const innerText = clean(question.innerText, ['virgules'])
    if (innerText.includes('décimale')) { // l'énoncé fournit une fraction on saisit un décimal
      const katexFraction = new KatexHandler(page, question, { has: page.locator('mfrac') })
      const fraction = await katexFraction.getFraction()
      const { num, den } = fraction ?? { num: undefined, den: undefined }
      if (num == null || den == null) throw Error(`getFraction n'a pas trouvé la fraction : ${fraction}`)
      const [n, d] = [num, den].map(Number)
      console.log('On me demande de fournir une valeur décimale')
      console.log(`la fraction de l'énoncé est : ${num}/${den}`)
      console.log(`on me demande de répondre ${question.isCorrect ? 'correctement' : 'faux'}`)
      console.log(`Je réponds donc : ${question.isCorrect ? (n / d).toFixed(3).replace('.', ',') : (d / n).toFixed(3).replace('.', ',')}`)
      reponse = question.isCorrect
        ? (n / d).toFixed(3).replace('.', ',')
        : (d / n).toFixed(3).replace('.', ',')
    } else { // l'énoncé fournit un décimal on saisit une fraction
      const katexExpression = new KatexHandler(page, question, { hasText: ',' })
      const expression = await katexExpression.getExpression()
      if (expression == null) return false
      const exprCleaned = clean(expression, ['espaces', 'cr'])
      const chunks = exprCleaned.match(/\d+,\d+/g)
      if (chunks !== null) {
        const nombre = Number(chunks[0].replace(',', '.'))
        if (nombre != null) { // on fabrique la réponse
          console.log('On me demande de fournir une fraction')
          console.log(`le nombre de l'énoncé est : ${String(nombre)}`)
          console.log(`on me demande de répondre ${question.isCorrect ? 'correctement' : 'faux'}`)
          const fraction = new FractionEtendue(nombre)
          reponse = question.isCorrect
            ? `${String(fraction.num)}/${String(fraction.den)}`
            : `${String(fraction.den)}/${String(fraction.num)}`
          console.log(`Je réponds donc : ${question.isCorrect ? String(fraction.num) + '/' + String(fraction.den) : String(fraction.den) + '/' + String(fraction.num)}`)
        }
      }
    }
    await inputAnswer(page, question, reponse)
  }
  await checkFeedback(page, questions)
  return true
}

runTest(test, import.meta.url, { pauseOnError: false })
