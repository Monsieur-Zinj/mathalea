import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
import { milieu, point, tracePointSurDroite } from '../../../lib/2d/points'
import { segmentAvecExtremites } from '../../../lib/2d/segmentsVecteurs'
import { labelPoint, latexParCoordonnees } from '../../../lib/2d/textes'
import { codageSegments } from '../../../lib/2d/codages'
import { droite } from '../../../lib/2d/droites'
import { mathalea2d } from '../../../modules/2dGeneralites'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { functionCompare } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Exprimer en fonction de ...'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'ea5e3'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecVariable
    this.optionsChampTexte = { texteAvant: '$AB=$', texteApres: 'cm' }
    this.formatInteractif = 'calcul'
    this.compare = functionCompare
    this.canOfficielle = true
  }

  nouvelleVersion () {
    const objets = []
    const pointsSurAB2 = []
    const listeValeurs = this.canOfficielle
      ? [[10, 4]]
      : [[10, 2], [11, 3], [11, 2], [9, 4],
          [13, 3], [11, 4], [1, 3],
          [15, 5], [13, 4]]// val1=valeur écrite, val2=nbre de segments de même longueur
    const Valeur = choice(listeValeurs)
    const b = Valeur[1]
    this.reponse = { reponse: { value: { fonction: `${Valeur[0]}-${Valeur[1]}x`, variable: 'x' }, compare: functionCompare } }
    const A = point(0, 0, 'A', 'below')
    const B = point(16, 0, 'B', 'below')
    const A3 = point(0, 1, 'A1', 'below')
    const B3 = point(16, 1, 'A1', 'below')
    const B2 = point(7, 0, 'A', 'below')
    const AB = segmentAvecExtremites(A, B)// grand sement de départ
    const AB2 = segmentAvecExtremites(A, B2)// segment qui sera partagé
    AB2.tailleExtremites = 5
    AB.tailleExtremites = 5
    const A3B3 = segmentAvecExtremites(A3, B3)// pour avoir la longueur du  segment du dessus
    A3B3.styleExtremites = '<->'
    AB2.styleExtremites = '|-|'
    AB.styleExtremites = '-|'

    objets.push(labelPoint(B2, B), AB)
    const d = droite(A, B2)

    const Texte2 = latexParCoordonnees(`${Valeur[0]} \\text{ cm}`, milieu(A3, B3).x, milieu(A3, B3).y + 0.7, 'black', 0, 0, '')
    for (let i = 1; i < b; i++) {
      pointsSurAB2.push(point(i * 7 / b, 0), point(i * 7 / b, 0))
      const Texte1 = latexParCoordonnees('x \\text{ cm}', 3 / b, -1.5, 'black', 0, 0, '')
      const A4 = point(0, -1, 'A1', 'below')
      const B4 = point(7 / b, -1, 'A1', 'below')
      const A4B4 = segmentAvecExtremites(A4, B4)
      A4B4.styleExtremites = '<->'
      const maTrace = tracePointSurDroite(pointsSurAB2[2 * (i - 1)], d)
      maTrace.taille = 2.5
      objets.push(tracePointSurDroite(pointsSurAB2[2 * (i - 1)], d), Texte1, A4B4)
    }
    objets.push(codageSegments('//', 'blue', A, ...pointsSurAB2, B2), AB2, A3B3, Texte2)
    this.question = 'Exprime $AB$ en fonction de $x$.<br>'

    this.question += mathalea2d({
      xmin: -1.5,
      ymin: -2.5,
      xmax: 20,
      ymax: 2,
      scale: 0.4
    }, objets)
    // this.question += mathalea2d(Object.assign({ scale: 0.45, style: 'margin: auto' }, fixeBordures(objets)), objets)
    this.correction = `Comme il y a $${b}$ segments de la même longueur $x$, donc  $AB=${miseEnEvidence(`${Valeur[0]}-${Valeur[1]}x`)}$ cm.`
    this.canEnonce = this.question
    this.canReponseACompleter = '$AB=\\ldots$ cm'
    if (!this.interactif) {
      this.question += '$AB=\\ldots$ cm'
    }
  }
}
