import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
import FractionEtendue from '../../../modules/FractionEtendue'
import { obtenirListeFractionsIrreductibles } from '../../../modules/fractions'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { equalFractionCompare } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Soustraire deux fractions'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '50e11'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction
    this.formatInteractif = 'calcul'
    this.compare = equalFractionCompare
    this.optionsChampTexte = { texteAvant: ' $=$' }
    this.canOfficielle = true
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new FractionEtendue(3, 35)
      this.question = '$\\dfrac{13}{35}-\\dfrac{2}{7}$    '
      this.correction = `Pour soustraire des fractions, on les met au même dénominateur.<br>
      Ainsi, <br><br>
      $\\begin{aligned}
      \\dfrac{13}{35}-\\dfrac{2}{7}&=\\dfrac{13}{35}-\\dfrac{10}{35}\\\\
      &=${miseEnEvidence(this.reponse)}
      \\end{aligned}$`
    } else {
      const a = choice(obtenirListeFractionsIrreductibles())
      const c = choice([2, 4])
      const b = new FractionEtendue(1, a.d * c)
      this.reponse = new FractionEtendue(a.n * c - b.n, b.d)
      if (choice([true, false])) {
        this.question = `$${a.texFraction} - ${b.texFraction}$
       `
        this.correction = `Pour soustraire des fractions, on les met au même dénominateur.<br>
       Ainsi, <br><br>
       $\\begin{aligned}
       ${a.texFraction} - ${b.texFraction}
       &=\\dfrac{${a.n}\\times ${c}}{${a.d}\\times ${c}}- ${b.texFraction}\\\\
      &=${a.reduire(c).texFraction} - ${b.texFraction}\\\\
      &=\\dfrac{${a.n * c}-${b.n}}{${b.d}}\\\\
      &=${miseEnEvidence(this.reponse)}${this.reponse.texSimplificationAvecEtapes()}
      \\end{aligned}$<br>
      Par conséquent, $ ${a.texFraction}-${b.texFraction}= ${miseEnEvidence(new FractionEtendue(a.n * c - b.n, b.d).simplifie().texFraction)}$.`
      } else {
        this.reponse = new FractionEtendue(b.n - a.n * c, b.d)
        this.question = `$ ${b.texFraction}-${a.texFraction}$`
        this.correction = `Pour soustraire des fractions, on les met au même dénominateur.
       <br>
       Ainsi, <br><br>$\\begin{aligned} ${b.texFraction}-${a.texFraction}
       &= ${b.texFraction}-\\dfrac{${a.n}\\times ${c}}{${a.d}\\times ${c}}\\\\
      &=${b.texFraction}-${a.reduire(c).texFraction}\\\\
      &=\\dfrac{${b.n}-${a.n * c}}{${b.d}}\\\\
      &=${miseEnEvidence((this.reponse).texFraction)}${this.reponse.texSimplificationAvecEtapes()}
      \\end{aligned}$<br>
      Par conséquent, $ ${b.texFraction}-${a.texFraction}= ${miseEnEvidence(new FractionEtendue(b.n - a.n * c, b.d).simplifie().texFraction)}$.`
      }
    }
    this.reponse = this.reponse.texFraction
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
