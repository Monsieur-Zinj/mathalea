import CalculerUnPourcentage from '../../6e/6N33-2.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCNum'
export const amcReady = true
export const titre = 'Résoudre un problème de calcul de pourcentage par complément à 100%'

export const dateDePublication = '15/11/2022'

/*!
 * @author Gilles Mora
 * Créé le 20/01/2022
 * Référence can6P06
 */

export const uuid = 'fb422'
export const ref = 'can6P06'
export const refs = {
  'fr-fr': ['can6P06'],
  'fr-ch': []
}
export default function CalculerUnPourcentageCAN () {
  CalculerUnPourcentage.call(this)
  this.nbQuestions = 1
  this.can = true
  this.consigne = ''
  this.spacing = 1
}
