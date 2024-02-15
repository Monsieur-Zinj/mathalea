import calculEffectifFrequence from '../3e/3S12.js'
export const titre = 'Calculer des effectifs et des fréquences'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * Clone de 3S12 pour les 2nde
 *
 * @author Sébastien LOZANO
 */
export const uuid = 'dc3d2'
export const ref = '2S20-1'
export const refs = {
  'fr-fr': ['2S20-1'],
  'fr-ch': []
}
export default function CalculEffectifFrequence2nde () {
  calculEffectifFrequence.call(this)
}
