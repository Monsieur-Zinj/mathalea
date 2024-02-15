import PuissanceDunNombre from '../4e/4C35.js'
export const titre = 'Transformer une écriture de puissance en écriture décimale ou fractionnaire'
export const dateDePublication = '14/06/2022'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Clone de 4C35 pour les 2nde
 * @author Rémi Angot
 */

export const uuid = '53fbb'
export const ref = '2N31-0'
export const refs = {
  'fr-fr': ['2N31-0'],
  'fr-ch': []
}
export default function PuissanceDunNombre2e () {
  PuissanceDunNombre.call(this)
  this.sup = true
}
