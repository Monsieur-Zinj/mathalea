import EqResolvantesThales from '../3e/3L13-2.js'
export const titre = 'Résoudre une équation du type $\\dfrac{x}{a}=\\dfrac{b}{c}$'

/**
 * Clone de 3L13-2 version déclinée 4L15-1 pour les 2nde
 *
 * @author Sébastien LOZANO
 */
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const uuid = '7959f'
export const ref = '2N51-3'
export const refs = {
  'fr-fr': ['2N51-3'],
  'fr-ch': []
}
export default function EqResolvantesThales2nde () {
  EqResolvantesThales.call(this)
  this.exo = '4L15-1'
  this.sup = 1
}
