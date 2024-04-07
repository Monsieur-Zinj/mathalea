import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { randint } from '../../../modules/outils'
import { texNombre } from '../../../lib/outils/texNombre'
export const titre = 'Compléter une égalité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'e56b3'
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
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction
    this.optionsChampTexte = { texteAvant: '? $=$' }
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    const a = this.canOfficielle ? 7 : randint(5, 9)
    const b = this.canOfficielle ? 3 : randint(2, 6)
    const c = this.canOfficielle ? 2 : randint(2, 6)

    this.reponse = a + b + c
    this.question = `Complète. <br>
     `
    this.question += `$${a}+${b}=$ ? $-${c}$<br> `
    this.correction = `Le nombre cherché est donné par : $${a}+${b}+${c}$ soit $${miseEnEvidence(texNombre(this.reponse, 0))}$.`
    if (!this.interactif) { this.question += ' ? $= \\ldots$ ' }
    this.canEnonce = 'Complète.'
    this.canReponseACompleter = `$${a}+${b}=\\ldots -${c}$ `
  }
}
