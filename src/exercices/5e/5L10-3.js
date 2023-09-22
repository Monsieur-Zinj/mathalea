import EcrireUneExpressionNumerique from './_Ecrire_une_expression_numerique.js'
export const titre = 'Traduire une expression par une phrase'
export const amcReady = true
export const amcType = 'AMCOpen'

/**
 * @author Jean-Claude Lhote
 */
export const uuid = '458ae'
export const ref = '5L10-3'
export default function TraduireUneExpressionLitteraleParUnePhrase () {
  EcrireUneExpressionNumerique.call(this)
  this.version = 2
  this.titre = titre
  this.litteral = true
  this.sup = 2
}
