import PavagesEtTransformations from '../6e/_Pavages_et_transformations.js'
export const titre = 'Trouver le symétrique d\'une figure dans un pavage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * Exercice en html seulement. Symétrie centrale dans un pavage.
 * @author Jean-Claude Lhote
 * référence 5G12-1
 */
export const uuid = '261bf'
export const ref = '5G12-1'
export const refs = {
  'fr-fr': ['5G12-1'],
  'fr-ch': []
}
export default function PavagesEtDemiTour () {
  PavagesEtTransformations.call(this)
  this.titre = titre
  this.level = 5
  this.besoinFormulaireNumerique = false
}
