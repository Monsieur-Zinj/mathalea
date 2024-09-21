import RangerOrdreCroissantDecroissant from './6N11-4.js'

export const titre =
  "Ranger des nombres décimaux dans l'ordre croissant ou décroissant"
export const dateDePublication = '21/09/2024'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * * Ranger une liste de nombres décimaux dans l'odre croissant ou décroissant
 * *
 */

export const uuid = '15ece'
export const ref = '6N31-7'
export const refs = {
  'fr-fr': ['6N31-7'],
  'fr-ch': ['']
}

export default class RangerOrdreCroissantDecroissantDecimaux extends RangerOrdreCroissantDecroissant {
  constructor () {
    super()
    this.sup = 1
    this.sup2 = true
  }
}
