import LireUneAbscisseAvecZoom from '../6e/6N23-3.js'
export const titre = 'Lire abscisse décimale avec zoom'

export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '13/11/2020'
/**
 * Lire un nombre décimal jusqu'au millième graĉe à un système de zoom successifs
 * L'abscisse est à donner sous trois formes.
 * @author Jean-Claude Lhote
 */
export const uuid = 'b2f66'
export const refs = {
  'fr-fr': ['c3N23'],
  'fr-ch': []
}
export default function LireUneAbscisseAvecZoomCM () {
  LireUneAbscisseAvecZoom.call(this)
  this.niveau = 'CM'
  this.sup = 1
}
