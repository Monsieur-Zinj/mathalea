import FonctionsProbabilite1 from '../5e/5S21.js'
export const titre = 'Décrire une expérience aléatoire'
export const interactifReady = false
export const dateDePublication = '03/04/2022'

/**
 * @author Guillaume Valmont
 * reference 5S22
 */
export const uuid = 'df72b'
export const ref = '5S22'
export const refs = {
  'fr-fr': ['5S22'],
  'fr-ch': ['11NO2-8']
}
export default class FonctionsVocabulaireProbabilite5e extends FonctionsProbabilite1 {
  constructor () {
    super()
    this.niveau = 2
    this.spacingCorr = 2
  }
}
