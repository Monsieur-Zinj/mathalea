import RelationDeThales from './_RelationDeThales.js'

export const titre = 'Écrire une relation de Thalès'
export const dateDePublication = '05/01/2023'
/**
 * Relation de Thalès
 * @author Sébastien LOZANO
 * Référence 4G30-1
*/

export const uuid = 'ff410'
export const ref = '4G30-1'
export const refs = {
  'fr-fr': ['4G30-1'],
  'fr-ch': []
}
export default function RelationDeThales4e () {
  RelationDeThales.call(this)
  this.level = 4
  this.besoinFormulaireNumerique = false
}
