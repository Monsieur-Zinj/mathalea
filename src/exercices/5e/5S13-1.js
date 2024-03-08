import calculEffectifFrequence from '../3e/3S12.js'
export const titre = 'Calculer des effectifs et des fréquences'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * Calculer des effectifs et des fréquences
 * @author Guillaume Valmont
 * Publié le 08/08/2021
 */
export const uuid = '7d429'
export const ref = '5S13-1'
export const refs = {
  'fr-fr': ['5S13-1'],
  'fr-ch': ['11NO2-3']
}
export default function CalculEffectifFrequence5e () {
  calculEffectifFrequence.call(this)
  this.sup = 1
}
