import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureParentheseSiNegatif } from '../../../lib/outils/ecritures'
import { abs } from '../../../lib/outils/nombres'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Résoudre une équation du type $\\dfrac{x+a}{b}=c$'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '04/03/2022'

/**
 *
 * @author Gilles Mora
 * Référence can2L08
*/
export const uuid = 'c1123'
export const ref = 'can2L08'
export const refs = {
  'fr-fr': ['can2L08'],
  'fr-ch': []
}
export default function ResoudreEquationAvecQuotient () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    const a = randint(-10, 10, 0)
    const b = randint(-10, 10, [-1, 0, 1])
    const c = randint(-10, 10, 0)
    switch (choice([1])) {
      case 1 :
        if (!this.interactif) { this.question = ` Résoudre l'équation $\\dfrac{x${ecritureAlgebrique(a)}}{${b}}=${c}$.` } else { this.question = ` Donner la solution de l'équation $\\dfrac{x${ecritureAlgebrique(a)}}{${b}}=${c}$.` }
        this.correction = `On multiplie par $${b}$ chacun des deux membres, puis on`
        if (a > 0) { this.correction += ` retranche $${a}$.<br>` } else { this.correction += ` ajoute $${abs(a)}$.<br>` }
        this.correction += `$\\bullet$  En multipliant par $${b}$, on obtient : <br>
         $x${ecritureAlgebrique(a)}=${c}\\times ${ecritureParentheseSiNegatif(b)}$, soit $x${ecritureAlgebrique(a)}=${c * b}$<br>`
        if (a > 0) {
          this.correction += `$\\bullet$ En retranchant $${a}$, on obtient : <br>
         $x= ${c * b}-${ecritureParentheseSiNegatif(a)}$,`
        } else {
          this.correction += `$\\bullet$ En ajoutant $${abs(a)}$, on obtient : <br>
         $x= ${c * b}+${abs(a)}$,`
        }
        this.correction += ` soit $x=${b * c - a}$. <br><br>
   L'équation a pour solution : $${b * c - a}$.`
        this.reponse = b * c - a
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
