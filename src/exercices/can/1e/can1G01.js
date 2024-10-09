import CosEtsin from '../../1e/1AN40.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Déterminer les valeurs remarquables du cosinus et sinus'

export const dateDePublication = '01/06/2022'

/*!
 * @author Stéphane et cie
 */
export const uuid = '4c2a0'
export const ref = 'can1G01'
export const refs = {
  'fr-fr': ['can1G01'],
  'fr-ch': []
}
export default class CosEtsinsCAN extends CosEtsin {
  constructor () {
    super()
    this.nbQuestions = 1
    this.can = true
    this.sup = 2
  }
}
