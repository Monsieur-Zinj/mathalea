import { setReponse } from '../../modules/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
import Exercice from '../Exercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import {
  listeQuestionsToContenu,
  randint,
  choice,
  ecritureParentheseSiNegatif
} from '../../modules/outils.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import {
  repere,
  point,
  tracePoint,
  labelPoint,
  segment,
  nomVecteurParPosition
} from '../../modules/2d.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Déterminer les coordonnées d\'un vecteur à partir des coordonnées de deux points'
export const dateDeModificationImportante = '30/06/2023'

/**
* Coordonnées d'un vecteur à partir de deux points
* @author Stéphane Guyon & Stéphan Grignon
 */
export const uuid = 'f71c1'
export const ref = '2G24-1'
export default function Calculercoordonneesvecteurs () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.nbQuestions = 2
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 1
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let xA, yA, xB, yB, xAB, yAB
      if (this.sup === 1) {
        xA = randint(-4, 4)
        yA = randint(-4, 4)
        xAB = new FractionEtendue(randint(-4, 4), 1)
        yAB = new FractionEtendue(randint(-4, 4, [xAB]), 1)
        xB = xA + xAB
        yB = yA + yAB

        texte = `Dans un repère orthonormé $(O;\\vec \\imath,\\vec \\jmath)$, on donne les points suivants : $A\\left(${xA};${yA}\\right)$ et $B\\left(${xB};${yB}\\right)$.<br>`
        texte += 'Déterminer les coordonnées du vecteur $\\overrightarrow{AB}$.'

        texteCorr = 'On sait d\'après le cours que si $A(x_A;y_A)$ et $B(x_B;y_B)$ sont deux points d\'un repère, alors on a $\\overrightarrow{AB}\\begin{pmatrix}x_B-x_A\\\\y_B-y_A\\end{pmatrix}$.<br>'
        texteCorr += `On applique ici aux données de l'énoncé : $\\overrightarrow{AB}\\begin{pmatrix}${xB}-${ecritureParentheseSiNegatif(xA)}\\\\${yB}-${ecritureParentheseSiNegatif(yA)}\\end{pmatrix}$.<br>`
        texteCorr += `Ce qui donne au final : $\\overrightarrow{AB}\\begin{pmatrix}${xAB}\\\\${yAB}\\end{pmatrix}$.<br><br>`
      } else if (this.sup === 2) {
        const listeFractions1 = [[1, 2], [3, 2], [5, 2], [1, 3], [2, 3], [4, 3], [5, 3], [1, 4], [3, 4], [5, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6]]
        const frac1 = choice(listeFractions1)
        xA = new FractionEtendue(frac1[0], frac1[1])
        xAB = new FractionEtendue(randint(-4, 4, [0]), 1)
        xB = xA.ajouteEntier(xAB).simplifie()
        const listeFractions2 = [[1, 2], [3, 2], [5, 2], [7, 2]]
        const frac2 = choice(listeFractions2)
        yAB = new FractionEtendue(frac2[0], frac2[1])
        yB = randint(-4, 4, [0])
        yA = new FractionEtendue(yB * frac2[1] - frac2[0], frac2[1])

        texte = `Dans un repère orthonormé $(O;\\vec \\imath,\\vec \\jmath)$, on donne les points suivants : $A\\left(${xA.texFSD};${yA.texFSD}\\right)$ et $B\\left(${xB.texFSD};${yB}\\right)$.<br>`
        texte += 'Déterminer les coordonnées du vecteur $\\overrightarrow{AB}$.'

        texteCorr = 'On sait d\'après le cours que si $A(x_A;y_A)$ et $B(x_B;y_B)$ sont deux points d\'un repère, alors on a $\\overrightarrow{AB}\\begin{pmatrix}x_B-x_A\\\\y_B-y_A\\end{pmatrix}$.<br>'
        texteCorr += `On applique ici aux données de l'énoncé : $\\overrightarrow{AB}\\begin{pmatrix}${xB.texFSD}-${xA.texFSP}\\\\[0.7em]${yB}-${yA.texFSP}\\end{pmatrix}$.<br>`
        texteCorr += `Ce qui donne au final : $\\overrightarrow{AB}\\begin{pmatrix}${xAB}\\\\[0.7em]${yAB.texFSD}\\end{pmatrix}$.<br><br>`
      }
      const r = repere()// On définit le repère
      const A = point(xA, yA, 'A') // On définit et on trace le point A
      const B = point(xB, yB, 'B') // On définit et on trace le point B
      const t = tracePoint(A, B, 'red') // Variable qui trace les points avec une croix
      const l = labelPoint(A, B, 'red')// Variable qui trace les nom s A et B
      const s = segment(A, B, 'red') // On trace en rouge [AB]
      const O = point(0, 0, 'O')// On définit et on trace le point O
      const o = labelPoint(O)
      const I = point(1, 0)// On définit sans tracer le point I
      const J = point(0, 1)// On définit sans tracer le point J
      const k = segment(O, I) // Variable qui trace [OI] en rouge
      const j = segment(O, J)// Variable qui trace [OJ] en rouge
      s.styleExtremites = '->'// Variable qui transforme [AB] en vecteur
      k.styleExtremites = '->'// Variable qui transforme [OI] en vecteur
      j.styleExtremites = '->'// Variable qui transforme [OJ] en vecteur
      s.epaisseur = 2// Variable qui grossit le tracé du vecteur AB
      k.epaisseur = 2// Variable qui grossit le tracé du vecteur OI
      j.epaisseur = 2// Variable qui grossit le tracé du vecteur OJ
      k.tailleExtremites = 3
      j.tailleExtremites = 3
      s.tailleExtremites = 3
      // vi = vecteur(O, I) // Variable qui définit vecteur OI
      // vj = vecteur(O, J) // Variable qui définit vecteur OJ
      // nomi = vi.representantNomme(O, 'i', 2, 'red') // Variable qui trace le nom du représentant du vecteur OI en origine O
      // nomj = vj.representantNomme(O, 'j', 2, 'red')// Variable qui trace le nom du représentant du vecteur OI en origine O
      const nomi = nomVecteurParPosition('i', 0.5, -0.7, 1.5, 0)
      const nomj = nomVecteurParPosition('j', -0.7, 0.5, 1.5, 0)
      const nomAB = nomVecteurParPosition('AB', (xA + xB) / 2 + 1, (yA + yB) / 2 + 1, 1, 0)
      texteCorr += mathalea2d({
        xmin: -9,
        ymin: -9,
        xmax: 9,
        ymax: 9
      }, r, t, l, k, j, s, o, nomi, nomj, nomAB)// On trace le graphique
      texte += ajouteChampTexteMathLive(this, 2 * i, 'largeur15 inline', { texte: '<br><br>Composante sur $x$ de $\\overrightarrow{AB}$ :' })
      texte += ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur15 inline', { texte: '<br><br>Composante sur $y$ de $\\overrightarrow{AB}$ :' })
      setReponse(this, 2 * i, xAB, { formatInteractif: 'fractionEgale' })
      setReponse(this, 2 * i + 1, yAB, { formatInteractif: 'fractionEgale' })
      if (this.questionJamaisPosee(i, xAB, yAB)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Situations différentes ', 2, '1 : Coordonnées entières\n 2 : Coordonnées en écriture fractionnaire']
}
