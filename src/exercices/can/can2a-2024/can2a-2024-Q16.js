import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import { ecritureAlgebrique } from '../../../lib/outils/ecritures'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Résoudre une équation'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '0e09a'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 ' + KeyboardType.clavierDeBaseAvecFraction
    this.formatInteractif = 'calcul'
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 4
      this.question = 'Solution de  l\'équation $2x-3=5$<br>'
      this.correction = `On procède par étapes successives :<br>
    On commence par isoler $2x$ dans le membre de gauche en ajoutant
    $3$ dans chacun des membres, puis on divise
    par $2$ pour obtenir la solution : <br>
     $\\begin{aligned}
     2x-3&=5\\\\
    2x&=5+3\\\\
    2x&=8\\\\
    x&=\\dfrac{8}{2}\\\\
    x&=4
    \\end{aligned}$<br>
    La solution de l'équation est : $${miseEnEvidence('4')}$.
    `
    } else {
      const a = randint(-5, 5, [0, -1, 1])
      this.reponse = randint(-9, 9, [-1, 0, 1])
      const c = randint(-9, 9, [0])
      const b = c - a * this.reponse
      this.question = `Solution de l'équation $${a}x${ecritureAlgebrique(b)}=${c}$`
      this.correction = `On procède par étapes successives :<br>
      On commence par isoler $${a}x$ dans le membre de gauche en ajoutant
      $${ecritureAlgebrique(-b)}$ dans chacun des membres, puis on divise
      par $${a}$ pour obtenir la solution : <br>
       $\\begin{aligned}
       ${a}x${ecritureAlgebrique(b)}&=${c}\\\\
      ${a}x&=${c}${ecritureAlgebrique(-b)}\\\\
      ${a}x&=${c - b}\\\\
      x&=\\dfrac{${c - b}}{${a}}\\\\
      x&=${this.reponse}
      \\end{aligned}$<br>
      La solution de l'équation est : $${miseEnEvidence(this.reponse)}$.
      `
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
