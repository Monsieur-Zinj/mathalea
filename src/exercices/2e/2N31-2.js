import PuissancesDunRelatif1 from '../3e/3C10-2.js'
export const titre = 'Puissances : le sens des règles de calculs'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true // pour définir que l'exercice est exportable AMC
export const amcType = 'AMCNum'

/**
 * Clone de 3C10-2 pour les 2nde
 * @author Sébastien Lozano
 */

export const uuid = '1e42b'
export const ref = '2N31-2'
export default function PuissancesDunRelatif12e () {
  PuissancesDunRelatif1.call(this)
  this.classe = 2
  this.correctionDetaillee = false
}
