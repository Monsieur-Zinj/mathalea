import { checkFeedback, getQuestions, inputAnswer, runTest } from '../../helpers/run'
import type { Page } from 'playwright'

async function test (page: Page) {
  const urlExercice = '' // Mettre ici l'url de l'exercice (éventuellement avec la graine mais push sans la graine)
  const questions = await getQuestions(page, urlExercice)

  for (const question of questions) {
    let reponse

    // ---------------------------------------------------------------
    // Se débrouiller à partir de question.innerText pour récupérer les informations nécessaires en utilisant
    // éventuellement les fonctions dans helpers/text.ts et construire une réponse selon question.isCorrect
    // (if (question.isCorrect) reponse = bonneReponse; else reponse = mauvaiseReponse)
    //
    // Si question.innerText ne suffit pas, on peut aller chercher des infos supplémentaires avec
    // question.locator.locator('sélecteur CSS') (voir le fichier mathLive.fraction.test.ts)
    //
    // Pour faire des tests, on peut utiliser des console.log() et await page.pause()
    // pnpm test:e2e:interactivity pour lancer les tests
    // ---------------------------------------------------------------

    await inputAnswer(page, question.id, reponse)
  }
  await checkFeedback(page, questions)
  return true
}

runTest(test, import.meta.url)
