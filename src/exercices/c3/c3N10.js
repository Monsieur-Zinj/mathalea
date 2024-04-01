import ÉcrireNombresEntiers from '../6e/6N10.js'
export const titre = 'Écrire un nombre en chiffres ou en lettres'
export const amcReady = true
export const amcType = 'AMCOpen'

export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDeModifImportante = '14/11/2023'

/**
 * Lire un nombre / écrire un nombre : passer d'une écriture à une autre et inversement
 * On peut fixer la classe maximale : unités, milliers, millions, milliards
 * @author Jean-Claude Lhote
 * Référence 6N10
 */
export const uuid = '85618'
export const refs = {
  'fr-fr': ['c3N10'],
  'fr-ch': []
}
export default function ÉcrireEntiersCycle3 () {
  ÉcrireNombresEntiers.call(this)
  this.sup2 = 0
  this.sup = 1
}
