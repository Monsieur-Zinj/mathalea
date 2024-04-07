import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import Decimal from 'decimal.js'
import { milieu, point } from '../../../lib/2d/points'
import { codageSegment } from '../../../lib/2d/codages'
import { segment } from '../../../lib/2d/segmentsVecteurs'
import { polygone } from '../../../lib/2d/polygones'
import { labelPoint, texteParPosition } from '../../../lib/2d/textes'
import { colorToLatexOrHTML, mathalea2d } from '../../../modules/2dGeneralites'
import { codageAngleDroit } from '../../../lib/2d/angles'
import { texNombre } from '../../../lib/outils/texNombre'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Calculer une aire'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '5dcca'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBase
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
    // this.question += ajouteChampTexteMathLive(this, 0, 'inline largeur01 nospacebefore', { texteAvant: '$=$' })
  }

  nouvelleVersion () {
    const a = randint(1, 3)
    const b = this.canOfficielle ? 4 : randint(2, 5)
    const c = this.canOfficielle ? 8 : a + b
    const f = new Decimal(a * b).div(2)
    const A = point(0, 0, 'A', 'below')
    const B = point(5, 0, 'B', 'below')
    const C = this.canOfficielle ? point(5, 2.5, 'C', 'above') : point(5, 3, 'C', 'above')
    const D = this.canOfficielle ? point(2.5, 2.5, 'D', 'above') : point(2, 3, 'D', 'above')
    const E = this.canOfficielle ? point(0, 2.5, 'E', 'above') : point(0, 3, 'E', 'above')
    const poly = this.canOfficielle ? polygone([A, B, D, E], 'black') : polygone([A, B, C, D], 'black')
    const code1 = codageSegment(B, C, '||')
    const segmentED = segment(E, D)
    segmentED.pointilles = 2
    const segmentEA = segment(E, A)
    segmentEA.pointilles = 2
    const code2 = codageSegment(D, C, '||')
    const code3 = codageSegment(D, E, '||')
    poly.couleurDeRemplissage = colorToLatexOrHTML('lightgray')
    const d = texteParPosition(`${c} cm`, milieu(A, B).x, milieu(A, B).y - 0.5, 'milieu', 'black', 1, 'middle', false)
    const e = texteParPosition(`${b} cm`, milieu(B, C).x + 1, milieu(B, C).y, 'milieu', 'black', 1, 'middle', false)
    poly.epaisseur = 1
    if (this.canOfficielle) {
      this.reponse = 24
      this.question = mathalea2d({
        xmin: -1.5,
        ymin: -0.8,
        xmax: 7.1,
        ymax: 3.2,
        pixelsParCm: 30,
        scale: 0.7
      }, poly,
      codageAngleDroit(E, A, B), codageAngleDroit(A, B, C), codageAngleDroit(B, C, E), codageAngleDroit(C, E, A),
      code1, code2, code3, d, e, segmentED, segmentEA, polygone([A, B, C, E]))
      this.question += 'Quelle est l\'aire de la figure grisée est ? '
      this.correction = `L'aire du rectangle  est : $8\\text{ cm}\\times 4\\text{ cm}=32$ cm$^2$.<br>
      L'aire du triangle  est : $\\dfrac{4\\text{ cm}\\times 4\\text{ cm}}{2}=8$ cm$^2$.<br>
      On en déduit que l'aire du polygone grisé est : $32\\text{ cm}^2-8\\text{ cm}^2=${miseEnEvidence(texNombre(this.reponse, 1))}$ cm$^2$.`
    } else {
      this.reponse = new Decimal(b * c).sub(f)
      this.question = mathalea2d({
        xmin: -1.5,
        ymin: -1,
        xmax: 7.1,
        ymax: 4,
        pixelsParCm: 30,
        scale: 0.7
      }, poly, labelPoint(A, B, C, D, E),
      codageAngleDroit(E, A, B), codageAngleDroit(A, B, C), codageAngleDroit(B, C, E), codageAngleDroit(C, E, A),
      code1, code2, d, e, segmentED, segmentEA)
      this.question += 'L\'aire de la figure grisée est : '
      this.correction = `L'aire du rectangle $ABCD$ est : $${b}\\text{ cm}\\times ${c}\\text{ cm}=${b * c}$ cm$^2$.<br>
      L'aire du triangle $AED$ est : $\\dfrac{${a}\\text{ cm}\\times ${b}\\text{ cm}}{2}=${texNombre(f, 1)}$ cm$^2$.<br>
      On en déduit que l'aire du polygone grisé est : $${b * c}\\text{ cm}^2-${texNombre(f, 1)}\\text{ cm}^2=${miseEnEvidence(texNombre(this.reponse, 1))}$ cm$^2$.`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$ cm$^2$'
    if (this.interactif) {
      this.optionsChampTexte = { texteApres: 'cm$^2$.' }
    } else {
      this.question += ' $\\ldots $ cm$^2$.'
    }
  }
}
