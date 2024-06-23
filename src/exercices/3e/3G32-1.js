import problemesTrigoLongueur from '../3e/3G32-0.js'
export const titre = "Calcul d'un parallèle terrestre"
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * @author Guillaume Valmont
 * reference 3G32-1
 */
export const uuid = 'e0287'
export const ref = '3G32-1'
export const refs = {
  'fr-fr': ['3G32-1'],
  'fr-ch': []
}
export default class CalculParalleleTerrestre extends problemesTrigoLongueur {
  constructor () {
    super()
    this.sup2 = 2
    this.besoinFormulaireCaseACocher = false
  }
}
