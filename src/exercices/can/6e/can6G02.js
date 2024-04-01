import DenombrerCubes from '../../6e/6G43.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCNum'
export const amcReady = true
export const titre = 'Compter les cubes'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can6G02
 */
export const uuid = '76b93'
export const refs = {
  'fr-fr': ['can6G02'],
  'fr-ch': []
}
export default function CompterLesCubesManquant () {
  DenombrerCubes.call(this)
  this.nbQuestions = 1
  this.sup2 = 1
  this.sup = 1
}
