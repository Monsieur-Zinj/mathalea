import PavagesEtTransformations from '../6e/_Pavages_et_transformations.js'

export const titre = 'Trouver l\'image d\'une figure par une translation dans un pavage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * Exercice en html seulement. Translations dans un pavage.
 * @author Jean-Claude Lhote
 * référence 4G11-1
 */
export const uuid = '48253'
export const ref = '4G11-1'
export const refs = {
  'fr-fr': ['4G11-1'],
  'fr-ch': []
}
export default function PavagesEtTranslation () {
  PavagesEtTransformations.call(this)
  this.titre = titre
  this.level = 4
  this.besoinFormulaireNumerique = false
}
