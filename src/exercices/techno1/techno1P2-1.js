import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import Decimal from 'decimal.js'
import { randint } from '../../modules/outils.js'
export const titre = 'Appliquer un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
* @author Stéphane Guyon
*/
export const uuid = 'a66ad'
export const ref = 'techno1P2-1'
export const refs = {
  'fr-fr': ['techno1P2-1'],
  'fr-ch': []
}
export default function Proportion () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 3
  this.formatChampTexte = 'largeur01 inline'
  // this.optionsChampTexte = { texteApres: ' €' }
  this.nouvelleVersion = function () {
    const b = randint(3, 80)/* Pourcentage */
    const a = randint(10, 100)/* Valeur */
    this.question = `Calculer  $${b}\\,\\%$ de $${a}$. `
    this.correction = `Calculer $p\\,\\%$ d'un nombre, c'est multiplier ce nombre par $\\dfrac{p}{100}$.
<br>    Ainsi, $${b}\\,\\%$  de $${a}$ est égal à $${texNombre(b / 100)}\\times ${a}=${texNombre(b * a / 100)}$.`
    this.reponse = new Decimal(a * b).div(100)
  }
}
