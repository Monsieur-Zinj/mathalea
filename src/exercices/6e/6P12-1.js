import EchellesProblemes from '../5e/5P13.js'

export const titre = 'Utiliser ou trouver l\'échelle d\'un plan'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

// Gestion de la date de publication initiale
export const dateDePublication = '19/04/2024'
/**
 * Clone de 5P13 pour les 6èmes
 *
 * @author Eric Elter
 */
export const uuid = '9c78f'
export const ref = '6P12-1'
export const refs = {
  'fr-fr': ['6P12-1'],
  'fr-ch': []
}
export default function EchellesProblemes6eme () {
  EchellesProblemes.call(this)
  this.sup = '2-3'
  this.sup2 = true
}
