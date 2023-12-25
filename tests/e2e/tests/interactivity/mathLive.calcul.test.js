import { logError } from '../../helpers/log.js'
import { runTest } from '../../helpers/run.js'

/**
 *
 * @param {Page} page
 * @returns {Promise<boolean>}
 */
async function test (page) {
  const messages = []
  await page.goto('http://localhost:5173/alea/?uuid=cfa6a&id=6C10&n=20&d=10&s=6&s2=3&alea=as0E&i=1&cd=1')
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
      const innerText = await liste[i].innerText()
      const operation = innerText.replace('−', '-').replaceAll('$', '').replaceAll('\\times', '×').replaceAll(/\s/g, '').replaceAll('\\,', '').split('=')[0]
      const operandes = operation.match(/[0-9,]+/g)
      if (operandes != null && operation != null) { // on fabrique la réponse
        const chunks = operation.match(/\D/)
        if (chunks != null) {
          const operateur = chunks[0]
          let reponse
          switch (operateur) {
            case '+':
              reponse = Number(operandes[0].replace(',', '.')) + Number(operandes[1].replace(',', '.')) + (rep[i] ? 0 : 1)
              break
            case '-':
              reponse = Number(operandes[0].replace(',', '.')) - Number(operandes[1].replace(',', '.')) + (rep[i] ? 0 : 1)
              break
            case '×':
              reponse = Number(operandes[0].replace(',', '.')) * Number(operandes[1].replace(',', '.')) + (rep[i] ? 0 : 1)
              break
            default:
              reponse = 0
              break
          }
          // on tape la réponse
          const champTexteMathlive = await page.locator(`#champTexteEx${questionId}`)
          await champTexteMathlive.fill(reponse.toString())
        }
      }
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
