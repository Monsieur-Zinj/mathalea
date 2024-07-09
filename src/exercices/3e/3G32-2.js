import problemesTrigoLongueur from '../3e/3G32-0.js'
export const titre = "Calculer la hauteur d'un objet vu sous un angle donné"
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * @author Guillaume Valmont
 * reference 3G32-2
 */
export const uuid = '5986b'
export const ref = '3G32-2'
export const refs = {
  'fr-fr': ['3G32-2'],
  'fr-ch': []
}
export default class CalculHauteurObjet extends problemesTrigoLongueur {
  constructor () {
    super()
    this.sup2 = 3
    this.besoinFormulaireCaseACocher = false
  }
}
