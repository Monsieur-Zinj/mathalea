import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { codageAngleDroit } from '../../../lib/2d/angles'
import { milieu, point } from '../../../lib/2d/points'
import { mathalea2d } from '../../../modules/2dGeneralites'
import { polygone } from '../../../lib/2d/polygones'
import { latexParCoordonnees } from '../../../lib/2d/textes'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Calculer une dimension dans un rectangle'
export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = 'a5528'
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
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    const A = point(0, 0, 'A', 'below')
    const B = point(4, 0, 'B', 'below')
    const C = point(4, 3, 'C', 'above')
    const D = point(0, 3, 'D', 'above')
    const P = polygone(A, B, C, D)// rectangle
    const code1 = codageAngleDroit(A, B, C)
    const code2 = codageAngleDroit(B, C, D)
    const code3 = codageAngleDroit(C, D, A)
    const code4 = codageAngleDroit(D, A, B)
    const xmin = -1.5
    const ymin = -0.7
    const xmax = 5.2
    const ymax = 3.5
    const objets1 = []
    const objets2 = []
    const L = this.canOfficielle ? 4 : randint(4, 8)
    const l = this.canOfficielle ? 2 : randint(1, 3)
    objets1.push(P, code1, code2, code3, code4,
      latexParCoordonnees(`${L} \\text{ cm}`, milieu(A, B).x, milieu(A, B).y - 0.2, 'black', 0, 0, '', 8),
      latexParCoordonnees('?', milieu(B, C).x + 0.4, milieu(B, C).y, 'black', 0, 0, '', 8))
    objets2.push(P, code1, code2, code3, code4,
      latexParCoordonnees('?', milieu(A, B).x, milieu(A, B).y - 0.2, 'black', 0, 0, '', 8),
      latexParCoordonnees(`${l} \\text{ cm}`, milieu(B, C).x + 0.5, milieu(B, C).y, 'black', 0, 0, '', 8))
    if (this.canOfficielle) {
      this.reponse = l
      this.question = `Le périmètre de ce rectangle est  $12$ cm.<br>
      Quelle est sa largeur ?<br>`
      this.question += mathalea2d({
        xmin,
        ymin,
        xmax,
        ymax,
        pixelsParCm: 35,
        mainlevee: true,
        amplitude: 0.5,
        scale: 0.8,
        style: 'margin: auto'
      }, objets1)

      this.correction = `Le demi-périmètre est $12\\div 2 = 6$ cm, la largeur du rectangle est donc égale à  $6-4=${miseEnEvidence(2)}$ cm.`
    } else {
      if (choice([true, false])) {
        this.reponse = l
        this.question = `Le périmètre de ce rectangle est  $${2 * L + 2 * l}$ cm.<br>
      Quelle est sa largeur ?<br>`
        this.question += mathalea2d({
          xmin,
          ymin,
          xmax,
          ymax,
          pixelsParCm: 35,
          mainlevee: true,
          amplitude: 0.5,
          scale: 0.8,
          style: 'margin: auto'
        }, objets1)

        this.correction = `Le demi-périmètre est $${2 * L + 2 * l}\\div 2 = ${L + l}$ cm, la largeur du rectangle est donc égale à  $${L + l}-${L}=${miseEnEvidence(this.reponse)}$ cm.`
      } else {
        this.reponse = L
        this.question = `Le périmètre de ce rectangle est  $${2 * L + 2 * l}$ cm.<br>
    Quelle est sa longueur ?<br>`
        this.question += mathalea2d({
          xmin,
          ymin,
          xmax,
          ymax,
          pixelsParCm: 35,
          mainlevee: true,
          amplitude: 0.5,
          scale: 0.8,
          style: 'margin: auto'
        }, objets2)

        this.correction = `Le demi-périmètre est $${2 * L + 2 * l}\\div 2 = ${L + l}$ cm, la longeur du rectangle est donc égale à  $${L + l}-${l}=${miseEnEvidence(this.reponse)}$ cm.`
      }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '? $=\\ldots$ cm'
    if (!this.interactif) {
      this.question += '? $=\\ldots$ cm'
    } else { this.optionsChampTexte = { texteAvant: '? $=$', texteApres: 'cm' } }
  }
}
