import ExerciceLabyrintheMultiples from '../6e/6C10-5.js'
export const titre = 'Parcourir un labyrinthe de multiples'
export const amcReady = true
export const amcType = 'AMCOpen'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '30/03/2023'
/**
 * Lire des nombres déciamux sur une portion de droite graduée
 * Une question demande la forme décimale, une autre, la partie entière plus la fraction décimale, et une troisième demande une seule fraction décimale.
 * @author Jean-Claude Lhote
 */
export const uuid = '40ae0'
export const ref = 'c3C10-2'
export const refs = {
  'fr-fr': ['c3C10-2'],
  'fr-ch': []
}
export default function LabyrintheDeMultiplesCM () {
  ExerciceLabyrintheMultiples.call(this)
  this.niveau = 'CM'
  this.sup = 4
  this.sup2 = 3
  this.sup3 = 1
  this.sup4 = 1
}
