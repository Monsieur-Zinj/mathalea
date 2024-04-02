import { codageAngleDroit } from '../../lib/2d/angles.js'
import { codageSegments } from '../../lib/2d/codages.js'
import { point } from '../../lib/2d/points.js'
import { polygone } from '../../lib/2d/polygones.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { shuffle } from '../../lib/outils/arrayOutils'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
export const amcReady = true
export const amcType = 'qcmMono'
export const interactifReady = true
export const interactifType = 'qcm'
export const dateDeModifImportante = '04/07/2023' // Modif par EE : Correction des QCM, ajout d'une question, amélioration des feedback
export const titre = 'Reconnaître un quadrilatère particulier à partir de ses propriétés'

/**
 * Reconnaître un quadrilatère particulier à partir de ses propriétés
 * @author Rémi Angot
 * Référence 6G33
*/
export const uuid = '4e52e'
export const ref = '6G33'
export const refs = {
  'fr-fr': ['6G33'],
  'fr-ch': ['9ES4-6']
}
export default function ReconnaitreQuadrilatereParticulier () {
  Exercice.call(this)
  this.titre = titre
  this.amcReady = amcReady
  this.amcType = amcType
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  this.consigne = ''
  this.nbQuestions = 3
  this.nbQuestionsModifiable = false
  this.nbColsCorr = 2 // Nombre de colonnes dans la correction pour la sortie LaTeX
  this.correctionDetailleeDisponible = true
  context.isHtml ? this.correctionDetaillee = true : this.correctionDetaillee = false

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.consigne = this.interactif ? 'Pour chaque question, cocher la bonne réponse.' : ''

    const listeDeQuad = shuffle(['losange', 'rectangle', 'carre'])
    for (let i = 0, numDeQuad, listeDeQuestions, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      numDeQuad = listeDeQuad[i] === 'losange' ? randint(1, 2) : randint(1, 3)
      listeDeQuestions = listeDeQuad[i] + numDeQuad
      texte = ''
      texteCorr = ''
      let A, B, C, D, O, ABCD, codage, codage1, codage2, codage3, codage4, sAC, sBD, marquesDemiDiagonales, marquesDemiDiagonales1, marquesDemiDiagonales2, marquesCotes
      this.autoCorrection[i] = {}
      switch (numDeQuad) {
        case 2 :
          this.autoCorrection[i].propositions = [
            {
              texte: 'Losange',
              statut: false,
              feedback: listeDeQuad[i] === 'losange'
                ? 'Les losanges ont des diagonales perpendiculaires et sécantes en leur milieu.'
                : 'Les losanges n\'ont pas de diagonales de même longueur.'
            },
            {
              texte: 'Rectangle',
              statut: false,
              feedback: listeDeQuad[i] === 'rectangle'
                ? 'Les rectangles ont des diagonales de même longueur et sécantes en leur milieu.'
                : 'Les rectangles n\'ont pas de diagonales perpendiculaires.'
            },
            {
              texte: 'Carré',
              statut: false,
              feedback: (listeDeQuad[i] === 'losange'
                ? 'Les carrés ont des diagonales perpendiculaires et sécantes en leur milieu, mais pas seulement. Leurs diagonales sont aussi de même longueur.'
                : listeDeQuad[i] === 'rectangle'
                  ? 'Les carrés ont des diagonales perpendiculaires et de même longueur, mais pas seulement. Leurs diagonales sont aussi sécantes en leur milieu.'
                  : 'Les carrés ont des diagonales perpendiculaires, de même longueur et sécantes en leur milieu.') +
              ' Un carré est à la fois un rectangle et un losange.'
            },
            {
              texte: 'Trapèze',
              statut: false,
              feedback: 'De manière générale, les trapèzes n\'ont pas de diagonales perpendiculaires.'
            },
            {
              texte: 'Parallélogramme',
              statut: false,
              feedback: 'De manière générale, les parallélogrammes n\'ont pas de diagonales perpendiculaires.'
            }
          ]
          break
        default :
          this.autoCorrection[i].propositions = [
            {
              texte: 'Losange',
              statut: false,
              feedback: listeDeQuad[i] === 'losange'
                ? 'Les losanges ont tous leurs côtés de même longueur.'
                : 'Les losanges n\'ont pas d\'angles droits.'
            },
            {
              texte: 'Rectangle',
              statut: false,
              feedback: listeDeQuad[i] === 'rectangle'
                ? 'Les rectangles ont 4 angles droits.'
                : 'Les rectangles n\'ont pas tous leurs côtés de même longueur.'
            },
            {
              texte: 'Carré',
              statut: false,
              feedback: (listeDeQuad[i] === 'losange'
                ? 'Les carrés ont tous leurs côtés de même longueur, mais pas seulement. Ils ont aussi 4 angles droits.'
                : listeDeQuad[i] === 'rectangle'
                  ? 'Les carrés ont 4 angles droits, mais pas seulement. Ils ont aussi tous leurs côtés de même longueur.'
                  : 'Les carrés ont tous leurs côtés de même longueur et 4 angles droits.') +
              ' Un carré est à la fois un rectangle et un losange.'
            },
            {
              texte: 'Trapèze',
              statut: false,
              feedback: 'De manière générale, les trapèzes n\'ont pas tous leurs côtés de même longueur, ni d\'angles droits.'
            },
            {
              texte: 'Parallélogramme',
              statut: false,
              feedback: 'De manière générale, les parallélogrammes n\'ont pas tous leurs côtés de même longueur, ni d\'angles droits.'
            }
          ]
      } this.autoCorrection[i].options = {
        ordered: true,
        lastChoice: 5
      }

      // listeDeQuestions[0] = 'losange2'
      // switch (listeDeQuestions) {
      switch (listeDeQuestions) {
        case 'losange1':
          texte = "Quelle est la nature d'un quadrilatère ayant 4 côtés de même longueur ?"
          A = point(0, 0)
          B = point(2, 3)
          C = point(0, 6)
          D = point(-2, 3)
          O = point(0, 3)
          ABCD = polygone(A, B, C, D)
          marquesCotes = codageSegments('||', 'blue', A, B, B, C, C, D, D, A)
          if (this.correctionDetaillee) { texteCorr = mathalea2d({ xmin: -3, xmax: 3, ymin: -1, ymax: 7 }, ABCD, marquesCotes) + '<br>' }
          texteCorr += "C'est un losange."
          break
        case 'losange2':
          texte = "Quelle est la nature d'un quadrilatère ayant ses diagonales perpendiculaires et sécantes en leur milieu ?"
          A = point(0, 0)
          B = point(2, 3)
          C = point(0, 6)
          D = point(-2, 3)
          O = point(0, 3)
          ABCD = polygone(A, B, C, D)
          codage = codageAngleDroit(C, O, B)
          sAC = segment(A, C)
          sBD = segment(B, D)
          sAC.pointilles = 5
          sBD.pointilles = 5
          marquesDemiDiagonales1 = codageSegments('|', 'blue', O, A, O, C)
          marquesDemiDiagonales2 = codageSegments('|||', 'blue', O, B, O, D)
          if (this.correctionDetaillee) { texteCorr = mathalea2d({ xmin: -3, xmax: 3, ymin: -1, ymax: 7 }, ABCD, codage, sAC, sBD, marquesDemiDiagonales1, marquesDemiDiagonales2) + '<br>' }
          texteCorr += "C'est un losange."
          break
        case 'rectangle1':
          texte = "Quelle est la nature d'un quadrilatère ayant 4 angles droits ?"
          A = point(0, 0)
          B = point(5, 0)
          C = point(5, 3)
          D = point(0, 3)
          O = point(2.5, 1.5)
          ABCD = polygone(A, B, C, D)
          codage1 = codageAngleDroit(A, B, C)
          codage2 = codageAngleDroit(B, C, D)
          codage3 = codageAngleDroit(C, D, A)
          codage4 = codageAngleDroit(D, A, B)
          if (this.correctionDetaillee) { texteCorr = mathalea2d({ xmin: -1, xmax: 6, ymin: -1, ymax: 4 }, ABCD, codage1, codage2, codage3, codage4) + '<br>' }
          texteCorr += "C'est un rectangle."
          break
        case 'rectangle2':
          texte = "Quelle est la nature d'un quadrilatère ayant ses diagonales de même longueur et sécantes en leur milieu ?"
          A = point(0, 0)
          B = point(5, 0)
          C = point(5, 3)
          D = point(0, 3)
          O = point(2.5, 1.5)
          ABCD = polygone(A, B, C, D)
          sAC = segment(A, C)
          sBD = segment(B, D)
          marquesDemiDiagonales = codageSegments('||', 'blue', O, A, O, B, O, C, O, D)
          if (this.correctionDetaillee) { texteCorr = mathalea2d({ xmin: -1, xmax: 6, ymin: -1, ymax: 4 }, ABCD, marquesDemiDiagonales, sAC, sBD) + '<br>' }
          texteCorr += "C'est un rectangle."
          break
        case 'rectangle3':
          texte = "Quelle est la nature d'un quadrilatère ayant 3 angles droits ?"
          A = point(0, 0)
          B = point(5, 0)
          C = point(5, 3)
          D = point(0, 3)
          O = point(2.5, 1.5)
          ABCD = polygone(A, B, C, D)
          codage1 = codageAngleDroit(A, B, C)
          codage2 = codageAngleDroit(B, C, D)
          codage3 = codageAngleDroit(C, D, A)
          if (this.correctionDetaillee) { texteCorr = mathalea2d({ xmin: -1, xmax: 6, ymin: -1, ymax: 4 }, ABCD, codage1, codage2, codage3) + '<br>' }
          texteCorr += "C'est un rectangle car si le quadrilère a 3 angles droits, alors il en possède aussi forcément un quatrième."
          break
        case 'carre1':
          texte = "Quelle est la nature d'un quadrilatère ayant ses 4 côtés de même longueur et 4 angles droits ?"
          A = point(0, 0)
          B = point(3, 0)
          C = point(3, 3)
          D = point(0, 3)
          O = point(1.5, 1.5)
          ABCD = polygone(A, B, C, D)
          codage1 = codageAngleDroit(A, B, C)
          codage2 = codageAngleDroit(B, C, D)
          codage3 = codageAngleDroit(C, D, A)
          marquesCotes = codageSegments('||', 'blue', A, B, B, C, C, D, D, A)
          if (this.correctionDetaillee) { texteCorr = mathalea2d({ xmin: -1, xmax: 4, ymin: -1, ymax: 4 }, ABCD, codage1, codage2, codage3, marquesCotes) + '<br>' }
          texteCorr += "C'est un carré."
          break
        case 'carre2':
          texte = "Quelle est la nature d'un quadrilatère ayant ses diagonales perpendiculaires, de même longueur et sécantes en leur milieu ?"
          A = point(0, 0)
          B = point(3, 0)
          C = point(3, 3)
          D = point(0, 3)
          O = point(1.5, 1.5)
          ABCD = polygone(A, B, C, D)
          codage = codageAngleDroit(C, O, D)
          sAC = segment(A, C)
          sBD = segment(B, D)
          sAC.pointilles = 5
          sBD.pointilles = 5
          marquesDemiDiagonales = codageSegments('||', 'blue', O, A, O, B, O, C, O, D)
          if (this.correctionDetaillee) { texteCorr = mathalea2d({ xmin: -1, xmax: 4, ymin: -1, ymax: 4 }, ABCD, codage, marquesDemiDiagonales, sAC, sBD) + '<br>' }
          texteCorr += "C'est un carré."
          break
        case 'carre3':
          texte = "Quelle est la nature d'un quadrilatère ayant ses 4 côtés de même longueur et un angle droit ?"
          A = point(0, 0)
          B = point(3, 0)
          C = point(3, 3)
          D = point(0, 3)
          O = point(1.5, 1.5)
          ABCD = polygone(A, B, C, D)
          codage = codageAngleDroit(A, B, C)
          marquesCotes = codageSegments('||', 'blue', A, B, B, C, C, D, D, A)
          if (this.correctionDetaillee) { texteCorr = mathalea2d({ xmin: -1, xmax: 4, ymin: -1, ymax: 4 }, ABCD, codage, marquesCotes) + '<br>' }
          texteCorr += "C'est un carré."
          break
      }
      // if (this.modeQcm && !context.isAmc) {
      //   if (texteCorr.lastIndexOf('\n') > 0) {
      //     texteCorr = texteCorr.substring(0, texteCorr.lastIndexOf('\n'))
      //   }
      //   this.tableauSolutionsDuQcm[i] = tabicone
      //   texte += propositionsQcm(this.numeroExercice, i, tabrep, tabicone).texte
      //   texteCorr += '<br>' + propositionsQcm(this.numeroExercice, i, tabrep, tabicone).texteCorr
      // }

      this.autoCorrection[i].enonce = `${texte}\n`

      // 0: losange, 1: rectangle, 2: carré, 3: trapèze, 4: parallélogramme
      switch (listeDeQuad[i]) {
        case 'losange' :
          this.autoCorrection[i].propositions[0].statut = true
          break
        case 'rectangle' :
          this.autoCorrection[i].propositions[1].statut = true
          break
        case 'carre' :
          this.autoCorrection[i].propositions[2].statut = true
          break
      }

      if (this.questionJamaisPosee(i, texte)) {
        // Si la question n'a jamais été posée, on en crée une autre
        if (this.interactif) {
          texte += propositionsQcm(this, i).texte
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
