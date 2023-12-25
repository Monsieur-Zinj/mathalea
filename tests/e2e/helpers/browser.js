import fetch from 'node-fetch'
/**
 * Regroupe les méthodes qui manipulent le browser playwright
 * @module browser
 */
import playwright from 'playwright'

import prefs from './prefs'
import { log, logError, logIfVerbose } from './log'
import { dropLatex, getMqChunks, normalize } from './text'

// fonctions privées
/**
 * À passer en listener avec page.on('response', logResponse) ou page.removeListener('response', logResponse)
 * En mode debug ça affiche aussi le contenu des réponses json
 * @param {Protocol.Response} res La réponse {@link https://playwright.dev/docs/api/class-response}
 */
function responseListener (res) {
  const req = res.request()
  log(`${req.method()} ${req.url()} ${res.status()} ${res.statusText()} => ${res.ok() ? 'ok' : 'KO'}`)
  if (prefs.debug) {
    // on affiche aussi le contenu de la réponse json
    const headers = res.headers()
    if (/json/.test(headers['content-type'])) {
      // pas de await ici car on est pas async, on log en tâche de fond
      res.json().then(resJson => log(`réponse json de ${req.url()} :\n`, resJson)).catch(logError)
    }
  }
}

// fonctions exportées

/**
 * Affiche le html de la page courante en console (de node)
 * @param {Page} page
 * @return {Promise<void>}
 */
export async function dump (page) {
  const html = await page.$eval('body', (body) => body.parentNode.innerHTML)
  console.info('La page contient : \n', html)
}

/**
 * Analyse errors & warning d'une page retournée par getPage, la ferme, en rouvre une autre et retourne le tout
 * @param {Page} page
 * @param {Browser} browser
 * @param {Object} [options]
 * @param {number} [options.maxLoads=0] Passer un nb de load pour lequel on garde l'objet page courant (si son nbLoads >= maxLoads on le close & recrée)
 * @param {boolean} [options.processFailureAsError=false] Passer true pour créer une erreur par load failure (le tableau failures sera alors toujours vide)
 * @return {Promise<{warnings: string[], errors: string[], failures: string[], page: Page}>}
 */
export async function flushPage (page, browser, { maxLoads = 0, processFailureAsError = false } = {}) {
  // on regarde d'abord le contenu de errors & warnings
  const result = {
    errors: [],
    warnings: []
  }
  // délicat de faire du forEach avec de l'async dedans, on utilise reduce pour faire du séquentiel
  // cf https://advancedweb.hu/how-to-use-async-functions-with-array-foreach-in-javascript/
  await Object.keys(result).reduce(async (dummy, type) => {
    await dummy // juste pour attendre la fin de l'itération précédente
    if (page[type].length) {
      // chaque error|warning est un JsHandle[] venant de message.args()
      for (const jsHandleList of page[type]) {
        const args = []
        for (const jsHandle of jsHandleList) {
          // bizarrement, de temps en temps (~1% des cas) ça plante avec du
          // jsHandle.jsonValue: Execution context was destroyed, most likely because of a navigation.
          try {
            args.push(await jsHandle.jsonValue())
          } catch (error) {
            args.push(`vanished ${type} (${error.message})`)
          }
        }
        result[type].push(args.join(' '))
      }
    }
  }, null)
  // on a fini de parser errors & warning en async, on passe aux failures (sync)
  if (processFailureAsError) {
    page.failures.forEach(({ method, url, text }) => result.errors.push(`Failed request: ${method} ${url} ${text}`))
    result.failures = []
  } else {
    result.failures = page.failures.map(({ method, url, text }) => `${method} ${url} ${text}`)
  }
  // et on regarde s'il faut reset la page
  if (page.nbLoads && page.nbLoads >= maxLoads) {
    // ferme la page et en rouvre une autre
    const { requestListener, accessLogger } = page
    await page.close()
    result.page = await getPage(browser, { requestListener, accessLogger })
  } else {
    resetPage(page)
    result.page = page
  }
  return result
}

/**
 * Retourne le contenu texte ou html d'un élément
 * @param {Page} page
 * @param {string} selector
 * @param {boolean} [fullHtml=false] Passer true pour récupérer le innerHTML plutôt que le innerText
 * @return {Promise<string>}
 */
