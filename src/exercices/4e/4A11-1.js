import decompositionFacteursPremiers from '../3e/3A10-3.js'
export const titre = 'Décomposer un nombre entier en produit de facteurs premiers'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'

/**
 * @author Guillaume Valmont
 * reference 4A11-1
 */
export const uuid = 'b8a38'
export const ref = '4A11-1'
export const refs = {
  'fr-fr': ['4A11-1'],
  'fr-ch': []
}
export default function DecompositionFacteursPremiers4e () {
  decompositionFacteursPremiers.call(this)
  this.titre = titre
}
