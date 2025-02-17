import Exercice from '../../Exercice'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import Decimal from 'decimal.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Convertir  cL <-> L'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '63eb6'
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
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 40
      this.question = '$0,4\\text{ L }=$ '
      this.correction = `Comme $1$ L $=100$ cL, pour passer des "L" au "cL", on multiplie par $100$.<br>
      Ainsi $0,4\\text{ L }=${miseEnEvidence(40)}$ cL`
      this.canEnonce = 'Complète.'
      this.canReponseACompleter = '$0,4\\text{ L }=\\ldots$ cL'
      if (!this.interactif) {
        this.question += '$\\ldots$ cL'
      } else { this.optionsChampTexte = { texteApres: 'cL' } }
    } else {
      if (choice([true, false])) {
        const a = new Decimal(randint(5, 19, 10)).div(10)
        this.reponse = a.mul(100)
        this.question = `$${texNombre(a, 1)}\\text{ L }=$ `
        this.correction = `Comme $1$ L $=100$ cL, pour passer des "L" au "cL", on multiplie par $100$.<br>
      Ainsi $${texNombre(a, 1)}\\text{ L }=${miseEnEvidence(texNombre(a * 100, 1))}$ cL`
        this.canEnonce = this.question
        this.canReponseACompleter = '$\\ldots$ cL'
        if (!this.interactif) {
          this.question += '$\\ldots$ cL'
        } else { this.optionsChampTexte = { texteApres: 'cL' } }
      } else {
        const a = new Decimal(randint(5, 19, 10)).mul(10)
        this.reponse = a.div(100)
        this.question = `$${texNombre(a, 1)}\\text{ cL }=$ `
        this.correction = `Comme $1$ cL $=0,01$ L, pour passer des "cL" au "L", on divise par $100$.<br>
      Ainsi $${texNombre(a, 1)}\\text{ cL }=${miseEnEvidence(texNombre(a / 100, 1))}$ L`
        this.canEnonce = this.question
        this.canReponseACompleter = '$\\ldots$ L'
        if (!this.interactif) {
          this.question += '$\\ldots$ L'
        } else { this.optionsChampTexte = { texteApres: 'L' } }
      }
    }
  }
}
