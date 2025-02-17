import { choice } from '../../../lib/outils/arrayOutils'
import { simplificationDeFractionAvecEtapes } from '../../../lib/outils/deprecatedFractions.js'
import { fraction, obtenirListeFractionsIrreductibles } from '../../../modules/fractions.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Calculer la différence de fractions à dénominateurs compatibles'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can4C07
 */
export const uuid = 'da898'
export const ref = 'can4C07'
export const refs = {
  'fr-fr': ['can4C07'],
  'fr-ch': []
}
export default function DifferenceFractionsCompatibles () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.formatInteractif = 'fractionEgale'
  this.nouvelleVersion = function () {
    const a = choice(obtenirListeFractionsIrreductibles())
    const c = choice([2, 3])
    const b = fraction(1, a.d * c)
    this.question = `Calculer $${a.texFraction} - ${b.texFraction}$.`
    this.correction = `Pour soustraire des fractions, on les met au même dénominateur.<br>
    <br>
    Pour écrire $${a.texFraction}$ avec le même dénominateur que $${b.texFraction}$,
    on multiplie son numérateur et son dénominateur par $${c}$.<br><br>
    Ainsi,
    $${a.texFraction} - ${b.texFraction}=
   \\dfrac{${a.n}\\times ${c}}{${a.d}\\times ${c}}- ${b.texFraction}
    =${a.reduire(c).texFraction} - ${b.texFraction}=\\dfrac{${a.n * c}-${b.n}}{${b.d}}=\\dfrac{${a.n * c - b.n}}{${b.d}}${simplificationDeFractionAvecEtapes(a.n * c - b.n, b.d)}$`
    this.reponse = a.differenceFraction(b).simplifie()
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
