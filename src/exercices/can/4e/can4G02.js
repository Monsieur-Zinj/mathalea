import Transformations from '../../6e/_Transformations.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const titre = 'Trouver l’image d’un point par une transformation'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can4G02
 */
export const uuid = 'a77ed'
export const ref = 'can4G02'
export const refs = {
  'fr-fr': ['can4G02'],
  'fr-ch': []
}
export default function SymetriqueD1Point () {
  Transformations.call(this)
  this.nbQuestions = 1
  this.can = true
  this.sup = 3
}
