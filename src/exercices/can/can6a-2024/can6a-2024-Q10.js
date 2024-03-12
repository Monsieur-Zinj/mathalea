import Exercice from '../../Exercice'
import { shuffle } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { randint } from '../../../modules/outils'
import Grandeur from '../../../modules/Grandeur'
import { sp } from '../../../lib/outils/outilString'
export const titre = 'Trouver une valeur possible de longueur'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '8c474'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class TrouverLongueur extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.longueur
    this.formatInteractif = 'calcul'
    this.canOfficielle = true
  }

  nouvelleVersion () {
    const choix = this.canOfficielle ? [['table', 80, 80, 'cm']] : [['table', 75, 85, 'cm'], ['immeuble', 20, 30, 'm'], ['falaise', 15, 25, 'm'], ['girafe', 40, 50, 'dm'], ['échelle', 200, 300, 'cm'], ['bouteille', 28, 35, 'cm'], ['télévision', 50, 60, 'cm']]
    const a = this.canOfficielle ? 0 : randint(0, 6)
    const b = this.canOffielle ? choix[a][1] : randint(choix[a][1], choix[a][2])
    this.reponse = new Grandeur(b, choix[a][3])
    const propositions = shuffle([`$${b}$ m`, `$${b}$ dm`, `$${b}$ cm`, `$${b}$ mm`])
    if (!this.interactif) { this.question = 'Entoure la réponse possible. <br>' } else { this.question = 'Recopie la réponse possible. <br>' }
    this.question += `La hauteur d'une ${choix[a][0]} est :<br>`
    this.question += `${propositions[0]} ${sp(3)} ${propositions[1]} ${sp(3)} ${propositions[2]}${sp(3)} ${propositions[3]}`
    this.correction = `La taille d'une ${choix[a][0]} est $${miseEnEvidence(b)}$ ${choix[a][3]}.`
    this.canEnonce = 'Entoure la réponse possible.'
    this.canReponseACompleter = `La hauteur d'une ${choix[a][0]} est :<br>
    ${propositions[0]} ${sp(1)} ${propositions[1]} ${sp(1)} ${propositions[2]}${sp(1)} ${propositions[3]}`
  }
}
