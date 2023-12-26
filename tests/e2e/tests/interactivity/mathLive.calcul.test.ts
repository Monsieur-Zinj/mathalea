import { checkFeedback, getInnerText, getQuestions, inputAnswer, runTest } from '../../helpers/run'
import type { Page } from 'playwright'

async function test (page: Page) {
  const urlExercice = 'http://localhost:5173/alea/?uuid=cfa6a&id=6C10&n=20&d=10&s=6&s2=3&i=1&cd=1'
  const { nbQuestions, questions, isCorrect } = await getQuestions(page, urlExercice)

  for (let i = 0; i < nbQuestions; i++) {
    const { innerText, questionId } = await getInnerText(questions[i])
    let reponse

    const operation = innerText.split('=')[0]
    const operandes = operation.match(/[0-9,]+/g)
    if (operandes != null && operation != null) { // on fabrique la réponse
      const chunks = operation.match(/\D/)
      if (chunks != null) {
        const operateur = chunks[0]
        switch (operateur) {
          case '+':
            reponse = Number(operandes[0].replace(',', '.')) + Number(operandes[1].replace(',', '.')) + (isCorrect[i] ? 0 : 1)
            break
          case '-':
            reponse = Number(operandes[0].replace(',', '.')) - Number(operandes[1].replace(',', '.')) + (isCorrect[i] ? 0 : 1)
            break
          case '×':
            reponse = Number(operandes[0].replace(',', '.')) * Number(operandes[1].replace(',', '.')) + (isCorrect[i] ? 0 : 1)
            break
        }
      }
    }

    await inputAnswer(page, questionId, reponse)
  }
  await checkFeedback(page, isCorrect)
  return true
}

runTest(test, import.meta.url)
