import 'boxicons/css/boxicons.min.css'
import './app.css'
import App from './components/App.svelte'
import Bugsnag from '@bugsnag/js'
// @ts-ignore
import { tropDeChiffres } from './modules/outils.js'

const app = new App({
  target: document.getElementById('app')
})

export default app

async function handleBugsnag () {
  const fileName = '../_private/keys'
  const bugsnagApiKey = await import(/* @vite-ignore */fileName)
  Bugsnag.start(bugsnagApiKey)
}
if (document.location.href.includes('coopmaths.fr')) {
  handleBugsnag()
}
// @todo regarder pourquoi window.Bugsnag n'est pas défini et donc les signalements sont balancés dans la console alors qu'on est en ligne !
// @ts-ignore
window.notify = function notify (error, metadatas) {
  if (typeof error === 'string') {
    // @ts-ignore
    if (error.includes(tropDeChiffres) && !window.Bugsnag) {
      console.error(error + '\nIl y a un risque d\'erreur d\'approximation (la limite est de 15 chiffres significatifs)\nnb : ' + metadatas.nb + '\nprecision (= nombre de décimales demandé) : ' + metadatas.precision)
    }
    error = Error(error)
  }
  // @ts-ignore
  if (window.Bugsnag) {
    if (metadatas) Bugsnag.addMetadata('ajouts', metadatas)
    Bugsnag.notify(error)
  } else {
    console.error('message qui aurait été envoyé à bugsnag s\'il avait été configuré', error)
    if (metadatas) console.log('avec les metadatas', metadatas)
  }
}
