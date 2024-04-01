import sommeFractionsDecimales from '../../6e/6N10-6.js'
export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Écrire sous forme d\'une fraction décimale'

export const dateDePublication = '20/01/2022'

/*!
 * @author Eric Elter
 * Créé le 20/01/2022
 * Référence can6N11
 */
export const uuid = '79452'
export const refs = {
  'fr-fr': ['can6N11'],
  'fr-ch': []
}
export default function SommeFractionsDecimalesCAN () {
  sommeFractionsDecimales.call(this)
  this.nbQuestions = 1
  this.can = true
  this.sup = '1-2'
  this.sup2 = 2
}
