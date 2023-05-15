import EncadrerFractionEntre2Entiers from '../6e/6N20-1.js'
export const titre = 'Encadrer une fraction entre deux nombres entiers'
export { interactifReady, interactifType, amcType, amcReady } from '../6e/6N20-1.js'
export const dateDeModifImportante = '27/10/2021'
/**
 * Clone de 6N20-1 pour les 2nde
 *
 * @author Jean-Claude Lhote
 */
export const dateDeModificationImportante = '14/05/2023' // ajout d'un paramètre pour choisir les dénominateurs
export const uuid = 'd309b'
export const ref = '2N12-1'
export default function EncadrerFractionEntre2Entiers2nde () {
  EncadrerFractionEntre2Entiers.call(this)
  this.lycee = true
  this.sup = false
  this.sup2 = '10'
  this.besoinFormulaire2Texte = ['Dénominateurs à choisir (nombres séparés par des tirets', 'De 2 à 9 pour les dénominateurs correspondants\n10 Mélange']
}
