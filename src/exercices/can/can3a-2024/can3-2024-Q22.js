import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { sp } from '../../../lib/outils/outilString'
import { shuffle } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Déterminer une médiane'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '3d45e'
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
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 16
      this.question = `$10$ ${sp(1)};${sp(1)}$16$${sp(1)};${sp(1)}$5$${sp(1)};${sp(1)}$18$${sp(1)};${sp(1)}$27$<br>
      La médiane de cette série est : `
      this.correction = `On ordonne la série :  $5$ ${sp(1)};${sp(1)}$10$${sp(1)};${sp(1)}$16$${sp(1)};${sp(1)}$18$${sp(1)};${sp(1)}$27$.<br>
       La série comporte $5$ valeurs donc la médiane est la troisième valeur : $${miseEnEvidence(this.reponse)}$.`
    } else {
      const med = randint(10, 15)
      const val1 = randint(2, 6)
      const val2 = randint(7, 9)
      const val3 = randint(16, 20)
      const val4 = randint(21, 25)
      const valeurs = shuffle([val1, val2, val3, val4, med])
      this.reponse = med

      this.question = `$${valeurs[0]}$ ${sp(1)};${sp(1)}$${valeurs[1]}$${sp(1)};${sp(1)}$${valeurs[2]}$${sp(1)};${sp(1)}$${valeurs[3]}$${sp(1)};${sp(1)}$${valeurs[4]}$<br>
      La médiane de cette série est : `
      this.correction = `On ordonne la série :  $${val1}$ ${sp(1)};${sp(1)}$${val2}$${sp(1)};${sp(1)}$${med}$${sp(1)};${sp(1)}$${val3}$${sp(1)};${sp(1)}$${val4}$.<br>
      La série comporte $5$ valeurs donc la médiane est la troisième valeur : $${miseEnEvidence(this.reponse)}$.`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ' $\\ldots$'
    if (!this.interactif) {
      this.question += ' $\\ldots$'
    }
  }
}
