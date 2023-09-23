import EcrireUneExpressionNumerique from './_Ecrire_une_expression_numerique.js'
export const titre = 'Traduire une phrase par une expression'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDeModifImportante='21/09/2023'

/**
 * @author Jean-Claude Lhote
 */

export const uuid = 'fefa0'
export const ref = '5L10-1'
export default function TraduireUnePhraseParUneExpressionLitterale () {
  EcrireUneExpressionNumerique.call(this)
  this.version = 1
  this.sup2 = false
  this.litteral = true
  this.sup4='2-3-4-5'
}
