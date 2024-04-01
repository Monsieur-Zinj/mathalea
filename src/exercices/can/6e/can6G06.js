import NombreDeFacesEtDAretes from '../../6e/6G44.js'
export const titre = 'Compter les arêtes et les faces'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé le 7/11/2021
 * Référence 6G44 clone à 4 question de can6G06
 */
export const uuid = '86ea3'
export const refs = {
  'fr-fr': ['can6G06'],
  'fr-ch': []
}
export default function NombreDeFacesEtDAretesExo () {
  NombreDeFacesEtDAretes.call(this)
  this.titre = titre
  this.nbQuestions = 1
  this.version = 3
  this.besoinFormulaireNumerique = false
}
