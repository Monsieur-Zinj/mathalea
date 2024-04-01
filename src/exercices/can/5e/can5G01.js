import Transformations from '../../6e/_Transformations.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const titre = 'Trouver le symétrique d’un point 5e'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can5C10
 */
export const uuid = '6314c'
export const refs = {
  'fr-fr': ['can5G01'],
  'fr-ch': []
}
export default function SymetriqueD1Point () {
  Transformations.call(this)
  this.nbQuestions = 1
  this.can = true
  this.sup = 2
}
