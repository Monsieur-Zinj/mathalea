import { test, expect } from '@playwright/test'
import { spawn } from 'child_process'
// import refToUuid from '../src/json/refToUuid.json' assert { type: 'json' }
import { readFileSync } from 'fs'
const jsonString = readFileSync('src/json/refToUuid.json', { encoding: 'utf8' })
const refToUuid = JSON.parse(jsonString)

// let serverProcess

// test.beforeAll( async () => {
//   serverProcess = spawn('pnpm', ['start'])
// })

// test.afterAll( async () => {
//   serverProcess.kill()
// })

const ids = Object.keys(refToUuid)
function TestAllPages (ids) {
  for (const id of ids) {
    const uuid = refToUuid[id]
    test(`Exercice avec correction et 10 actualisations ${id}`, async ( {page} ) => {
      const messages: string[] = []
      await page.goto(`http://localhost:5173/alea/?uuid=${uuid}`)
      // Listen for all console events and handle errors
      page.on('console', msg => {
        if (msg.type === 'error') {
          if (!msg.text().includes('[vite]')) {
            if (!msg.text().includes('<HeaderExercice>')) {
              messages.push(page.url() + ' ' + msg.text())
            }
          }
        }
      })
      // Correction
      const buttonNewData = page.locator('i.bx-check-circle').first()
      await buttonNewData.click()
      // Paramètres
        const  buttonParam = page.locator('i.bx-cog').first()
      await buttonParam.click()
      // Actualier
      const buttonRefresh = page.locator('i.bx-refresh').nth(1)
      await buttonRefresh.click() // { clickCount: 3 }
      expect(messages.length, `Il y a ${messages.length} erreurs : ${messages.join('\n')}`).toBe(0)
    })
  }
}
TestAllPages(ids)
