import BetaModeleSpline from '../../2e/2F22-3.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Dresser un tableau de signes à partir d\'un graphique'
export const dateDePublication = '07/12/2023'
/*!
 * @author Gilles Mora
 *
 * Référence can2F17
 */
export const uuid = '659da'
export const refs = {
  'fr-fr': ['can2F17'],
  'fr-ch': []
}
export default class BetaModeleSplineCAN extends BetaModeleSpline {
  constructor () {
    super()
    this.nbQuestions = 1
    this.can = true
    this.sup = 1
    this.correctionDetaillee = true
  }
}
