import LireAbscisseEntiere2d from '../6e/6N11.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const titre = 'Lire l\'abscisse entière d\'un point (grands nombres)'

/**
 * Lire un nombre / écrire un nombre : passer d'une écriture à une autre et inversement
 * On peut fixer la classe maximale : unités, milliers, millions, milliards
 * @author Jean-Claude Lhote
 * Référence 6N10
 */
export const uuid = 'c0fb1'
export const ref = 'c3N11'
export const refs = {
  'fr-fr': ['c3N11'],
  'fr-ch': []
}
export default function LireAbscisseEntiere2dC3 () {
  LireAbscisseEntiere2d.call(this)
  this.sup = 1
}
