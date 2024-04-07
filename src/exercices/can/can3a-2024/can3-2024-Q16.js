import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { texNombre } from '../../../lib/outils/texNombre'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Calculer le côté d\'un carré à partir de son aire'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '4a518'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
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
      this.reponse = 6
      this.question = `Un carré a une aire de $36$ cm$^2$.<br>
      La longueur de l'un de ses côtés est :   `
      this.correction = `L'aire d'un carré est le carré de la longueur d'un côté. <br>
      Ainsi, la longueur $c$ d'un de ses côtés est :   $c=\\sqrt{36}=${miseEnEvidence(texNombre(this.reponse, 0))}$ cm.
     `
      this.optionsChampTexte = { texteApres: 'cm' }
      this.canEnonce = this.question
      this.canReponseACompleter = '$\\ldots$ cm'
      if (!this.interactif) {
        this.question += '$\\ldots$ cm'
      }
    } else {
      if (choice([true, false])) {
        const a = randint(4, 12)
        this.reponse = a
        this.question = `Un carré a une aire de $${a ** 2}$ cm$^2$.<br>
      La longueur d'un de ses côtés est :   `
        this.correction = `L'aire d'un carré est le carré de la longueur d'un côté. <br>
      Ainsi, la longueur $c$ d'un de ses côtés est : $c=\\sqrt{${a ** 2}}=${miseEnEvidence(texNombre(this.reponse, 0))}$ cm.
     `
        this.optionsChampTexte = { texteApres: 'cm' }
        this.canEnonce = this.question
        this.canReponseACompleter = '$\\ldots$ cm'
        if (!this.interactif) {
          this.question += '$\\ldots$ cm'
        }
      } else {
        const a = randint(4, 12)
        this.reponse = a ** 2
        this.question = `Un carré a un périmètre de $${a * 4}$ cm.<br>
     Son aire est :   `
        this.correction = `L'aire d'un carré est le carré du côté. <br>
      Le côté du carré est $\\dfrac{${4 * a}}{4}=${a}$ cm.<br>
      Ainsi, son aire est : $${a}^2=${miseEnEvidence(texNombre(this.reponse, 0))}$ cm$^2$.
     `
        this.optionsChampTexte = { texteApres: 'cm$^2$' }
        this.canEnonce = this.question
        this.canReponseACompleter = '$\\ldots$ cm$^2$'
        if (!this.interactif) {
          this.question += '$\\ldots$ cm$^2$'
        }
      }
    }
  }
}
