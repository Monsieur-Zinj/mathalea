import TableauCriteresDeDivisibilite from '../6e/6N43-2.js'
export const titre = 'Utiliser les critères de divisibilité (plusieurs possibles)'
export const interactifReady = true
export const interactifType = 'qcm'
export const dateDeModifImportante = '29/10/2021'
/**
 * Clone de 6N43-2 pour les 2nde
 *
 * @author Jean-Claude Lhote
 */

export const uuid = 'd5a6d'
export const ref = '2N20-2'
export const refs = {
  'fr-fr': ['2N20-2'],
  'fr-ch': []
}
export default function TableauCritereDeDivisibilite2nde () {
  TableauCriteresDeDivisibilite.call(this)
  this.sup = true
  this.besoinFormulaireCaseACocher = false
}
