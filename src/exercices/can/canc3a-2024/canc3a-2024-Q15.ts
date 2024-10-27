import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { point, Point } from '../../../lib/2d/points'
import { Polygone } from '../../../lib/2d/polygones'
import { fixeBordures, mathalea2d } from '../../../modules/2dGeneralites'
import { latexParCoordonnees } from '../../../lib/2d/textes'
import { codageAngleDroit } from '../../../lib/2d/angles'
import { segment } from '../../../lib/2d/segmentsVecteurs'
export const titre = 'Calculer le périmètre d\'un rectangle'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'f828d'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora (reprise du fichier de Jean-Claude Lhote 6ième)
 * Référence
*/
export default class PerimetreRectangleCM2 extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    // this.formatInteractif = 'calcul'
    this.formatChampTexte = ''
    this.optionsChampTexte = { texteApres: ' cm' }
    this.canOfficielle = false
    this.compare = fonctionComparaison
  }

  nouvelleVersion () {
    let hauteur: number
    let grandeBase: number
    if (this.canOfficielle) {
      hauteur = 2
      grandeBase = 4
    } else {
      hauteur = randint(2, 4)
      grandeBase = randint(hauteur + 1, 4 + hauteur)
    }
    const A = new Point(0, 0)
    const B = new Point(grandeBase, 0)
    const C = new Point(grandeBase, hauteur)
    const D = new Point(0, hauteur)
    const rectangle = new Polygone([A, B, C, D])
    const angle1 = codageAngleDroit(D, A, B)
    const angle2 = codageAngleDroit(A, B, C)
    const angle3 = codageAngleDroit(B, C, D)
    const angle4 = codageAngleDroit(C, D, A)
    const horizontale1 = segment(point(0, -0.5), point(grandeBase, -0.5))
    horizontale1.styleExtremites = '<->'
    const verticale1 = segment(point(grandeBase + 0.5, 0), point(grandeBase + 0.5, hauteur))
    verticale1.styleExtremites = '<->'
    const horizontale2 = segment(point(0, hauteur + 0.5), point(grandeBase, hauteur + 0.5))
    horizontale2.styleExtremites = '<->'
    const verticale2 = segment(point(-0.5, 0), point(-0.5, hauteur))
    verticale2.styleExtremites = '<->'
    const  = latexParCoordonnees(`\\text{${String(hauteur) + ' cm'}}`, grandeBase + 0.9, hauteur / 2, 'black', 0, 0, 'white', 8)
    const longueur1 = latexParCoordonnees(`\\text{${String(grandeBase) + ' cm'}}`, grandeBase / 2, -0.5, 'black', 0, 0, 'white', 8)
    const largeur02 = latexParCoordonnees(`\\text{${String(hauteur) + ' cm'}}`, -1, hauteur / 2, 'black', 0, 0, 'white', 8)
    const longueur2 = latexParCoordonnees(`\\text{${String(grandeBase) + ' cm'}}`, grandeBase / 2, hauteur + 0.7, 'black', 0, 0, 'white', 8)
    const objets = [rectangle, angle1, angle2, angle3, angle4, verticale1, horizontale1,
      verticale2, horizontale2, , longueur1, largeur02, longueur2]

    this.question = mathalea2d(Object.assign({ scale: grandeBase > 5 ? 0.75 : 1, style: 'display: block', pixelsParCm: grandeBase > 5 ? 20 : 25 }, fixeBordures(objets)), objets)
    this.question += 'Le périmètre de ce rectangle est égal à ' + (this.interactif ? '' : '$\\ldots$ cm.')

    this.canEnonce = mathalea2d(Object.assign({ scale: grandeBase > 5 ? 0.6 : 0.9, pixelsParCm: grandeBase > 5 ? 20 : 30 }, fixeBordures(objets)), objets)
    this.canReponseACompleter = 'Le périmètre de ce rectangle est égal à $\\ldots$ cm.'
    this.reponse = String((hauteur + grandeBase) * 2)
    this.correction = `Le périmètre du rectangle est égal à : <br>$(${String(grandeBase)}+${String(hauteur)})\\times 2=${String(grandeBase + hauteur)}\\times 2 = ${miseEnEvidence(this.reponse)}$.`
  }
}
