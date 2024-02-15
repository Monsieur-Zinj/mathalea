import identitesCalculs from '../3e/3L11-5.js'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * * Calcul mental autour des identités remarquables
 * * Clone de 3L11-5 pour les 2nde
 * * publié le  7/10/2021
 * @author Sébastien Lozano
 */

export const titre = 'Calcul mental et calcul littéral'

export const uuid = '74c5a'
export const ref = '2N40-6'
export const refs = {
  'fr-fr': ['2N40-6'],
  'fr-ch': []
}
export default function IdentitesCalculs2e () {
  identitesCalculs.call(this)
  this.sup = 4
}
