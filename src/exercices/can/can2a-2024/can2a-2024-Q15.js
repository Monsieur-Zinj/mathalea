import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import { arrondi } from '../../../lib/outils/nombres'
import { texNombre } from '../../../lib/outils/texNombre'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Calculer avec des puissances de 10'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '847a9'
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
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecFraction
    this.optionsChampTexte = { texteAvant: ' $=$' }
    this.formatInteractif = 'calcul'
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = '100.1'
      this.question = '$10^{-1}+10^{2}$'
      this.correction = `$\\begin{aligned}
      10^{-1}+10^{2}&=${texNombre(0.1)} +${texNombre(100)}\\\\
      &=${miseEnEvidence(texNombre(100.1))}
      \\end{aligned}$`
    } else {
      const n1 = randint(2, 4)
      const n2 = randint(-3, 0)
      const choix = choice([true, false])
      this.reponse = arrondi(10 ** n1 + 10 ** n2, 3)
      this.question = `${choix ? `$10^{${n1}}+10^{${n2}}$ ` : `$10^{${n2}}+10^{${n1}}$ `}`
      this.correction = `$\\begin{aligned}
      ${choix ? `10^{${n1}}+10^{${n2}}&=${texNombre(10 ** n1, 0)} +${texNombre(10 ** n2, 3)}` : `10^{${n2}}+10^{${n1}}&=${texNombre(10 ** n2, 3)} +${texNombre(10 ** n1, 0)}`}\\\\
      &=${miseEnEvidence(texNombre(this.reponse, 3))}
      \\end{aligned}$`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
