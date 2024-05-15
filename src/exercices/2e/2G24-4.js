import { choice } from '../../lib/outils/arrayOutils'
import { texFractionReduite } from '../../lib/outils/deprecatedFractions.js'
import { ecritureAlgebrique, ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import Exercice from '../deprecatedExercice.js'
import { signe } from '../../lib/outils/nombres'

import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Calculer les coordonnées du produit d\'un vecteur par un réel'
export const dateDePublication = '28/05/2023'
export const dateDeModifImportante = '14/06/2023'

/**
 * Produit d'un vecteur par un réel
 * @author Stéphan Grignon & Jean-Claude Lhote
 */
export const uuid = '68693'
export const ref = '2G24-4'
export const refs = {
  'fr-fr': ['2G24-4'],
  'fr-ch': []
}
export default function Calculercoordonneesproduitvecteurs () {
  Exercice.call(this)
  this.titre = titre
  this.nbQuestions = 2
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = '1'
  this.correctionDetaillee = false
  this.correctionDetailleeDisponible = true
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 3,
      defaut: 1,
      melange: 4,
      nbQuestions: this.nbQuestions,
      listeOfCase: ['t1', 't2', 't3']
    })
    for (let i = 0, wx, wy, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (listeTypeDeQuestions[i]) {
        case 't1': { // On donne 2 vecteurs à coordonnées entières & k entier
          let uy, vy
          const ux = randint(-9, 9)
          if (ux === 0) {
            uy = randint(-9, 9, [0])
          } else {
            uy = randint(-9, 9)
          } // Premier vecteur jamais nul
          const vx = randint(-9, 9)
          if (vx === 0) {
            vy = randint(-9, 9, [0])
          } else {
            vy = randint(-9, 9)
          } // Second vecteur jamais nul
          const k = randint(-9, 9, [-1, 0, 1])
          // wx et wy sont entier tout comme dans 't3' mais on uniformise avec 't2' la réponse pour l'interactif
          wx = new FractionEtendue(ux + k * vx, 1)
          wy = new FractionEtendue(uy + k * vy, 1)

          texte = `Dans un repère orthonormé $(O;\\vec \\imath,\\vec \\jmath)$, on donne les vecteurs suivants : $\\vec{u}\\begin{pmatrix}${ux}\\\\${uy}\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}${vx}\\\\${vy}\\end{pmatrix}$.<br>`
          texte += `Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{u}${ecritureAlgebrique(k)}\\overrightarrow{v}$.`

          texteCorr = `$\\overrightarrow{w}\\begin{pmatrix}${ux}${ecritureAlgebrique(k)}\\times${ecritureParentheseSiNegatif(vx)}\\\\${uy}${ecritureAlgebrique(k)}\\times${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$,  soit $\\overrightarrow{w}\\begin{pmatrix}${wx.texFSD}\\\\${wy.texFSD}\\end{pmatrix}$.<br>`
          if (this.correctionDetaillee) {
            texteCorr = 'Soit $k$ un nombre réel et soit $\\vec{u}\\begin{pmatrix}x\\\\y\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}$ deux vecteurs dans un repère $(O;\\vec \\imath,\\vec \\jmath)$.<br><br>'
            texteCorr += 'On sait d\'après le cours que $k\\overrightarrow{v}\\begin{pmatrix}k \\times x\'\\\\k \\times y\'\\end{pmatrix}$ et que $\\overrightarrow{u}+\\overrightarrow{v}\\begin{pmatrix}x+x\'\\\\y+y\'\\end{pmatrix}$.<br><br>'
            texteCorr += 'Appliqué aux données de l\'énoncé :<br><br>'
            texteCorr += `$${k}\\overrightarrow{v}\\begin{pmatrix}${k}\\times${ecritureParentheseSiNegatif(vx)}\\\\${k}\\times${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$, soit $${k}\\overrightarrow{v}\\begin{pmatrix}${k * vx}\\\\${k * vy}\\end{pmatrix}$.<br><br>`
            texteCorr += `$\\overrightarrow{u}${ecritureAlgebrique(k)}\\overrightarrow{v}\\begin{pmatrix}${ux}+${ecritureParentheseSiNegatif(k * vx)}\\\\${uy}+${ecritureParentheseSiNegatif(k * vy)}\\end{pmatrix}$<br><br>`
            texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wx.texFSD}\\\\${wy.texFSD}\\end{pmatrix}$.<br>`
          }
        }
          break

        case 't2': { // On donne 1/2 vecteur à coordonnées fractionnaires & k fraction
          const listeFractions1 = [[1, 2], [3, 2], [5, 2], [1, 3], [2, 3], [4, 3], [5, 3], [1, 4],
            [3, 4], [5, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6]]
          // u vecteur à coordonnées entières
          const ux = randint(-9, 9, [0])
          const uy = randint(-9, 9, [0])
          const frac1 = choice(listeFractions1)
          const k = new FractionEtendue(frac1[0], frac1[1])
          const a = choice([-1, 1])
          const frac2 = choice(listeFractions1)
          const vx = new FractionEtendue(frac2[0], frac2[1])
          const vy = new FractionEtendue(randint(-9, 9, [0]), 1)
          wx = vx.produitFraction(k.multiplieEntier(a)).ajouteEntier(ux).simplifie()
          wy = vy.produitFraction(k.multiplieEntier(a)).ajouteEntier(uy).simplifie()

          texte = `Dans un repère orthonormé $(O;\\vec \\imath,\\vec \\jmath)$, on donne les vecteurs suivants : $\\vec{u}\\begin{pmatrix}${ux}\\\\[0.7em]${uy}\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}${vx.texFSD}\\\\[0.7em]${vy.texFSD}\\end{pmatrix}$.<br>`
          texte += `Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{u}${signe(a)}${k.texFSD}\\overrightarrow{v}$.`

          texteCorr = `$\\overrightarrow{w}\\begin{pmatrix}${ux}${signe(a)}${k.texFSD}\\times${vx.texFSD}\\\\[0.7em]${uy}${signe(a)}${k.texFSD}\\times${vy.texFSP}\\end{pmatrix}$ soit $\\overrightarrow{w}\\begin{pmatrix}${wx.texFSD}\\\\[0.7em]${wy.texFSD}\\end{pmatrix}$.`
          if (this.correctionDetaillee) {
            texteCorr = 'Soit $k$ un nombre réel et soit $\\vec{u}\\begin{pmatrix}x\\\\y\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}$ deux vecteurs dans un repère $(O;\\vec \\imath,\\vec \\jmath)$.<br><br>'
            texteCorr += 'On sait d\'après le cours que $k\\overrightarrow{v}\\begin{pmatrix}k \\times x\'\\\\k \\times y\'\\end{pmatrix}$ et que $\\overrightarrow{u}+\\overrightarrow{v}\\begin{pmatrix}x+x\'\\\\y+y\'\\end{pmatrix}$.<br><br>'
            texteCorr += 'Appliqué aux données de l\'énoncé :<br><br>'
            texteCorr += `$${texFractionReduite(frac1[0] * a, frac1[1])}\\overrightarrow{v}\\begin{pmatrix}${texFractionReduite(frac1[0] * a, frac1[1])}\\times${vx.texFSD}\\\\[0.7em]${texFractionReduite(frac1[0] * a, frac1[1])}\\times${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$ soit $${texFractionReduite(frac1[0] * a, frac1[1])}\\overrightarrow{v}\\begin{pmatrix}${texFractionReduite(a * frac1[0] * frac2[0], frac1[1] * frac2[1])}\\\\[0.7em]${texFractionReduite(a * frac1[0] * vy, frac1[1])}\\end{pmatrix}$.<br><br>`
            if (a < 0 && vy > 0) {
              texteCorr += `$\\overrightarrow{u}${signe(a)}${k.texFSD}\\overrightarrow{v}\\begin{pmatrix}${ux}+\\left(${texFractionReduite(a * frac1[0] * frac2[0], frac1[1] * frac2[1])}\\right)\\\\[0.7em]${uy}+\\left(${texFractionReduite(a * frac1[0] * vy, frac1[1])}\\right)\\end{pmatrix}$.<br><br>`
            }
            if (a > 0 && vy > 0) {
              texteCorr += `$\\overrightarrow{u}${signe(a)}${k.texFSD}\\overrightarrow{v}\\begin{pmatrix}${ux}+${texFractionReduite(a * frac1[0] * frac2[0], frac1[1] * frac2[1])}\\\\[0.7em]${uy}+${texFractionReduite(a * frac1[0] * vy, frac1[1])}\\end{pmatrix}$<br><br>`
            }
            if (a < 0 && vy < 0) {
              texteCorr += `$\\overrightarrow{u}${signe(a)}${k.texFSD}\\overrightarrow{v}\\begin{pmatrix}${ux}+\\left(${texFractionReduite(a * frac1[0] * frac2[0], frac1[1] * frac2[1])}\\right)\\\\[0.7em]${uy}+${texFractionReduite(a * frac1[0] * vy, frac1[1])}\\end{pmatrix}$<br><br>`
            }
            if (a > 0 && vy < 0) {
              texteCorr += `$\\overrightarrow{u}${signe(a)}${k.texFSD}\\overrightarrow{v}\\begin{pmatrix}${ux}+${texFractionReduite(a * frac1[0] * frac2[0], frac1[1] * frac2[1])}\\\\[0.7em]${uy}+\\left(${texFractionReduite(a * frac1[0] * vy, frac1[1])}\\right)\\end{pmatrix}$<br><br>`
            }
            texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wx.texFSD}\\\\[0.7em]${wy.texFSD}\\end{pmatrix}$.<br>`
          }
        }
          break

        case 't3': { // On donne 4 points à coordonnées entières & k entier
          const xA = randint(-9, 9)
          const yA = randint(-9, 9, xA)
          const xB = randint(-9, 9, xA)
          const yB = randint(-9, 9, [yA, xB])
          const xC = randint(-9, 9)
          const yC = randint(-9, 9, xC)
          const xD = randint(-9, 9, xC)
          const yD = randint(-9, 9, [yC, xD])
          const k = randint(-9, 9, [-1, 0, 1])
          wx = new FractionEtendue((xB - xA) + k * (xD - xC), 1)
          wy = new FractionEtendue((yB - yA) + k * (yD - yC), 1)

          texte = `Dans un repère orthonormé $(O;\\vec \\imath,\\vec \\jmath)$, on donne les points suivants : $A\\left(${xA};${yA}\\right)$, $B\\left(${xB};${yB}\\right)$, $C\\left(${xC};${yC}\\right)$ et $D\\left(${xD};${yD}\\right)$.<br>`
          texte += `Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{AB}${ecritureAlgebrique(k)}\\overrightarrow{CD}$.`

          if (this.correctionDetaillee) {
            texteCorr = 'On sait d\'après le cours que si $A(x_A;y_A)$ et $B(x_B;y_B)$ sont deux points d\'un repère, alors on a $\\overrightarrow{AB}\\begin{pmatrix}x_B-x_A\\\\y_B-y_A\\end{pmatrix}$.<br>'
            texteCorr += 'On applique ici aux données de l\'énoncé :<br><br>'
          } else {
            texteCorr = ''
          }
          texteCorr += `$\\overrightarrow{AB}\\begin{pmatrix}${xB}-${ecritureParentheseSiNegatif(xA)}\\\\${yB}-${ecritureParentheseSiNegatif(yA)}\\end{pmatrix}$, soit $\\overrightarrow{AB}\\begin{pmatrix}${xB - xA}\\\\${yB - yA}\\end{pmatrix}$.<br><br>`
          texteCorr += `$\\overrightarrow{CD}\\begin{pmatrix}${xD}-${ecritureParentheseSiNegatif(xC)}\\\\${yD}-${ecritureParentheseSiNegatif(yC)}\\end{pmatrix}$, soit $\\overrightarrow{CD}\\begin{pmatrix}${xD - xC}\\\\${yD - yC}\\end{pmatrix}$.<br><br>`
          if (this.correctionDetaillee) {
            texteCorr += 'Soit $k$ un nombre réel et soit $\\vec{u}\\begin{pmatrix}x\\\\y\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}$ deux vecteurs dans un repère $(O;\\vec \\imath,\\vec \\jmath)$.<br><br>'
            texteCorr += 'On sait d\'après le cours que $k\\overrightarrow{v}\\begin{pmatrix}k \\times x\'\\\\k \\times y\'\\end{pmatrix}$ et que $\\overrightarrow{u}+\\overrightarrow{v}\\begin{pmatrix}x+x\'\\\\y+y\'\\end{pmatrix}$.<br><br>'
            texteCorr += 'Appliqué aux données de l\'énoncé :<br><br>'
            texteCorr += `$${k}\\overrightarrow{CD}\\begin{pmatrix}${k}\\times${ecritureParentheseSiNegatif(xD - xC)}\\\\${k}\\times${ecritureParentheseSiNegatif(yD - yC)}\\end{pmatrix}$, soit $${k}\\overrightarrow{CD}\\begin{pmatrix}${k * (xD - xC)}\\\\${k * (yD - yC)}\\end{pmatrix}$.<br><br>`
            texteCorr += `$\\overrightarrow{AB}${ecritureAlgebrique(k)}\\overrightarrow{CD}\\begin{pmatrix}${xB - xA}+${ecritureParentheseSiNegatif(k * (xD - xC))}\\\\${yB - yA}+${ecritureParentheseSiNegatif(k * (yD - yC))}\\end{pmatrix}$<br><br>`
            texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wx.texFSD}\\\\${wy.texFSD}\\end{pmatrix}$.<br>`
          } else {
            texteCorr = `$\\overrightarrow{w}\\begin{pmatrix}${xB - xA}${ecritureAlgebrique(k)}\\times${ecritureParentheseSiNegatif(xD - xC)}\\\\${yB - yA}${ecritureAlgebrique(k)}\\times${ecritureParentheseSiNegatif(yD - yC)}\\end{pmatrix}$ soit $\\overrightarrow{w}\\begin{pmatrix}${wx.texFSD}\\\\${wy.texFSD}\\end{pmatrix}$.<br>`
          }
        }
          break
      }
      texte += ajouteChampTexteMathLive(this, 2 * i, 'largeur15 inline', { texteAvant: '<br><br>Composante sur $x$ de $\\overrightarrow{w}$ :' })
      texte += ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur15 inline', { texteAvant: '<br><br>Composante sur $y$ de $\\overrightarrow{w}$ :' })
      setReponse(this, 2 * i, wx, { formatInteractif: 'fractionEgale' })
      setReponse(this, 2 * i + 1, wy, { formatInteractif: 'fractionEgale' })
      if (this.questionJamaisPosee(i, wx, wy)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Situations différentes ', '1 : Coordonnées entières\n2 : Coordonnées en écriture fractionnaire\n3 : À partir de quatre points\n4 : Mélange']
}