export async function getContent (page, selector, fullHtml = false) {
  // avec un selector qui match plusieurs éléments dont le premier est invisible, faut pas faire de waitForSelector sinon il attend que le 1er devienne visible)
  const elts = await page.$$(selector)
  if (!elts.length) await page.waitForSelector(selector)
  const elt = await page.$(selector)
  if (!elt) return null
  // cf https://playwright.dev/docs/api/class-elementhandle#elementhandleinnertext
  return fullHtml ? await elt.innerHTML() : await elt.innerText()
}

/**
 * Retourne le innerText "normalisé" (sans saut de ligne, espaces en doubles virés, tabulations remplacées, etc.)
 * @param {Page} page
 * @param {string} selector Sélecteur playwright ({@link https://playwright.dev/docs/selectors/}
 * @param {boolean} [doDropLatex=false] passer true pour virer aussi le LaTeX
 * @return {Promise<void>}
 */
export async function getContentNormalized (page, selector, doDropLatex) {
  let text = await getContent(page, selector)
  if (doDropLatex) text = dropLatex(text)
  return normalize(text)
}

/**
 * Retourne une nouvelle page sur le browser courant
 * @param {Object} [options]
 * @param {string} [options.browserName]
 * @param {boolean} [options.logResponse=false] passer true pour logguer toutes les réponses
 * @param {function} [options.reject] Une fonction à appeler en cas de console.error dans le navigateur (ignoré si prefs.relax), ou si le navigateur crash
 * (mais ce sera probablement à cause d'un pb de RAM et ce script sera peut-être dégagé aussi sans préavis)
 * @return {Promise<Page>}
 */
export async function getDefaultPage ({ browserName, logResponse, reject } = {}) {
  let browser = prefs.browserInstance
  if (!browser || browserName) {
    if (!browserName) browserName = prefs.browsers[0]
    browser = await initCurrentBrowser(browserName)
  }
  const [context] = browser.contexts()
  const page = await context.newPage()
  // on ajoute le listeners sur les messages pour récupérer les console.error
  const consoleListener = (message) => {
    // Cf https://playwright.dev/docs/api/class-consolemessage
    const type = message.type()
    const args = message.args()
    if (type === 'error') {
      if (!args.length) return logError('console.error du navigateur appelé sans argument')
      logError('[Browser error]', ...args)
      if (!prefs.relax) {
        const error = Error(`Erreur dans la console du navigateur => ABANDON\nSur ${page.url()} on a eu\n${args.join('\n')}`)
        if (typeof reject === 'function') reject(error)

        // on throw dans qq ms pour laisser le temps aux fcts async du logger d'écrire en console
        // le pb est qu'on récupèrera pas ça dans le catch de l'appelant…
        // mais sans timeout on le récupère pas non plus…
        // if (!continueOnErrors) throw new Error(`Erreur dans la console du navigateur => ABANDON\nSur ${page.url()} on a eu\n${args.join('\n')}`)
        // => il faut passer une fct reject
        else setTimeout(() => { throw error }, 200)
      }
    } else if (prefs.debug || (prefs.verbose && type === 'warning')) {
      log(`[Browser ${type}]`, ...args)
    }
  }
  // https://playwright.dev/docs/api/class-page#page-event-console
  page.on('console', consoleListener)
  // https://playwright.dev/docs/api/class-page#page-event-page-error
  page.on('pageerror', reject ?? consoleListener)
  // https://playwright.dev/docs/api/class-page#page-event-crash
  page.on('crash', reject ?? consoleListener)

  // on ajoute toujours un listener sur les requests failed
  const requestfailedListener = (request) => log(`request failure on ${request.method()} ${request.url()} ${request.failure().errorText}`)
  // https://playwright.dev/docs/api/class-page#pageonrequestfailed
  page.on('requestfailed', requestfailedListener)

  // et sur toutes les réponses si on le demande
  if (logResponse) page.on('response', responseListener)

  return page
}

/**
 * Retourne les strings LaTeX (sans les $) contenues dans un sélecteur (tableau vide si y'en avait pas)
 * @param {Page} page
 * @param {string} selector
 * @return {Promise<string[]>}
 */
export async function getLatexChunks (page, selector) {
  const text = await getContent(page, selector)
  return getMqChunks(text)
}

/**
 * Retourne une Page avec les propriétés errors, warnings, failures (tableaux)
 * @param browser
 * @param requestListener
 * @param accessLogger
 * @return {Promise<Page>}
 */
