import NotationPuissance from '../4e/4C33-0.js'
export const titre = 'Utiliser la notation puissance'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDePublication = '24/09/2023'
/**
 * Clone de 4C33-0 pour les 2nde
 * @author Eric Elter
 */

export const uuid = '31bd7'
export const ref = '3C10-3'
export const refs = {
  'fr-fr': ['3C10-3'],
  'fr-ch': []
}
export default function NotationPuissanceEn3eme () {
  NotationPuissance.call(this)
  this.sup = 3
  this.sup3 = 3
  this.classe = 3
  this.besoinFormulaire3Numerique = ['Exposant', 3, '1 : Positif\n2 : Négatif\n3 : Mélange']
}
