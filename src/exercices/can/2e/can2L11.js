import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureAlgebriqueSauf1, reduireAxPlusB, rienSi1 } from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
export const titre = 'Exprimer une variable en fonction d\'une autre'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '12/01/2023'
export const dateDeModifImportante = '08/06/2024'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
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
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur01 inline nospacebefore'
  // this.compare = fonctionComparaison
  this.nouvelleVersion = function () {
    { const a = randint(-9, 9, 0)
      const b = randint(-5, 9, [0, a, -a])
      const c = randint(-9, 9, 0)
      const var1 = choice(['x', 'z', 'a'])
      const var2 = choice(['b', 'c', 'y'])
      const corr1 = `De la relation $${rienSi1(a)}${var1}${ecritureAlgebriqueSauf1(b)}${var2}=${c}$, on déduit en ajoutant $${rienSi1(-b)}${var2}$ dans chaque membre :
          $${rienSi1(a)}${var1}=${c}${ecritureAlgebrique(-b)}${var2}$`
      const corr2 = ` Puis, en divisant par $${a}$, on obtient : $${var1}=\\dfrac{${c}${ecritureAlgebriqueSauf1(-b)}${var2}}{${a}}$`
      const corr3 = `De la relation $${rienSi1(a)}${var1}${ecritureAlgebriqueSauf1(b)}${var2}=${c}$, on déduit en ajoutant $${rienSi1(-a)}${var1}$ dans chaque membre :
          $${rienSi1(b)}${var2}=${c}${ecritureAlgebriqueSauf1(-a)}${var1}$`
      const corr4 = ` Puis, en divisant par $${b}$, on obtient : $${var2}=\\dfrac{${c}${ecritureAlgebriqueSauf1(-a)}${var1}}{${b}}$`

      if (choice([true, false])) {
        this.question = ` On donne la relation  : $${rienSi1(a)}${var1}${ecritureAlgebriqueSauf1(b)}${var2}=${c}$.<br>
        
        Exprimer $${var1}$ en fonction de $${var2}$.<br>`
        if (a === 1) {
          this.correction = `${corr1}`
        } else if (a > 0) {
          this.correction = `${corr1}<br>`
          this.correction += `${corr2}`
        } else {
          this.correction = `${corr1}<br>`
          this.correction += `${corr2}<br>`
          this.correction += ` que l'on peut écrire également : $${var1}=`
          this.correction += a === -1 ? `${-c}${ecritureAlgebriqueSauf1(b)}${var2}$.` : `\\dfrac{${-c}${ecritureAlgebriqueSauf1(b)}${var2}}{${-a}}$`
        }
        // 08/06/2024 : customCanonical empêche actuellement d'accepter (3x+5)/6 pour (-3x-5)/(-6). Qd ce sera fait, on enlevera un des deux cas ci-dessous (qui seront équivalents).
        this.reponse = { reponse: { value: a < 0 ? `${var1}=${`\\dfrac{${reduireAxPlusB(b, -c, var2)}}{${-a}}`}` : `${var1}=${`\\dfrac{${reduireAxPlusB(-b, c, var2)}}{${a}}`}`, compare: fonctionComparaison, options: { egaliteExpression: true } } }
      } else {
        this.question = ` On donne la relation  : $${rienSi1(a)}${var1}${ecritureAlgebriqueSauf1(b)}${var2}=${c}$.<br>
        
        Exprimer $${var2}$ en fonction de $${var1}$.<br>`
        if (b === 1) {
          this.correction = `${corr3}`
        } else if (b > 0) {
          this.correction = `${corr3}<br>`
          this.correction += `${corr4}`
        } else {
          this.correction = `${corr3}<br>`
          this.correction += `${corr4}`
          this.correction += ` que l'on peut écrire également : $${var2}=`
          this.correction += a === -1 ? `${-c}${ecritureAlgebriqueSauf1(a)}${var1}$.` : `\\dfrac{${-c}${ecritureAlgebriqueSauf1(a)}${var1}}{${-b}}$`
        }
        // 08/06/2024 : customCanonical empêche actuellement d'accepter (3x+5)/6 pour (-3x-5)/(-6). Qd ce sera fait, on enlevera un des deux cas ci-dessous (qui seront équivalents).
        this.reponse = { reponse: { value: b === -1 ? `${var2}=${`${reduireAxPlusB(a, -c, var1)}`}` : `${var2}=${`\\dfrac{${reduireAxPlusB(-a, c, var1)}}{${b}}`}`, compare: fonctionComparaison, options: { egaliteExpression: true } } }
      }
    }
    // Uniformisation : Mise en place de la réponse attendue en interactif en orange et gras
    const textCorrSplit = this.correction.split(':')
    let aRemplacer = textCorrSplit[textCorrSplit.length - 1]
    aRemplacer = aRemplacer.replaceAll('$', '')

    this.correction = ''
    for (let ee = 0; ee < textCorrSplit.length - 1; ee++) {
      this.correction += textCorrSplit[ee] + ':'
    }
    this.correction += ` $${miseEnEvidence(aRemplacer)}$`
    // Fin de cette uniformisation
    this.correction += '.'

    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
