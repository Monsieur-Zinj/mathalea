import Exercice from '../../Exercice'
import { miseEnEvidence, texteGras } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import Decimal from 'decimal.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { context } from '../../../modules/context'
export const titre = 'Déterminer une valeur définie avec un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '15/09/2024'
export const uuid = '0b829'
export const refs = {
  'fr-fr': ['can4P06'],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class ValeursDefPourcentage extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.spacing = 1.5
    this.spacingCorr = 1.5
  }

  nouvelleVersion () {
    const listeValeurs = [[1, randint(1, 100) * 10, 100], [5, randint(3, 20) * 10, 20],
      [10, randint(5, 20) * 10, 10], [20, randint(1, 9) * 10, 5], [50, randint(10, 30), 2], [25, randint(1, 10) * 10, 4]]// le pourcentage, N, coeff mul-->100
    const choix = choice(listeValeurs)
    const valeur = new Decimal(choix[0]).mul(choix[1]).div(100)
    this.reponse = texNombre(choix[1], 0)
    this.question = `$${choix[0]}\\,\\%$ de $N$ est égal à $${texNombre(valeur, 2)}$.<br> 
    Quelle est la valeur de $N$ ?`

    this.canEnonce = this.question
    this.canReponseACompleter = '$N=\\ldots$'
    this.correction = `Pour passer de $${choix[0]}\\,\\%$ à $100\\,\\%$, on multiplie par $${choix[2]}$.<br>
        $\\begin{aligned}
        ${choix[0]}\\,\\% \\text{ de } N &=  ${texNombre(valeur, 2)}\\\\
        100\\,\\% \\text{ de } N&=${choix[2]}\\times${texNombre(valeur, 2)}\\\\
        ${choix[0] === 5 && !Number.isInteger(choix[0] * (choix[1]) / 100) ? `100\\,\\% \\text{ de } N&=\\underbrace{2\\times 10}_{=20}\\times${texNombre(valeur, 2)}\\\\` : context.isHtml ? '' : '\\'}
        N&=${miseEnEvidence(this.reponse)}
        \\end{aligned}$
          `
    if (choix[0] === 5 && !Number.isInteger(choix[0] * (choix[1]) / 100)) {
      this.correction += `<br>  ${texteGras('Remarque : ')} <br>
              Pour multiplier un nombre par $20$, on peut le multiplier par $10$, puis par $2$.
                `
    }

    if (this.interactif) { this.question += '<br> $N=$' }
  }
}
