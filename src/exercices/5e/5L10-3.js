import EcrireUneExpressionNumerique from './_Ecrire_une_expression_numerique.js'
export const titre = 'Traduire une expression par une phrase'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDeModifImportante = '21/09/2023'

/**
 * @author Jean-Claude Lhote
 */

export const uuid = '458ae'
export const ref = '5L10-3'
export const refs = {
  'fr-fr': ['5L10-3'],
  'fr-ch': []
}
export default function TraduireUneExpressionLitteraleParUnePhrase () {
  EcrireUneExpressionNumerique.call(this)
  this.version = 2
  this.litteral = true
  this.sup4 = '2-3'
}
