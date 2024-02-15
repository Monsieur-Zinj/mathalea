import NotationScientifique from '../4e/4C32.js'
export const titre = 'Associer un nombre décimal à sa notation scientifique'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * Clone de 4C32 pour les 2nde
 * @author Sébastien Lozano
 */

export const uuid = 'c9404'
export const ref = '2N31-1'
export const refs = {
  'fr-fr': ['2N31-1'],
  'fr-ch': []
}
export default function NotationScientifique2e () {
  NotationScientifique.call(this)
}
