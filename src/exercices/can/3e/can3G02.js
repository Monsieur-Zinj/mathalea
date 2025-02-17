import Transformations from '../../6e/_Transformations.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const titre = 'Trouver l’image d’un point par une  transformation 3e'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can3G02
 */
export const uuid = '8e651'
export const ref = 'can3G02'
export const refs = {
  'fr-fr': ['can3G02'],
  'fr-ch': []
}
export default function ImageD1Point () {
  Transformations.call(this)
  this.nbQuestions = 1
  this.can = true
  this.sup = 4
}
