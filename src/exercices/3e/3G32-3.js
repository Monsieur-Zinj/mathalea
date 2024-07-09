import problemesTrigoLongueur from '../3e/3G32-0.js'
export const titre = "Calculer la hauteur d'une falaise"
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * @author Guillaume Valmont
 * reference 3G32-3
 */
export const uuid = 'e42e0'
export const ref = '3G32-3'
export const refs = {
  'fr-fr': ['3G32-3'],
  'fr-ch': []
}
export default class CalculHauteurFalaise extends problemesTrigoLongueur {
  constructor () {
    super()
    this.sup2 = 4
    this.besoinFormulaireCaseACocher = false
  }
}
