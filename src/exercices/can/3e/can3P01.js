import { ecritureParentheseSiNegatif, reduireAxPlusB } from '../../../lib/outils/ecritures'
import { sp } from '../../../lib/outils/outilString.js'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Utiliser la proportionnalité sur une expression algébrique'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '25/10/2021'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can3L05
 * Date de publication
*/
export const uuid = '9734b'
export const ref = 'can3P01'
export const refs = {
  'fr-fr': ['can3P01'],
  'fr-ch': []
}
export default function ProportionnaliteExpressionAlgebrique () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    const a = randint(-3, 3, 0)
    const b = randint(-5, 5, 0)
    const c = randint(-5, 5, 0)
    const n = randint(-7, -1)

    this.question = `Si ${sp(1)}  $${reduireAxPlusB(a, b)}=${c}$, quelle est la valeur de  ${sp(1)} $${reduireAxPlusB(n * a, n * b)}$ ?
      
      `
    this.correction = `Comme ${sp(1)} $${reduireAxPlusB(n * a, n * b)}=${n}\\times (${reduireAxPlusB(a, b)})$, <br>
     alors${sp(1)}
      $${reduireAxPlusB(n * a, n * b)}=${n}\\times ${ecritureParentheseSiNegatif(c)}=${n * c}$`

    this.reponse = n * c
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
