import { checkFeedback, getQuestions, inputAnswer, runTest } from '../../helpers/run'
import type { Page } from 'playwright'
import Hms from '../../../../src/modules/Hms'

async function test (page: Page) {
  const urlExercice = 'http://localhost:5173/alea/?uuid=5f315&id=6D11&alea=02ek&i=1' // Mettre ici l'url de l'exercice (éventuellement avec la graine mais push sans la graine)
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
      console.log(reponse)
    } else {
      console.log(expression)
      throw new Error('Pas de match')
    }

    // ---------------------------------------------------------------
    // Dupliquer ce fichier
    // Se débrouiller à partir des console.log ci-dessous pour récupérer les informations nécessaires en utilisant
    // éventuellement les fonctions dans helpers/text.ts et construire une réponse selon question.isCorrect
    // (if (question.isCorrect) reponse = bonneReponse; else reponse = mauvaiseReponse)
    console.log(`Question ${question.numero} :`)
    console.log(`Texte énoncé : ${question.innerText}`)
    console.log('Éléments Katex :', question.katex.elements)
    // Si question.katex.elements ne suffit pas, on peut aller chercher des infos supplémentaires avec d'autres
    // propriétés comme question.innerHTML ou pour les aventuriers question.locator.locator('sélecteur CSS')
    //
    // pnpm test:e2e:dev pour lancer les tests
    // Une fois le test fonctionnel, déplacer le fichier vers son dossier de destination
    // ---------------------------------------------------------------

    await inputAnswer(page, question, reponse)
  }
  await checkFeedback(page, questions)
  return true
}

runTest(test, import.meta.url, { pauseOnError: true }) // true pendant le développement, false ensuite
