import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import { texNombre } from '../../../lib/outils/texNombre'
import Decimal from 'decimal.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Déterminer un coefficient multiplicateur ou un taux d\'évolution'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '80386'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.question = 'Multiplier par $1,12$ revient à augmenter de : '
      this.correction = `Comme $1,12=1+0,12$, multiplier par $1,12$ revient à augmenter de $${miseEnEvidence('12')}\\,\\%$. `
      this.reponse = 12
      this.optionsChampTexte = { texteApres: '$\\%$' }
      if (!this.interactif) {
        this.question += '$\\ldots\\,\\%$'
      }
      this.canEnonce = 'Multiplier par $1,12$ revient à augmenter de : '
      this.canReponseACompleter = '$\\ldots\\,\\%$'
    } else {
      const taux = new Decimal(randint(1, 29, [10, 20])).div(100)
      const coeff = taux.add(1)
      if (choice([true, false])) {
        this.question = `Multiplier par $${texNombre(coeff, 2)}$ revient à augmenter de : `
        this.correction = `Comme $${texNombre(coeff, 2)}=1+${texNombre(taux, 2)}$, multiplier par $${texNombre(coeff, 2)}$ revient à augmenter de $${miseEnEvidence(texNombre(taux * 100, 0))}\\,\\%$. `
        this.reponse = new Decimal(taux).mul(100)
        this.optionsChampTexte = { texteApres: '$\\%$' }
        if (!this.interactif) {
          this.question += '$\\ldots\\,\\%$'
        }
        this.canEnonce = `Multiplier par $${texNombre(coeff, 2)}$ revient à augmenter de : `
        this.canReponseACompleter = '$\\ldots\\,\\%$'
      } else {
        this.question = `Augmenter de $${texNombre(taux * 100, 0)}\\,\\%$ revient à multiplier par : `
        this.correction = `Augmenter de $${texNombre(taux * 100, 0)}\\,\\%$ revient à multiplier par $1 + \\dfrac{${texNombre(taux * 100, 0)}}{100} = 1 + ${texNombre(taux, 2)} = ${miseEnEvidence(texNombre(coeff, 2))}$.`
        this.optionsChampTexte = { texteApres: '' }
        if (!this.interactif) {
          this.question += '$\\ldots$'
        }
        this.reponse = coeff
        this.canEnonce = `Augmenter de $${texNombre(taux * 100, 0)}\\,\\%$ revient à multiplier par : `
        this.canReponseACompleter = '$\\ldots$'
      }
    }
  }
}
