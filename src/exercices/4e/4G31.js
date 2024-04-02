import ReciproqueThales from '../3e/3G21.js'
export const titre = 'Contrôler si deux droites sont parallèles'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * @author Jean-Claude Lhote
 * référence 4G31
 */
export const uuid = '4dce8'
export const ref = '4G31'
export const refs = {
  'fr-fr': ['4G31'],
  'fr-ch': []
}
export default function ReciproqueThales4eme () {
  ReciproqueThales.call(this)
  this.quatrieme = true
  this.titre = titre
  this.besoinFormulaire3Numerique = false
}
