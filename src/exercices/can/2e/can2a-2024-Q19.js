import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { numberCompare } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Calculer avec une puissance'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '60d7b'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBase
    this.formatInteractif = 'fillInTheBlank'
    this.compare = numberCompare
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.question = '$\\left(2^3\\right)^4=2^{\\ldots}$'
      if (this.interactif) {
        this.question = '\\left(2^3\\right)^4=2^{%{champ1}}'
      }
      this.reponse = '12'
      this.correction = `On utilise la formule $\\left(a^n\\right)^p=a^{n\\times p}$
        avec $a=2$,  $n=3$ et $p=4$.<br>
        $\\left(2^3\\right)^4 =2^{3\\times 4}=2^{${miseEnEvidence(this.reponse)}}$`
      this.canEnonce = '$\\left(2^3\\right)^4$'
      this.canReponseACompleter = ' $2^{\\ldots}$'
    } else {
      let a, p, s, n
      switch (choice(['a', 'b'])) { //, 'b', 'c', 'd', 'e', 'f'
        case 'a':
          a = randint(2, 3)
          n = randint(2, 5)
          p = randint(2, 5)
          s = n + p
          this.reponse = s.toString()
          if (this.interactif) {
            this.question = `\\text{Écrire sous la forme d'une puissance de }${a}\\quad :\\quad ${a}^{${n}}\\times ${a}^{${p}}=${a}^{%{champ1}}`
          } else {
            this.question = `Écrire sous la forme d'une puissance de $${a}$ :<br> $${a}^{${n}}\\times ${a}^{${p}}$`
          }
          this.correction = `On utilise la formule $a^n\\times a^m=a^{n+m}$ avec $a=${a}$, $n=${n}$ et $p=${p}$.<br>
            $${a}^{${n}}\\times ${a}^{${p}}=${a}^{${n}+${p}}=${a}^{${miseEnEvidence(s)}}$`

          break

        case 'b':
          a = randint(2, 3)
          p = randint(2, 5)
          n = randint(2, 4, p)
          s = n * p
          this.reponse = s.toString()
          if (this.interactif) {
            this.question = `\\text{Écrire sous la forme d'une puissance de }${a}\\quad :\\quad \\left(${a}^{${n}}\\right)^{${p}}=${a}^{%{champ1}}`
          } else {
            this.question = `Écrire sous la forme d'une puissance de $${a}$ :<br>
            $\\left(${a}^{${n}}\\right)^{${p}}$`
          }

          this.correction = `On utilise la formule $\\left(a^n\\right)^p=a^{n\\times p}$
            avec $a=${a}$,  $n=${n}$ et $p=${p}$.<br>
            $\\left(${a}^{${n}}\\right)^{${p}}=${a}^{${n}\\times ${p}}=${a}^{${miseEnEvidence(s)}}$`

          break
      }
      this.canEnonce = this.question// 'Compléter'
      this.canReponseACompleter = ''
    }
  }
}
