import ParalleleEtPerpendiculaires from './6G12-1.js'
export const titre = 'Tracer des parallèles'
export const interactifReady = false
export const amcReady = true
export const amcType = 'AMCOpen'

/**
 * @author Jean-Claude Lhote (AMC par Eric Elter en septembre 2021)
 * référence 6G12
 */
export const uuid = '46429'
export const ref = '6G12'
export const refs = {
  'fr-fr': ['6G12'],
  'fr-ch': ['9ES3-3']
}
export default class TracerDesParalleles extends ParalleleEtPerpendiculaires {
  constructor () {
    super()
    this.titre = titre
    this.sup = 1
    this.type = 2
  }
}
