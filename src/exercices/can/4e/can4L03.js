import ExerciceEquationASolutionEntiere from '../../4e/4L20-0.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const titre = 'Résoudre une équation $ax+b=cx+d$'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can4L03
 */
export const uuid = '91cd5'
export const refs = {
  'fr-fr': ['can4L03'],
  'fr-ch': []
}
export default function UneEquationDifficile () {
  ExerciceEquationASolutionEntiere.call(this)
  this.nbQuestions = 1
  this.correctionDetaillee = false
  this.sup = false
  this.sup2 = 3
  this.spacingCorr = 1
  this.consigne = 'Résoudre l’équation :'
}
