import DivisionsEuclidiennes from '../6e/6C11.js'
export const titre = 'Divisions euclidiennes'
export const amcReady = true
export const amcType = 'AMCOpen'
export const interactifReady = true
export const interactifType = 'mathLive'
/**
 * Lire des nombres déciamux sur une portion de droite graduée
 * Une question demande la forme décimale, une autre, la partie entière plus la fraction décimale, et une troisième demande une seule fraction décimale.
 * ref 6N23-2
 *
 * @author Jean-Claude Lhote
 */
export const uuid = 'b259a'
export const ref = 'c3C11'
export const refs = {
  'fr-fr': ['c3C11'],
  'fr-ch': []
}
export default function DivisionCycle3 () {
  DivisionsEuclidiennes.call(this)
  this.sup = 1
}
