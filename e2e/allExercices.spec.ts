import { test, expect } from '@playwright/test'
// import refToUuid from '../src/json/refToUuid.json' assert { type: 'json' }
import { readFileSync } from 'fs'
const jsonString = readFileSync('src/json/refToUuid.json', { encoding: 'utf8' })
const refToUuid = JSON.parse(jsonString)

const ids = Object.keys(refToUuid)//.slice(0,1)
function TestAllPages (ids) {
  for (const id of ids) {
    console.log(id)
    const uuid = refToUuid[id]
    console.log(uuid)
    test(`Exercice avec correction et 10 actualisations ${id}`, async ( {page} ) => {
      const messages: string[] = []
      await page.goto(`http://localhost:5173/alea/?uuid=${uuid}`)
      // Listen for all console events and handle errors
      page.on('console', msg => {
        if (!msg.text().includes('[vite]')) {
          messages.push(msg.text())
        }
      })
      // Correction
      const buttonNewData = page.locator('i.bx-check-circle').first()
      await buttonNewData.click()
      // Paramètres
        const  buttonParam = page.locator('i.bx-cog').first()
      await buttonParam.click()
      // Actualier
const buttonRefresh = page.locator('div:visible>i.bx-refresh').first()
      await buttonRefresh.click() // { clickCount: 3 }
      expect(messages.length).toBe(0)
    })
  }
}
TestAllPages(ids)
