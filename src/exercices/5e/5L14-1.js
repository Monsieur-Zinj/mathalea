import EcrireUneExpressionNumerique from './_Ecrire_une_expression_numerique.js'
export const titre = 'Calculer une expression littérale pour les valeurs données en détaillant les calculs'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '21/09/2023'

/**
 * @author Jean-Claude Lhote
  * Référence 5L14-1
*/
export const uuid = '1abc6'
export const ref = '5L14-1'
export const refs = {
  'fr-fr': ['5L14-1'],
  'fr-ch': []
}
export default function CalculerUneExpressionLitterale () {
  EcrireUneExpressionNumerique.call(this)
  this.version = 4
  this.titre = titre
  this.litteral = true
  this.sup4 = '2-3-4-5'
}
