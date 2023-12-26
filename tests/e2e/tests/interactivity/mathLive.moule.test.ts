import { checkFeedback, getInnerText, getQuestions, inputAnswer, runTest } from '../../helpers/run'
import type { Page } from 'playwright'

async function test (page: Page) {
  const urlExercice = '' // Mettre ici l'url de l'exercice (éventuellement avec la graine mais push sans la graine)
  const { nbQuestions, questions, isCorrect } = await getQuestions(page, urlExercice)

  for (let i = 0; i < nbQuestions; i++) {
    const { innerText, questionId } = await getInnerText(questions[i])
    let reponse

    // ---------------------------------------------------------------
    // Se débrouiller à partir de l'innerText de la question pour récupérer les informations nécessaires
    // (avec des RegEx par exemple) et construire une réponse selon isCorrect[i]
    // (if (isCorrect[i]) reponse = bonneReponse; else reponse = mauvaiseReponse)
    //
    // Si l'innerText de la question ne suffit pas, on peut aller chercher des infos supplémentaires avec
    // questions[i].locator('sélecteur CSS') (voir le fichier mathLive.fraction.test.ts)
    //
    // Pour faire des tests, on peut utiliser des console.log() et await page.pause()
    // pnpm test:e2e:interactivity pour lancer les tests
    // ---------------------------------------------------------------

    await inputAnswer(page, questionId, reponse)
  }
  await checkFeedback(page, isCorrect)
  return true
}

runTest(test, import.meta.url)
