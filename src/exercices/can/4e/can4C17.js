import { choice } from '../../../lib/outils/arrayOutils'
import { randint } from '../../../modules/outils.js'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Simplifier des fractions (cas simples)'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const dateDePublication = '07/09/2023'

/*!
 * @author Gilles Mora
 * Référence can4C17
 */

export const uuid = '471bf'
export const refs = {
  'fr-fr': ['can4C17'],
  'fr-ch': []
}
export default function SimplifierFractionSimple () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur15 inline'
  this.formatInteractif = 'calcul'
  this.nouvelleVersion = function () {
    switch (choice([1, 2, 3])) { // 1, 2, 3, 4, 5, 6
      case 1 :
        {
          const n = randint(-10, 10, 0)
          const d = choice([-1, 1])
          this.reponse = new FractionEtendue(n, d).simplifie()
          this.question = `Écrire le plus simplement possible : $\\dfrac{${n}}{${d}}$.`
          this.correction = `$\\dfrac{${n}}{${d}}=${this.reponse.texFraction}$`
          this.canEnonce = this.question
          this.canReponseACompleter = '' }
        break
      case 2 :{
        const n = randint(-10, 10, 0)
        const d = n * choice([-1, 1])
        this.reponse = new FractionEtendue(n, d).simplifie()
        this.question = `Écrire le plus simplement possible : $\\dfrac{${n}}{${d}}$.`
        this.correction = `$\\dfrac{${n}}{${d}}=${this.reponse.texFraction}$`
        this.canEnonce = this.question
        this.canReponseACompleter = '' }
        break

      case 3 :{
        const d = randint(-10, 10, [-1, 0, 1])
        const n = d * choice([-10, 10])
        this.reponse = new FractionEtendue(n, d).simplifie()
        this.question = `Écrire le plus simplement possible : $\\dfrac{${n}}{${d}}$.`
        this.correction = `$\\dfrac{${n}}{${d}}=${this.reponse.texFraction}$`
        this.canEnonce = this.question
        this.canReponseACompleter = '' }
        break
    }
  }
}
