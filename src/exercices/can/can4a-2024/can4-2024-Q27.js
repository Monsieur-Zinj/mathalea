import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice, shuffle } from '../../../lib/outils/arrayOutils'
import Decimal from 'decimal.js'
import { texNombre } from '../../../lib/outils/texNombre'
import FractionEtendue from '../../../modules/FractionEtendue'
import { arrondi } from '../../../lib/outils/nombres'
export const titre = 'Donner l\'écriture décimale d\'une fraction'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '221a5'
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
    this.formatChampTexte = 'largeur01 inline nospacebefore'
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
    // this.question += ajouteChampTexteMathLive(this, 0, 'inline largeur01 nospacebefore', { texteAvant: '$=$' })
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 1.25
      this.question = 'L\'écriture décimale de $\\dfrac{5}{4}$ est :   '
      this.correction = `$\\begin{aligned}
      \\dfrac{5}{4}&=\\dfrac{4}{4}+\\dfrac{1}{4}\\\\
      &=1+\\dfrac{1}{4}\\\\
      &=${miseEnEvidence(texNombre(this.reponse,2))}
      \\end{aligned}$`
    } else { a = randint(1, 9, 5)
        b = choice([1, 3, 5, 7, 9, 11])
        if (choice([true, false])) {
         const maFraction = new FractionEtendue(a, 5)
          this.reponse = arrondi(a / 5, 2)
          this.question  = `L'écriture décimale de  $${maFraction.texFraction}$ est : `
          this.correction = `$${maFraction.texFraction}=${miseEnEvidence(texNombre(this.reponse))}$`
        } else {
          const maFraction = new FractionEtendue(b, 4)
          this.reponse = arrondi(b / 4, 2)
          this.question  = `L'écriture décimale de   $${maFraction.texFraction}$  est : `
          this.correction = `$${maFraction.texFraction}=${miseEnEvidence(texNombre(this.reponse))}$`
        }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$'
    if (!this.interactif) {
      this.question += '$\\ldots$'
    }
  }
}
