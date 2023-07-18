import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import Exercice from '../Exercice.js'
import {
  listeQuestionsToContenu,
  gestionnaireFormulaireTexte,
  choice
} from '../../modules/outils.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import {
  point,
  tracePoint,
  labelPoint,
  vecteur,
  segment,
  grille
} from '../../modules/2d.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Déterminer graphiquement les images de points par des translations'
export const dateDePublication = '13/07/2023'

/**
 * Images de points par des translations
 * @author Stéphan Grignon
 */
export const uuid = 'd2b57'
export const ref = '2G23-1'
export default function ImagePtParTranslation () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.nbQuestions = 2
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = '1'
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 3, defaut: 1, melange: 4, nbQuestions: this.nbQuestions, listeOfCase: ['t1', 't2', 't3'] })
    for (let i = 0, xB, yB, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const objets = []
      const A = point(0, 4, 'A', 'above right')
      const B = point(2, 4, 'B', 'above right')
      const C = point(4, 4, 'C', 'above right')
      const D = point(6, 4, 'D', 'above right')
      const E = point(8, 4, 'E', 'above right')
      const F = point(10, 4, 'F', 'above right')
      const G = point(0, 2, 'G', 'above right')
      const H = point(2, 2, 'H', 'above right')
      const I = point(4, 2, 'I', 'above right')
      const J = point(6, 2, 'J', 'above right')
      const K = point(8, 2, 'K', 'above right')
      const L = point(10, 2, 'L', 'above right')
      const M = point(0, 0, 'M', 'above right')
      const N = point(2, 0, 'N', 'above right')
      const O = point(4, 0, 'O', 'above right')
      const P = point(6, 0, 'P', 'above right')
      const Q = point(8, 0, 'Q', 'above right')
      const R = point(10, 0, 'R', 'above right')
      const CoorPt = [[0, 4], [2, 4], [4, 4], [6, 4], [8, 4], [10, 4], [0, 2], [2, 2], [4, 2], [6, 2], [8, 2], [10, 2], [0, 0], [2, 0], [4, 0], [6, 0], [8, 0], [10, 0]]
      const NomPt = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R']
      const Pt = [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R]
      const PositionPt = tracePoint(A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R)
      const LabelsPt = labelPoint(A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R)
      const Grille = grille(0, 0, 10, 4)
      objets.push(PositionPt, LabelsPt, Grille)

      switch (listeTypeDeQuestions[i]) {
        case 't1': { // A partir d'un point
          const PtDepart = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R])
          let OrigVec = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R], [PtDepart])
          let ExtrVec = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R], [PtDepart, OrigVec])
          let xSOL = PtDepart.x + ExtrVec.x - OrigVec.x
          let ySOL = PtDepart.y + ExtrVec.y - OrigVec.y
          while (xSOL < 0 || xSOL > 10 || ySOL < 0 || ySOL > 4) {
            OrigVec = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R], [PtDepart])
            ExtrVec = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R], [PtDepart, OrigVec])
            xSOL = PtDepart.x + ExtrVec.x - OrigVec.x
            ySOL = PtDepart.y + ExtrVec.y - OrigVec.y
          }
          const nomPD = PtDepart.nom
          const nomOR = OrigVec.nom
          const nomEXT = ExtrVec.nom
          const NomSOL = NomPt[CoorPt.findIndex(couple => couple[0] === xSOL && couple[1] === ySOL)]

          texte = `Sans justifier, donner l'image du point $${nomPD}$ par la translation de vecteur $\\overrightarrow{${nomOR}${nomEXT}}$.`
          texte += mathalea2d(Object.assign({ zoom: 1.75 }, fixeBordures(objets)), objets) // On trace le graphique

          if (this.interactif) {
            texte += ajouteChampTexteMathLive(this, 2 * i, 'largeur15 inline', { texte: `<br><br>L'image du point $${nomPD}$ est :` })
          }

          const VecDepl = vecteur(ExtrVec.x - OrigVec.x, ExtrVec.y - OrigVec.y) // Crée le vecteur déplacement
          const VecDeplRep = VecDepl.representant(PtDepart, 'red') // Trace le vecteur déplacement
          VecDepl.epaisseur = 2 // Variable qui grossit le tracé du vecteur
          VecDepl.styleExtremites = '->' // Donne l'extrémité du vecteur
          const nomVecDepl = VecDepl.representantNomme(PtDepart, nomOR + nomEXT, 1, 'red') // Affiche le nom du vecteur déplacement
          objets.push(PositionPt, LabelsPt, Grille, VecDeplRep, nomVecDepl)

          texteCorr = `Le point $${NomSOL}$ est l'image du point $${nomPD}$ par la translation de vecteur $\\overrightarrow{${nomOR}${nomEXT}}$.`
          texteCorr += mathalea2d(Object.assign({ zoom: 1.75 }, fixeBordures(objets)), objets) // On trace le graphique de la solution
          setReponse(this, i, NomSOL, { formatInteractif: 'texte' })
        }
          break

        case 't2': { // A partir d'un segment
          const PtDepartSeg = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R])
          let xPtArrivSeg = PtDepartSeg.x + choice([-2, 0, 2])
          let yPtArrivSeg = PtDepartSeg.y + choice([-2, 0, 2])
          while (xPtArrivSeg < 0 || xPtArrivSeg > 10 || yPtArrivSeg < 0 || yPtArrivSeg > 4 || (xPtArrivSeg === PtDepartSeg.x && yPtArrivSeg === PtDepartSeg.y)) {
            xPtArrivSeg = PtDepartSeg.x + choice([-2, 0, 2])
            yPtArrivSeg = PtDepartSeg.y + choice([-2, 0, 2])
          }
          const Seg = segment(PtDepartSeg.x, PtDepartSeg.y, xPtArrivSeg, yPtArrivSeg, 'blue')
          Seg.epaisseur = 2 // Variable qui grossit le tracé du segment
          const nomPDSeg = PtDepartSeg.nom
          const nomPASeg = NomPt[CoorPt.findIndex(couple => couple[0] === xPtArrivSeg && couple[1] === yPtArrivSeg)]
          const PtArrivSeg = Pt[CoorPt.findIndex(couple => couple[0] === xPtArrivSeg && couple[1] === yPtArrivSeg)]
          let OrigVec = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R], [PtDepartSeg, PtArrivSeg])
          let ExtrVec = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R], [PtDepartSeg, PtArrivSeg, OrigVec])
          let xSOLPDSeg = PtDepartSeg.x + ExtrVec.x - OrigVec.x
          let ySOLPDSeg = PtDepartSeg.y + ExtrVec.y - OrigVec.y
          let xSOLPASeg = PtArrivSeg.x + ExtrVec.x - OrigVec.x
          let ySOLPASeg = PtArrivSeg.y + ExtrVec.y - OrigVec.y
          while (xSOLPDSeg < 0 || xSOLPASeg < 0 || ySOLPDSeg < 0 || ySOLPASeg < 0 || xSOLPDSeg > 10 || xSOLPASeg > 10 || ySOLPDSeg > 4 || ySOLPASeg > 4) {
            OrigVec = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R], [PtDepartSeg, PtArrivSeg])
            ExtrVec = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R], [PtDepartSeg, PtArrivSeg, OrigVec])
            xSOLPDSeg = PtDepartSeg.x + ExtrVec.x - OrigVec.x
            ySOLPDSeg = PtDepartSeg.y + ExtrVec.y - OrigVec.y
            xSOLPASeg = PtArrivSeg.x + ExtrVec.x - OrigVec.x
            ySOLPASeg = PtArrivSeg.y + ExtrVec.y - OrigVec.y
          }
          const nomOR = OrigVec.nom
          const nomEXT = ExtrVec.nom
          const nomSOLPDSeg = NomPt[CoorPt.findIndex(couple => couple[0] === xSOLPDSeg && couple[1] === ySOLPDSeg)]
          const nomSOLPASeg = NomPt[CoorPt.findIndex(couple => couple[0] === xSOLPASeg && couple[1] === ySOLPASeg)]

          objets.push(PositionPt, LabelsPt, Grille, Seg)
          texte = `Sans justifier, donner l'image du segment $[${nomPDSeg}${nomPASeg}]$ par la translation de vecteur $\\overrightarrow{${nomOR}${nomEXT}}$.`
          texte += mathalea2d(Object.assign({ zoom: 1.75 }, fixeBordures(objets)), objets) // On trace le graphique

          const VecDepl = vecteur(ExtrVec.x - OrigVec.x, ExtrVec.y - OrigVec.y) // Crée le vecteur déplacement
          const VecDeplRep = VecDepl.representant(PtDepartSeg, 'red') // Trace le vecteur déplacement
          VecDepl.epaisseur = 2 // Variable qui grossit le tracé du vecteur
          VecDepl.styleExtremites = '->' // Donne l'extrémité du vecteur
          const nomVecDepl = VecDepl.representantNomme(PtDepartSeg, nomOR + nomEXT, 1, 'red') // Affiche le nom du vecteur déplacement
          const SegSOL = segment(xSOLPDSeg, ySOLPDSeg, xSOLPASeg, ySOLPASeg, 'green')
          SegSOL.epaisseur = 2 // Variable qui grossit le tracé du vecteur
          objets.push(PositionPt, LabelsPt, Grille, VecDeplRep, nomVecDepl, SegSOL)

          texteCorr = `Le segment $[${nomSOLPDSeg}${nomSOLPASeg}]$ est l'image du du segment $[${nomPDSeg}${nomPASeg}]$ par la translation de vecteur $\\overrightarrow{${nomOR}${nomEXT}}$.`
          texteCorr += mathalea2d(Object.assign({ zoom: 1.75 }, fixeBordures(objets)), objets) // On trace le graphique de la solution
        }
          break

        case 't3': { // A partir d'un triangle
          const Pt1Triangle = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R])
          let xPt2Triangle = Pt1Triangle.x + choice([-2, 0, 2])
          let yPt2Triangle = Pt1Triangle.y + choice([-2, 0, 2])
          let xPt3Triangle, yPt3Triangle
          while (xPt2Triangle < 0 || xPt2Triangle > 10 || yPt2Triangle < 0 || yPt2Triangle > 4 || (xPt2Triangle === Pt1Triangle.x && yPt2Triangle === Pt1Triangle.y)) {
            xPt2Triangle = Pt1Triangle.x + choice([-2, 0, 2])
            yPt2Triangle = Pt1Triangle.y + choice([-2, 0, 2])
          }
          if (xPt2Triangle === Pt1Triangle.x) {
            xPt3Triangle = xPt2Triangle + choice([-2, 2])
            yPt3Triangle = yPt2Triangle
          }
          if (yPt2Triangle === Pt1Triangle.y) {
            yPt3Triangle = yPt2Triangle + choice([-2, 2])
            xPt3Triangle = xPt2Triangle
          }
          if (xPt2Triangle !== Pt1Triangle.x && yPt2Triangle !== Pt1Triangle.y) {
            xPt3Triangle = choice([Pt1Triangle.x, xPt2Triangle])
            if (xPt3Triangle === Pt1Triangle.x) {
              yPt3Triangle = yPt2Triangle
            } else {
              yPt3Triangle = Pt1Triangle.y
            }
          }
          while (xPt3Triangle < 0 || xPt3Triangle > 10 || yPt3Triangle < 0 || yPt3Triangle > 4) {
            if (xPt2Triangle === Pt1Triangle.x) {
              xPt3Triangle = xPt2Triangle + choice([-2, 2])
              yPt3Triangle = yPt2Triangle
            }
            if (yPt2Triangle === Pt1Triangle.y) {
              yPt3Triangle = yPt2Triangle + choice([-2, 2])
              xPt3Triangle = xPt2Triangle
            }
            if (xPt2Triangle !== Pt1Triangle.x && yPt2Triangle !== Pt1Triangle.y) {
              xPt3Triangle = choice([Pt1Triangle.x, xPt2Triangle])
              if (xPt3Triangle === Pt1Triangle.x) {
                yPt3Triangle = yPt2Triangle
              } else {
                yPt3Triangle = Pt1Triangle.y
              }
            }
          }
          const Seg1 = segment(Pt1Triangle.x, Pt1Triangle.y, xPt2Triangle, yPt2Triangle, 'blue')
          Seg1.epaisseur = 2 // Variable qui grossit le tracé du segment
          const Seg2 = segment(Pt1Triangle.x, Pt1Triangle.y, xPt3Triangle, yPt3Triangle, 'blue')
          Seg2.epaisseur = 2 // Variable qui grossit le tracé du segment
          const Seg3 = segment(xPt2Triangle, yPt2Triangle, xPt3Triangle, yPt3Triangle, 'blue')
          Seg3.epaisseur = 2 // Variable qui grossit le tracé du segment
          const nomPD1Tri = Pt1Triangle.nom
          const nomPD2Tri = NomPt[CoorPt.findIndex(couple => couple[0] === xPt2Triangle && couple[1] === yPt2Triangle)]
          const Pt2Triangle = Pt[CoorPt.findIndex(couple => couple[0] === xPt2Triangle && couple[1] === yPt2Triangle)]
          const nomPD3Tri = NomPt[CoorPt.findIndex(couple => couple[0] === xPt3Triangle && couple[1] === yPt3Triangle)]
          const Pt3Triangle = Pt[CoorPt.findIndex(couple => couple[0] === xPt3Triangle && couple[1] === yPt3Triangle)]
          let OrigVec = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R], [Pt1Triangle, Pt2Triangle, Pt3Triangle])
          let ExtrVec = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R], [Pt1Triangle, Pt2Triangle, Pt3Triangle, OrigVec])
          let xSOLPA1Tri = Pt1Triangle.x + ExtrVec.x - OrigVec.x
          let ySOLPA1Tri = Pt1Triangle.y + ExtrVec.y - OrigVec.y
          let xSOLPA2Tri = xPt2Triangle + ExtrVec.x - OrigVec.x
          let ySOLPA2Tri = yPt2Triangle + ExtrVec.y - OrigVec.y
          let xSOLPA3Tri = xPt3Triangle + ExtrVec.x - OrigVec.x
          let ySOLPA3Tri = yPt3Triangle + ExtrVec.y - OrigVec.y
          while (xSOLPA1Tri < 0 || xSOLPA2Tri < 0 || xSOLPA3Tri < 0 || ySOLPA1Tri < 0 || ySOLPA2Tri < 0 || ySOLPA3Tri < 0 || xSOLPA1Tri > 10 || xSOLPA2Tri > 10 || xSOLPA3Tri > 10 || ySOLPA1Tri > 4 || ySOLPA2Tri > 4 || ySOLPA3Tri > 4) {
            OrigVec = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R], [Pt1Triangle, Pt2Triangle, Pt3Triangle])
            ExtrVec = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R], [Pt1Triangle, Pt2Triangle, Pt3Triangle, OrigVec])
            xSOLPA1Tri = Pt1Triangle.x + ExtrVec.x - OrigVec.x
            ySOLPA1Tri = Pt1Triangle.y + ExtrVec.y - OrigVec.y
            xSOLPA2Tri = xPt2Triangle + ExtrVec.x - OrigVec.x
            ySOLPA2Tri = yPt2Triangle + ExtrVec.y - OrigVec.y
            xSOLPA3Tri = xPt3Triangle + ExtrVec.x - OrigVec.x
            ySOLPA3Tri = yPt3Triangle + ExtrVec.y - OrigVec.y
          }
          const nomOR = OrigVec.nom
          const nomEXT = ExtrVec.nom
          const nomSOLPA1Tri = NomPt[CoorPt.findIndex(couple => couple[0] === xSOLPA1Tri && couple[1] === ySOLPA1Tri)]
          const nomSOLPA2Tri = NomPt[CoorPt.findIndex(couple => couple[0] === xSOLPA2Tri && couple[1] === ySOLPA2Tri)]
          const nomSOLPA3Tri = NomPt[CoorPt.findIndex(couple => couple[0] === xSOLPA3Tri && couple[1] === ySOLPA3Tri)]

          objets.push(PositionPt, LabelsPt, Grille, Seg1, Seg2, Seg3)
          texte = `Sans justifier, donner l'image du triangle $${nomPD1Tri}${nomPD2Tri}${nomPD3Tri}$ par la translation de vecteur $\\overrightarrow{${nomOR}${nomEXT}}$.`
          texte += mathalea2d(Object.assign({ zoom: 1.75 }, fixeBordures(objets)), objets) // On trace le graphique

          const VecDepl = vecteur(ExtrVec.x - OrigVec.x, ExtrVec.y - OrigVec.y) // Crée le vecteur déplacement
          const VecDeplRep = VecDepl.representant(Pt1Triangle, 'red') // Trace le vecteur déplacement
          VecDepl.epaisseur = 2 // Variable qui grossit le tracé du vecteur
          VecDepl.styleExtremites = '->' // Donne l'extrémité du vecteur
          const nomVecDepl = VecDepl.representantNomme(Pt1Triangle, nomOR + nomEXT, 1, 'red') // Affiche le nom du vecteur déplacement
          const SegSOL1 = segment(xSOLPA1Tri, ySOLPA1Tri, xSOLPA2Tri, ySOLPA2Tri, 'green')
          SegSOL1.epaisseur = 2 // Variable qui grossit le tracé du segment
          const SegSOL2 = segment(xSOLPA1Tri, ySOLPA1Tri, xSOLPA3Tri, ySOLPA3Tri, 'green')
          SegSOL2.epaisseur = 2 // Variable qui grossit le tracé du segment
          const SegSOL3 = segment(xSOLPA2Tri, ySOLPA2Tri, xSOLPA3Tri, ySOLPA3Tri, 'green')
          SegSOL3.epaisseur = 2 // Variable qui grossit le tracé du segment
          objets.push(PositionPt, LabelsPt, Grille, VecDeplRep, nomVecDepl, SegSOL1, SegSOL2, SegSOL3)

          texteCorr = `Le triangle $${nomSOLPA1Tri}${nomSOLPA2Tri}${nomSOLPA3Tri}$ est l'image du triangle $${nomPD1Tri}${nomPD2Tri}${nomPD3Tri}$ par la translation de vecteur $\\overrightarrow{${nomOR}${nomEXT}}$.`
          texteCorr += mathalea2d(Object.assign({ zoom: 1.75 }, fixeBordures(objets)), objets) // On trace le graphique de la solution
        }
          break
      }
      // texte += ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur15 inline', { texte: '<br><br>Ordonnée $y$ de $B$ :' })
      // setReponse(this, 2 * i + 1, yB, { formatInteractif: 'fractionEgale' })
      if (this.questionJamaisPosee(i, xB, yB)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Situations différentes ', ' 1 : À partir d\'une point\n 2 : À partir d\'une segment\n 3 : À partir d\'un triangle\n 4 : Mélange']
}
