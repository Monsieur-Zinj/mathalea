import ArrondirUneValeur6e from '../6e/6N31-3.js'
export const titre = 'Trouver la valeur arrondie d\'une racine carrée'
export const dateDePublication = '13/04/2021'

export const amcReady = true
export const amcType = 'qcmMult'
export const interactifReady = true
export const interactifType = 'qcm'

/**
 * Arrondir une racine carrée
 * @author Mireille Gain
 */

export const uuid = '9c484'
export const ref = '4G20-5'
export const refs = {
  'fr-fr': ['4G20-5'],
  'fr-ch': ['10NO3-3']
}
export default function ArrondirUneValeur4eRac () {
  ArrondirUneValeur6e.call(this)
  this.version = 3
  this.sup2 = true
  this.besoinFormulaireNumerique = false
}
