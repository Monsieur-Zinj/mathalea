import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint, choice, ecritureParentheseSiNegatif, combinaisonListes, signe, ecritureAlgebrique, texFractionReduite } from '../../modules/outils.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
export const titre = 'Calculer les coordonnées du produit d\'un vecteur par un réel'
export const dateDePublication = '28/05/2023'

/**
 * Produit d'un vecteur par un réel
 * @author Stéphan Grignon
 */
export const uuid = '68693'
export const ref = '2G24-4'
export default function Calculercoordonneesproduitvecteurs () {
  Exercice.call(this) // Héritage de la classe Exercice()
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
    let typeDeQuestionsDisponibles
    if (this.sup === 1) {
      typeDeQuestionsDisponibles = ['t1'] // On donne 2 vecteurs à coordonnées entières & k entier
    } else {
      if (this.sup === 2) {
        typeDeQuestionsDisponibles = ['t2'] // On donne 1/2 vecteur à coordonnées fractionnaires & k fraction
      } else {
        if (this.sup === 3) {
          typeDeQuestionsDisponibles = ['t3'] // On donne 4 points à coordonnées entières & k entier
        } else {
          typeDeQuestionsDisponibles = ['t1', 't2', 't3']
        }
      }
    }
    const listeTypeDeQuestions = combinaisonListes(typeDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, ux, uy, vx, vy, wx, wy, k, a, b, c, d, listeFractions1, frac1, frac2, frac3, frac4, xA, yA, xB, yB, xC, yC, xD, yD, texte, texteCorr, typesDeQuestions, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]

      switch (typesDeQuestions) {
        case 't1': // On donne 2 vecteurs à coordonnées entières & k entier
          ux = randint(-9, 9)
          if (ux === 0) {
            uy = randint(-9, 9, [0])
          } else {
            uy = randint(-9, 9)
          } // Premier vecteur jamais nul
          vx = randint(-9, 9)
          if (vx === 0) {
            vy = randint(-9, 9, [0])
          } else {
            vy = randint(-9, 9)
          } // Second vecteur jamais nul
          k = randint(-9, 9, [-1, 0, 1])
          wx = ux + k * vx
          wy = uy + k * vy

          texte = `Dans un repère orthonormé $(O;\\vec \\imath,\\vec \\jmath)$, on donne les vecteurs suivants : $\\vec{u}\\begin{pmatrix}${ux}\\\\${uy}\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}${vx}\\\\${vy}\\end{pmatrix}$.<br>`
          texte += `Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{u}${ecritureAlgebrique(k)}\\overrightarrow{v}$.`

          texteCorr = `$\\overrightarrow{w}\\begin{pmatrix}${ux}${ecritureAlgebrique(k)}\\times${ecritureParentheseSiNegatif(vx)}\\\\${uy}${ecritureAlgebrique(k)}\\times${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$ soit $\\overrightarrow{w}\\begin{pmatrix}${wx}\\\\${wy}\\end{pmatrix}$.<br>`
          if (this.correctionDetaillee) {
            texteCorr = 'Soit $k$ un nombre réel et soit $\\vec{u}\\begin{pmatrix}x\\\\y\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}$ deux vecteurs dans un repère $(O;\\vec \\imath,\\vec \\jmath)$.<br><br>'
            texteCorr += 'On sait d\'après le cours que $k\\overrightarrow{v}\\begin{pmatrix}k \\times x\'\\\\k \\times y\'\\end{pmatrix}$ et que $\\overrightarrow{u}+\\overrightarrow{v}\\begin{pmatrix}x+x\'\\\\y+y\'\\end{pmatrix}$.<br><br>'
            texteCorr += 'Appliqué aux données de l\'énoncé :<br><br>'
            texteCorr += `$${k}\\overrightarrow{v}\\begin{pmatrix}${k}\\times${ecritureParentheseSiNegatif(vx)}\\\\${k}\\times${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$ soit $${k}\\overrightarrow{v}\\begin{pmatrix}${k * vx}\\\\${k * vy}\\end{pmatrix}$.<br><br>`
            texteCorr += `$\\overrightarrow{u}${ecritureAlgebrique(k)}\\overrightarrow{v}\\begin{pmatrix}${ux}+${ecritureParentheseSiNegatif(k * vx)}\\\\${uy}+${ecritureParentheseSiNegatif(k * vy)}\\end{pmatrix}$.<br><br>`
            texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wx}\\\\${wy}\\end{pmatrix}$.<br>`
          }
          break

        case 't2': // On donne 1/2 vecteur à coordonnées fractionnaires & k fraction
          listeFractions1 = [[1, 2], [3, 2], [5, 2], [1, 3], [2, 3], [4, 3], [5, 3], [1, 4],
            [3, 4], [5, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6]]
          ux = randint(-9, 9, [0])
          uy = randint(-9, 9, [0])
          frac1 = choice(listeFractions1)
          k = new FractionEtendue(frac1[0], frac1[1])
          a = choice([-1, 1])
          frac2 = choice(listeFractions1)
          vx = new FractionEtendue(frac2[0], frac2[1])
          vy = randint(-9, 9, [0])
          b = ux * frac1[1] * frac2[1] + a * frac1[0] * frac2[0]
          c = frac1[1] * frac2[1]
          d = uy * frac1[1] + a * frac1[0] * vy

          texte = `Dans un repère orthonormé $(O;\\vec \\imath,\\vec \\jmath)$, on donne les vecteurs suivants : $\\vec{u}\\begin{pmatrix}${ux}\\\\[0.7em]${uy}\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}${vx.texFraction}\\\\[0.7em]${vy}\\end{pmatrix}$.<br>`
          texte += `Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{u}${signe(a)}${k.texFraction}\\overrightarrow{v}$.`

          texteCorr = `$\\overrightarrow{w}\\begin{pmatrix}${ux}${signe(a)}${k.texFraction}\\times${vx.texFraction}\\\\[0.7em]${uy}${signe(a)}${k.texFraction}\\times${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$ soit $\\overrightarrow{w}\\begin{pmatrix}${texFractionReduite(b, c)}\\\\[0.7em]${texFractionReduite(d, frac1[1])}\\end{pmatrix}$.`
          if (this.correctionDetaillee) {
            texteCorr = 'Soit $k$ un nombre réel et soit $\\vec{u}\\begin{pmatrix}x\\\\y\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}$ deux vecteurs dans un repère $(O;\\vec \\imath,\\vec \\jmath)$.<br><br>'
            texteCorr += 'On sait d\'après le cours que $k\\overrightarrow{v}\\begin{pmatrix}k \\times x\'\\\\k \\times y\'\\end{pmatrix}$ et que $\\overrightarrow{u}+\\overrightarrow{v}\\begin{pmatrix}x+x\'\\\\y+y\'\\end{pmatrix}$.<br><br>'
            texteCorr += 'Appliqué aux données de l\'énoncé :<br><br>'
            texteCorr += `$${texFractionReduite(frac1[0] * a, frac1[1])}\\overrightarrow{v}\\begin{pmatrix}${texFractionReduite(frac1[0] * a, frac1[1])}\\times${vx.texFraction}\\\\[0.7em]${texFractionReduite(frac1[0] * a, frac1[1])}\\times${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$ soit $${texFractionReduite(frac1[0] * a, frac1[1])}\\overrightarrow{v}\\begin{pmatrix}${texFractionReduite(a * frac1[0] * frac2[0], frac1[1] * frac2[1])}\\\\[0.7em]${texFractionReduite(a * frac1[0] * vy, frac1[1])}\\end{pmatrix}$.<br><br>`
            if (a < 0 && vy > 0) {
              texteCorr += `$\\overrightarrow{u}${signe(a)}${k.texFraction}\\overrightarrow{v}\\begin{pmatrix}${ux}+\\left(${texFractionReduite(a * frac1[0] * frac2[0], frac1[1] * frac2[1])}\\right)\\\\[0.7em]${uy}+\\left(${texFractionReduite(a * frac1[0] * vy, frac1[1])}\\right)\\end{pmatrix}$.<br><br>`
            }
            if (a > 0 && vy > 0) {
              texteCorr += `$\\overrightarrow{u}${signe(a)}${k.texFraction}\\overrightarrow{v}\\begin{pmatrix}${ux}+${texFractionReduite(a * frac1[0] * frac2[0], frac1[1] * frac2[1])}\\\\[0.7em]${uy}+${texFractionReduite(a * frac1[0] * vy, frac1[1])}\\end{pmatrix}$.<br><br>`
            }
            if (a < 0 && vy < 0) {
              texteCorr += `$\\overrightarrow{u}${signe(a)}${k.texFraction}\\overrightarrow{v}\\begin{pmatrix}${ux}+\\left(${texFractionReduite(a * frac1[0] * frac2[0], frac1[1] * frac2[1])}\\right)\\\\[0.7em]${uy}+${texFractionReduite(a * frac1[0] * vy, frac1[1])}\\end{pmatrix}$.<br><br>`
            }
            if (a > 0 && vy < 0) {
              texteCorr += `$\\overrightarrow{u}${signe(a)}${k.texFraction}\\overrightarrow{v}\\begin{pmatrix}${ux}+${texFractionReduite(a * frac1[0] * frac2[0], frac1[1] * frac2[1])}\\\\[0.7em]${uy}+\\left(${texFractionReduite(a * frac1[0] * vy, frac1[1])}\\right)\\end{pmatrix}$.<br><br>`
            }
            texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${texFractionReduite(b, c)}\\\\[0.7em]${texFractionReduite(d, frac1[1])}\\end{pmatrix}$.<br>`
          }
          break

        case 't3': // On donne 4 points à coordonnées entières & k entier
          xA = randint(-9, 9)
          yA = randint(-9, 9, [xA])
          xB = randint(-9, 9)
          yB = randint(-9, 9, [xB])
          xC = randint(-9, 9)
          yC = randint(-9, 9, [xC])
          xD = randint(-9, 9)
          yD = randint(-9, 9, [xD])
          k = randint(-9, 9, [-1, 0, 1])
          wx = (xB - xA) + k * (xD - xC)
          wy = (yB - yA) + k * (yD - yC)

          texte = `Dans un repère orthonormé $(O;\\vec \\imath,\\vec \\jmath)$, on donne les points suivants : $A\\left(${xA};${yA}\\right)$, $B\\left(${xB};${yB}\\right)$, $C\\left(${xC};${yC}\\right)$ et $D\\left(${xD};${yD}\\right)$.<br>`
          texte += `Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{AB}${ecritureAlgebrique(k)}\\overrightarrow{CD}$.`

          texteCorr = `$\\overrightarrow{AB}\\begin{pmatrix}${xB}-${ecritureParentheseSiNegatif(xA)}\\\\${yB}-${ecritureParentheseSiNegatif(yA)}\\end{pmatrix}$ soit $\\overrightarrow{AB}\\begin{pmatrix}${xB - xA}\\\\${yB - yA}\\end{pmatrix}$.<br><br>`
          texteCorr += `$\\overrightarrow{CD}\\begin{pmatrix}${xD}-${ecritureParentheseSiNegatif(xC)}\\\\${yD}-${ecritureParentheseSiNegatif(yC)}\\end{pmatrix}$ soit $\\overrightarrow{CD}\\begin{pmatrix}${xD - xC}\\\\${yD - yC}\\end{pmatrix}$.<br><br>`
          texteCorr += `$\\overrightarrow{w}\\begin{pmatrix}${xB - xA}${ecritureAlgebrique(k)}\\times${ecritureParentheseSiNegatif(xD - xC)}\\\\${yB - yA}${ecritureAlgebrique(k)}\\times${ecritureParentheseSiNegatif(yD - yC)}\\end{pmatrix}$ soit $\\overrightarrow{w}\\begin{pmatrix}${wx}\\\\${wy}\\end{pmatrix}$.<br>`
          if (this.correctionDetaillee) {
            texteCorr = 'On sait d\'après le cours que si $A(x_A;y_A)$ et $B(x_B;y_B)$ sont deux points d\'un repère, alors on a $\\overrightarrow{AB}\\begin{pmatrix}x_B-x_A\\\\y_B-y_A\\end{pmatrix}$.<br>'
            texteCorr += 'On applique ici aux données de l\'énoncé :<br><br>'
            texteCorr += `$\\overrightarrow{AB}\\begin{pmatrix}${xB}-${ecritureParentheseSiNegatif(xA)}\\\\${yB}-${ecritureParentheseSiNegatif(yA)}\\end{pmatrix}$ soit $\\overrightarrow{AB}\\begin{pmatrix}${xB - xA}\\\\${yB - yA}\\end{pmatrix}$.<br><br>`
            texteCorr += `$\\overrightarrow{CD}\\begin{pmatrix}${xD}-${ecritureParentheseSiNegatif(xC)}\\\\${yD}-${ecritureParentheseSiNegatif(yC)}\\end{pmatrix}$ soit $\\overrightarrow{CD}\\begin{pmatrix}${xD - xC}\\\\${yD - yC}\\end{pmatrix}$.<br><br>`
            texteCorr += 'Soit $k$ un nombre réel et soit $\\vec{u}\\begin{pmatrix}x\\\\y\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}$ deux vecteurs dans un repère $(O;\\vec \\imath,\\vec \\jmath)$.<br><br>'
            texteCorr += 'On sait d\'après le cours que $k\\overrightarrow{v}\\begin{pmatrix}k \\times x\'\\\\k \\times y\'\\end{pmatrix}$ et que $\\overrightarrow{u}+\\overrightarrow{v}\\begin{pmatrix}x+x\'\\\\y+y\'\\end{pmatrix}$.<br><br>'
            texteCorr += 'Appliqué aux données de l\'énoncé :<br><br>'
            texteCorr += `$${k}\\overrightarrow{CD}\\begin{pmatrix}${k}\\times${ecritureParentheseSiNegatif(xD - xC)}\\\\${k}\\times${ecritureParentheseSiNegatif(yD - yC)}\\end{pmatrix}$ soit $${k}\\overrightarrow{CD}\\begin{pmatrix}${k * (xD - xC)}\\\\${k * (yD - yC)}\\end{pmatrix}$.<br><br>`
            texteCorr += `$\\overrightarrow{AB}${ecritureAlgebrique(k)}\\overrightarrow{CD}\\begin{pmatrix}${xB - xA}+${ecritureParentheseSiNegatif(k * (xD - xC))}\\\\${yB - yA}+${ecritureParentheseSiNegatif(k * (yD - yC))}\\end{pmatrix}$.<br><br>`
            texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wx}\\\\${wy}\\end{pmatrix}$.<br>`
          }
          break
      }
      if (this.questionJamaisPosee(i, ux, uy, vx, vy, wx, wy, k, a, b, c, d, listeFractions1, frac1, frac2, frac3, frac4, xA, yA, xB, yB, xC, yC, xD, yD)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Situations différentes ', 4, '1 : Coordonnées entières\n 2 : Coordonnées en écriture fractionnaire\n 3 : À partir de quatre points\n4 : Mélange']
}
