import EqResolvantesThales from '../3e/3L13-2.js'
export const titre = 'Déterminer une quatrième proportionnelle dans un tableau'

export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '15/12/2020'
export const dateDeModifImportante = '15/06/2024'
/**
 * * Quatrieme proportionnelle dans un tableau du type
 * @author Sébastien Lozano
 */

export const uuid = 'a6b5b'
export const ref = '4P10-2'
export const refs = {
  'fr-fr': ['4P10-2'],
  'fr-ch': ['9FA3-4']
}
export default function TableauxEtQuatriemeProportionnelle () {
  EqResolvantesThales.call(this)
  this.exo = '4P10-2'
  this.consignePluriel = 'Déterminer la quatrième proportionnelle dans les tableaux suivants.'
  this.consigneSingulier = 'Déterminer la quatrième proportionnelle dans le tableau suivant.'
  this.sup = 1
}
