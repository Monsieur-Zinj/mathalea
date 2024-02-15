import FonctionsAffinesOuLineaires from '../3e/3F20-2.js'
export const titre = 'Faire un bilan sur les fonctions affines et/ou linéaires'
export const interactifType = 'mathLive'
export const interactifReady = true
export const dateDePublication = '17/05/2023'
export const dateDeModifImportante = '21/05/2023'
/** clone de 3F20-1
 * Questions sur les fonctions affines
 * @author Jean-Claude Lhote cloné par Gilles Mora
 * @constructor
 */
export const uuid = 'c1961'
export const ref = '2F10-8'
export const refs = {
  'fr-fr': ['2F10-8'],
  'fr-ch': []
}
export default function FonctionsAffinesS () {
  FonctionsAffinesOuLineaires.call(this)
  this.lycee = true
  this.nbQuestions = 10
}
