import { choice } from '../../../lib/outils/arrayOutils'
import { rienSi1 } from '../../../lib/outils/ecritures'
import { arrondi } from '../../../lib/outils/nombres'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
import { factorisationCompare } from '../../../lib/interactif/comparisonFunctions'
import { fraction } from '../../../modules/fractions'
export const titre = 'Réduire une expression avec une fraction'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '08/12/2022'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can3L06
 * Date de publication
*/

export const uuid = '3cf30'
export const ref = 'can3L06'
export const refs = {
  'fr-fr': ['can3L06'],
  'fr-ch': []
}
export default function ReduireAvecFraction () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.compare = factorisationCompare
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur01 inline'
  this.nouvelleVersion = function () {
    const couplend = choice([[1, 2], [3, 2], [5, 2], [7, 2], [1, 3], [2, 3], [4, 3], [5, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [3, 8], [5, 8], [7, 8], [2, 9], [4, 9], [5, 9], [7, 9], [8, 9], [3, 10], [7, 10], [9, 10]]) // n et m sont premiers entre eux
    const n = couplend[0]
    const d = couplend[1]
    const a = randint(1, 9)
    const frac = fraction(n, d).texFraction
    const frac2 = fraction(a * d, d).texFraction
    const decompo = `\\dfrac{${a}\\times${d}}{${d}}`
    const frac10 = `\\dfrac{x}{${d}}`

    switch (choice([1, 2, 3, 4])) { //, 2, 3, 4
      case 1 : {
        const frac3 = fraction(n + a * d, d).texFraction
        if (choice([true, false])) {
          this.question = ` Réduire l'expression : $${frac}x+${rienSi1(a)}x$.`
          this.correction = `$${frac}x+${rienSi1(a)}x=${frac}x+${decompo}x=${frac}x+${frac2}x=\\dfrac{${n}+${a * d}}{${d}}x=${frac3}x$`
        } else {
          this.question = ` Réduire l'expression : $${rienSi1(a)}x+${frac}x$.`
          this.correction = `$${rienSi1(a)}x+${frac}x=${decompo}x+${frac}x=${frac2}x+${frac}x=\\dfrac{${a * d}+${n}}{${d}}x=${frac3}x$`
        }
        this.reponse = `\\frac{${n + a * d}}{${d}}x`
      }
        break
      case 2 :
        if (choice([true, false])) {
          const frac4 = fraction(n - a * d, d).texFraction
          this.question = ` Réduire l'expression : $${frac}x-${rienSi1(a)}x$.`
          this.correction = `$${frac}x-${rienSi1(a)}x=${frac}x-${decompo}x=${frac}x-${frac2}x=\\dfrac{${n}-${a * d}}{${d}}x=${frac4}x$`
          this.reponse = [`${n - a * d < 0 ? '-' : ''}\\frac{${Math.abs(n - a * d)}}{${d}}x`, `\\frac{${n - a * d}}{${d}}x`, `${arrondi((n - a * d) / d, 2)}x`, `${n - a * d}x\\div${d} `]
        } else {
          const frac5 = fraction(a * d - n, d).texFraction
          this.question = ` Réduire l'expression : $${rienSi1(a)}x-${frac}x$.`
          this.correction = `$${rienSi1(a)}x-${frac}x=${decompo}x-${frac}x=${frac2}x-${frac}x=\\dfrac{${a * d}-${n}}{${d}}x=${frac5}x$`
          this.reponse = `\\frac{${a * d - n}}{${d}}x`
        }
        break

      case 3 : {
        const frac6 = `\\dfrac{${1 + a * d}}{${d}}`
        const frac7 = `\\dfrac{${1 + a * d}x}{${d}}`
        if (choice([true, false])) {
          this.question = ` Réduire l'expression : $${frac10}+${rienSi1(a)}x$.`
          this.correction = `$${frac10}+${rienSi1(a)}x=${frac10}+\\dfrac{${rienSi1(a)}x\\times ${d}}{${d}}=${frac10}+\\dfrac{${a * d}x}{${d}}=\\dfrac{x+${a * d}x}{${d}}=${frac7}=${frac6}x$`
        } else {
          this.question = ` Réduire l'expression : $${rienSi1(a)}x+${frac10}$.`
          this.correction = ` $${rienSi1(a)}x+${frac10}=\\dfrac{${rienSi1(a)}x\\times ${d}}{${d}}+${frac10}=\\dfrac{${a * d}x}{${d}}+${frac10}=\\dfrac{${a * d}x+x}{${d}}=${frac7}=${frac6}x$`
        }
        this.reponse = `\\frac{${1 + a * d}}{${d}}x`
      }
        break

      case 4 : {
        const frac8 = `\\dfrac{${a * d}x}{${d}}`
        if (choice([true, false])) {
          this.question = ` Réduire l'expression : $${frac10}-${rienSi1(a)}x$.`
          this.correction = `$${frac10}-${rienSi1(a)}x=${frac10}-\\dfrac{${rienSi1(a)}x\\times ${d}}{${d}}=${frac10}-${frac8}=\\dfrac{x-${a * d}x}{${d}}=\\dfrac{${1 - a * d}x}{${d}}=\\dfrac{${1 - a * d}}{${d}}x$`
          this.reponse = [`${1 - a * d < 0 ? '-' : ''}\\frac{${Math.abs(1 - a * d)}}{${d}}x`, `\\frac{${1 - a * d}}{${d}}x`, `${arrondi((1 - a * d) / d, 2)}x`, `${1 - a * d}x\\div${d}`]
        } else {
          this.question = ` Réduire l'expression : $${rienSi1(a)}x-${frac10}$.`
          this.correction = ` $${rienSi1(a)}x-${frac10}=\\dfrac{${rienSi1(a)}x\\times ${d}}{${d}}-${frac10}=${frac8}-${frac10}=\\dfrac{${a * d}x-x}{${d}}=\\dfrac{${a * d - 1}x}{${d}}=\\dfrac{${a * d - 1}}{${d}}x$`
          this.reponse = `\\frac{${a * d - 1}}{${d}}x`
        }
      }
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
