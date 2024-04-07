import Exercice from '../../Exercice'
import { randint } from '../../../modules/outils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { numberCompare } from '../../../lib/interactif/comparisonFunctions'
import { choice } from '../../../lib/outils/arrayOutils'

export const titre = 'Compléter 1 litre'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'c1fe4'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Jean-Claude Lhote
 * Référence
*/

export default class CompleterUnLitre extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'fillInTheBlank'
    this.formatChampTexte = 'largeur01'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    let capacite: number
    let reste: number
    let unite: string
    if (this.canOfficielle) {
      capacite = 25
      reste = 75
      unite = 'cL'
    } else {
      switch (choice([100, 1000])) {
        case 1000:
          capacite = (1 + randint(2, 8) * 2) * 50
          reste = 1000 - capacite
          unite = 'mL'
          break
        case 100:
        default:
          capacite = (1 + randint(2, 8) * 2) * 5
          reste = 100 - capacite
          unite = 'cL'
          break
      }
    }
    this.question = `\\text{Complète : ${String(capacite)}\\,${unite}}+%{champ1}\\,\\text{${unite}} =1\\, \\text{L}`
    this.canEnonce = 'Complète.'
    this.canReponseACompleter = `$${String(capacite)}$ ${unite} $+ \\ldots$ \\,${unite} $=1$ L`
    this.reponse = { champ1: { value: String(reste), compare: numberCompare } }
    this.correction = `Il faut ajouter $${miseEnEvidence(String(reste))}$ ${unite} à $${String(capacite)}$ ${unite} pour faire $1$ L, car $1$ L $=${String(reste + capacite)}$ ${unite}.`
  }
}
