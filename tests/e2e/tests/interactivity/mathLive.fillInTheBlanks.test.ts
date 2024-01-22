import { checkFeedback, getQuestions, inputAnswer, runTest } from '../../helpers/run'
import type { Page } from 'playwright'

async function test6N203 (page: Page) {
  const urlExercice = 'http://localhost:5173/alea/?uuid=3bdcd&id=6N20-3&alea=vBuv&i=1'
  const questions = await getQuestions(page, urlExercice)

  for (const question of questions) {
    const mathField = question.mathField
    const cleanMathField = mathField.replaceAll('\\,', '')
    const regex = /(\d+)/g
    const [, numString, denString] = cleanMathField.match(regex) as [string, string, string]
    const num = Number(numString)
    const den = Number(denString)
    let a, b : number
    if (question.isCorrect) {
      a = Math.floor(num / den)
      b = Math.ceil(num / den)
    } else {
      a = Math.floor(num / den) - 1
      b = Math.floor(num / den) + 1
    }
    // @fixme trouver un moyen de mettre le focus sur le premier placeholder dans remplisLesBlancs()
    const reponse = [b.toString(), a.toString()] // J'ai inversé l'ordre parce que le focus se place automatiquement sur le deuxième placeholder !
    await inputAnswer(page, question, reponse)
  }
  await checkFeedback(page, questions)
  return true
}

async function test5R211 (page: Page) {
  const urlExercice = 'http://localhost:5173/alea/?uuid=f2db1&alea=1iCO&i=1' // Mettre ici l'url de l'exercice (éventuellement avec la graine mais push sans la graine)
  const questions = await getQuestions(page, urlExercice)

  for (const question of questions) {
    const mathField = question.mathField
    const cleanMathField = mathField
      .replace(' = (\\placeholder[place1]{}) + (\\placeholder[place2]{}) = \\placeholder[place3]{}', '')
      .replaceAll('(', '')
      .replaceAll(')', '')
    const [stringA, stringB] = cleanMathField.split(' - ')
    let a, b, c : number
    if (question.isCorrect) {
      a = Number(stringA)
      b = Number(stringB)
      b *= -1
      c = a + b
    } else {
      a = Number(stringA)
      b = Number(stringB)
      c = a + b
    }
    // @fixme remettre de l'ordre dans les réponses lorsque le focus ne sera plus sur le dernier placeholder
    const reponse = [c.toString(), a.toString(), b.toString()]
    await inputAnswer(page, question, reponse)
  }
  await checkFeedback(page, questions)
  return true
}

runTest(test6N203, import.meta.url)
runTest(test5R211, import.meta.url)
