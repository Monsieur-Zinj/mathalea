import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import Decimal from 'decimal.js'
import { texNombre } from '../../../lib/outils/texNombre'
export const titre = 'Retrouver un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '14/09/2024'
export const uuid = 'fb552'
export const refs = {
  'fr-fr': ['can4P07'],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class PourcentageARetrouver extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 ' + KeyboardType.clavierDeBase
    this.spacing = 1.5
    this.spacingCorr = 1.5
  }

  nouvelleVersion () {
    const listeValeurs = [[5, randint(3, 20) * 10, 2], [10, randint(1, 50) * 5, 1], [20, randint(1, 15) * 5, 2], [30, randint(1, 15) * 5, 3], [40, randint(1, 15) * 10, 4], [60, randint(1, 10) * 10, 6], [70, randint(1, 10) * 10, 7], [80, randint(1, 10) * 10, 8], [90, randint(1, 10) * 10, 9]]//
    const choix = choice(listeValeurs)
    const valeur = new Decimal(choix[0]).mul(choix[1]).div(100)
    this.reponse = choix[0]
    this.question = `$p\\,\\%$ de $${choix[1]}$ est égal à $${texNombre(valeur, 1)}$.<br> 
    Quelle est la valeur de $p$ ?`

    this.canEnonce = this.question
    this.canReponseACompleter = '$p=\\ldots$'
    this.correction = 'Prendre $10\\,\\%$ d\'une quantité revient à la diviser par $10$.<br>'
    this.correction += ` $10\\,\\%$ de $${choix[1]}$ est égal à ${choix[0] === 5 ? `$${texNombre(valeur.mul(choix[2]), 1)}$` : `$${texNombre(valeur.div(choix[2]), 1)}$`}.<br>`
    if (choix[0] === 5 || choix[0] === 10) {
      if (choix[0] === 10) { this.correction += '' } else {
        this.correction += ` En divisant par $${choix[2]}$, on obtient : <br>`
        this.correction += `$${choix[0]}\\,\\%$  de $${choix[1]}$ est égal à $${texNombre(valeur, 1)}$.<br>`
      }
    } else {
      this.correction += ` En multipliant par $${choix[2]}$, on obtient : <br>`
      this.correction += `$${choix[0]}\\,\\%$  de $${choix[1]}$ est égal à $${texNombre(valeur, 1)}$.<br>`
    }
    this.correction += ` Ainsi $p=${miseEnEvidence(texNombre(this.reponse))}$.`

    if (this.interactif) { this.question += '<br> $p=$' }
  }
}
