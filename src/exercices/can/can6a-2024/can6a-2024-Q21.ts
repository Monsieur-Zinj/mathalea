import Exercice from '../../Exercice'
import { randint } from '../../../modules/outils'
import { DroiteGraduee } from '../../../lib/2d/reperes'
import { fixeBordures, mathalea2d } from '../../../modules/2dGeneralites'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'

export const titre = 'Déterminer une abscisse sur une droite graduée'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'e3c35'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Jean-Claude Lhote
 * Référence
*/
export default class AbscisseEnDemis extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'calcul'
    this.formatChampTexte = 'largeur01'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    let a1: number
    const delta = 1
    if (this.canOfficielle) {
      a1 = 11
    } else {
      a1 = randint(5, 15)
    }
    const a2 = a1 + delta
    const x = a2 + 0.5
    const drGrad = new DroiteGraduee({ Unite: 2, Min: a1 - 1, Max: a2 + 1, thickSec: true, thickSecDist: 0.5, labelsPrincipaux: false, labelListe: [[a1, String(a1)], [a2, String(a2)]], pointListe: [[x, 'A']] })
    const objets = [drGrad]
    this.question = 'Quelle est l\'abscisse du point A ?<br>'
    this.question += mathalea2d(Object.assign({ scale: 0.5 }, fixeBordures(objets)), objets)
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    this.reponse = String(x)
    this.correction = `L'abscisse du point A est $${miseEnEvidence(texNombre(x, 1))}$.`
  }
}
