import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
import { obtenirListeFractionsIrreductibles } from '../../../modules/fractions'
import { texNombre } from '../../../lib/outils/texNombre'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Calculer une fraction d\'un entier'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '2a879'
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
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBase
    this.optionsChampTexte = { texteAvant: ' est égal à : ' }
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 24
      this.question = '$\\dfrac{3}{5}$ de $40$ '
      this.correction = ` $\\dfrac{3}{5}$ de $40$ est égal à $\\dfrac{3}{5}\\times 40$.<br><br>
       $\\begin{aligned}
      \\dfrac{3}{5}\\times 40&=3\\times (40\\div 5)\\\\
      &=3\\times 8\\\\
      &=${miseEnEvidence(this.reponse)}
      \\end{aligned}$<br>
     `
    } else {
      const a = choice(obtenirListeFractionsIrreductibles())
      const c = choice([2, 3, 4, 5, 6])
      const b = a.d * c
      this.reponse = a.n * c
      this.question = `$${a.texFraction}$  de $${b}$`
      this.correction = ` $${a.texFraction}$ de $${b}$ est égal à $${a.texFraction}\\times ${b}$.<br><br>
       $\\begin{aligned}
       ${a.texFraction}\\times ${b}&=${a.n}\\times (${b}\\div ${a.d})\\\\
      &=${a.n}\\times ${texNombre(b / a.d, 0)}\\\\
      &=${miseEnEvidence(this.reponse)}
      \\end{aligned}$<br>
     `
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
