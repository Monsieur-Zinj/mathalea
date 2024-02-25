import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { codageAngleDroit } from '../../../lib/2d/angles'
import { milieu, point } from '../../../lib/2d/points'
import { mathalea2d } from '../../../modules/2dGeneralites'
import { polygone } from '../../../lib/2d/polygones'
import { context } from '../../../modules/context.js'
import { segment } from '../../../lib/2d/segmentsVecteurs'
import { latexParCoordonnees } from '../../../lib/2d/textes'
export const titre = 'Calculer le périmètre d\'un rectangle'
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
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore'
    this.formatInteractif = 'calcul'
    this.canOfficielle = true
    // this.question += ajouteChampTexteMathLive(this, 0, 'inline largeur01 nospacebefore', { texteAvant: '$=$' })
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
    const k = this.canOfficielle ? 1 : randint(1, 4)

    objets1.push(P, code1, code2, code3, code4, segment(D, B),
      context.isHtml ? latexParCoordonnees(`${4 * k}`, milieu(A, B).x, milieu(A, B).y - 0.2, 'black', 0, 0, '', 8) : latexParCoordonnees(`${4 * k}`, milieu(A, B).x, milieu(A, B).y - 0.5, 'black', 0, 0, '', 8),
      context.isHtml ? latexParCoordonnees(`${3 * k}`, milieu(A, D).x - 0.2, milieu(A, D).y, 'black', 0, 0, '', 8) : latexParCoordonnees(`${3 * k}`, milieu(A, D).x - 0.2, milieu(A, D).y, 'black', 0, 0, '', 8),
      context.isHtml ? latexParCoordonnees(`${5 * k}`, milieu(D, B).x, milieu(D, B).y + 0.3, 'black', 0, 0, '', 8) : latexParCoordonnees(`${5 * k}`, milieu(D, B).x, milieu(D, B).y + 0.3, 'black', 0, 0, '', 8))
    if (this.canOfficielle) {
      this.reponse = 14
      this.question = mathalea2d({
        xmin,
        ymin,
        xmax,
        ymax,
        pixelsParCm: 35,
        mainlevee: false,
        amplitude: 0.5,
        scale: 0.8,
        style: 'margin: auto'
      }, objets1)
      this.question += `<br>Les mesures sont en cm.<br>
      Le périmètre du rectangle est  : `
      this.correction = 'Le périmètre du rectangle est donné par $2\\times (4+3)=14$ cm.'
    } else {
      this.reponse = 2 * 3 * k + 2 * 4 * k
      this.question = mathalea2d({
        xmin,
        ymin,
        xmax,
        ymax,
        pixelsParCm: 35,
        mainlevee: false,
        amplitude: 0.5,
        scale: 0.8,
        style: 'margin: auto'
      }, objets1)
      this.question += `<br>Les mesures sont en cm.<br>
          Le périmètre du rectangle est  : `
      this.correction = `Le périmètre du rectangle est donné par $2\\times (${4 * k}+${3 * k})=${miseEnEvidence(this.reponse)}$ cm.`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$ cm'
    if (!this.interactif) {
      this.question += '$\\ldots$ cm'
    }
  }
}
