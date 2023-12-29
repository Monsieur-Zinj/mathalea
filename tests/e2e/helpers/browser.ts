import type { Browser, ConsoleMessage, Page as PlaywrightPage, Request, Response } from 'playwright'
import playwright from 'playwright'
import prefs from './prefs'
import { log, logError, logIfVerbose } from './log'
import type { BrowserName } from './types'

type Page = PlaywrightPage & {
  nbLoads: number
  failures: {
    method: string
    url: string
    text: string
  }[]
}

export async function getDefaultPage (browserName: BrowserName) {
  const browser = await getCurrentBrowser(browserName)
  if (browser === null) throw new Error(`Le chargement de ${browserName} a échoué`)
  const page = await getNewPage(browser)
  return page
}

async function getCurrentBrowser (browserName: BrowserName) {
  let browser = prefs.browserInstance
  if (browser === null || browser.browserType().name() !== browserName) browser = await initBrowser(browserName)
  return browser
}

async function initBrowser (browserName: BrowserName) {
  logIfVerbose(`init browser ${browserName}`)
  const options = { ...prefs.browserOptions } // faut cloner pour que nos affectations ne modifient pas l'objet d'origine
  if (prefs.browserInstance !== null) await prefs.browserInstance.close()
  prefs.browserInstance = null
  if (!prefs.browsers.includes(browserName)) throw Error(`browser ${browserName} invalide (pas dans la liste des browsers autorisés : ${prefs.browsers.join(' ou ')}`)
  const pwBrowser = playwright[browserName]
  options.headless = prefs.headless
  // if (prefs.headless) options.args = ['--disable-gpu'] // workaround si chromium plante en headless https://github.com/microsoft/playwright/issues/4761
  if (prefs.slowMo) {
    log('Browser en slowMo :', prefs.slowMo, 'ms de délai entre chaque action')
    options.slowMo = prefs.slowMo
  }
  const browser = await pwBrowser.launch(options)
  await browser.newContext(prefs.contextOptions)
  prefs.browserInstance = browser
  logIfVerbose(`browser ${browserName} instancié`)
  return browser
}

async function getNewPage (browser: Browser) {
  const [context] = browser.contexts()
  const playwrightPage = await context.newPage()
  const page = initPage(playwrightPage)
  addEventListeners(page)
  return page
}

function initPage (playwrightPage: PlaywrightPage) {
  const page: Page = Object.assign(playwrightPage, {
    nbLoads: 0,
    failures: []
  })
  return page
}

function addEventListeners (page: Page) {
  // https://playwright.dev/docs/api/class-page#page-event-console
  page.on('console', consoleListener)
  // https://playwright.dev/docs/api/class-page#page-event-crash
  page.on('crash', logError)
  // https://playwright.dev/docs/api/class-page#page-event-dom-content-loaded
  page.on('domcontentloaded', () => { page.nbLoads++ })
  // https://playwright.dev/docs/api/class-page#page-event-request-failed
  page.on('requestfailed', (request) => { requestfailedListener(request, page) })
  // https://playwright.dev/docs/api/class-page#page-event-page-error
  page.on('pageerror', logError)
  // https://playwright.dev/docs/api/class-page#page-event-response
  if (prefs.verbose) page.on('response', responseListener)
}

// https://playwright.dev/docs/api/class-consolemessage
function consoleListener (message: ConsoleMessage) {
  const type = message.type()
  const args = message.args()
  if (type === 'error') {
    logError('[Browser error]', ...args)
  } else if (prefs.verbose) {
    log(`[Browser ${type}]`, ...args)
  }
}

function requestfailedListener (request: Request, page: Page) {
  const requestFailure = request.failure()
  page.failures.push({
    method: request.method(),
    url: request.url(),
    text: requestFailure === null ? '' : requestFailure.errorText
  })
  log(`request failure on ${request.method()} ${request.url()} ${requestFailure === null ? '' : requestFailure.errorText}`)
}

// https://playwright.dev/docs/api/class-response
function responseListener (response: Response) {
  const request = response.request()
  log(`${request.method()} ${request.url()} ${response.status()} ${response.statusText()} => ${response.ok() ? 'OK' : 'KO'}`)
  logJsonContent(response)
}

function logJsonContent (response: Response) {
  const headers = response.headers()
  if (/json/.test(headers['content-type'])) {
    response.json().then(resJson => log(`Réponse json de ${response.request().url()} :\n`, resJson)).catch(logError)
  }
}
