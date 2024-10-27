import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { randint } from '../../../modules/outils'
export const titre = 'Écrire des heurs/minutes en minutes'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '9f648'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecFraction
    this.optionsChampTexte = { texteApres: ' min', texteAvant: '$=$' }
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    const a = this.canOfficielle ? 1 : randint(1, 2)
    const b = this.canOfficielle ? 20 : randint(1, 11) * 5

    this.reponse = a * 60 + b
    this.question = `Complète. <br>
     `
    this.question += `$${a}$ h $${b}$ min  `
    this.correction = `Le nombre de minutes est  : $${a}\\times 60 +${b}=${miseEnEvidence(this.reponse)}$.`
    if (!this.interactif) { this.question += '$= \\ldots$ min ' }
    this.canEnonce = 'Complète.'
    this.canReponseACompleter = `$${a}$ h $${b}$ min $=\\ldots$ min `
  }
}
