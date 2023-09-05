import PuissancesEncadrement from '../4e/4C30-1.js'
export const titre = 'Encadrer des nombres relatifs avec des puissances de 10'
export const dateDeModifImportante = '05/09/2023'
export const interactifReady = true
export const interactifType = 'mathLive'
/**
 * Clone de 4C30-1 pour les 2nde
 *
 * @author Jean-Claude Lhote
 */

export const uuid = '8f56e'
export const ref = '2N12-2'
export default function PuissancesEncadrement2nde () {
  PuissancesEncadrement.call(this)
  this.sup = 4
  this.classe = 2
  this.besoinFormulaireTexte = [
    'Niveau de difficulté',
    'Nombres séparés par des tirets\n1 : Nombre entier positif\n2 : Nombre décimal positif\n3 : Nombre entier positif inférieur à 1\n4 : Nombre relatif \n5 : Mélange'
  ]
}
