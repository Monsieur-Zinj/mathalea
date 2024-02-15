import EcrireUneExpressionNumerique from '../5e/_Ecrire_une_expression_numerique.js'
export const titre = 'Traduire une expression par une phrase'
export const amcReady = true
export const amcType = 'AMCOpen'
export const interactifReady = true
export const interactifType = 'listeDeroulante'
export const dateDePublication = '08/10/2023'

/**
 * @author Eric Elter
 */

export const uuid = 'e6f62'
export const ref = '6C13-2'
export const refs = {
  'fr-fr': ['6C13-2'],
  'fr-ch': []
}
export default function TraduireUneExpressionParUnePhrase6eme () {
  EcrireUneExpressionNumerique.call(this)
  this.version = 2
  this.nbQuestions = 4
  this.sup4 = '1'
  this.besoinFormulaire4Texte = false
}
