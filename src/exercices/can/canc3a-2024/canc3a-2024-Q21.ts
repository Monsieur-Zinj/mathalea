import Exercice from '../../Exercice'
import { randint } from '../../../modules/outils'
import { DroiteGraduee } from '../../../lib/2d/reperes'
import { fixeBordures, mathalea2d } from '../../../modules/2dGeneralites'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Déterminer une abscisse sur une droite graduée'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '36031'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora (reprise du fichier de Jean-Claude Lhote 6ième)
 * Référence
*/
export default class AbscisseEnDemisCM2 extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    // this.formatInteractif = 'calcul'
    this.formatChampTexte = 'largeur01'
    this.canOfficielle = true
    this.compare = fonctionComparaison
  }

  nouvelleVersion () {
    let a1: number
    let a2: number
    const delta = 1
    if (this.canOfficielle) {
      a1 = 10
      a2 = 11
    } else {
      a1 = randint(5, 15)
      a2 = a1 + delta
    }

    const x = a2 + 0.5
    this.reponse = { reponse: { value: `\\frac{${2 * a2 + 1}}{2}`, compare: fonctionComparaison } } // this.reponse = String(x)
    const drGrad = new DroiteGraduee({ Unite: 2, Min: a1, Max: a2 + 2, thickSec: true, thickSecDist: 0.5, labelsPrincipaux: false, labelListe: [[a2, String(a2)], [a2 + 1, String(a2 + 1)]], pointListe: [[x, 'A']] })
    const objets = [drGrad]
    this.question = 'Quelle est l\'abscisse du point A ?<br>'
    this.question += mathalea2d(Object.assign({ scale: 0.5 }, fixeBordures(objets)), objets)
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    this.correction = `L'abscisse du point A est $${miseEnEvidence(texNombre(x, 1))}$.`
  }
}
