import TrouverLaTransformations from '../4e/4G12-1.js'
export const titre = 'Identifier une transformation'
export const interactifReady = true
export const interactifType = 'listeDeroulante'
export const dateDePublication = '4/12/2021'

/*!
 * @author Jean-Claude Lhote
 */

export const uuid = '2d343'
export const ref = '5G12-3'
export const refs = {
  'fr-fr': ['5G12-3'],
  'fr-ch': []
}
export default function TrouverLaTransformations5e () {
  TrouverLaTransformations.call(this)
  this.version = 1
  this.nbQuestions = 1
  this.besoinFormulaireNumerique = false
}
