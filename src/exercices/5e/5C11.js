import EcrireUneExpressionNumerique from './_Ecrire_une_expression_numerique.js'
export const titre = 'Traduire une phrase par une expression'
export const dateDeModifImportante = '21/09/2023'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'

/**
 * @author Jean-Claude Lhote
 */

export const uuid = '9d15d'
export const refs = {
  'fr-fr': ['5C11'],
  'fr-ch': ['9NO4-20']
}
export default function TraduireUnePhraseParUneExpression () {
  EcrireUneExpressionNumerique.call(this)
  this.version = 1
  this.sup2 = false
  this.nbQuestions = 5
  this.sup4 = '1-2-3'
}
