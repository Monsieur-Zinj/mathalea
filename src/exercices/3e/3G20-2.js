import RelationDeThales from '../4e/_RelationDeThales.js'
export const dateDePublication = '05/01/2023'
export const titre = 'Écrire une relation de Thalès'

/**
 * Relation de Thalès
 * @author Sébastien LOZANO
 * Référence 3G20-2
*/

export const uuid = '6fd12'
export const ref = '3G20-2'
export const refs = {
  'fr-fr': ['3G20-2'],
  'fr-ch': []
}
export default function RelationDeThales3e () {
  RelationDeThales.call(this)
  this.sup = 2
}
