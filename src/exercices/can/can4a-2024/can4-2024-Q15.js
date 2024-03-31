import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import FractionEtendue from '../../../modules/FractionEtendue'
import { choice } from '../../../lib/outils/arrayOutils'
import { obtenirListeFractionsIrreductibles } from '../../../modules/fractions'
import { pgcd } from '../../../lib/outils/primalite'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { equalFractionCompare } from '../../../lib/interactif/comparisonFunctions'

export const titre = 'Additionner deux fractions de dénominateurs comptatibles'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '60909'
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
    this.canOfficielle = true
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new FractionEtendue(7, 6).texFraction
      this.question = '$\\dfrac{5}{6}+\\dfrac{1}{3}$ '
      this.correction = `Pour additionner les fractions, on les met au même dénominateur. <br>
      $\\begin{aligned}
      \\dfrac{5}{6}+\\dfrac{1}{3}=& \\dfrac{5}{6}+\\dfrac{2}{6}
      &=${miseEnEvidence(this.reponse)}
      \\end{aligned}$`
    } else {
      const a = choice(obtenirListeFractionsIrreductibles())
      const c = choice([2, 4])
      const b = new FractionEtendue(1, a.d * c)
      this.reponse = a.sommeFraction(b).simplifie().texFraction
      this.question = `Calculer $${a.texFraction} + ${b.texFraction}$`
      this.correction = `Pour additionner des fractions, on les met au même dénominateur.<br>
     <br>
     Pour écrire $${a.texFraction}$ avec le même dénominateur que $${b.texFraction}$,
     on multiplie son numérateur et son dénominateur par $${c}$.<br><br>
     $\\begin{aligned}
     ${a.texFraction} + ${b.texFraction}=& \\dfrac{${a.n}\\times ${c}}{${a.d}\\times ${c}}+ ${b.texFraction}\\\\
     &=${a.reduire(c).texFraction} + ${b.texFraction}\\\\
     &=\\dfrac{${a.n * c}+${b.n}}{${b.d}}\\\\
     &=${miseEnEvidence(`\\dfrac{${a.n * c + b.n}}{${b.d}}`)}
     ${pgcd(a.n * c + b.n, b.d) === 1 ? '' : `\\\\&${a.sommeFraction(b).texSimplificationAvecEtapes()}`}    
     \\end{aligned}$`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    if (this.interactif) {
      this.question += '$=$'
    }
  }
}
