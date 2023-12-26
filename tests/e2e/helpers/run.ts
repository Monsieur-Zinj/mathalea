import prefs from './prefs.js'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, it } from 'vitest'
import { getDefaultPage } from './browser.js'
import { logError } from './log.js'
import type { Locator, Page } from 'playwright'
import type { Question } from './types.js'
import { clean } from './text.js'

/**
 * Wrapper des test effectués par vitest
 * Ajoute un describe() contenant un it() (alias de test() dans vitest) par browser à tester
 * @param {function} test La fonction à exécuter dans chaque it()
 * @param metaUrl il faut passer import.meta.url depuis le fichier appelant pour savoir lequel c'est (et l'indiquer dans le log)
 */
export function runTest (test: (page: Page) => Promise<boolean>, metaUrl: string) {
  const filename = fileURLToPath(metaUrl)
  const testsSuiteDescription = '' // Ajoute une description intermédiaire dans le stdout si besoin
  describe(testsSuiteDescription, async () => {
    let page: Page, result: boolean
    const { continueOnError } = prefs
    let stop = false

    beforeEach(({ skip }) => {
      if (stop) skip()
    })

    // cf https://vitest.dev/guide/test-context.html pour l'argument passé
    afterEach(async () => {
      if (continueOnError) return
      // on s'arrête sur le 1er test qui plante pour creuser ça
      if (!result && page && !prefs.headless) {
        await page.pause()
        stop = true
      }
    })

    if (prefs.browsers !== undefined) {
      for (const browserName of prefs.browsers) {
        it(`works with ${browserName}`, async ({ skip }) => {
          if (stop) return skip()
          try {
            result = false
            page = await getDefaultPage({ browserName })
            const promise = test(page)
            if (!(promise instanceof Promise)) throw Error(`${filename} ne contient pas de fonction test qui prend une page et retourne une promesse`)
            result = await promise
          } catch (error: unknown) {
            result = false
            // faut attendre que l'écriture se termine (sinon on se retrouve en pause avant
            // d'avoir le message d'erreur et on sait pas pourquoi ça a planté)
            await logError(error)
            throw error
          }
          if (!result) {
            throw Error(`test ${filename} KO avec ${browserName}`)
          }
        })
      }
    }
  })
}

export async function getQuestions (page: Page, urlExercice: string) {
  const questionSelector = 'div#exo0 div.mb-5 div.container>li'

  await page.goto(urlExercice)
  await page.waitForSelector(questionSelector)
  const locators = await page.locator(questionSelector).all()

  const questions: Question[] = []
  for (const locator of locators) {
    questions.push({
      id: await getQuestionId(locator),
      innerText: await getInnerText(locator),
      isCorrect: Math.random() < 0.5,
      locator
    })
  }
  return questions
}

async function getQuestionId (question: Locator) {
  const id = await question.getAttribute('id')
  if (id == null || id.match(/exercice/) == null) throw Error(`Il y a un problème avec la question ${id}`) // précaution si il y a des <li> parasites à l'intérieur des questions
  const questionIdMatchArray = id.match(/\dQ\d+/)
  if (questionIdMatchArray === null) {
    throw Error(`L'id de la question ${id} n'a pas été trouvé`)
  } else {
    const questionId = questionIdMatchArray[0]
    return questionId
  }
}

async function getInnerText (question: Locator) {
  const innerTextRaw = (await question.innerText())
  const innerText = clean(innerTextRaw, [])
  return innerText
}

export async function inputAnswer (page: Page, questionId: string, answer: string | number | undefined) {
  const champTexteSelector = `#champTexteEx${questionId}`

  if (answer === undefined) throw Error(`La réponse à la question ${questionId} est undefined`)

  await page.waitForSelector(champTexteSelector) // Les champs MathLive mettent un peu plus de temps à se charger que le reste
  const champTexteMathlive = page.locator(champTexteSelector)
  await champTexteMathlive.pressSequentially(answer.toString()) // On a besoin de pressSequentially au lieu de fill pour que le clavier MathLive réagisse (et transforme les / en fraction par exemple)
}

export async function checkFeedback (page: Page, questions: Question[]) {
  await checkButtonClick(page)
  await addFeedbacks(page, questions)

  for (const question of questions) {
    const numeroQuestion = Number(question.id.split('Q')[1]) + 1
    if (question.feedback === 'OK' && question.isCorrect === false) throw Error(`On s'attendait à avoir une mauvaise réponse à la question ${numeroQuestion}`)
    if (question.feedback === 'KO' && question.isCorrect === true) throw Error(`On s'attendait à avoir une bonne réponse à la question ${numeroQuestion}`)
  }
}

async function checkButtonClick (page: Page) {
  const checkButtonSelector = 'button#verif0'
  const checkButton = page.locator(checkButtonSelector)
  await checkButton.click()
}

async function addFeedbacks (page: Page, questions: Question[]) {
  for (const question of questions) {
    question.feedback = await getFeedback(page, question.id)
  }
}

async function getFeedback (page: Page, id: string) {
  const feedbackSelector = `#resultatCheckEx${id}`
  await page.waitForSelector(feedbackSelector)
  const feedback = await page.locator(feedbackSelector).innerText()
  if (feedback === '☹️') return 'KO'
  if (feedback === '😎') return 'OK'
  throw Error('Un feedback autre que ☹️ et 😎 a été trouvé')
}
