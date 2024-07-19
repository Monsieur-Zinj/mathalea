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
  debug: true,
  headless: false,
  silent: false,
  slowMo: 0,
  verbose: true
}

export default prefs
