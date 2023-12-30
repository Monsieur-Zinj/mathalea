import { clean } from 'helpers/text'
import { checkFeedback, getQuestions, inputAnswer, runTest } from '../../helpers/run'
import type { Page } from 'playwright'

async function testEntier (page: Page) {
  const urlExercice = 'http://localhost:5173/alea/?uuid=cfa6a&id=6C10&n=20&d=10&s=6&s2=3&i=1&cd=1'
  const questions = await getQuestions(page, urlExercice)

  for (const question of questions) {
    let reponse

    const innerText = clean(question.innerText, ['dollars', 'espaces']).replaceAll('\\times', '×')
    const operation = innerText.split('=')[0]
    const operandes = operation.match(/[0-9,]+/g)
    if (operandes != null && operation != null) { // on fabrique la réponse
      const chunks = operation.match(/\D/)
      if (chunks != null) {
        const operateur = chunks[0]
        switch (operateur) {
          case '+':
            reponse = Number(operandes[0].replace(',', '.')) + Number(operandes[1].replace(',', '.')) + (question.isCorrect ? 0 : 1)
            break
          case '-':
            reponse = Number(operandes[0].replace(',', '.')) - Number(operandes[1].replace(',', '.')) + (question.isCorrect ? 0 : 1)
            break
          case '×':
            reponse = Number(operandes[0].replace(',', '.')) * Number(operandes[1].replace(',', '.')) + (question.isCorrect ? 0 : 1)
            break
        }
      }
    }

    await inputAnswer(page, question, reponse)
  }
  await checkFeedback(page, questions)
  return true
}

async function testCalculLitteral (page: Page) {
  const urlExercice = 'http://localhost:5173/alea/?uuid=77a62&id=3L11&n=6&d=10&s=3&s2=1&s3=1&s4=true&n=20&i=1'
  const questions = await getQuestions(page, urlExercice)

  for (const question of questions) {
    let reponse = ''
    const regex = /([-+]?\d+)\(([-+]?\d*)x([-+]\d+)\)/
    const expression = question.katex.elements[0][0]
    const match = expression.match(regex)

    if (match) {
      const k = stringToNumber(match[1])
      const a = stringToNumber(match[2])
      const b = stringToNumber(match[3])
      if (question.isCorrect) {
        reponse = `${k * a}x${k * b > 0 ? '+' : ''}${k * b}`
      } else {
        reponse = `${-k * a}x${k * b > 0 ? '+' : ''}${k * b}`
      }
    } else {
      throw new Error('Pas de match')
    }

    await inputAnswer(page, question, reponse)
  }
  await checkFeedback(page, questions)
  return true
}

async function testCalculLitteral2 (page: Page) {
  const urlExercice = 'http://localhost:5173/alea/?uuid=77a62&n=6&d=10&s=3&s2=1&s3=3&s4=true&i=1&cd=1'
  const questions = await getQuestions(page, urlExercice)

  for (const question of questions) {
    let reponse = ''
    const regex = /([-+]?\d+)x\(([-+]?\d*)x([-+]\d+)\)/
    const expression = question.katex.elements[0][0]
    const match = expression.match(regex)

    if (match) {
      const k = stringToNumber(match[1])
      const a = stringToNumber(match[2])
      const b = stringToNumber(match[3])
      if (question.isCorrect) {
        reponse = `${k * a}x^2${k * b > 0 ? '+' : ''}${k * b}x`
      } else {
        reponse = `${-k * a}x${k * b > 0 ? '+' : ''}${k * b}`
      }
    } else {
      throw new Error('Pas de match')
    }

    await inputAnswer(page, question, reponse)
  }
  await checkFeedback(page, questions)
  return true
}

runTest(testEntier, import.meta.url, { pauseOnError: true })
runTest(testCalculLitteral, import.meta.url, { pauseOnError: true })
runTest(testCalculLitteral2, import.meta.url, { pauseOnError: true })

function stringToNumber (str: string): number {
  if (str === '') {
    return 1
  } else if (str === '-') {
    return -1
  } else if (str === '+') {
    return 1
  }
  return Number(str)
}
