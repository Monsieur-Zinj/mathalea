import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { codageSegments } from '../../../lib/2d/codages'
import { segmentAvecExtremites } from '../../../lib/2d/segmentsVecteurs'
import { labelPoint, latexParCoordonnees } from '../../../lib/2d/textes'
import { milieu, point, tracePointSurDroite } from '../../../lib/2d/points'
import { droite } from '../../../lib/2d/droites'
import { fixeBordures, mathalea2d } from '../../../modules/2dGeneralites'
import { choice } from '../../../lib/outils/arrayOutils'
import Decimal from 'decimal.js'
import { texNombre } from '../../../lib/outils/texNombre'
export const titre = 'Calculer une longueur'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'fec2f'
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
    this.optionsChampTexte = { texteApres: 'cm', texteAvant: '$AB=$' }
    this.formatInteractif = 'calcul'
    this.canOfficielle = true
    // this.question += ajouteChampTexteMathLive(this, 0, 'inline largeur01 nospacebefore', { texteAvant: '$=$' })
  }

  nouvelleVersion () {
    const objets = []
    const pointsSurAB2 = []
    const listeValeurs = this.canOfficielle
      ? [[20, 12, 4]]
      : [[25, 13, 2], [23, 14, 3], [20, 12, 2], [20, 12, 4],
          [20, 11, 3], [24, 16, 4], [25, 16, 3],
          [27, 17, 5], [28, 16, 4]]// val1=grande longueur, val2=longueur à soustraire, val3=nbre de segments de même longueur
    const Valeur = choice(listeValeurs)
    const b = Valeur[2]
    this.reponse = new Decimal(Valeur[0] - Valeur[1]).div(b)
    const A = point(0, 0, 'A', 'above')
    const B = point(16, 0, 'B', 'below')
    const A1 = point(0, -1.5, 'A1', 'below')
    const A3 = point(6, 1.5, 'A1', 'below')
    const B3 = point(16, 1.5, 'A1', 'below')
    const B4 = point(6 / b, 0, 'B', 'above')
    const B1 = point(16, -1.5, 'B1', 'above')
    const B2 = point(6, 0, 'B2', 'below')
    const AB = segmentAvecExtremites(A, B)// grand sement de départ
    const AB2 = segmentAvecExtremites(A, B2)// segment qui sera partagé
    AB2.tailleExtremites = 5
    AB.tailleExtremites = 5
    const A1B1 = segmentAvecExtremites(A1, B1)// pour avoir la longueur du grand segment
    const A3B3 = segmentAvecExtremites(A3, B3)// pour avoir la longueur du  segment du dessus
    A1B1.styleExtremites = '<->'
    A3B3.styleExtremites = '<->'
    AB2.styleExtremites = '|-|'
    AB.styleExtremites = '-|'

    objets.push(labelPoint(A, B4), AB)
    const d = droite(A, B2)
    const Texte1 = latexParCoordonnees(`${Valeur[0]} \\text{ cm}`, milieu(A1, B1).x, milieu(A1, B1).y - 0.4, 'black', 0, 0, '')
    const Texte2 = latexParCoordonnees(`${Valeur[1]} \\text{ cm}`, milieu(A3, B3).x, milieu(A3, B3).y + 0.5, 'black', 0, 0, '')
    for (let i = 1; i < b; i++) {
      pointsSurAB2.push(point(i * 6 / b, 0), point(i * 6 / b, 0))
      const maTrace = tracePointSurDroite(pointsSurAB2[2 * (i - 1)], d)
      maTrace.taille = 2.5
      objets.push(tracePointSurDroite(pointsSurAB2[2 * (i - 1)], d))
    }
    objets.push(codageSegments('/', 'blue', A, ...pointsSurAB2, B2), AB2, A1B1, A3B3, Texte1, Texte2)

    this.question = mathalea2d(Object.assign({ scale: 0.45, style: 'margin: auto' }, fixeBordures(objets)), objets)
    this.correction = `Comme il y a $${b}$ segments de la même longueur que $[AB]$, $AB=\\dfrac{${Valeur[0]}-${Valeur[1]}}{${b}}=${texNombre(this.reponse, 0)}$.<br>
      Ainsi, $AB=${miseEnEvidence(texNombre(this.reponse, 0))}$ cm.`
    this.canEnonce = this.question
    this.canReponseACompleter = '$AB=\\ldots$'
    if (!this.interactif) {
      this.question += '$AB=\\ldots$'
    }
  }
}
