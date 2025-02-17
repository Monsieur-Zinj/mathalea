import ArrondirUneValeur6e from '../6e/6N31-3.js'
export const titre = 'Arrondir une valeur'
export const interactifReady = true
export const interactifType = 'qcm'
export const dateDeModifImportante = '27/10/2021'
/**
 * Clone de 6N31-3 pour les 2nde
 *
 * @author Jean-Claude Lhote
 */
export const uuid = 'bba9b'
export const ref = '2N13-1'
export const refs = {
  'fr-fr': ['2N13-1'],
  'fr-ch': ['10NO3-7']
}
export default function ArrondirUneValeur2nde () {
  ArrondirUneValeur6e.call(this)
  this.sup = 5
}
