import EcrireUneExpressionNumerique from './_Ecrire_une_expression_numerique.js'
export const titre = 'Calculer une expression littérale pour les valeurs données en détaillant les calculs'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '21/09/2023'

/**
 * @author Jean-Claude Lhote
*/
export const uuid = '1abc6'
export const ref = '5L14-1'
export const refs = {
  'fr-fr': ['5L14-1'],
  'fr-ch': ['10FA1-3', '11FA1-5']
}
export default function CalculerUneExpressionLitterale () {
  EcrireUneExpressionNumerique.call(this)
  this.version = 4
  this.litteral = true
  this.sup4 = '2-3-4-5'
}
