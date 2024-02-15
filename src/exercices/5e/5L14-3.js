import EcrireUneExpressionNumerique from './_Ecrire_une_expression_numerique.js'
export const titre = 'Traduire une phrase par une expression et la calculer'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '21/09/2023'

/**
 * @author Jean-Claude Lhote
 */

export const uuid = '2c600'
export const ref = '5L14-3'
export const refs = {
  'fr-fr': ['5L14-3'],
  'fr-ch': []
}
export default function TraduireUnePhraseParUneExpressionLitteraleEtCalculer () {
  EcrireUneExpressionNumerique.call(this)
  this.version = 3
  this.litteral = true
  this.sup4 = '1-2-3'
}
