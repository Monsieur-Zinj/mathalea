import { choice } from '../../../lib/outils/arrayOutils'
import { simplificationDeFractionAvecEtapes } from '../../../lib/outils/deprecatedFractions.js'
import {
  ecritureAlgebrique,
  ecritureParentheseSiNegatif,
  reduireAxPlusB,
  reduirePolynomeDegre3, rienSi1
} from '../../../lib/outils/ecritures'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
import Decimal from 'decimal.js'
import { fraction } from '../../../modules/fractions.js'
export const titre = 'Déterminer une équation de l’axe de symétrie d’une parabole'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '15/06/2022'

/**
 *
 * @author Gilles Mora
 * Référence can1F07
*/
export const uuid = '5b203'
export const ref = 'can1F07'
export const refs = {
  'fr-fr': ['can1F07'],
  'fr-ch': []
}
export default function AxeSymetrieParabole () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    let a, x1, x2, somme, moinsb, b, c, maFraction, alpha, beta
    switch (choice([1, 2, 3])) {
      case 1:// forme factorisée
        a = randint(-9, 9, 0)
        x1 = randint(-9, 9)
        x2 = randint(-9, 9, [0, x1])
        somme = new Decimal(x1 + x2)
        if (x1 === 0) {
          this.question = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par :
      $f(x)=${rienSi1(a)}x(${reduireAxPlusB(1, -x2)})$. <br>
      
      `
        } else {
          this.question = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par :
      $f(x)=${rienSi1(a)}(${reduireAxPlusB(1, -x1)})(${reduireAxPlusB(1, -x2)})$. <br>
      
      `
        }

        this.question += 'Donner une équation de l\'axe de symétrie de la parabole représentant $f$.'

        this.correction = `$f$ est une fonction polynôme du second degré écrite sous forme factorisée $a(x-x_1)(x-x_2)$.<br>
    Les racines sont donc $x_1=${x1}$ et $x_2=${x2}$.<br>
    L'axe de symétrie a pour équation $x=\\dfrac{x_1+x_2}{2}$. <br>
    On obtient alors  $x=\\dfrac{${x1}+${ecritureParentheseSiNegatif(x2)}}{2}$, soit $x=\\dfrac{${x1 + x2}}{2}$ ou encore $x=${texNombre((x1 + x2) / 2, 1)}$. `
        if (x1 + x2 < 0) {
          this.reponse = [`x=${somme.div(2)}`, `x=\\dfrac{${somme}}{2}`, `x+\\dfrac{${-somme}}{2}=0`, `x+${-somme.div(2)}=0`]
        } else { this.reponse = [`x=${somme.div(2)}`, `x=\\dfrac{${somme}}{2}`, `x-\\dfrac{${somme}}{2}=0`, `x-${somme.div(2)}=0`] }
        break

      case 2:// forme développée
        a = randint(-3, 3, 0)
        b = randint(-9, 9)
        c = randint(-10, 10)
        moinsb = new Decimal(-b)
        maFraction = fraction(-b, 2 * a)
        this.question = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par :
      $f(x)=${reduirePolynomeDegre3(0, a, b, c)}$. <br>
      
      `

        this.question += 'Donner une équation de l\'axe de symétrie de la parabole représentant $f$.'

        this.correction = `$f$ est une fonction polynôme du second degré écrite sous forme développée $ax^2+bx+c$.<br>
    Le sommet de la parabole a pour abscisse $-\\dfrac{b}{2a}$.<br>
        L'axe de symétrie a donc pour équation $x=-\\dfrac{b}{2a}$. <br>
    On obtient alors  $x=-\\dfrac{${b}}{2\\times ${ecritureParentheseSiNegatif(a)}}$, soit $x=\\dfrac{${-b}}{${2 * a}}${simplificationDeFractionAvecEtapes(-b, 2 * a)}$. `
        if (moinsb.div(2 * a) < 0) {
          this.reponse = [`x=${moinsb.div(2 * a)}`, `x=\\dfrac{${moinsb}}{${2 * a}}`,
          `x+${moinsb.div(-2 * a)}=0`, `x+\\dfrac{${moinsb}}{${-2 * a}}=0`, `x=${maFraction.texFraction}`, `x+${-maFraction.texFraction}=0`]
        } else {
          this.reponse = [`x=${moinsb.div(2 * a)}`, `x=\\dfrac{${moinsb}}{${2 * a}}`, `x-\\dfrac{${moinsb}}{${2 * a}}=0`,
         `x-${moinsb.div(2 * a)}=0`, `x=${maFraction.texFraction}`, `x-${maFraction.texFraction}=0`]
        }
        break

      case 3:// forme canonique
        a = randint(-9, 9, 0)
        alpha = randint(-9, 9)
        beta = randint(-10, 10)

        this.question = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par :
      $f(x)=${rienSi1(a)}(x${ecritureAlgebrique(-alpha)})^2${ecritureAlgebrique(beta)}$. <br>
      
      `

        this.question += 'Donner une équation de l\'axe de symétrie de la parabole représentant $f$.'

        this.correction = `$f$ est une fonction polynôme du second degré écrite sous forme canonique $a(x-\\alpha)^2+\\beta$.<br>
        L'axe de symétrie a pour équation $x=\\alpha$. <br>
    On obtient alors  $x=${alpha}$. `

        this.reponse = [`x=${alpha}`,
          `x${ecritureAlgebrique(-alpha)}=0`]
        break
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
