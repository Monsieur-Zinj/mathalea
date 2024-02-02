import Bugsnag from '@bugsnag/js'
import bigInt from 'big-integer'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { tropDeChiffres } from './modules/outils.js'
import { showDialogForLimitedTime } from './lib/components/dialogs.js'

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

/**
 * Une fonction à importer dans les fichiers typescript si on veut faire du window.notify() on utilise notify().
 * @param error
 * @param metadatas
 */
export function notify (error: string|Error, metadatas: Metadatas) {
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
    Bugsnag.notify(error)
  } else {
    const message = 'message qui aurait été envoyé à bugsnag s\'il avait été configuré'
    showDialogForLimitedTime('notifDialog', 10000, message + ' : <br>' + error.toString())
    console.error(message, error)
    if (metadatas) console.info('avec les metadatas', metadatas)
  }
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.notify = notify
