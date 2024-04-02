import ExerciceEquationASolutionEntiere from '../../4e/4L20-0.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const titre = 'Résoudre une équation $x+a=b$ ou $ax=b$'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can4L01
 */
export const uuid = '0641c'
export const ref = 'can4L01'
export const refs = {
  'fr-fr': ['can4L01'],
  'fr-ch': []
}
export default function UneEquationSimple () {
  ExerciceEquationASolutionEntiere.call(this)
  this.nbQuestions = 1
  this.correctionDetaillee = false
  this.sup = false
  this.sup2 = 1
  this.spacingCorr = 1
  this.consigne = 'Résoudre l’équation :'
}
