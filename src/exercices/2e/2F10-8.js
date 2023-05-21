import FonctionsAffines from '../3e/3F20-1.js'
export const titre = 'Faire un bilan sur les fonctions affines'
export { interactifReady, interactifType } from '../3e/3F20-1.js'
export const dateDePublication = '17/05/2023'
/** clone de 3F20-1
 * Questions sur les fonctions affines
 * @author Jean-Claude Lhote cloné par Gilles Mora
 * @constructor
 */
export const uuid = 'c1961'
export const ref = '2F10-8'
export default function FonctionsAffinesS () {
  FonctionsAffines.call(this)
  this.lycee = true
  this.nbQuestions = 10
}
