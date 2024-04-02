import TableauCriteresDeDivisibilite from '../6e/6N43-2.js'
export const titre = 'Utiliser les critères de divisibilité (plusieurs possibles)'
export const interactifReady = true
export const interactifType = 'qcm'

/**
 * Un nombre est-il divisible par 2, 3, 5, 9 ?
 * @author Rémi Angot
 * 5A11 (clone de 6N43-2)
 */
export const uuid = 'a55d2'
export const ref = '5A11'
export const refs = {
  'fr-fr': ['5A11'],
  'fr-ch': []
}
export default function TableauCriteresDeDivisibilite5e () {
  TableauCriteresDeDivisibilite.call(this)
  this.sup = true
}
