import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import FractionEtendue from '../../../modules/FractionEtendue'
export const titre = 'Simplifier une fraction'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '00625'
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
    this.formatInteractif = 'fraction'
    this.canOfficielle = true
    // this.question += ajouteChampTexteMathLive(this, 0, 'inline largeur01 nospacebefore', { texteAvant: '$=$' })
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new FractionEtendue(5, 3)
      this.question = 'Simplifie $\\dfrac{25}{15}$. '
      this.correction = `$\\dfrac{25}{15}=\\dfrac{\\cancel{5}\\times 5}{\\cancel{5}\\times 3}=${miseEnEvidence(this.reponse)}$`
    } else {
      const k = randint(2, 5)
      const listeFractions = [[4, 15], [3, 11], [2, 9], [5, 11], [3, 13],
        [10, 9], [4, 11], [7, 15], [2, 15], [5, 12]
      ]
      const fraction = choice(listeFractions)
      const a = new FractionEtendue(fraction[0] * k, fraction[1] * k)
      const b = new FractionEtendue(fraction[0], fraction[1])
      this.reponse = b
      this.question = `Simplifie au maximum $${a.texFraction}$.<br>
      `
      this.correction = `$${a.texFraction}=\\dfrac{${fraction[0]}\\times \\cancel{${k}}}{${fraction[1]}\\times \\cancel{${k}}}=${miseEnEvidence(this.reponse)}$
      `
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\dfrac{\\ldots}{\\ldots}$'
  }
}
