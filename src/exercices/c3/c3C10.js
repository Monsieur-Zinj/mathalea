import AdditionsSoustractionsMultiplicationsPosees from '../6e/6C10.js'
export const titre = 'Additions, soustractions et multiplications posées de nombres entiers'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'
/**
 *Clone de 6C10 pour les CM1-CM2
 *
 * @author Jean-Claude Lhote
 */
export const uuid = 'fa836'
export const refs = {
  'fr-fr': ['c3C10'],
  'fr-ch': []
}
export default function OperationsPosees () {
  AdditionsSoustractionsMultiplicationsPosees.call(this)
  this.nbQuestions = 3
}
