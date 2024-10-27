import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { prenom } from '../../../lib/outils/Personne'
export const titre = 'Calculer un nombre de billes'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '1b6cc'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class BillesMultiplieesCM2 extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'calcul'
    this.formatChampTexte = ''
    this.optionsChampTexte = { texteApres: ' billes.' }
    this.canOfficielle = false
  }

  nouvelleVersion () {
    let coeff: number
    let nbBilles: number
    let quidams: string[] = []
    if (this.canOfficielle) {
      coeff = 4
      nbBilles = 12
      quidams[0] = 'Léo'
      quidams[1] = 'Lola'
    } else {
      quidams = prenom(2)
      coeff = choice([3, 4, 5])
      nbBilles = randint(11, 15)
    }
    this.reponse = texNombre(coeff * nbBilles, 0)
    this.question = `${quidams[0]} a ${texNombre(nbBilles, 0)} billes.<br>Il en a ${coeff} fois moins que ${quidams[1]}.<br>`
    this.canEnonce = this.question
    this.question += `${quidams[1]} a ` + (this.interactif ? '' : '$\\ldots$ billes.')
    this.canReponseACompleter = `${quidams[1]} a $\\ldots$ billes.`
    this.correction = `${quidams[1]} a $${coeff}$ fois plus de billes que ${quidams[0]}.<br>
    Comme $${coeff}\\times ${nbBilles}=${this.reponse}$, ${quidams[1]} a donc $${miseEnEvidence(this.reponse)}$ billes.`
  }
}
