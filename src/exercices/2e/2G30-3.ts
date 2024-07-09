import EqCartDroite from '../1e/1G13'
export const titre = 'Déterminer une équation cartésienne de droite à partir de deux points'
export const dateDeModifImportante = '07/07/2024'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Description didactique de l'exercice
 * @author Stéphane Guyon  + Jean-Claude Lhote (interactif) + Gilles Mora
*/
export const uuid = '1bb30'
export const ref = '2G30-3'
export const refs = {
  'fr-fr': ['2G30-3'],
  'fr-ch': []
}
class EqCart2points extends EqCartDroite {
  version: number
  constructor () {
    super()
    this.nbQuestions = 1
    this.spacingCorr = 1
    this.version = 2
  }
}
export default EqCart2points
