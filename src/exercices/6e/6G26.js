import SerieDeTransformations from '../4e/4G12.js'
export const titre = 'Trouver les symétries axiales successives dans un damier'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDePublication = '4/12/2021'

/*!
 * @author Jean-Claude Lhote
 * Créé le 4/12/2021
 * Référence 6G26 clone Symétrie axiale de 4G12
 */
export const uuid = 'd7da5'
export const ref = '6G26'
export const refs = {
  'fr-fr': ['6G26'],
  'fr-ch': []
}
export default function SerieDeTransformations6e () {
  SerieDeTransformations.call(this)
  this.titre = titre
  this.version = 1
  this.nbQuestions = 1
  this.besoinFormulaireNumerique = false
}
