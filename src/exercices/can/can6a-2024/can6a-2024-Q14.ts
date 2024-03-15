import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils'
import { numberCompare } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Multiplier par 0,1...'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '38fe5'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Jean-Claude Lhote
 * Référence
*/
export default class MultiplieDixieme extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'fillInTheBlank'
    this.canOfficielle = true
    this.compare = numberCompare
  }

  nouvelleVersion () {
    let nb: number
    let puissance: number
    if (this.canOfficielle) {
      puissance = 1
      nb = 75
    } else {
      puissance = randint(1, 2)
      nb = randint(3, 8) * 10 + randint(1, 9) * 10 ** (puissance - 1)
    }
    this.reponse = texNombre(1 / (10 ** puissance), 3)
    this.question = `\\text{Complète : }${texNombre(nb, 0)}\\times %{champ1}=${texNombre(nb / (10 ** puissance), 3)}`
    this.canEnonce = 'Complète.'
    this.canReponseACompleter = `$${texNombre(nb, 0)}\\times \\ldots=${texNombre(nb / (10 ** puissance), 3)}$`
    this.correction = `Le chiffre des unités du nombre de départ est devenu le chiffre des ${puissance === 1 ? 'dixièmes' : puissance === 2 ? 'centièmes' : 'millièmes'}.<br>C'est donc que le nombre a été multiplié par $1$ ${puissance === 1 ? 'dixième' : puissance === 2 ? 'centième' : 'millième'}.<br>`
    this.correction += `Donc $${texNombre(nb, 0)}\\times ${miseEnEvidence(texNombre(1 / (10 ** puissance), 3))}=${texNombre(nb / (10 ** puissance), 3)}$`
  }
}
