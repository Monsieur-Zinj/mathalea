import TransformationsDuPlanEtCoordonnees from '../3e/3G10-1.js'
export const titre = 'Trouver les coordonnées de l\'image d\'un point par une translation et une rotation'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDePublication = '28/10/2021'
export const dateDeModifImportante = '28/12/2022'

/**
 * Transformations : symétrie centrale et repérage
 * @author Jean-Claude Lhote
 * référence 4G10-1 réglage de 3G10-1
 */
export const uuid = '7b40c'
export const ref = '4G10-1'
export const refs = {
  'fr-fr': ['4G10-1'],
  'fr-ch': []
}
export default function TransformationsDuPlanEtCoordonnees4e () {
  TransformationsDuPlanEtCoordonnees.call(this)
  this.sup = '3-4'
}
