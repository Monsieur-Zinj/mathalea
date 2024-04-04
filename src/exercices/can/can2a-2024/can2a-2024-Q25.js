import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import { developmentCompare } from '../../../lib/interactif/comparisonFunctions'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Développer avec une identité remarquable'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '7e2a2'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = true
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 ' + KeyboardType.clavierDeBaseAvecFractionPuissanceCrochets
    this.formatInteractif = 'calcul'
    this.compare = developmentCompare
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 'x^2-8x+16'
      this.question = ' Développer $(x-4)^2$.<br>' // (x+a)²
      this.correction = `On utilise l'égalité remarquable $(a-b)^2=a^2-2ab+b^2$ avec $a=x$ et $b=4$.<br>
      $\\begin{aligned}(x-4)^2&=x^2-2 \\times x \\times 4+4^2\\\\
      &=${miseEnEvidence(this.reponse)}\\end{aligned}$`
    } else {
      const inconnue = choice(['x', 'y'])
      const a = randint(1, 9)
      switch (choice([1, 2])) {
        case 1 :
          this.reponse = `${inconnue}^2+${2 * a}${inconnue}+${a * a}`
          this.question = ` Développer $(${inconnue}+${a})^2$.` // (x+a)²
          this.correction = `On utilise l'égalité remarquable $(a+b)^2=a^2+2ab+b^2$ avec $a=${inconnue}$ et $b=${a}$.<br>
      $\\begin{aligned}(${inconnue}+${a})^2&=${inconnue}^2+2 \\times ${a} \\times ${inconnue}+${a}^2\\\\
      &=${miseEnEvidence(this.reponse)}\\end{aligned}$`
          break
        case 2 :
          this.reponse = `${inconnue}^2-${2 * a}${inconnue}+${a * a}`
          this.question = ` Développer $(${inconnue}-${a})^2$.` // (x-a)²
          this.correction = `On utilise l'égalité remarquable $(a-b)^2=a^2-2ab+b^2$ avec $a=${inconnue}$ et $b=${a}$.<br>
      $\\begin{aligned}(${inconnue}-${a})^2&=${inconnue}^2-2 \\times ${a} \\times ${inconnue}+${a}^2\\\\
      &=${miseEnEvidence(this.reponse)}
      \\end{aligned}$`
          break
      }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
