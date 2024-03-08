import RelationDeThales from './_RelationDeThales.js'

export const titre = 'Écrire une relation de Thalès'
export const interactifReady = false
export const dateDePublication = '05/01/2023'

/**
 * Relation de Thalès
 * @author Sébastien LOZANO
*/

export const uuid = 'ff410'
export const ref = '4G30-1'
export const refs = {
  'fr-fr': ['4G30-1'],
  'fr-ch': ['11GM3-2']
}
export default function RelationDeThales4e () {
  RelationDeThales.call(this)
  this.level = 4
  this.besoinFormulaireNumerique = false
}
