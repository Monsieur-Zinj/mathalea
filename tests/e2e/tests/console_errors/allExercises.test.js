import { runTest } from '../../helpers/run.js'
import json from '../../../../src/json/refToUuid.json'
const refToUuid = JSON.parse(JSON.stringify(json))
const ids = Object.keys(refToUuid)

/**
 *
 * @param {Page} page
 * @returns {Promise<boolean>}
 */
async function test (page) {
  for (const id of ids) {
    const uuid = refToUuid[id]
    const messages = []
    await page.goto(`http://localhost:5173/alea/?uuid=${uuid}`)
    // Listen for all console events and handle errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        if (!msg.text().includes('[vite]')) {
          if (!msg.text().includes('<HeaderExercice>')) {
            messages.push(page.url() + ' ' + msg.text())
          }
        }
      }
    })
    // Correction
    // On cherche les questions
    await page.waitForSelector('div.mb-5>ul>div#consigne0-0')
    const buttonNewData = page.getByRole('button', { name: 'Nouvel énoncé ' })
    await buttonNewData.click()
    // Paramètres ça va les refermer puisqu'ils sont ouverts par défaut
    const buttonParam = page.getByRole('button', { name: 'Changer les paramètres de l\'' })
    await buttonParam.click()
    // Actualier
    const buttonRefresh = page.locator('i.bx-refresh').nth(1)
    await buttonRefresh.highlight()
    await buttonRefresh.click({ clickCount: 3 }) //
    if (messages.length > 0) throw Error(`Il y a ${messages.length} erreurs : ${messages.join('\n')}`)
  }
  return true
}

runTest(test, import.meta.url)
