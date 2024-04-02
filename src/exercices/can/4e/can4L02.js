import ExerciceEquationASolutionEntiere from '../../4e/4L20-0.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const titre = 'Résoudre une équation $ax+b=c$'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can4L02
 */
export const uuid = 'c5700'
export const ref = 'can4L02'
export const refs = {
  'fr-fr': ['can4L02'],
  'fr-ch': []
}
export default function UneEquationMoyenne () {
  ExerciceEquationASolutionEntiere.call(this)
  this.nbQuestions = 1
  this.correctionDetaillee = false
  this.sup = false
  this.sup2 = 2
  this.spacingCorr = 1
  this.consigne = 'Résoudre l’équation :'
}
