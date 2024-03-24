import PlacerPointsAbscissesFractionnaires from '../6e/6N21'
export const titre = 'Utiliser les abscisses fractionnaires'
export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '27/10/2021'
/**
 * Clone de 6N21 pour les 2nde
 *
 * @author Jean-Claude Lhote
 */
export const uuid = '7cfbe'
export const ref = '2N10-3'
export const refs = {
  'fr-fr': ['2N10-3'],
  'fr-ch': []
}
export default class PlacerPointsAbscissesFractionnaires2nde extends PlacerPointsAbscissesFractionnaires {
  constructor () {
    super()
    this.sup = 5
  }
}
