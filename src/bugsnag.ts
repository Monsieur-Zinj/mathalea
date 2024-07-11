import Bugsnag, { type NotifiableError } from '@bugsnag/js'
import bigInt from 'big-integer'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { tropDeChiffres } from './modules/outils.js'
import { showDialogForLimitedTime } from './lib/components/dialogs.js'
import { get } from 'svelte/store'
import { exercicesParams } from './lib/stores/generalStore.js'

type Metadatas = Record<string, unknown>

/* global BigInt */
if (typeof (BigInt) === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  window.BigInt = bigInt
}
async function handleBugsnag () {
  const fileName = '../_private/bugsnagApiKey.js'
  const getBugsnagApiKey = await import(/* @vite-ignore */fileName)
  const key = getBugsnagApiKey.default() || ''
  Bugsnag.start(key)
}

if (document.location.hostname === 'coopmaths.fr') {
  handleBugsnag()
}

function isDevMode () {
  return window.location.href.startsWith('http://localhost')
}

export function notifyLocal (error: string|Error, metadatas: Metadatas) {
  if (!isDevMode()) return
  if (typeof error === 'string') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (error.includes(tropDeChiffres) && !window.Bugsnag) {
      console.error(error + '\nIl y a un risque d\'erreur d\'approximation (la limite est de 15 chiffres significatifs)\nnb : ' + metadatas.nb + '\nprecision (= nombre de décimales demandé) : ' + metadatas.precision)
    }
    error = Error(error).message
  }
  const message = 'Ce message ne sera pas envoyé à Bugsnag dans la version en ligne, mais il faut traiter le problème !'
  showDialogForLimitedTime('notifDialog', 5000, message + ' : <br>' + error.toString() + JSON.stringify(metadatas))
  console.error(message, error)
  if (metadatas) console.info('avec les metadatas', metadatas)
  if (metadatas) console.info(JSON.stringify(metadatas))
  console.info('Paramètres des exercices', get(exercicesParams))
  console.trace()
}
/**
 * Une fonction à importer dans les fichiers typescript si on veut faire du window.notify() on utilise notify().
 * @param error
 * @param metadatas
 */
export function notify (error: string | NotifiableError, metadatas: Metadatas) {
  if (typeof error === 'string') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (error.includes(tropDeChiffres) && !window.Bugsnag) {
      console.error(error + '\nIl y a un risque d\'erreur d\'approximation (la limite est de 15 chiffres significatifs)\nnb : ' + metadatas.nb + '\nprecision (= nombre de décimales demandé) : ' + metadatas.precision)
    }
    error = Error(error).message
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (window.Bugsnag) {
    if (metadatas) Bugsnag.addMetadata('ajouts', metadatas)
    Bugsnag.addMetadata('Paramètres des exercices', get(exercicesParams))
    Bugsnag.notify(error)
  } else {
    const message = 'message qui aurait été envoyé à bugsnag s\'il avait été configuré'
    showDialogForLimitedTime('notifDialog', 5000, message + ' : <br>' + error.toString())
    console.error(message, error)
    if (metadatas) console.info('avec les metadatas', metadatas)
    console.info('Paramètres des exercices', get(exercicesParams))
  }
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.notify = notify
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.notifyLocal = notifyLocal
