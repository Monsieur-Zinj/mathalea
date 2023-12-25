import fs from 'node:fs'

import prefs from './prefs'

import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// fcts privées
const hasJsHandle = (args) => args.some(isJsHandle)
const isJsHandle = (arg) => arg && typeof arg.asElement === 'function' && typeof arg.evaluate === 'function'

// une promesse qui sert à gérer la file d'attente des logs
// (sinon les appels sync passés après d'autres async se retrouvent dans la console avant)
let lastLog = Promise.resolve()

/**
 * @typedef Logger
 * @type {function}
 * @param {...any} args Autant d'arguments que l'on veut
 * @returns {Promise<undefined>}
 */
/**
 * Retourne un logger qui écrira dans filename (dans le dossier log), le fichier est créé s'il n'existait pas.
 * ATTENTION, par défaut il est vidé s'il existait (passer {append: true} pour ne pas le faire)
 * @param {string} fileName nom du fichier, sans son extension .log
 * @param {Object} [options]
 * @param {boolean} [options.append=false] Passer true pour ne pas vider le fichier s'il existe
 * @return {Logger} Le logger (chaque argument sortira sur une ligne dans le log, le premier sera préfixé avec le moment)
 */
export function getFileLogger (fileName, options = {}) {
  // on prépare le log
  const logDir = resolve(__dirname, '..', '..', 'log')
  // avec recursive, ça ne gêne pas si ça existe déjà (https://nodejs.org/docs/latest-v14.x/api/fs.html#fs_fs_mkdir_path_options_callback)
  fs.mkdirSync(logDir, { recursive: true })
  const logfile = join(logDir, fileName + '.log')
  // cf https://nodejs.org/docs/latest-v14.x/api/fs.html#fs_file_system_flags
  const flag = options.append ? 'a' : 'w'
  const fd = fs.openSync(logfile, flag)
  const logger = (...args) => {
    fs.appendFileSync(fd, args.join(' ') + '\n')
  }
  return (...args) => logSerializer(logger, args)
}

/**
 * Fonctions de log
 * @module log
 */

/**
 * Log les arguments via logger
 * @param {Logger} logger
 * @param ...args
 * @return {Promise} qui sera résolue lorsque cet appel sera sorti en console
 */
function logSerializer (logger, ...args) {
  const datePrefix = (args) => {
    const prefix = `[${Date.now()}]`
    if (!Array.isArray(args) || !args.length) return logger(prefix, Error('fonction de log appelée sans argument'))
    args.unshift(prefix)
    logger(...args)
  }

  // on veut passer après les appels précédents (pas forcément terminés si on mix sync/async),
  // pour garder les messages de log dans l'ordre où ils ont été envoyés
  lastLog = lastLog.then(() => {
    if (hasJsHandle(args)) {
    // il faut décoder en async
      return Promise.all(args.map(arg => {
        if (isJsHandle(arg)) {
          return arg.evaluate((arg) => {
            if (arg && arg.outerHTML) return arg.outerHTML
            if (arg instanceof Error) return arg.stack
            return arg
          })
        }
        return arg
      }))
    }
    // sinon rien à décoder
    return args
  })
    .then(datePrefix)
    .catch(error => console.error(error))
  return lastLog
}

/**
 * Une fct qui ne fait rien
 * @private
 * @type {Logger}
 */
const dummyFn = () => Promise.resolve()

/**
 * Envoie les arguments à console.log en préfixant avec la date courante
 * @type {Logger}
 */
export const log = logSerializer.bind(null, console.log) // eslint-disable-line no-console
/**
 * Idem log, sauf si on est en mode quiet (ça ne fait rien dans ce cas)
 * @type {Logger}
 */
export const logButQuiet = prefs.quiet ? dummyFn : log
/**
 * Envoie les arguments à console.log en préfixant avec la date courante
 * @type {Logger}
 */
export const logError = logSerializer.bind(null, console.error)
/**
 * Envoie les arguments à console.log en préfixant avec la date courante
 * @type {Logger}
 */
export const logWarning = logSerializer.bind(null, console.warn)
/**
 * Idem log si debug, ne fait rien sinon
 * @type {Logger}
 */
export const logIfDebug = prefs.debug ? log : dummyFn
/**
 * Idem log si verbose, ne fait rien sinon
 * @type {Logger}
 */
export const logIfVerbose = prefs.verbose ? log : dummyFn
