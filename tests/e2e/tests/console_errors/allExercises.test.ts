import { runSeveralTests, waitForKatex } from '../../helpers/run.js'
import type { Page } from 'playwright'
import { logError as lgE, log as lg, getFileLogger } from '../../helpers/log'
import referentielStatic from '../../../../src/json/referentielStatic.json'
import { type JSONReferentielObject } from '../../../../src/lib/types/referentiels'
import uuidToUrl from '../../../../src/json/uuidsToUrl.json'

const allStaticReferentiels: JSONReferentielObject = {
  ...referentielStatic
}

// on supprime les entrées par thèmes qui entraîne des doublons
delete allStaticReferentiels['Brevet des collèges par thèmes - APMEP']
delete allStaticReferentiels['BAC par thèmes - APMEP']
delete allStaticReferentiels['CRPE (2015-2019) par thèmes - COPIRELEM']
delete allStaticReferentiels['CRPE (2022-2023) par thèmes']
delete allStaticReferentiels['E3C par thèmes - APMEP']

const logConsole = getFileLogger('exportConsole', { append: true })

function log (...args: unknown[]) {
  lg(args)
  logConsole(args)
}

function logError (...args: unknown[]) {
  lgE(args)
  logConsole(args)
}

// async function test (page: Page) {
//   const i = Number(store.get('i'))
//   const id = ids[i]
//   store.set('i', i + 1)
//   const uuid = refToUuid[id]
//   const messages: string[] = []
//   await page.goto(`http://localhost:5173/alea/?uuid=${uuid}`)
//   // Listen for all console events and handle errors
//   page.on('console', msg => {
//     if (msg.type() === 'error') {
//       if (!msg.text().includes('[vite]')) {
//         if (!msg.text().includes('<HeaderExercice>')) {
//           messages.push(page.url() + ' ' + msg.text())
//         }
//       }
//     }
//   })
//   // Correction
//   // On cherche les questions
//   await page.waitForSelector('div.mb-5>ul>div#consigne0-0')
//   const buttonNewData = page.getByRole('button', { name: 'Nouvel énoncé ' })
//   await buttonNewData.click()
//   // Paramètres ça va les refermer puisqu'ils sont ouverts par défaut
//   const buttonParam = page.getByRole('button', { name: 'Changer les paramètres de l\'' })
//   await buttonParam.click()
//   // Actualier
//   const buttonRefresh = page.locator('i.bx-refresh').nth(1)
//   await buttonRefresh.highlight()
//   await buttonRefresh.click({ clickCount: 3 })
//   if (messages.length > 0) {
//     const exerciesBugges = store.get('exerciesBugges') as string[]
//     exerciesBugges.push(id)
//     store.set('exerciesBugges', exerciesBugges)
//     console.log(exerciesBugges)
//     throw Error(`Il y a ${messages.length} erreurs : ${messages.join('\n')}`)
//   }
//   return true
// }

// store.set('i', 0)
// store.set('exerciesBugges', [])
// for (let i = 0; i < ids.length; i++) {
//   runTest(test, import.meta.url, { headless: true, silent: true })
// }

async function getConsoleTest (page: Page, urlExercice: string) {
  log(urlExercice)
  page.setDefaultTimeout(100000)

  await page.goto(urlExercice)
  // await page.reload()
  const messages: string[] = []

  // Listen for all console events and handle errors
  page.on('console', msg => {
    // if (msg.type() === 'error') {
    if (!msg.text().includes('[vite]')) {
      if (!msg.text().includes('<HeaderExercice>')) {
        messages.push(page.url() + ' ' + msg.text())
      }
    }
    // }
  })

  // Correction
  // On cherche les questions
  await page.waitForSelector('div.mb-5>ul>div#consigne0-0')
  // on clique sur nouvelle énoncé
  const buttonNewData = page.getByRole('button', { name: 'Nouvel énoncé ' })
  await buttonNewData.click()
  // Paramètres ça va les refermer puisqu'ils sont ouverts par défaut
  const buttonParam = page.getByRole('button', { name: 'Changer les paramètres de l\'' })
  await buttonParam.click()
  // Actualier
  const buttonRefresh = page.locator('i.bx-refresh').nth(1)
  await buttonRefresh.highlight()
  await buttonRefresh.click({ clickCount: 3 })
  // activer l'interactif
  const buttonInteractif = page.getByRole('button', { name: 'Rendre interactif' })
  if (await buttonInteractif.isVisible()) {
    await buttonInteractif.click()
    // selectionne les questions
    const questionSelector = 'li[id^="exercice0Q"]'
    await page.waitForSelector(questionSelector)
    const locators = await page.locator(questionSelector).all()
    log('nbre de questions' + locators.length)
    // => TODOS à poursuivre
    // Cliquer sur vérifier les données
    const buttonVerifier = page.locator('#verif0')
    await buttonVerifier.click()
    await page.waitForSelector('article + div')
    const buttonResult = await page.locator('article + div').innerText()
    log(buttonResult)
  }
  if (messages.length > 0) {
    logError(messages)
    logError(`Il y a ${messages.length} erreurs : ${messages.join('\n')}`)
    return 'KO'
  }
  return 'OK'
}

async function findUuid (filter : string) {
  const uuids = Object.entries(uuidToUrl)
  return uuids.filter(function (uuid) {
    return uuid[1].startsWith(filter)
  })
}

async function findStatic (filter : string) {
  const uuids = Object.entries(allStaticReferentiels)
  // les clés de allStaticReferentiels sont les thèmes (types)
  // [
  //   "Brevet des collèges par année - APMEP",
  //   "BAC par année - APMEP",
  //   "CRPE (2015-2019) par année - COPIRELEM",
  //   "CRPE (2022-2023) par année",
  //   "E3C par specimen - APMEP",
  // ]
  const uuidsDNB = uuids[0][1] // on conserve uniquement les exercices DNB
  const uuidsFound : [string, string][] = []
  Object.entries(uuidsDNB).forEach(([, value]) => {
    // les keys sont les années, elles ne nous intéressent pas ici!
    const values = Object.values(value)
    values.forEach((val) => {
      if (val !== null && typeof val === 'object' && 'uuid' in val && typeof val.uuid === 'string' && val.uuid.startsWith(filter)) {
        uuidsFound.push([val.uuid, val.uuid])
      }
    })
  })
  return uuidsFound
}

const alea = 'e906e'

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
        const local = true
        const hostname = local ? 'http://localhost:5173/alea/' : 'https://coopmaths.fr/alea/'
        log(`uuid=${uuids[k][0]} exo=${uuids[k][1]} i=${k} / ${uuids.length}`)
        const resultReq = await getConsoleTest(page, `${hostname}?uuid=${uuids[k][0]}&id=${uuids[k][1].substring(0, uuids[k][1].lastIndexOf('.')) || uuids[k][1]}&alea=${alea}`)
        log(`Resu: ${resultReq} uuid=${uuids[i][0]} exo=${uuids[k][1]}`)
        return resultReq === 'OK'
      }
      Object.defineProperty(f, 'name', { value: myName, writable: false })
      ff.push(f)
    }
    runSeveralTests(ff, import.meta.url, { pauseOnError: false, silent: false, debug: false })
  }
}

testRunAllLots('6e/6')
testRunAllLots('5e/5')
testRunAllLots('4e/4')
testRunAllLots('3e/3')
