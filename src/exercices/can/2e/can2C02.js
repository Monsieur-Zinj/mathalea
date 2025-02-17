import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
import { randint, calculANePlusJamaisUtiliser } from '../../../modules/outils.js'
export const titre = 'Calculer une différence de deux carrés'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gille Mora
 * Créé pendant l'été 2021
 * Référence can2C02
 * Date de publication
*/
export const uuid = '76ac6'
export const ref = 'can2C02'
export const refs = {
  'fr-fr': ['can2C02'],
  'fr-ch': []
}
export default function CalculAstucieuxAvecDifferenceCarre () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    const a = randint(15, 40)
    const b = a + 1
    if (choice([true, false])) {
      this.question = `Calculer $${b}^2-${a}^2$.`
      this.correction = `La forme du calcul fait penser à l'identité remarquable :<br> $a^2-b^2=(a+b)(a-b)$.<br>
      En l'utilisant avec $a=${b}$ et $${a}=b$, on obtient : <br>
      $${b}^2-${a}^2=(${b}+${a})(${b}-${a})=${b + a}\\times ${b - a}=${miseEnEvidence(b ** 2 - a ** 2)}$.`
      this.reponse = calculANePlusJamaisUtiliser(b ** 2 - a ** 2)
    } else {
      this.question = `Calculer $${a}^2-${b}^2$.`
      this.correction = `La forme du calcul fait penser à l'identité remarquable :<br> $a^2-b^2=(a-b)(a+b)$.<br>
      En l'utilisant avec $a=${b}$ et $${a}=b$, on obtient : <br>
      $${a}^2-${b}^2=(${a}-${b})(${a}+${b})=${a - b}\\times ${a + b}=${miseEnEvidence(a ** 2 - b ** 2)}$.`
      this.reponse = calculANePlusJamaisUtiliser(a ** 2 - b ** 2)
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
