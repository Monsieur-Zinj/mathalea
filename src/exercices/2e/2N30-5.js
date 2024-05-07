import SommeOuProduitFractions from '../4e/4C23.js'
export const titre = 'Effectuer somme, différence ou produit de fractions'

export const dateDeModifImportante = '07/05/2024'
export const interactifType = 'mathLive'
export const interactifReady = true

/**
 * Clone de 4C23 pour les 2nde
 *
 * @author Sébastien LOZANO
 */
export const uuid = '6575c'
export const ref = '2N30-5'
export const refs = {
  'fr-fr': ['2N30-5'],
  'fr-ch': []
}
export default function SommeOuProduitFractions2nde () {
  SommeOuProduitFractions.call(this)
  this.sup = 4
}