export async function getPage (browser, { requestListener, accessLogger } = {}) {
  // une valeur par défaut suivant les prefs
  const [context] = browser.contexts()
  const page = await context.newPage()
  // on lui ajoute ces tableaux
  // chaque élément sera un tableau de JsHandle, cf message.args()
  // (on ne sérialise pas dans le listener avant d'ajouter au tableau pour garder le listener sync)
  page.errors = []
  page.warnings = []
  page.failures = []
  page.nbLoads = 0
  // on ajoute un flag global sur window pour que l'appli sache qu'elle est testée (évite de râler si on clique trop vite)
  await page.evaluate(() => { window.isPlaywright = true })
  page.on('domcontentloaded', () => { page.nbLoads++ })
  // on ajoute le listeners sur les messages pour récupérer les console.error
  // https://playwright.dev/docs/api/class-page#pageonconsole
  page.on('console', (message) => {
    // Cf https://playwright.dev/docs/api/class-consolemessage
    switch (message.type()) {
      case 'error':
        page.errors.push(message.args())
        break
      case 'warning':
        page.warnings.push(message.args())
        break
    }
  })
  // https://playwright.dev/docs/api/class-page#pageonrequestfailed
  page.on('requestfailed', (request) => {
    page.failures.push({
      method: request.method(),
      url: request.url(),
      text: request.failure().errorText
    })
  })
  if (requestListener) {
    page.requestListener = requestListener // pour flush
    page.on('request', requestListener)
  }
  if (accessLogger) {
    page.accessLogger = accessLogger
    page.on('request', (request) => accessLogger(request.url()))
  }
  return page
}

/**
 * Retourne les résultats déjà envoyés pour ce graphe
 * @param {Page} page
 * @param {boolean} [doReset=false] Passer true pour remettre à 0 les résultats (mis en global dans la page)
 * @return {Promise<Resultat[]>}
 */
export async function getResultats (page, doReset = false) {
  const resultats = await page.evaluate(() => window.j3pResultats)
  if (doReset) await page.evaluate(() => { window.j3pResultats = [] })
  return resultats
}

/**
 * Réinitialise l'instance courante du browser
 * @param {string} browserName
 * @param {Object} [browserOptions] Les options à passer au lancement du browser ({@link https://playwright.dev/docs/api/class-browsertype?_highlight=launch#browsertypelaunchoptions})
 * @param {Object} [contextOptions] options de contexte éventuel {@link https://playwright.dev/docs/api/class-browser#browsernewcontextoptions}
 * @return {Promise<Protocol.Browser>}
 */
export async function initCurrentBrowser (browserName, browserOptions = {}, contextOptions = {}) {
  logIfVerbose(`init browser ${browserName}`)
  const options = { ...browserOptions } // faut cloner pour que nos affectations ne modifient pas l'objet d'origine
  if (prefs.browserInstance) await prefs.browserInstance.close()
  prefs.browserInstance = null
  if (!prefs.browsers.includes(browserName)) throw Error(`browser ${browserName} invalide (pas dans la liste des browsers autorisés : ${prefs.browsers.join(' ou ')}`)
  const pwBrowser = playwright[browserName]
  options.headless = prefs.headless
  // on ajoute les devtools pour chromium, sauf si on nous demande de pas le faire (ou headless car ça n'aurait pas vraiment d'intérêt)
  if (!prefs.headless && browserName === 'chromium' && prefs.devtools) options.devtools = true
  // chromium plante en headless chez moi, on tente ce workaround https://github.com/microsoft/playwright/issues/4761
  if (prefs.headless) options.args = ['--disable-gpu']
  if (prefs.slow) {
    console.info('slow mis en option du browser', prefs.slow)
    options.slowMo = prefs.slow
  }
  const browser = await pwBrowser.launch(options)
  // on lui crée son contexte
  if (prefs.ignoreHttpsErrors) contextOptions.ignoreHTTPSErrors = true
  await browser.newContext(contextOptions)
  prefs.browserInstance = browser
  logIfVerbose(`browser ${browserName} instancié`)
  return browser
}

/**
 * Charge le graphe par défaut de la section dans le navigateur (via j3p.html)
 * @param {Page} page
 * @param {string} section
 * @return {Promise<void>}
 */
export async function loadDefaultGraphe (page, section) {
  const graphe = [
    1,
    section,
    [{ pe: 'sans%20condition', nn: 'fin', conclusion: 'Fin' }]
  ]
  await loadGraphe(page, { graphe })
}

