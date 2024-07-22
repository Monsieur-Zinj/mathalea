import CoefficientEvolution from '../3e/3P10-1.js'
export const titre = 'Calculer un CM à partir d\'un taux d\'évolution et inversement'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Clone de 3P10-1 pour les 2nde
 *
 * @author Sébastien LOZANO
 */
export const uuid = '05db7'
export const ref = '2S11-1'
export const refs = {
  'fr-fr': ['2S11-1'],
  'fr-ch': []
}
export default function CoefficientEvolution2nde () {
  CoefficientEvolution.call(this)
  this.version = 2
}
