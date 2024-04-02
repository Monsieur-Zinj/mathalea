import { choice } from '../../../lib/outils/arrayOutils'
import { deprecatedTexFraction, obtenirListeFractionsIrreductibles } from '../../../lib/outils/deprecatedFractions.js'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
import { randint } from '../../../modules/outils.js'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Calculer un nombre connaissant son inverse'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '10/11/2022'
/*!
 * @author Gilles Mora
 * Référence can2C15
*/

export const uuid = 'd9488'
export const ref = 'can2C15'
export const refs = {
  'fr-fr': ['can2C15'],
  'fr-ch': []
}
export default function NombreInverse () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur15 inline'
  this.formatInteractif = 'fractionEgale'
  this.nouvelleVersion = function () {
    const maFraction = choice(obtenirListeFractionsIrreductibles())
    const a = randint(1, 4)
    const b = maFraction[0]
    const c = maFraction[1]
    const d = new FractionEtendue(a * c + b, c)
    const e = new FractionEtendue(a * c - b, c)
    const listeNom = ['R', 'x', 'y', 'T', 'z', 'U', 'A', 'B', 'C']
    const Nom = choice(listeNom)
    if (choice([true, false])) {
      this.reponse = new FractionEtendue(a * c + b, c).inverse()
      this.question = `Calculer $${Nom}$  sachant que : <br>
     $\\dfrac{1}{${Nom}}=${a}+${deprecatedTexFraction(b, c)}$`
      this.correction = `$\\dfrac{1}{${Nom}}=${a}+${deprecatedTexFraction(b, c)} = \\dfrac{${a} \\times ${c}}{${c}} + \\dfrac{${b}}{${c}} = \\dfrac{${a * c}}{${c}} + \\dfrac{${b}}{${c}}  =${d.texFraction}$<br><br>
    Ainsi $${Nom}=${miseEnEvidence(`${d.inverse().texFraction}`)}$.`
      this.canEnonce = `$\\dfrac{1}{${Nom}}=${a}+${deprecatedTexFraction(b, c)}$`// 'Compléter'
      this.canReponseACompleter = `$${Nom}=\\ldots$`
    } else {
      this.reponse = new FractionEtendue(a * c - b, c).inverse()
      this.question = `Calculer $${Nom}$  sachant que : <br>
         $\\dfrac{1}{${Nom}}=${a}-${deprecatedTexFraction(b, c)}$`
      this.correction = `$\\dfrac{1}{${Nom}}=${a}-${deprecatedTexFraction(b, c)} = \\dfrac{${a} \\times ${c}}{${c}} - \\dfrac{${b}}{${c}} = \\dfrac{${a * c}}{${c}} - \\dfrac{${b}}{${c}}  =${e.texFraction}$<br><br>
        Ainsi $${Nom}=${miseEnEvidence(`${e.inverse().texFraction}`)}$.`
      this.canEnonce = `$\\dfrac{1}{${Nom}}=${a}-${deprecatedTexFraction(b, c)}$`// 'Compléter'
      this.canReponseACompleter = `$${Nom}=\\ldots$`
    }
  }
}
