import Exercice from '../../Exercice'
import { miseEnEvidence, texteGras } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { texNombre } from '../../../lib/outils/texNombre'
export const titre = 'Calculer astucieusement avec un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '15/09/2024'
export const uuid = '1abca'
export const refs = {
  'fr-fr': ['can2C19'],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class CalculAstucePourcentage extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.correctionDetailleeDisponible = true
    this.correctionDetaillee = false
  }

  nouvelleVersion () {
    const listeValeurs = [[25, randint(1, 15, 10), 4], [50, randint(21, 49, [30, 40]), 2], [75, randint(1, 12, [5, 10]), 4]]
    const choix = choice(listeValeurs)
    this.reponse = choix[0] === 75 ? texNombre(choix[1] * 3, 1) : texNombre(choix[1], 1)
    this.question = `Calculer $${choix[2] * choix[1]}\\,\\%$ de $${choix[0]}$.`
    if (this.interactif) { this.question += '<br>' }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    this.correction = `Calculer $${choix[2] * choix[1]}\\,\\%$ de $${choix[0]}$ revient à calculer $${choix[0]}\\,\\%$ de $${choix[2] * choix[1]}$.<br>
  `
    if (this.correctionDetaillee) {
      this.correction += `En effet : <br>
    $\\begin{aligned}
    ${choix[2] * choix[1]}\\,\\% \\text{ de } ${choix[0]}&= \\dfrac{${choix[2] * choix[1]}}{100}\\times ${choix[0]}\\\\
    &=${choix[2] * choix[1]}\\times \\dfrac{1}{100}\\times${choix[0]}\\\\
    &=${choix[2] * choix[1]}\\times${choix[0]}\\times \\dfrac{1}{100}\\\\
    &=\\dfrac{${choix[0]}}{100}\\times ${choix[2] * choix[1]} \\\\
    &=${choix[0]}\\,\\% \\text{ de } ${choix[2] * choix[1]}
    \\end{aligned}$<br>`
    }
    this.correction += `  Prendre $${choix[0]}\\,\\%$ d'un nombre revient à ${choix[0] === 75 ? `le diviser par $${choix[2]}$ puis à multiplier par $3$ (c'est-à-dire en prendre les trois quarts)` : `le diviser par $${choix[2]}$`}.<br>
     ${choix[0] === 75 ? `$${choix[2] * choix[1]}\\div ${choix[2]}=${choix[1]}$ et $${choix[1]}\\times 3=${choix[1] * 3}$.<br>` : ''}
     Ainsi, $${choix[2] * choix[1]}\\,\\%$ de $${choix[0]}$ est égal à $${miseEnEvidence(this.reponse)}$.
        
          `
    if (choix[0] === 5 && !Number.isInteger(choix[0] * (choix[1]) / 100)) {
      this.correction += `<br>  ${texteGras('Remarque : ')} <br>
              Pour multiplier un nombre par $20$, on peut le multiplier par $10$, puis par $2$.
                `
    }
  }
}
