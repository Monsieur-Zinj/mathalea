import { point, tracePoint } from '../../lib/2d/points.js'
import { repere } from '../../lib/2d/reperes.js'
import { nomVecteurParPosition, segment, vecteur } from '../../lib/2d/segmentsVecteurs.js'
import { labelPoint, texteParPosition } from '../../lib/2d/textes.ts'
import { choice } from '../../lib/outils/arrayOutils'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { creerNomDePolygone } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Calculer les coordonnées d\'un vecteur à partir des coordonnées de deux points'
export const dateDeModifImportante = '30/06/2023'

/**
 * Coordonnées d'un vecteur à partir de deux points
 * @author Stéphane Guyon & Stéphan Grignon Interactif Gilles Mora le 11 juin 2024
 */
export const uuid = 'f71c1'
export const ref = '2G24-1'
export const refs = {
  'fr-fr': ['2G24-1'],
  'fr-ch': []
}
export default function Calculercoordonneesvecteurs () {
  Exercice.call(this)
  this.titre = titre
  this.nbQuestions = 2
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 1
  this.correctionDetaillee = false
  this.correctionDetailleeDisponible = true
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let xA, yA, xB, yB, xABFraction, yABFraction, r
      const nomsPoints = creerNomDePolygone(2, ['Q', 'I', 'J', 'O', 'X', 'Y', 'Z'])
      const objets = []
      if (this.sup === 1) {
        xA = randint(-4, 4)
        yA = randint(-4, 4)
        xABFraction = new FractionEtendue(randint(-4, 4), 1)
        yABFraction = new FractionEtendue(randint(-4, 4, [xABFraction.valeurDecimale]), 1)
        xB = xA + xABFraction.valeurDecimale
        yB = yA + yABFraction.valeurDecimale
        r = repere({
          xUnite: 1,
          yUnite: 1,
          xMin: Math.min(-2, xA - 2, xB - 2, 2),
          yMin: Math.min(-2, yA - 2, yB - 2, 2),
          xMax: Math.max(-2, xA + 2, xB + 2, 2),
          yMax: Math.max(-2, yA + 2, yB + 2, 2),
          thickHauteur: 0.1,
          yLabelEcart: 0.4,
          xLabelEcart: 0.3,
          axeXStyle: '->',
          axeYStyle: '->'
        })

        texte = `Dans un repère orthonormé $(O\\,;\\,\\vec \\imath,\\,\\vec \\jmath)$, on donne les points suivants : $${nomsPoints[0]}\\left(${xA}\\,;\\,${yA}\\right)$ et $${nomsPoints[1]}\\left(${xB}\\,;\\,${yB}\\right)$.<br>`
        texte += `Déterminer les coordonnées du vecteur $\\overrightarrow{${nomsPoints[0]}${nomsPoints[1]}}$.`

        texteCorr = `$\\overrightarrow{${nomsPoints[0]}${nomsPoints[1]}}\\begin{pmatrix}${xB}-${ecritureParentheseSiNegatif(xA)}\\\\${yB}-${ecritureParentheseSiNegatif(yA)}\\end{pmatrix}$, soit $\\overrightarrow{${nomsPoints[0]}${nomsPoints[1]}}\\begin{pmatrix}${xABFraction.texFraction}\\\\${yABFraction.texFraction}\\end{pmatrix}$.<br>`
        if (this.correctionDetaillee) {
          texteCorr = 'On sait d\'après le cours que si $A(x_A\\,;\\,y_A)$ et $B(x_B\\,;\\,y_B)$ sont deux points d\'un repère, alors on a $\\overrightarrow{AB}\\begin{pmatrix}x_B-x_A\\\\y_B-y_A\\end{pmatrix}$.<br>'
          texteCorr += `On applique ici aux données de l'énoncé : $\\overrightarrow{${nomsPoints[0]}${nomsPoints[1]}}\\begin{pmatrix}${xB}-${ecritureParentheseSiNegatif(xA)}\\\\${yB}-${ecritureParentheseSiNegatif(yA)}\\end{pmatrix}$.<br>`
          texteCorr += `Ce qui donne au final : $\\overrightarrow{${nomsPoints[0]}${nomsPoints[1]}}\\begin{pmatrix}${miseEnEvidence(xABFraction.texFraction)}\\\\${miseEnEvidence(yABFraction.texFraction)}\\end{pmatrix}$.<br><br>`
        }
      } else if (this.sup === 2) {
        const listeFractions1 = [[1, 2], [3, 2], [5, 2], [1, 3], [2, 3], [4, 3], [5, 3], [1, 4], [3, 4], [5, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6]]
        const frac1 = choice(listeFractions1)
        xA = new FractionEtendue(frac1[0], frac1[1])
        xABFraction = new FractionEtendue(randint(-4, 4, [0]), 1)
        xB = xA.sommeFractions(xABFraction).simplifie()
        const frac2 = choice(listeFractions1)
        yABFraction = new FractionEtendue(frac2[0], frac2[1])
        yB = randint(-4, 4, [0])
        yA = new FractionEtendue(yB * frac2[1] - frac2[0], frac2[1])
        r = repere({
          xUnite: 1,
          yUnite: 1,
          xMin: Math.min(-2, Math.trunc(xA - 2.5), Math.trunc(xB - 2.5), 2),
          yMin: Math.min(-2, Math.trunc(yA.valeurDecimale - 2.5), Math.trunc(yB - 2.5), 2),
          xMax: Math.max(-2, Math.trunc(xA + 2.5), Math.trunc(xB + 2.5), 2),
          yMax: Math.max(-2, Math.trunc(yA.valeurDecimale + 2.5), Math.trunc(yB + 2.5), 2),
          thickHauteur: 0.1,
          yLabelEcart: 0.4,
          xLabelEcart: 0.3,
          axeXStyle: '->',
          axeYStyle: '->',
          grilleSecondaire: true,
          grilleSecondaireXDistance: 1 / frac1[1],
          grilleSecondaireYDistance: 1 / frac2[1],
          grilleSecondaireYMin: Math.min(-2, Math.trunc(yA - 2.5), Math.trunc(yB - 2.5), 2),
          grilleSecondaireYMax: Math.max(-2, Math.trunc(yA + 2.5), Math.trunc(yB + 2.5), 2),
          grilleSecondaireXMin: Math.min(-2, Math.trunc(xA - 2.5), Math.trunc(xB - 2.5), 2),
          grilleSecondaireXMax: Math.max(-2, Math.trunc(xA + 2.5), Math.trunc(xB + 2.5), 2)
        }) // On définit le repère

        texte = `Dans un repère orthonormé $(O\\,;\\,\\vec \\imath,\\,\\vec \\jmath)$, on donne les points suivants : $${nomsPoints[0]}\\left(${xA.texFSD}\\,;\\,${yA.texFSD}\\right)$ et $${nomsPoints[1]}\\left(${xB.texFSD}\\,;\\,${yB}\\right)$.<br>`
        texte += `Déterminer les coordonnées du vecteur $\\overrightarrow{${nomsPoints[0]}${nomsPoints[1]}}$.`

        texteCorr = `$\\overrightarrow{${nomsPoints[0]}${nomsPoints[1]}}\\begin{pmatrix}${xB.texFSD}-${xA.texFSP}\\\\[0.7em]${yB}-${yA.texFSP}\\end{pmatrix}$, soit $\\overrightarrow{${nomsPoints[0]}${nomsPoints[1]}}\\begin{pmatrix}${miseEnEvidence(xABFraction.texFraction)}\\\\[0.7em]${miseEnEvidence(yABFraction.texFSD)}\\end{pmatrix}$.<br>`
        if (this.correctionDetaillee) {
          texteCorr = 'On sait d\'après le cours que si $A(x_A\\,;\\,y_A)$ et $B(x_B\\,;\\,y_B)$ sont deux points d\'un repère, alors on a $\\overrightarrow{AB}\\begin{pmatrix}x_B-x_A\\\\y_B-y_A\\end{pmatrix}$.<br>'
          texteCorr += `On applique ici aux données de l'énoncé : $\\overrightarrow{${nomsPoints[0]}${nomsPoints[1]}}\\begin{pmatrix}${xB.texFSD}-${xA.texFSP}\\\\[0.7em]${yB}-${yA.texFSP}\\end{pmatrix}$.<br>`
          texteCorr += `Ce qui donne au final : $\\overrightarrow{${nomsPoints[0]}${nomsPoints[1]}}\\begin{pmatrix}${miseEnEvidence(xABFraction.texFraction)}\\\\[0.7em]${miseEnEvidence(yABFraction.texFraction)}\\end{pmatrix}$.<br><br>`
        }
      }

      const A = point(xA, yA, nomsPoints[0]) // On définit et on trace le point A
      const B = point(xB, yB, nomsPoints[1]) // On définit et on trace le point B
      const traceAetB = tracePoint(A, B, 'red') // Variable qui trace les points avec une croix
      traceAetB.taille = 1.5
      const labelAetB = labelPoint(A, B, 'red') // Variable qui trace les noms A et B
      const vecteurAB = vecteur(A, B, 'red') // On créé le vecteur AB
      const vecteurABRep = vecteurAB.representant(A, 'red') // On trace le vecteur AB
      const O = point(0, 0, 'O') // On définit et on trace le point O
      const nomO = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
      const I = point(1, 0) // On définit sans tracer le point I
      const J = point(0, 1) // On définit sans tracer le point J
      const vecteurOI = segment(O, I) // Variable qui trace [OI] en rouge
      const vecteurOJ = segment(O, J) // Variable qui trace [OJ] en rouge
      vecteurAB.styleExtremites = '->' // Variable qui transforme [AB] en vecteur
      vecteurOI.styleExtremites = '->' // Variable qui transforme [OI] en vecteur
      vecteurOJ.styleExtremites = '->' // Variable qui transforme [OJ] en vecteur
      vecteurAB.epaisseur = 1.75 // Variable qui grossit le tracé du vecteur AB
      vecteurOI.epaisseur = 1.75 // Variable qui grossit le tracé du vecteur OI
      vecteurOJ.epaisseur = 1.75 // Variable qui grossit le tracé du vecteur OJ
      vecteurOI.tailleExtremites = 2.5
      vecteurOJ.tailleExtremites = 2.5
      vecteurAB.tailleExtremites = 2.5
      // vi = vecteur(O, I) // Variable qui définit vecteur OI
      // vj = vecteur(O, J) // Variable qui définit vecteur OJ
      // nomi = vi.representantNomme(O, 'i', 2, 'red') // Variable qui trace le nom du représentant du vecteur OI en origine O
      // nomj = vj.representantNomme(O, 'j', 2, 'red')// Variable qui trace le nom du représentant du vecteur OI en origine O
      const nomi = nomVecteurParPosition('i', 0.5, -0.7, 1.5, 0)
      const nomj = nomVecteurParPosition('j', -0.7, 0.5, 1.5, 0)
      const nomAB = vecteurAB.representantNomme(A, nomsPoints[0] + nomsPoints[1], 1, 'red') // affiche le nom du vecteur
      // const nomAB = nomVecteurParPosition(nomsPoints[0] + nomsPoints[1], (xA + xB) / 2 + 1, (yA + yB) / 2 + 1, 1, 0) // affiche le nom du vecteur
      objets.push(r, traceAetB, labelAetB, vecteurOI, vecteurOJ, vecteurABRep, nomO, nomi, nomj, nomAB)

      if (this.correctionDetaillee) {
        texteCorr += `On peux vérifier graphiquement ci-dessous les coordonnées du vecteur $\\overrightarrow{${nomsPoints[0]}${nomsPoints[1]}}$.<br>`
        texteCorr += mathalea2d(Object.assign({ zoom: 2 }, fixeBordures(objets)), objets) // On trace le graphique
      }
      handleAnswers(this, i, {
        bareme: (listePoints) => [Math.min(listePoints[0], listePoints[1]), 1],
        champ1: { value: xABFraction.texFraction, compare: fonctionComparaison },
        champ2: { value: yABFraction.texFraction, compare: fonctionComparaison }
      },
      { formatInteractif: 'mathlive' })
      if (this.interactif) {
        texte += '<br>' + remplisLesBlancs(this, i,
          `\\overrightarrow{${nomsPoints[0]}${nomsPoints[1]}}\\begin{pmatrix}%{champ1}\\\\\\\\%{champ2}\\end{pmatrix}`,
          KeyboardType.clavierDeBaseAvecFraction
        )
      }

      if (this.questionJamaisPosee(i, xABFraction.texFraction, yABFraction.texFraction)) { // Si la question n'a jamais été posée, on en créé une autre
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
