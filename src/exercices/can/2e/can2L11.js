import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureAlgebriqueSauf1, reduireAxPlusB, rienSi1 } from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
import { equalityCompare } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Exprimer une variable en fonction d\'une autre'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '12/01/2023'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can2L11
 * Date de publication
*/

export const uuid = 'b5c9c'
export const ref = 'can2L11'
export const refs = {
  'fr-fr': ['can2L11'],
  'fr-ch': []
}
export default function ExprimerVariable () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.compare = equalityCompare
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur15 inline nospacebefore'
  this.nouvelleVersion = function () {
    { const a = randint(-9, 9, 0)
      const b = randint(-5, 9, [0, a, -a])
      const c = randint(-9, 9, 0)
      const var1 = choice(['x', 'z', 'a'])
      const var2 = choice(['b', 'c', 'y'])
      const corr1 = `De la relation $${rienSi1(a)}${var1}${ecritureAlgebriqueSauf1(b)}${var2}=${c}$, on déduit en ajoutant $${rienSi1(-b)}${var2}$ dans chaque membre :
          $${rienSi1(a)}${var1}=${c}${ecritureAlgebrique(-b)}${var2}$.<br>`
      const corr2 = ` Puis, en divisant par $${a}$, on obtient $${var1}=\\dfrac{${c}${ecritureAlgebriqueSauf1(-b)}${var2}}{${a}}$`
      const corr3 = `De la relation $${rienSi1(a)}${var1}${ecritureAlgebriqueSauf1(b)}${var2}=${c}$, on déduit en ajoutant $${rienSi1(-a)}${var1}$ dans chaque membre :
          $${rienSi1(b)}${var2}=${c}${ecritureAlgebriqueSauf1(-a)}${var1}$.<br>`
      const corr4 = ` Puis, en divisant par $${b}$, on obtient $${var2}=\\dfrac{${c}${ecritureAlgebriqueSauf1(-a)}${var1}}{${b}}$`

      if (choice([true, false])) {
        this.question = ` On donne la relation  : $${rienSi1(a)}${var1}${ecritureAlgebriqueSauf1(b)}${var2}=${c}$.<br>
        
        Exprimer $${var1}$ en fonction de $${var2}$.<br>`
        if (a === 1) {
          this.correction = `${corr1}`
        } else {
          if (a > 0) {
            this.correction = `${corr1}`
            this.correction += `${corr2}.`
          } else {
            this.correction = `${corr1}`
            this.correction += `${corr2}`
            this.correction += ` que l'on peut écrire également $${var1}=\\dfrac{${-c}${ecritureAlgebriqueSauf1(b)}${var2}}{${-a}}$.`
          }
        }

        this.reponse = { reponse: { value: { membre1: { fonction: var1, variable: var1 }, membre2: { fonction: `\\dfrac{${reduireAxPlusB(-b, c, var2)}}{${a}}`, variable: var2 }, strict: true }, compare: equalityCompare } }
      } else {
        this.question = ` On donne la relation  : $${rienSi1(a)}${var1}${ecritureAlgebriqueSauf1(b)}${var2}=${c}$.<br>
        
        Exprimer $${var2}$ en fonction de $${var1}$.<br>`
        if (b === 1) {
          this.correction = `${corr3}`
        } else {
          if (b > 0) {
            this.correction = `${corr3}`
            this.correction += `${corr4}.`
          } else {
            this.correction = `${corr3}`
            this.correction += `${corr4}`
            this.correction += ` que l'on peut écrire également $${var2}=\\dfrac{${-c}${ecritureAlgebriqueSauf1(a)}${var1}}{${-b}}$.`
          }
        }

        this.reponse = { reponse: { value: { membre1: { fonction: var2, variable: var2 }, membre2: { fonction: `\\dfrac{${reduireAxPlusB(-a, c, var1)}}{${b}}`, variable: var1 }, strict: true }, compare: equalityCompare } }
      }
    }

    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
