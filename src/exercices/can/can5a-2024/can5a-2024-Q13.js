import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Calculer une expression décrite par une phrase'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '3eda9'
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
      this.reponse = 30
      this.question = 'Le produit de $5$ par la somme de $2$ et de $4$ est égal à : '
      this.correction = `la somme de $2$ et de $4$ est égal à : $2+4=6$.<br>
      Le produit de $5$ par la somme de $2$ et de $4$ est donc égal à : $5\\times 6=${miseEnEvidence(30)}$.`
    } else {
      const a = randint(3, 4)
      const b = randint(2, 5)
      const c = randint(1, 6, b)
      this.reponse = a * (b + c)
      this.question = `Le produit de $${a}$ par la somme de $${b}$ et de $${c}$ est égal à : `
      this.correction = `la somme de $${b}$ et de $${c}$ est égal à : $${b}+${c}=${b + c}$.<br>
      Le produit de $${a}$ par la somme de $${b}$ et de $${c}$ est donc égal à : $${a}\\times ${b + c}=${miseEnEvidence(this.reponse)}$`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$'
    if (!this.interactif) {
      this.question += '$\\ldots$'
    }
  }
}