/**
 * Charge le graphe dans le navigateur (via j3p.html) et ajoute une callback pour mettre les résultats dans un Array global j3pResultats
 * @param {Page} page
 * @param {Object} datas Données initiales à charger via j3pTest
 * @param {Nodes[]} datas.graphe
 * @param {Object} [datas.lastResultat]
 * @param {Object} [datas.editgraphe]
 * @return {Promise<void>>}
 */
export async function loadGraphe (page, datas) {
  if (!datas || !datas.graphe || !Array.isArray(datas.graphe)) throw Error('graphe invalide (pas un tableau)')
  prefs.currentGraphe = null
  // on peut pas affecter directement datas.baseUrl si datas provient d'un import (object is not extensible)
  datas = Object.assign({}, datas, { baseUrl: prefs.baseUrl })
  // on passe pas toujours le graphe complet dans l'url, car s'il est gros ça peut donner du 414 Request-URI Too Large
  let url = prefs.baseUrl + '?wait'
  if (prefs.debug) url += '&debug'
  // si le graphe est pas trop gros, on le passe quand même aussi dans l'url, bien pratique pour le debug (et avoir ça dans le log d'erreur)
  // à priori une url < 4k doit toujours passer
  const grapheSerialized = JSON.stringify(datas.graphe)
  if (grapheSerialized.length < 4000 - url.length) url += `&graphe=${grapheSerialized}`

  await purge(url)
  await page.goto(url, { waitUntil: 'networkidle' }) // il faut networkidle pour que le code qui suit soit exécuté après le chargement des module js async
  await page.evaluate((datas) => {
    window.isPlaywright = true
    // pour récupérer les résultats
    window.j3pResultats = []
    datas.resultatCallback = (resultat) => {
      let fixedResultat
      try {
        // on clone tout
        fixedResultat = JSON.parse(JSON.stringify(resultat))
      } catch (error) {
        console.error(error)
        fixedResultat = resultat
      }
      window.j3pResultats.push(fixedResultat)
    }
    window.j3pLoad('j3pContainer', datas, (error) => {
      if (error) console.error(error)
    })
  }, datas)
  prefs.currentGraphe = datas.graphe
}

/**
 * Reset page puis charge url, recommence si on a des failures (ça arrive souvent, pas trouvé pourquoi)
 * @param {Page} page
 * @param {string} url
 * @param {number} [maxTries=3] Nb max d'essais
 * @return {Promise<number>} Le nb d'essais réalisés
 */
export async function loadUrl (page, url, maxTries = 3) {
  let tries = 1
  resetPage(page)
  await purge(url)
  await page.goto(url)
  while (page.failures.length && tries < maxTries) {
    tries++
    resetPage(page)
    // petit délai pour le laisser reprendre ses esprits (ça marche mieux, pas cherché pourquoi)
    await page.waitForTimeout(tries * 100)
    await purge(url)
    await page.goto(url)
  }
  return tries
}

/**
 * Retournent les contenus des éléments qui matchent un pattern
 * @param {Page} page
 * @param {string|JSHandle[]} selector
 * @param {RegExp} pattern
 * @return {Promise<JSHandle[]>} La liste des éléments dont le contenu match le pattern
 */
export async function patternFilter (page, selector, pattern) {
  if (!(pattern instanceof RegExp)) return Promise.reject(Error('patternFilter veut un pattern en RexExp'))
  const elts = typeof selector === 'string' ? await page.$$(selector) : selector
  return Promise.all(elts.map(elt => getContent(page, elt, { doNotDispose: true }))).then(contents => {
    const filteredElements = []
    contents.forEach((content, i) => {
      if (pattern.test(content)) filteredElements.push(elts[i])
    })
    return filteredElements
  })
}

export async function purge (url) {
  try {
    const response = await fetch(url, { method: 'PURGE' })
    if (!response.ok) {
      // si on est pas sur un serveur sésamath varnish n'est pas forcément là, on dit rien
      if (!/\.sesamath\.(dev|net)/.test(url)) return
      // sinon c'est pas normal, on le signale
      console.error(`purge ${url} retourne ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error(`purge ${url} KO :`, error)
  }
}

/**
 * Vide les propriétés errors/warnings/failures de l'objet page (retourné par getPage)
 * @param {Page} page
 */
export function resetPage (page) {
  page.errors = []
  page.warnings = []
  page.failures = []
}
