import RelationDeThales from '../4e/_RelationDeThales.js'
export const dateDePublication = '05/01/2023'
export const interactifReady = false
export const titre = 'Écrire une relation de Thalès'

/**
 * Relation de Thalès
 * @author Sébastien LOZANO
*/

export const uuid = '6fd12'
export const ref = '3G20-2'
export const refs = {
  'fr-fr': ['3G20-2'],
  'fr-ch': ['11GM3-3']
}
export default function RelationDeThales3e () {
  RelationDeThales.call(this)
  this.sup = 2
}
