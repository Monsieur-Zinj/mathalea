import DeterminerDerniereOperationExpressionLitterale from '../5e/5L14-4.js'
export const titre = 'Déterminer si ces expressions sont des sommes, des différences, des produits ou des quotients'
export const interactifReady = false

export const dateDePublication = '14/08/2021'

/**
 * @author Guillaume Valmont
 */
export const uuid = '68cda'
export const ref = '4L16'
export const refs = {
  'fr-fr': ['4L16'],
  'fr-ch': ['11FA3-1']
}
export default function DeterminerStructureExpressionLitterale () {
  DeterminerDerniereOperationExpressionLitterale.call(this)
  this.consigne = 'Déterminer si ces expressions sont des sommes, des différences, des produits ou des quotients.'
}
