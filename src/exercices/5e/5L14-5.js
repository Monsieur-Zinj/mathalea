import CalculerLaValeurDUneExpressionLitterale from './5L14.js'
export const titre = 'Calculer la valeur d\'une expression littérale de degré 1 à 1 inconnue'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Caculer la valeur d'une expression littérale de degré 1 à une inconnue
 * @author Sébastien Lozano forking 5L13 of Rémi Angot
 */
export const uuid = '72764'
export const ref = '5L14-5'
export const refs = {
  'fr-fr': ['5L14-5'],
  'fr-ch': ['9FA2-7']
}
export default function CalculerLaValeurDUneExpressionLitteraleDeg1Inc1 () {
  CalculerLaValeurDUneExpressionLitterale.call(this)
  this.version = '5L13-5'
  this.nbQuestions = 2
}
