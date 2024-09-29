import { ecritureAlgebrique, ecritureAlgebriqueSauf1, reduireAxPlusB } from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Déterminer une forme canonique'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '07/06/2022'

/**
 *
 * @author Gilles Mora repris de 1E11-3 de Stéphane
 * Référence can1L06
*/
export const uuid = 'd1ad9'
export const ref = 'can1L06'
export const refs = {
  'fr-fr': ['can1L06'],
  'fr-ch': []
}
export default function FormeCanonique () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur01 inline'
  this.nouvelleVersion = function () {
    const alpha = randint(-3, 3, [0])
    const beta = randint(-5, 5, [0])
    const b = -2 * alpha
    const c = alpha * alpha + beta
    if (c !== 0) {
      if (!this.interactif) {
        this.question = `Soit $f(x)= x^2${ecritureAlgebriqueSauf1(b)}x${ecritureAlgebrique(c)}$.<br>

       Donner la forme canonique de $f(x)$.`
      } else {
        this.question = `Soit $f(x)= x^2${ecritureAlgebriqueSauf1(b)}x${ecritureAlgebrique(c)}$.<br>

        La forme canonique de $f(x)$ est : $f(x)=$`
      }
    } else {
      if (!this.interactif) {
        this.question = `Soit
        $f(x)= x^2${ecritureAlgebriqueSauf1(b)}x$.<br>

        Donner la forme canonique de $f(x)$.`
      } else {
        this.question = `Soit
        $f(x)= x^2${ecritureAlgebriqueSauf1(b)}x$.<br>
        
       La forme canonique de $f(x)$ est : $f(x)=$`
      }
    }

    this.correction = 'La forme canonique est donnée par : $f(x)=a(x-\\alpha)^2+\\beta$.'

    this.correction += `<br> On a $a=1$, et on reconnaît dans $x^2${ecritureAlgebriqueSauf1(b)}x${ecritureAlgebrique(c)}$, le début du carré de $(${reduireAxPlusB(1, -alpha)})^2$.`
    this.correction += `<br>On peut donc écrire :  $\\underbrace{x^2${ecritureAlgebriqueSauf1(b)}x}_{(${reduireAxPlusB(1, -alpha)})^2-${(-alpha) ** 2}}${ecritureAlgebrique(c)}
    =(${reduireAxPlusB(1, -alpha)})^2-${(-alpha) ** 2}${ecritureAlgebrique(c)}$.`
    this.correction += '<br>Soit : $f(x)='
    this.correction += `(x ${ecritureAlgebrique(-alpha)})^2${ecritureAlgebrique(beta)}$`
    this.reponse = [`(x${ecritureAlgebrique(b / 2)})^2${ecritureAlgebrique(beta)}`, `${beta}+(x${ecritureAlgebrique(b / 2)})^2`]
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
