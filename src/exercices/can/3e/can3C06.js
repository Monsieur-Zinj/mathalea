import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureParentheseSiNegatif } from '../../../lib/outils/ecritures'
import { abs } from '../../../lib/outils/nombres'
import Exercice from '../../deprecatedExercice.js'
import { randint, calculANePlusJamaisUtiliser } from '../../../modules/outils.js'
export const titre = 'Calculer avec des carrés/priorité opératoire'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDeModifImportante = '08/12/2021'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Créé pendant l'été 2021
 * Référence can3C06
 * Date de publication
*/
export const uuid = '9634b'
export const ref = 'can3C06'
export const refs = {
  'fr-fr': ['can3C06'],
  'fr-ch': []
}
export default function CalculDivers1 () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    let a, b, c
    switch (choice(['a', 'b', 'c', 'd'])) { //
      case 'a':
        a = randint(-5, 5, [0, 1])
        b = randint(2, 9)
        c = randint(-9, 9, 0)
        this.question = `Calculer $${ecritureParentheseSiNegatif(a)}^2-${b}\\times ${ecritureParentheseSiNegatif(c)}$.`
        this.correction = `La multiplication étant prioritaire, on obtient : <br>
        $${ecritureParentheseSiNegatif(a)}^2-${b}\\times ${ecritureParentheseSiNegatif(c)}=${a * a}-${ecritureParentheseSiNegatif(b * c)}=${a * a - b * c}$.`
        this.reponse = calculANePlusJamaisUtiliser(a * a - b * c)
        break
      case 'b':
        a = randint(-10, -1)
        this.question = `Calculer $(${a})^2+${abs(a)}^2$.`
        this.correction = `$(${a})^2+${abs(a)}^2=${a * a}+${a * a}=${2 * a * a}$.`
        this.reponse = calculANePlusJamaisUtiliser(2 * a * a)
        break
      case 'c':
        a = randint(-7, 7, 0)
        b = randint(-7, 7, [0, 1, a])
        this.question = `Calculer $${ecritureParentheseSiNegatif(a)}^2+${ecritureParentheseSiNegatif(b)}^2$.`
        this.correction = `$${ecritureParentheseSiNegatif(a)}^2+${ecritureParentheseSiNegatif(b)}^2=${a * a}+${b * b}=${a * a + b * b}$.`
        this.reponse = calculANePlusJamaisUtiliser(a ** 2 + b ** 2)
        break

      case 'd':
        a = randint(2, 9)
        b = randint(-4, 4, [0, 1])
        c = randint(-9, 9, 0)
        this.question = `Calculer $${a}\\times ${ecritureParentheseSiNegatif(c)}+${ecritureParentheseSiNegatif(b)}^2$.`
        this.correction = `La multiplication étant prioritaire, on obtient : <br> $${a}\\times ${ecritureParentheseSiNegatif(c)}+${ecritureParentheseSiNegatif(b)}^2=${a * c}+${ecritureParentheseSiNegatif(b)}^2=${a * c + b * b}$.`
        this.reponse = calculANePlusJamaisUtiliser(a * c + b * b)
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
