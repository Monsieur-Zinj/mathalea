import { runSeveralTests } from '../../helpers/run.js'
import type { Page } from 'playwright'
import { logError as lgE, log as lg, getFileLogger } from '../../helpers/log'
import prefs from '../../helpers/prefs.js'
import { findStatic, findUuid } from '../../helpers/filter.js'
import { createIssue } from '../../helpers/issue.js'

const logConsole = getFileLogger('exportConsole', { append: true })

function log (...args: unknown[]) {
  lg(args)
  logConsole(args)
}

function logError (...args: unknown[]) {
  lgE(args)
  logConsole(args)
}

function logDebug (...args: unknown[]) {
  if (process.env.CI && process.env.DEBUG !== null && process.env.DEBUG !== undefined) {
    if ((process.env.DEBUG as string).replaceAll(' ', '') === 'DEBUG') {
      log(args)
    }
  }
}

async function getConsoleTest (page: Page, urlExercice: string) {
  log(urlExercice)
  // on configure à 5 min le timeout
  page.setDefaultTimeout(5 * 60 * 1000)

  // await page.reload()
  const messages: string[] = []

  try {
    page.on('pageerror', msg => {
      if (!msg.stack?.includes('mtgLoad') // mtgLoad : 3G22
      ) {
        messages.push(page.url() + ' ' + msg.stack)
        logError(msg)
      }
    })
    page.on('crash', msg => {
      messages.push(page.url() + ' ' + msg)
      logError(msg)
    })
    // Listen for all console events and handle errors
    page.on('console', msg => {
      // if (msg.type() === 'error') {
      if (!msg.text().includes('[vite]') &&
          !msg.text().includes('[bugsnag] Loaded!') &&
          !msg.text().includes('No character metrics for') && // katex
          !msg.text().includes('LaTeX-incompatible input') && // katex
          !msg.text().includes('mtgLoad') && // mtgLoad : 3G22
          !msg.text().includes('MG32div0') && // MG32div0 : 3G22
          !msg.location().url.includes('mathgraph32')
      ) {
        if (!msg.text().includes('<HeaderExercice>')) {
          messages.push(page.url() + ' ' + msg.text())
        }
      }
      // }
    })

    logDebug('On charge la page')
    await page.goto(urlExercice)
    logDebug('fin : On charge la page')

    // Correction
    // On cherche les questions
    logDebug('On cherche les questions')
    await page.waitForSelector('div.mb-5>ul>div#consigne0-0')
    logDebug('fin : On cherche les questions')
    // on clique sur nouvel énoncé
    const buttonNewData = page.getByRole('button', { name: 'Nouvel énoncé ' })
    logDebug('Actualier (nouvel énoncé)')
    await buttonNewData.click()
    logDebug('fin Actualier (nouvel énoncé)')
    // Paramètres ça va les refermer puisqu'ils sont ouverts par défaut
    const buttonParam = page.getByRole('button', { name: 'Changer les paramètres de l\'' })
    logDebug('Ferme les paramètres ')
    if (await buttonParam.isVisible()) {
      await buttonParam.click()
    }
    // Actualier (nouvelle énoncé)
    const buttonRefresh = page.locator('i.bx-refresh').nth(1)
    await buttonRefresh.highlight()
    logDebug('Actualier (nouvelle énoncé x 3fois)')
    await buttonRefresh.click({ clickCount: 3 })
    logDebug('Actualier (fin : nouvelle énoncé x 3fois)')
    // activer l'interactif
    const buttonInteractif = page.getByRole('button', { name: 'Rendre interactif' })
    if (await buttonInteractif.isVisible()) {
      await buttonInteractif.click()
      logDebug('Active le mode interactif')
      // selectionne les questions
      const questionSelector = 'li[id^="exercice0Q"]'
      await page.waitForSelector(questionSelector)
      const locators = await page.locator(questionSelector).all()
      log('nbre de questions:' + locators.length)
      // => TODOS à poursuivre
      // Cliquer sur vérifier les données
      const buttonVerifier = page.locator('#verif0')
      logDebug('Vérifier les réponses')
      await buttonVerifier.click()
      await page.waitForSelector('article + div')
      const buttonResult = await page.locator('article + div').innerText()
      log(buttonResult)
    }
    if (messages.length > 0) {
      logError(messages)
      logError(`Il y a ${messages.length} erreurs : ${messages.join('\n')}`)
      await createIssue(urlExercice, messages, ['console'], log)
      return 'KO'
    }
  } catch (error) {
    // si une exception comme timeout: on récupère la requete
    let message = 'Unknown Error'
    if (error instanceof Error) message = error.message
    messages.push('erreur:' + message)
    logError(messages)
    logError(`Il y a ${messages.length} erreurs : ${messages.join('\n')}`)
    await createIssue(urlExercice, messages, ['console'], log)
    return 'KO'
  }
  return 'OK'
}

async function testRunAllLots (filter: string) {
  // return testAll(page, '6e/6G23')
  const uuids = filter.includes('dnb') ? await findStatic(filter) : await findUuid(filter)
  for (let i = 0; i < uuids.length && i < 300; i += 10) {
    const ff : ((page: Page) => Promise<boolean>)[] = []
    for (let k = i; k < i + 10 && k < uuids.length; k++) {
      const myName = 'test' + uuids[k][1]
      const f = async function (page: Page) {
        // Listen for all console logs
        page.on('console', msg => {
          logConsole(msg.text())
        })
        const hostname = local ? `http://localhost:${process.env.CI ? '80' : '5173'}/alea/` : 'https://coopmaths.fr/alea/'
        log(`uuid=${uuids[k][0]} exo=${uuids[k][1]} i=${k} / ${uuids.length}`)
        const resultReq = await getConsoleTest(page, `${hostname}?uuid=${uuids[k][0]}&id=${uuids[k][1].substring(0, uuids[k][1].lastIndexOf('.')) || uuids[k][1]}&alea=${alea}&testCI`)
        log(`Resu: ${resultReq} uuid=${uuids[i][0]} exo=${uuids[k][1]}`)
        return resultReq === 'OK'
      }
      Object.defineProperty(f, 'name', { value: myName, writable: false })
      ff.push(f)
    }
    runSeveralTests(ff, import.meta.url, { pauseOnError: false, silent: false, debug: false })
  }
}

const alea = 'e906e'
const local = true

if (process.env.CI && process.env.NIV !== null && process.env.NIV !== undefined) {
  // utiliser pour les tests d'intégration
  const filter = (process.env.NIV as string).replaceAll(' ', '')
  prefs.headless = true
  log(filter)
  testRunAllLots(filter)
} else {
  // testRunAllLots('can')
  // testRunAllLots('6e')
  // testRunAllLots('5e')
  // testRunAllLots('4e')
  // testRunAllLots('3e')
  // testRunAllLots('2e')
  // testRunAllLots('1e')
  // prefs.headless = true
  // testRunAllLots('3e/3G22')
  testRunAllLots('5e/5R10-0.js')
}
