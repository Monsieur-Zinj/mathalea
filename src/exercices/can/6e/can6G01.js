import Transformations from '../../6e/_Transformations.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const titre = 'Trouver le symétrique d’un point'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can6G01
 */
export const uuid = '135d4'
export const ref = 'can6G01'
export const refs = {
  'fr-fr': ['can6G01'],
  'fr-ch': []
}
export default function SymetriqueD1Point () {
  Transformations.call(this)
  this.nbQuestions = 1
  this.can = true
  this.sup = 1
}
