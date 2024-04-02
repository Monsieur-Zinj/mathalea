import DenombrerCubes from '../../6e/6G43.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCNum'
export const amcReady = true
export const titre = 'Compter les cubes manquants'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 */
export const uuid = '5571c'
export const ref = 'can6G03'
export const refs = {
  'fr-fr': ['can6G03'],
  'fr-ch': []
}
export default function CompterLesCubes () {
  DenombrerCubes.call(this)
  this.nbQuestions = 1
  this.sup2 = 1
  this.sup = 2
}
