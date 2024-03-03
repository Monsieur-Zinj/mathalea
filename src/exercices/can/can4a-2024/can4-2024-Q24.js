import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { printlatex, randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Réduire une expression littérale'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '23d19'
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
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecVariable
    this.formatInteractif = 'calcul'
    this.optionsChampTexte = { texteAvant: '$=$' }
    this.canOfficielle = true
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = ['16x-5']//, '12\\times x-5'
      this.question = 'Réduis $2x-5+14x$ '
      this.correction = `$2x-5+14x=${miseEnEvidence('16x-5')}$`
    } else {
      const lettre = choice(['a', 'b', 'x', 'y'])
      const a = randint(2, 9)
      const b = randint(2, 9)
      const c = randint(2, 9)
      const d = randint(2, 9)
      if (choice([true, false])) {
        this.reponse = printlatex(`${a + c}*${lettre}+(${b + d})`)
        this.question = `Réduire   $${a}${lettre}+${b}+${c}${lettre}+${d}$ `
        this.correction = ` $${a}${lettre}+${b}+${c}${lettre}+${d}=${a}${lettre}+${c}${lettre}+${b}+${d}=${miseEnEvidence(this.reponse)}$`
      } else {
        this.reponse = printlatex(`${a + c}*${lettre}+${b}`)
        this.question = `Réduis   $${a}${lettre}+${b}+${c}${lettre}$`
        this.correction = ` $${a}${lettre}+${b}+${c}${lettre}=${a}${lettre}+${c}${lettre}+${b}=${miseEnEvidence(this.reponse)}$`
      }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
