import ExerciceTablesAdditions from '../6e/6C10-4.js'
export const titre = 'Tables d\'addition'
export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '22/08/2024'

/**
 * Lire des nombres déciamux sur une portion de droite graduée
 * Une question demande la forme décimale, une autre, la partie entière plus la fraction décimale, et une troisième demande une seule fraction décimale.
 * ref 6N23-2
 *
 * @author Jean-Claude Lhote
 */
export const uuid = 'ed7fc'
export const ref = 'c3C10-4'
export const refs = {
  'fr-fr': ['c3C10-4'],
  'fr-ch': []
}
export default function TablesAdditionsCycle3 () {
  ExerciceTablesAdditions.call(this, 10)
}
