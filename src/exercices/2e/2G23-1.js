// import { ecritureAlgebrique, ecritureParentheseSiNegatif } from '../../lib/outils/ecritures.js'
// import { setReponse } from '../../lib/interactif/gestionInteractif.js'
// import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import Exercice from '../Exercice.js'
import {
  listeQuestionsToContenu,
  randint,
  gestionnaireFormulaireTexte,
  choice
} from '../../modules/outils.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import {
  point,
  tracePoint,
  labelPoint,
  vecteur,
  nomVecteurParPosition,
  grille
} from '../../modules/2d.js'
// export const interactifReady = true
// export const interactifType = 'mathLive'
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
      const PositionPt = tracePoint(A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R)
      const LabelsPt = labelPoint(A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R)
      const Grille = grille(0, 0, 10, 4)
      objets.push(PositionPt, LabelsPt, Grille)

      switch (listeTypeDeQuestions[i]) {
        case 't1': { // A partir d'un point
          const PtDepart = choice([A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R])
          const nomPD = PtDepart.nom
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
          const nomOR = OrigVec.nom
          const nomEXT = ExtrVec.nom
          const NomSOL = NomPt[CoorPt.findIndex(couple => couple[0] === xSOL && couple[1] === ySOL)]

          texte = `Sans justifier, donner l'image du point $${nomPD}$ par la translation de vecteur $\\overrightarrow{${nomOR}${nomEXT}}$.`
          texte += mathalea2d(Object.assign({ zoom: 1.75 }, fixeBordures(objets)), objets) // On trace le graphique

          const VecDepl = vecteur(ExtrVec.x - OrigVec.x, ExtrVec.y - OrigVec.y).representant(PtDepart, 'red')
          VecDepl.epaisseur = 2 // Variable qui grossit le tracé du vecteur
          VecDepl.styleExtremites = '->'
          const nomVecDepl = nomVecteurParPosition(nomOR + nomEXT, PtDepart.x + (ExtrVec.x - OrigVec.x) / 2 + 0.35, PtDepart.y + (ExtrVec.y - OrigVec.y) / 2 + 0.35, 1, 0, 'red') // affiche le nom du vecteur
          objets.push(PositionPt, LabelsPt, Grille, VecDepl, nomVecDepl)

          texteCorr = `$${NomSOL}$ est l'image du point $${nomPD}$ par la translation de vecteur $\\overrightarrow{${nomOR}${nomEXT}}$.`
          texteCorr += mathalea2d(Object.assign({ zoom: 1.75 }, fixeBordures(objets)), objets) // On trace le graphique de la solution
        }
          break

        case 't2': { // A partir d'un segment
          const ux = randint(-9, 9, [0])

          texte = 'Sans justifier, donner l\'image du segment [AB] par la translation de vecteur $\\overrightarrow{AB}$.'

          texteCorr = `${ux}`
          texteCorr += ''
        }
          break

        case 't3': { // A partir d'un triangle
          const ux = randint(-9, 9, [0])

          texte = 'Sans justifier, donner l\'image du triangle ABC par la translation de vecteur $\\overrightarrow{AB}$.'

          texteCorr = `${ux}`
          texteCorr += ''
        }
          break
      }
      // texte += ajouteChampTexteMathLive(this, 2 * i, 'largeur15 inline', { texte: '<br><br>Abscisse $x$ de $B$ :' })
      // texte += ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur15 inline', { texte: '<br><br>Ordonnée $y$ de $B$ :' })
      // setReponse(this, 2 * i, xB, { formatInteractif: 'fractionEgale' })
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
  this.besoinFormulaireTexte = ['Situations différentes ', '1 : À partir d\'une point\n 2 : À partir d\'une segment\n 3 : À partir d\'un triangle\n4 : Mélange']
}
