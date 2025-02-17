import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import FractionEtendue from '../../../modules/FractionEtendue'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Calculer la moitié d\'une fracion'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '36c4e'
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
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecFraction
    this.formatInteractif = 'fractionEgale'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new FractionEtendue(1, 16)
      this.question = 'La moitié de $\\dfrac{1}{8}$ '
      this.correction = `Pour obtenir la moitié d'un nombre, on le multiplie par $\\dfrac{1}{2}$.<br>
      Ainsi, la moitié de $\\dfrac{1}{8}$ est $\\dfrac{1}{8}\\times \\dfrac{1}{2}$, soit $${miseEnEvidence(this.reponse.texFraction)}$.`
    } else {
      if (choice([true, false])) {
        const a = randint(2, 10)
        this.reponse = new FractionEtendue(1, 2 * a)
        this.question = `La moitié de $\\dfrac{1}{${a}}$`
        this.correction = `Pour obtenir la moitié d'un nombre, on le multiplie par $\\dfrac{1}{2}$.<br>
        Ainsi, la moitié de $\\dfrac{1}{${a}}$ est $\\dfrac{1}{${a}}\\times \\dfrac{1}{2}$, soit $${miseEnEvidence(this.reponse.texFraction)}$.`
      } else {
        const listeFractions = [[3, 5], [7, 5], [9, 7], [3, 4], [5, 3], [7, 9], [9, 7], [5, 6], [3, 11], [5, 11]]
        const frac = choice(listeFractions)
        const a = new FractionEtendue(frac[0], frac[1])

        this.reponse = new FractionEtendue(frac[0], 2 * frac[1])
        this.question = `La moitié de $${a.texFraction}$`
        this.correction = `Pour obtenir la moitié d'un nombre, on le multiplie par $\\dfrac{1}{2}$.<br>
        Ainsi, la moitié de $${a.texFraction}$ est $${a.texFraction}\\times \\dfrac{1}{2}$, soit $${miseEnEvidence(this.reponse.texFraction)}$.`
      }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    if (this.interactif) {
      this.question += ' $=$'
    }
  }
}
