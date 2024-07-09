import problemesTrigoLongueur from '../3e/3G32-0.js'
export const titre = "Calculer la hauteur d'une montagne"
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * @author Guillaume Valmont
 * reference 3G32-4
 */
export const uuid = '3cb52'
export const ref = '3G32-4'
export const refs = {
  'fr-fr': ['3G32-4'],
  'fr-ch': []
}
export default class CalculHauteurMontagne extends problemesTrigoLongueur {
  constructor () {
    super()
    this.sup2 = 5
    this.besoinFormulaireCaseACocher = false
  }
}
