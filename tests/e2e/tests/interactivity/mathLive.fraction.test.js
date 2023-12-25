import { runTest } from '../../helpers/run.js'
import FractionEtendue from '../../../../src/modules/FractionEtendue.js'

/**
 *
 * @param {Page} page
 * @returns {Promise<boolean>}
 */
async function test (page) {
  const messages = []
  await page.goto('http://localhost:5173/alea/?uuid=91d72&id=5N10&n=5&d=10&s=3&s2=false&alea=pllB&i=1&cd=1')
  // Listen for all console events and handle errors
  page.on('console', (msg) => {
    if (!msg.text().includes('[vite]')) {
      messages.push(msg.text())
    }
  })
  // On cherche les questions
  await page.waitForSelector('div.mb-5>ul>div#consigne0-0')
  const liste = await page.locator('div#exo0 div.mb-5 div.container>li').all()
  const rep = []
  const nbQuestions = liste.length
  // on aléatoirise le fait de répondre juste ou pas
  for (let i = 0; i < nbQuestions; i++) {
    rep.push(Math.random() < 0.5)
  }
  // on répond aux questions
  for (let i = 0; i < nbQuestions; i++) {
    // on récupère l'id de la question pour le champMathLive
    const id = await liste[i].getAttribute('id')
    if (id != null && id.match(/exercice/) != null) { // précaution si il y a des <li> parasites à l'intérieur des questions
      const questionId = id.match(/\dQ\d+/)
      // on lit la question on récupère les données nécessaire pour fabriquer la réponse
      const expression = await liste[i].innerText()
      let reponse
      if (expression.includes('décimale')) { // on donne une fraction
        const numLocator = liste[i].locator('span:nth-child(1) > span > span.katex-mathml > math > semantics > mrow > mstyle > mfrac > mn').first()
        const denLocator = liste[i].locator('span:nth-child(1) > span > span.katex-mathml > math > semantics > mrow > mstyle > mfrac > mn').nth(1)
        if (numLocator == null || denLocator == null) throw Error('y a pas deux <mn> ! ')
        const num = await numLocator.textContent()
        const den = await denLocator.textContent()
        reponse = rep[i] ? (Number(num) / Number(den)).toFixed(3) : (Number(den) / Number(num)).toFixed(3)
      } else { // on donne un nombre décimal
        const chunks = expression.match(/[\d,]+/g)
        const nombre = Number(chunks[chunks.length - 1].replace(',', '.'))
        if (nombre != null) { // on fabrique la réponse
          const fraction = new FractionEtendue(nombre)
          reponse = rep[i] ? `${fraction.num}/${fraction.den}` : `${fraction.den}/${fraction.num}`
        }
      }
      // on tape la réponse
      const champTexteMathlive = page.locator(`#champTexteEx${questionId}`)
      await champTexteMathlive.type(reponse)
    } else {
      throw Error('La liste des questions contient un élément incongru')
    }
  }
  // on clique sur le bouton de vérification
  const boutonVerifier = page.locator('button#verif0')
  await boutonVerifier.click()
  // on analyse le feedback
  const feedback = page.locator('div[style="color: rgb(241, 89, 41); font-weight: bold; font-size: x-large; display: inline;"]')
  const [nbJuste, nbTotal] = (await feedback.innerText()).split('/').map(el => Number(el))
  let nbBonnesReponses = 0
  for (let k = 0; k < rep.length; k++) {
    nbBonnesReponses += (rep[k] ? 1 : 0)
  }
  // on regarde si le feedback est correct par rapport aux réponses qu'on a fabriquées
  if (nbJuste !== nbBonnesReponses || nbTotal !== rep.length) throw Error('Un problème avec la correction de 6C10')
  return true
}

runTest(test, import.meta.url)
