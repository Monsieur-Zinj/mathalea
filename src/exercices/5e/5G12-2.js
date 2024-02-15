import SerieDeTransformations from '../4e/4G12.js'
export const titre = 'Trouver les symétries successives dans un damier'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDePublication = '4/12/2021'

/*!
 * @author Jean-Claude Lhote
 * Créé le 4/12/2021
 * Référence 5G12-2 clone Symétrie axiale de 4G12
 */
export const uuid = 'dbc1d'
export const ref = '5G12-2'
export const refs = {
  'fr-fr': ['5G12-2'],
  'fr-ch': []
}
export default function SerieDeTransformations5e () {
  SerieDeTransformations.call(this)
  this.version = 2
  this.nbQuestions = 1
  this.besoinFormulaireNumerique = false
}
