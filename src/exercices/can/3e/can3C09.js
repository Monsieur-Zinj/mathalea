import { choice } from '../../../lib/outils/arrayOutils'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Calculer avec une racine carrée'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 * Date de publication
*/
export const uuid = 'a2d6a'
export const ref = 'can3C09'
export const refs = {
  'fr-fr': ['can3C09'],
  'fr-ch': []
}
export default function CalculAvecRacineCarree1 () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur15 inline'
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    let d
    const a = randint(2, 10)
    const b = randint(2, 10)
    const c = randint(1, 10)
    d = randint(1, 10)
    while (c === d) { d = randint(1, 10) }
    if (choice([true, false])) {
      this.question = `Calculer $${a}\\sqrt{${c ** 2}}+${b}\\sqrt{${d ** 2}}$.`
      this.correction = `$\\sqrt{${c ** 2}}=${c}$ et $\\sqrt{${d ** 2}}=${d}$, ainsi:<br>
       $${a}\\sqrt{${c ** 2}}+${b}\\sqrt{${d ** 2}}=${a}\\times ${c}+${b}\\times ${d}=${a * c + b * d}$`
      this.reponse = a * c + b * d
    } else {
      this.question = `Calculer $${a}\\sqrt{${c ** 2}}-${b}\\sqrt{${d ** 2}}$.`
      this.correction = `$\\sqrt{${c ** 2}}=${c}$ et $\\sqrt{${d ** 2}}=${d}$, ainsi:<br>
       $${a}\\sqrt{${c ** 2}}-${b}\\sqrt{${d ** 2}}=${a}\\times ${c}-${b}\\times ${d}=${a * c - b * d}$`
      this.reponse = a * c - b * d
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
