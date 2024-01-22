import type { Prefs } from './types'

/**
 * Préférences par défaut
 */
const prefs: Prefs = {
  browserInstance: null,
  browserOptions: {},
  browsers: ['chromium'],
  contextOptions: {},
  pauseOnError: true,
  debug: false,
  headless: false,
  silent: false,
  slowMo: 0,
  verbose: false
}

export default prefs
