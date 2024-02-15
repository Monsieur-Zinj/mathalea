import EcrireUneExpressionNumerique from './_Ecrire_une_expression_numerique.js'
export const titre = 'Traduire une expression par une phrase'
export const amcReady = true
export const amcType = 'AMCOpen'
export const interactifReady = true
export const interactifType = 'listeDeroulante'

export const dateDeModifImportante = '21/09/2023'

/**
 * @author Jean-Claude Lhote
 */

export const uuid = 'baa4b'
export const ref = '5C11-1'
export const refs = {
  'fr-fr': ['5C11-1'],
  'fr-ch': []
}
export default function TraduireUneExpressionParUnePhrase () {
  EcrireUneExpressionNumerique.call(this)
  this.version = 2
  this.nbQuestions = 5
  this.sup4 = '1-2-3'
}
