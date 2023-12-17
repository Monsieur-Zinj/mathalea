import 'boxicons/css/boxicons.min.css'
import './app.css'
import App from './components/App.svelte'
import Bugsnag from '@bugsnag/js'
// @ts-ignore
import { tropDeChiffres } from './modules/outils.js'

import bigInt from 'big-integer'
/* global BigInt */
if (typeof BigInt === 'undefined') {
  // @ts-ignore
  window.BigInt = bigInt
}
let app
const appComponent = document.getElementById('appComponent')
console.log('appComponent')
console.log(appComponent)
if (appComponent === null) {
  app = new App({
    target: document.getElementById('appMathalea') as HTMLElement
  })
}

export default app

async function handleBugsnag () {
  const fileName = '../_private/bugsnagApiKey.js'
  const getBugsnagApiKey = await import(/* @vite-ignore */ fileName)
  const key = getBugsnagApiKey.default() || ''
  Bugsnag.start(key)
}

if (document.location.hostname === 'coopmaths.fr') {
  handleBugsnag()
}

// @todo regarder pourquoi window.Bugsnag n'est pas défini et donc les signalements sont balancés dans la console alors qu'on est en ligne !
export function notify (error: string | Error, metadatas: object) {
  if (typeof error === 'string') {
    // @ts-ignore
    if (error.includes(tropDeChiffres) && !window.Bugsnag) {
      console.error(
        error +
          "\nIl y a un risque d'erreur d'approximation (la limite est de 15 chiffres significatifs)\nnb : " +
          metadatas.nb +
          '\nprecision (= nombre de décimales demandé) : ' +
          metadatas.precision
      )
    }
    error = Error(error).message
  }
  // @ts-ignore
  if (window.Bugsnag) {
    if (metadatas) Bugsnag.addMetadata('ajouts', metadatas)
    Bugsnag.notify(error)
  } else {
    console.error(
      "message qui aurait été envoyé à bugsnag s'il avait été configuré",
      error
    )
    if (metadatas) console.info('avec les metadatas', metadatas)
  }
}
// @ts-ignore
window.notify = notify
