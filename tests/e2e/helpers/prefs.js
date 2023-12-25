/**
 * Gère le singleton prefs (défini getters/setters pour contrôler les modifications de ce store)
 * Initialisé d'après l'environnement au premier import de ce module
 * @module prefs
 */

/**
 * Browsers utilisables avec playwright
 * @type {string[]}
 */
const knownBrowsers = ['chromium', 'firefox', 'webkit']

/**
 * Un singleton pour conserver les préférences globales (un store maison)
 * @typedef Prefs
 * @property {string} baseUrl
 * @property {Browser} browserInstance l'objet Browser courant, null s'il n'y en a pas d'instancié
 * @property {string} browserName Le browser à utiliser
 * @property {string[]} browsers La liste des browsers qu'on va tester
 * @property {boolean} [continueOnError] pour continuer en cas d'erreur, par défaut a la même valeur que headless
 * @property {boolean} [debug=false]
 * @property {boolean} [headless=false]
 * @property {boolean} [nokeep=false]
 * @property {boolean} [quiet=false]
 * @property {string} [uuid=undefined] L'éventuel exo imposée au lancement
 * @property {boolean} [verbose=false]
 * @property {number} timeout
*/
/**
 * Nos préférences initialisées par le lancement (options et environnement)
 * Contient aussi l'instance courante de Browser (pour éviter de déclarer un 2e singleton uniquement pour ça)
 * @type {Prefs}
 */
const prefs = {
  // options facultatives passées via la config
  browserOptions: {},
  contextOptions: {},
  // props sans getter/setter
  /** @type {Browser} */
  browserInstance: null
}
// instance à tester par défaut
let baseUrl = 'https://coopmaths.fr/alea/'
// une string facultative
let uuid
// browser par défaut
let browsers = ['chromium']

// un objet pour stocker les booléens (pour la propriété dynamique)
const flags = {
  continueOnError: false,
  debug: true,
  devtools: false,
  headless: false,
  ignoreHttpsErrors: false,
  quiet: false,
  relax: false,
  timeoutLocked: false,
  usage: false,
  verbose: true
}
// un objet pour les entiers
const ints = {
  timeout: 60000,
  slow: 0,
  skip: 0,
  limit: 0
}

const intRestrictions = {
  timeout: { min: 100 }
}

function boolSetter (prop, value) {
  if (typeof value !== 'boolean') {
    switch (value) {
      case 'off':
      case '0':
      case 0:
      case 'false':
        value = false
        break

      case 'on':
      case '1':
      case 'true':
      case 1:
        value = true
        break

      default:
        throw Error(`${prop} est un boolean`)
    }
  }
  flags[prop] = value
}

function intSetter (prop, value) {
  if (typeof value !== 'number') {
    value = Number(value)
  }
  if (!Number.isInteger(value) || value < 0) {
    throw Error(`valeur ${value} invalide pour ${prop} (pas un entier positif)`)
  }
  if (intRestrictions[prop]) {
    const { min, max } = intRestrictions[prop]
    if (min && value < min) throw Error(`${prop} doit être supérieur ou égal à ${min} (${value} fourni)`)
    if (max && value > max) throw Error(`${prop} doit être inférieur ou égal à ${max} (${value} fourni)`)
  }
  ints[prop] = value
}

const boolProps = Object.keys(flags)
const intProps = Object.keys(ints)
const strProps = ['baseUrl', 'uuid']
const prefsProps = boolProps.concat(intProps, strProps)

const propDefaults = { enumerable: true }

// les booléens
for (const prop of boolProps) {
  Object.defineProperty(prefs, prop, {
    ...propDefaults,
    get: () => flags[prop],
    set: boolSetter.bind(null, prop)
  })
}
// les entiers
for (const prop of intProps) {
  Object.defineProperty(prefs, prop, {
    ...propDefaults,
    get: () => ints[prop],
    set: intSetter.bind(null, prop)
  })
}

// browsers
Object.defineProperty(prefs, 'browsers', {
  ...propDefaults,
  get: () => browsers,
  set: (value) => {
    if (typeof value === 'string') value = value.split(',')
    if (!Array.isArray(value) || !value.length) throw Error('browsers invalide (doit être un Array non vide)')
    value.forEach(browser => {
      if (!knownBrowsers.includes(browser)) throw Error(`browser ${browser} inconnu (sont autorisés : ${knownBrowsers.join(', ')})`)
    })
    browsers = value
  }
})

// propriétés facultatives en string, qui restent à undefined tant qu'on les affecte pas
Object.defineProperty(prefs, 'uuid', {
  ...propDefaults,
  get: () => uuid,
  set: (value) => {
    if (!value || typeof value !== 'string') throw Error('uuid invalide (doit être une string non vide)')
    uuid = value
  }
})
Object.defineProperty(prefs, 'baseUrl', {
  ...propDefaults,
  get: () => baseUrl,
  set: (value) => {
    if (!value || typeof value !== 'string' || !/^https?:\/\//.test(value)) {
      console.error(Error(`baseUrl invalide (doit être une string non vide commençant par http, ${value} ignorée`))
    }
    // on assure le / de fin
    if (!value.endsWith('/')) value += '/'
    baseUrl = value
  }
})

// une correspondance pour les props en camelCase
const camelCaseProps = {}
for (const p of Object.keys(prefs).filter(p => /[A-Z]/.test(p))) {
  camelCaseProps[p.toLowerCase()] = p
}

// init d'après process.env fait au premier import de ce module
// faut virer BASE_URL car vitest l'initialise avec /, faudra passer BASEURL ou BASE__URL ou baseUrl ou …
const env = Object.entries(process.env).filter(([p]) => p !== 'BASE_URL')
for (const [k, value] of env) {
  let p = k.toLowerCase().replace(/_/g, '')
  if (camelCaseProps[p]) p = camelCaseProps[p]
  // une propriété qui n'existe pas mais que l'on accepte via l'environnement
  if (p === 'browser') prefs.browsers = [value]
  // sinon on affecte si ça nous concerne
  else if (prefsProps.includes(p)) prefs[p] = value
}

export default prefs
