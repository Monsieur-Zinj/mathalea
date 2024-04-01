import sommeFractionsDecimales from '../../6e/6N10-6.js'
export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Passer d’un calcul de fractions décimales à une écriture décimale**'

export const dateDePublication = '20/01/2022'

/*!
 * @author Eric Elter
 * Créé le 20/01/2022
 * Référence can6N13
 */
export const uuid = 'ce3da'
export const refs = {
  'fr-fr': ['can6N13'],
  'fr-ch': []
}
export default function SommeFractionsDecimalesCAN () {
  sommeFractionsDecimales.call(this)
  this.nbQuestions = 1
  this.can = true
  this.sup = '5-6'
  this.sup2 = 1
}
