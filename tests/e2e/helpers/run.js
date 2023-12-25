import prefs from './prefs.js'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, it } from 'vitest'
import { getDefaultPage } from './browser.js'
import { logError } from './log.js'

/**
 * Wrapper des test effectués par vitest
 * Ajoute un describe() contenant un it() (alias de test() dans vitest) par browser à tester
 * @param {function} test La fonction à exécuter dans chaque it()
 * @param metaUrl il faut passer import.meta.url depuis le fichier appelant pour savoir lequel c'est (et l'indiquer dans le log)
 */
export function runTest (test, metaUrl) {
  if (test.length < 1) throw Error('la fonction de test doit avoir un argument (un objet Page)')
  const filename = fileURLToPath(metaUrl)
  const testsSuiteDescription = '' // Ajoute une description intermédiaire dans le stdout si besoin
  describe(testsSuiteDescription, async () => {
    let page, result
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

    for (const browserName of prefs.browsers) {
      it(`works with ${browserName}`, async ({ skip }) => {
        if (stop) return skip()
        try {
          result = null
          page = await getDefaultPage({ browserName })
          const promise = test(page)
          if (!(promise instanceof Promise)) throw Error(`${filename} ne contient pas de fonction test qui prend une page et retourne une promesse`)
          result = await promise
        } catch (error) {
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
  })
}
