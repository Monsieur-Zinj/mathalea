import NotationPuissance from '../4e/4C33-0.js'
export const titre = 'Utiliser la notation puissance'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDePublication = '12/09/2023'
/**
 * Clone de 4C33-0 pour les 2nde
 * @author Eric Elter
 */

export const uuid = 'fb1a4'
export const ref = '2N31-9'
export const refs = {
  'fr-fr': ['2N31-9'],
  'fr-ch': []
}
export default function NotationPuissanceEn2nde () {
  NotationPuissance.call(this)
  this.sup = 3
  this.sup3 = 3
  this.classe = 2
  this.besoinFormulaire3Numerique = ['Exposant', 3, '1 : Positif\n2 : Négatif\n3 : Mélange']
}
