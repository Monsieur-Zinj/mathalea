import prefs from './prefs.js'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getDefaultPage } from './browser.js'
import { getFileLogger, logError } from './log.js'
import type { Locator, Page } from 'playwright'
import type { Prefs, Question } from './types.js'
import { clean } from './text.js'
import path from 'node:path'
import { store } from './store.js'

declare global {
  interface Window {
    katexRendered?: boolean;
  }
}
/**
 * Wrapper des test effectués par vitest
 * Ajoute un describe() contenant un it() (alias de test() dans vitest) par browser à tester
 * @param {function} test La fonction à exécuter dans chaque it()
 * @param {string} metaUrl il faut passer import.meta.url depuis le fichier appelant pour savoir lequel c'est (et l'indiquer dans le log)
 * @param {Partial<Prefs>} prefsOverride permet d'écraser les préférences par défaut qui se trouvent dans le fichier helpers/prefs.ts
 */
export function runTest (test: (page: Page) => Promise<boolean>, metaUrl: string, prefsOverride?: Partial<Prefs>) {
  const autoTestOverride = process.env.AUTOTEST ? { pauseOnError: false, headless: true } : {}
  Object.assign(prefs, prefsOverride, autoTestOverride)
  const filename = fileURLToPath(metaUrl)
  const testsSuiteDescription = '' // Ajoute une description intermédiaire dans le stdout si besoin
  const fileLogger = getFileLogger(path.basename(metaUrl))
  store.set('fileLogger', fileLogger)
  describe(testsSuiteDescription, async () => {
    let page: Page, result: boolean
    let stop = false

    beforeEach(({ skip }) => {
      if (stop) skip()
    })

    // cf https://vitest.dev/guide/test-context.html pour l'argument passé
    afterEach(async () => {
      if (prefs.pauseOnError && !result && page) {
        await page.pause()
        stop = true
      }
    })

    if (prefs.browsers !== undefined) {
      for (const browserName of prefs.browsers) {
        it(`${test.name} works with ${browserName}`, async ({ skip }) => {
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

export function runSeveralTests (tests: ((page: Page) => Promise<boolean>)[], metaUrl: string, prefsOverride?: Partial<Prefs>) {
  Object.assign(prefs, prefsOverride)
  const filename = fileURLToPath(metaUrl)
  const testsSuiteDescription = '' // Ajoute une description intermédiaire dans le stdout si besoin
  const fileLogger = getFileLogger(path.basename(metaUrl))
  store.set('fileLogger', fileLogger)
  describe(testsSuiteDescription, async () => {
    let page: Page, result: boolean
    let stop = false

    beforeEach(({ skip }) => {
      if (stop) skip()
    })

    // cf https://vitest.dev/guide/test-context.html pour l'argument passé
    afterEach(async () => {
      if (prefs.pauseOnError && !result && page) {
        await page.pause()
        stop = true
      }
    })

    if (prefs.browsers !== undefined) {
      for (const browserName of prefs.browsers) {
        for (const test of tests) {
          it(`${test.name} works with ${browserName}`, async ({ skip }) => {
            if (stop) return skip()
            try {
              if (page === undefined) page = await getDefaultPage({ browserName })
              result = false
              const promise = test(page)
              if (!(promise instanceof Promise)) throw Error(`${filename} ne contient pas de fonction test qui prend une page et retourne une promesse`)
              result = await promise
              expect(result).toBe(true) // si le résultat n'est pas bon, ça lève une exception
            } catch (error: unknown) {
              result = false
              // faut attendre que l'écriture se termine (sinon on se retrouve en pause avant
              // d'avoir le message d'erreur et on sait pas pourquoi ça a planté)
              await logError(error)
              expect(result).toBe(true) // il faut cependant renvoyer l'exception...
            }
          })
        }
      }
    }
  })
}
export async function getQuestions (page: Page, urlExercice: string) {
  const questionSelector = 'div#exo0 div.mb-5 div.container>li'

  // console.log('getQuestions')

  await page.addInitScript(() => {
    const katexRenderedHandler = () => {
      window.katexRendered = true
      // console.log('katex rendered received')
      document.removeEventListener('katexRendered', katexRenderedHandler)
    }
    // console.log('katexRendered listener')
    document.addEventListener('katexRendered', katexRenderedHandler)
  })

  console.log('goto:' + urlExercice)
  await page.goto(urlExercice)

  // console.log('waitForFunction')
  await page.waitForFunction(() => window.katexRendered)

  await page.waitForSelector(questionSelector)
  const locators = await page.locator(questionSelector).all()

  const href = await page.evaluate(() => document.location.href)

  console.log('goto (avec la graine):' + href)

  const questions: Question[] = []
  for (const locator of locators) {
    questions.push({
      id: await getQuestionId(locator),
      innerText: await getInnerText(locator),
      innerHTML: await getInnerHTML(locator),
      isCorrect: Math.random() < 0.5,
      katex: await getKatex(locator),
      mathField: await getMathField(locator),
      locator,
      numero: 0
    })
    const lastQuestion = questions[questions.length - 1]
    lastQuestion.numero = Number(lastQuestion.id.split('Q')[1]) + 1
  }
  return questions
}

/**
 * MGU
 * On peut rater l'événement si la page se charge rapidement.
 * A ne surtout pas utiliser
 * @deprecated
 */
export async function waitForKatex (page: Page) {
  await page.evaluate(() => {
    const katexRenderedHandler = () => {
      window.katexRendered = true
      console.log('katex rendered received')
      document.removeEventListener('katexRendered', katexRenderedHandler)
    }

    document.addEventListener('katexRendered', katexRenderedHandler)
  })
  console.log('waitForFunction')
  await page.waitForFunction(() => window.katexRendered, null, { timeout: 60000 })
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

async function getInnerText (locator: Locator) {
  const innerTextRaw = (await locator.innerText())
  return clean(innerTextRaw, [])
}

async function getInnerHTML (locator: Locator) {
  const innerHTMLRaw = (await locator.innerHTML())
  return clean(innerHTMLRaw, [])
}

async function getKatex (questionLocator: Locator) {
  const locators = await questionLocator.locator('span.katex-html').all()
  const innerHTMLs: string[] = []
  const innerTexts: string[] = []
  const elementsWithRedondancy: string[][][] = []
  for (const locator of locators) {
    innerHTMLs.push(await locator.innerHTML())
    innerTexts.push(await locator.innerText())
    elementsWithRedondancy.push(innerTexts.map(innerText => innerText.split('\n')))
  }
  const selectedElements = elementsWithRedondancy[elementsWithRedondancy.length - 1]
  let elements: string[][] = []
  if (selectedElements !== undefined) elements = selectedElements.map(list => list.map(ele => clean(ele, [])))
  return { elements, innerHTMLs, innerTexts, locators }
}

async function getMathField (questionLocator: Locator) {
  const locators = await questionLocator.locator('math-field').all()
  const mathField: string[] = []
  for (const locator of locators) {
    mathField.push(await locator.innerHTML())
  }
  return mathField[0]
}

export async function inputAnswer (page: Page, question: Question, answer: string | number | (string | number)[] | undefined) {
  const champTexteSelector = `#champTexteEx${question.id}`

  if (answer === undefined) throw Error(`La réponse à la question ${question.id} est undefined`)

  await page.waitForSelector(champTexteSelector) // Les champs MathLive mettent un peu plus de temps à se charger que le reste
  const champTexteMathlive = page.locator(champTexteSelector)
  if (Array.isArray(answer)) {
    for (let i = 0; i < answer.length; i++) {
      if (i > 0) await champTexteMathlive.press('Tab')
      await champTexteMathlive.pressSequentially(answer[i].toString()) // On a besoin de pressSequentially au lieu de fill pour que le clavier MathLive réagisse (et transforme les / en fraction par exemple)
    }
  } else {
    await champTexteMathlive.pressSequentially(answer.toString())
  }
}

export async function inputAnswerById (page: Page, id: string, answer: string | number | (string | number)[] | undefined) {
  const champTexteSelector = `#champTexteEx${id}`

  if (answer === undefined) throw Error(`La réponse à la question ${id} est undefined`)

  await page.waitForSelector(champTexteSelector) // Les champs MathLive mettent un peu plus de temps à se charger que le reste
  const champTexteMathlive = page.locator(champTexteSelector)
  if (Array.isArray(answer)) {
    for (let i = 0; i < answer.length; i++) {
      if (i > 0) await champTexteMathlive.press('Tab')
      await champTexteMathlive.pressSequentially(answer[i].toString()) // On a besoin de pressSequentially au lieu de fill pour que le clavier MathLive réagisse (et transforme les / en fraction par exemple)
    }
  } else {
    await champTexteMathlive.pressSequentially(answer.toString())
  }
}

export async function checkFeedback (page: Page, questions: Question[]) {
  await checkButtonClick(page)
  await addFeedbacks(page, questions)

  for (const question of questions) {
    const numeroQuestion = Number(question.id.split('Q')[1]) + 1
    if (question.feedback === 'OK' && !question.isCorrect) {
      throw Error(`On s'attendait à avoir une mauvaise réponse à la question ${numeroQuestion}`)
    }
    if (question.feedback === 'KO' && question.isCorrect) {
      throw Error(`On s'attendait à avoir une bonne réponse à la question ${numeroQuestion}`)
    }
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
  if (feedback.includes('☹️')) return 'KO'
  if (feedback.includes('😎')) return 'OK'
  throw Error('Un feedback autre que ☹️ et 😎 a été trouvé')
}
