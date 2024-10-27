import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureParentheseSiNegatif } from '../../../lib/outils/ecritures'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
export const titre = 'Calculer avec un programme de calcul*'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '16/11/2022'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 * ref can2C16
*/

export const uuid = '04048'
export const ref = 'can2C16'
export const refs = {
  'fr-fr': ['can2C16'],
  'fr-ch': []
}
export default function ProgrammeCalcul2 () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  // ${texNombre(ecritureParenthesesSiNegatif(a / 5 - e))}^2=${texNombre((a / 5 - e) * (a / 5 - e))}$
  this.nouvelleVersion = function () {
    let a, b, reponse, f1, f2

    switch (choice([1, 2, 3, 4, 5, 6, 7, 8])) { //, 2, 3, 4, 5, 6, 7, 8
      case 1:// x^2+y^2
        this.formatInteractif = 'calcul'
        a = randint(-5, 5, 0)
        b = randint(-10, 10, [0, a])

        reponse = a ** 2 + b ** 2
        this.question = `Choisir deux nombres puis calculer la somme de leurs carrés.  <br>
      
     Quel résultat obtient-on si on choisit comme nombres $${a}$ et $${b}$ ?`
        this.correction = `$${ecritureParentheseSiNegatif(a)}^2+${ecritureParentheseSiNegatif(b)}^2=${miseEnEvidence(`${reponse}`)}$
      `

        this.reponse = reponse

        break
      case 2:// (x+y)^2
        this.formatInteractif = 'calcul'
        a = randint(-5, 5, 0)
        b = randint(-7, 7, [0, a])

        reponse = (a + b) ** 2
        this.question = `Choisir deux nombres puis calculer le carré de leur somme.  <br>
      
     Quel résultat obtient-on si on choisit comme nombres $${a}$ et $${b}$ ?`
        this.correction = `$(${a}${ecritureAlgebrique(b)})^2=${miseEnEvidence(`${reponse}`)}$
      `

        this.reponse = reponse

        break

      case 3:// 2(x+y)^2
        this.formatInteractif = 'calcul'
        a = randint(-5, 5, 0)
        b = randint(-5, 5, [0, a])

        reponse = 2 * (a + b) ** 2
        this.question = `Choisir deux nombres puis calculer le double du carré de leur somme.  <br>
      
     Quel résultat obtient-on si on choisit comme nombres $${a}$ et $${b}$ ?`
        this.correction = `$2\\times (${a}+${ecritureParentheseSiNegatif(b)})^2=2\\times ${(a + b) ** 2}=${miseEnEvidence(`${reponse}`)}$
      `

        this.reponse = reponse

        break

      case 4:// 2(x*y)et 2*(x+y)
        this.formatInteractif = 'calcul'
        if (choice([true, false])) {
          a = randint(-10, 10, 0)
          b = randint(-5, 5, [0, a])
          reponse = 2 * a * b
          this.question = `Choisir deux nombres puis calculer le double de leur produit.  <br>
      
     Quel résultat obtient-on si on choisit comme nombres $${a}$ et $${b}$ ?`
          this.correction = `$2\\times${ecritureParentheseSiNegatif(a)}\\times ${ecritureParentheseSiNegatif(b)}=${miseEnEvidence(`${reponse}`)}$
      `

          this.reponse = reponse
        } else {
          a = randint(-10, 10, 0)
          b = randint(-10, 10, [0, a, -a])
          reponse = 2 * (a + b)
          this.question = `Choisir deux nombres puis calculer le double de leur somme.  <br>
          
         Quel résultat obtient-on si on choisit comme nombres $${a}$ et $${b}$ ?`
          this.correction = `$2\\times(${a}+${ecritureParentheseSiNegatif(b)})=${miseEnEvidence(`${reponse}`)}$
          `

          this.reponse = reponse
        }

        break

      case 5:// 1/x+1/y
        a = randint(-10, 10, 0)
        b = randint(-4, 4, 0) * a
        f1 = new FractionEtendue(1, a)
        f2 = new FractionEtendue(1, b)
        this.formatInteractif = 'fractionEgale'
        reponse = f1.sommeFraction(f2).simplifie()
        this.question = `Choisir deux nombres puis calculer la somme de leur inverse.  <br>
      
     Quel résultat obtient-on si on choisit comme nombres $${a}$ et $${b}$ ?`
        this.correction = `L'inverse de $${a}$ est : $${f1.texFraction}$ ;<br>
        L'inverse de $${b}$ est : $${f2.texFraction}$ ;<br>
        La somme des inverses est donc : $${f1.texFraction}+${f2.texFraction}=\\dfrac{1\\times${ecritureParentheseSiNegatif(b / a)}}{${a}\\times${ecritureParentheseSiNegatif(b / a)}}+${f2.texFraction}=
        \\dfrac{${(b / a)}}{${b}}+${f2.texFraction}=
        \\dfrac{${(b / a + f2.n)}}{${b}}=
         ${miseEnEvidence(`${reponse.texFractionSimplifiee}`)}$
      `

        this.reponse = reponse

        break

      case 6:// 1/(x+y)
        a = randint(-10, 10, 0)
        b = randint(-10, 10, [0, -a])

        this.formatInteractif = 'fractionEgale'
        reponse = new FractionEtendue(1, a + b)
        this.question = `Choisir deux nombres puis calculer l'inverse de leur somme.  <br>
      
     Quel résultat obtient-on si on choisit comme nombres $${a}$ et $${b}$ ?`
        this.correction = `La somme de $${a}$ et $${b}$ est $${a + b}$. <br>
        Son inverse est : $${miseEnEvidence(`${reponse.texFractionSimplifiee}`)}$.
      `

        this.reponse = reponse

        break

      case 7:// 1/(x+y) avec x fraction
        a = randint(2, 10)
        b = randint(1, 10)
        f1 = new FractionEtendue(1, a)
        this.formatInteractif = 'fractionEgale'
        f2 = new FractionEtendue(1 + b * a, a)
        reponse = new FractionEtendue(a, 1 + b * a)
        this.question = `Choisir deux nombres puis calculer l'inverse de leur somme.  <br>
      
     Quel résultat obtient-on si on choisit comme nombres $${f1.texFraction}$ et $${b}$ ?`
        this.correction = `La somme de $${f1.texFraction}$ et $${b}$ est : $${f1.texFraction}+${b}=${f1.texFraction}+\\dfrac{${b}\\times ${a}}{${a}}=
        ${f1.texFraction}+\\dfrac{${b * a}}{${a}}=${f2.texFraction}$. <br>
        <br>
        Son inverse est : $${miseEnEvidence(`${reponse.texFractionSimplifiee}`)}$.
      `

        this.reponse = reponse

        break

      case 8:// 1/(x+y)^2
        a = randint(-9, 9, 0)
        if (a < 0) { b = randint(-2, 6, [0, -a]) } else { b = randint(-6, 2, [0, -a]) }

        this.formatInteractif = 'fractionEgale'

        reponse = new FractionEtendue(1, (a + b) ** 2)
        this.question = `Choisir deux nombres puis calculer l'inverse du carré de leur somme.  <br>
      
     Quel résultat obtient-on si on choisit comme nombres $${a}$ et $${b}$ ?`
        this.correction = `La somme de $${a}$ et $${b}$ est : $${a + b}$.<br>
        Le carré de cette somme est : $${ecritureParentheseSiNegatif(a + b)}^2=${(a + b) ** 2}$.<br>
        L'inverse de ce carré est :  $${miseEnEvidence(`${reponse.texFractionSimplifiee}`)}$.
      `

        this.reponse = reponse

        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
