import prefs from './prefs.js'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, it } from 'vitest'
import { getDefaultPage } from './browser.js'
import { logError } from './log.js'
import type { Locator, Page } from 'playwright'

/**
 * Wrapper des test effectués par vitest
 * Ajoute un describe() contenant un it() (alias de test() dans vitest) par browser à tester
 * @param {function} test La fonction à exécuter dans chaque it()
 * @param metaUrl il faut passer import.meta.url depuis le fichier appelant pour savoir lequel c'est (et l'indiquer dans le log)
 */
export function runTest (test: (page: Page) => Promise<boolean>, metaUrl: string) {
  if (test.length < 1) throw Error('la fonction de test doit avoir un argument (un objet Page)')
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
            const msg = `test ${filename} KO avec ${browserName}`
            throw Error(msg)
          }
        })
      }
    }
  })
}

export async function getQuestions (page: Page, urlExercice: string) {
  const messages = []
  await page.goto(urlExercice)
  // Listen for all console events and handle errors
  page.on('console', (msg) => {
    if (!msg.text().includes('[vite]')) {
      messages.push(msg.text())
    }
  })
  // On cherche les questions
  await page.waitForSelector('div.mb-5>ul>div#consigne0-0')
  const questions = await page.locator('div#exo0 div.mb-5 div.container>li').all()
  const isCorrect = []
  const nbQuestions = questions.length
  // on aléatoirise le fait de répondre juste ou pas
  for (let i = 0; i < nbQuestions; i++) {
    isCorrect.push(Math.random() < 0.5)
  }
  return { nbQuestions, questions, isCorrect }
}

export async function getInnerText (question: Locator) {
  // on récupère l'id de la question pour le champMathLive
  const id = await question.getAttribute('id')
  if (id == null || id.match(/exercice/) == null) throw Error(`Il y a un problème avec la question ${id}`) // précaution si il y a des <li> parasites à l'intérieur des questions
  const questionIdMatchArray = id.match(/\dQ\d+/)
  const questionId = questionIdMatchArray === null ? '' : questionIdMatchArray[0]
  // on lit la question on récupère les données nécessaire pour fabriquer la réponse
  const innerTextRaw = (await question.innerText())
  const innerText = innerTextRaw.replace('−', '-').replaceAll('$', '').replaceAll('\\times', '×').replaceAll('{,}', ',').replaceAll(/\s/g, '').replaceAll('\\,', '')
  return { innerText, questionId }
}

export async function inputAnswer (page: Page, questionId: string, answer: string | number | undefined) {
  if (answer === undefined) throw Error(`On n'a pas pu trouver la réponse à la question ${questionId}`)
  const selector = `#champTexteEx${questionId}`
  await page.waitForSelector(selector) // Des fois il est tellement pressé qu'il zappe la première question
  const champTexteMathlive = page.locator(selector)
  await champTexteMathlive.type(answer.toString())
}

export async function checkFeedback (page: Page, isCorrect: boolean[]) {
  const boutonVerifier = page.locator('button#verif0')
  await boutonVerifier.click()

  const feedback = page.locator('div[style="color: rgb(241, 89, 41); font-weight: bold; font-size: x-large; display: inline;"]')
  const [correctFeedback, totalFeedback] = (await feedback.innerText()).split('/').map(el => Number(el))
  const totalInput = isCorrect.length
  let correctInput = 0
  for (let k = 0; k < totalInput; k++) {
    correctInput += (isCorrect[k] ? 1 : 0)
  }
  if (correctFeedback !== correctInput) {
    throw Error(`On attendait ${correctInput} réponses correctes et on en a eu ${correctFeedback}
Les questions correctes devaient être les questions ${getTrueIndices(isCorrect).toString()}`)
  }
  if (totalFeedback !== totalInput) throw Error(`On a compté ${totalFeedback} feedbacks pour ${totalInput} questions`)
}

function getTrueIndices (arr: boolean[]): number[] {
  return arr.reduce((indices: number[], value, index) => {
    if (value) {
      indices.push(index + 1)
    }
    return indices
  }, [])
}
