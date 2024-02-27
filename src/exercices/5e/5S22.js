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
  'fr-ch': []
}
export default function FonctionsVocabulaireProbabilite5e () {
  FonctionsProbabilite1.call(this)
  this.titre = titre
  this.niveau = 2
  this.spacingCorr = 2
}
