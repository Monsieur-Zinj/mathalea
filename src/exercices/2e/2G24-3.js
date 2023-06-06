import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint, choice, ecritureParentheseSiNegatif, combinaisonListes } from '../../modules/outils.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
export const titre = 'Calculer les coordonnées de la différence de deux vecteurs'
export const dateDePublication = '28/05/2023'

/**
 * Différence de deux vecteurs à l'aide des coordonnées
 * @author Stéphan Grignon
 */
export const uuid = '14a2c'
export const ref = '2G24-3'
export default function Calculercoordonneesdifferencevecteurs () {
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
      typeDeQuestionsDisponibles = ['t1'] // On donne 2 vecteurs à coordonnées entières
    } else {
      if (this.sup === 2) {
        typeDeQuestionsDisponibles = ['t2'] // On donne 2 vecteurs à coordonnées fractionnaires
      } else {
        if (this.sup === 3) {
          typeDeQuestionsDisponibles = ['t3'] // On donne 4 points à coordonnées entières
        } else {
          typeDeQuestionsDisponibles = ['t1', 't2', 't3']
        }
      }
    }
    const listeTypeDeQuestions = combinaisonListes(typeDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, ux, uy, vx, vy, wx, wy, a, b, c, d, listeFractions1, frac1, frac2, frac3, frac4, xA, yA, xB, yB, xC, yC, xD, yD, texte, texteCorr, typesDeQuestions, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]

      switch (typesDeQuestions) {
        case 't1': // On donne 2 vecteurs à coordonnées entières
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
          wx = ux - vx
          wy = uy - vy

          texte = `Dans un repère orthonormé $(O;\\vec \\imath,\\vec \\jmath)$, on donne les vecteurs suivants : $\\vec{u}\\begin{pmatrix}${ux}\\\\${uy}\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}${vx}\\\\${vy}\\end{pmatrix}$.<br>`
          texte += 'Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{u}-\\overrightarrow{v}$.'

          texteCorr = `$\\overrightarrow{w}\\begin{pmatrix}${ux}-${ecritureParentheseSiNegatif(vx)}\\\\${uy}-${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$ soit $\\overrightarrow{w}\\begin{pmatrix}${wx}\\\\${wy}\\end{pmatrix}$.<br>`
          if (this.correctionDetaillee) {
            texteCorr = 'Soit $\\vec{u}\\begin{pmatrix}x\\\\y\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}$ deux vecteurs dans un repère $(O;\\vec \\imath,\\vec \\jmath)$.<br>'
            texteCorr += 'On sait d\'après le cours que $\\overrightarrow{w}=\\overrightarrow{u}-\\overrightarrow{v}$ aura pour coordonnées $\\overrightarrow{w}\\begin{pmatrix}x-x\'\\\\y-y\'\\end{pmatrix}$.<br>'
            texteCorr += `On applique ici aux données de l'énoncé : $\\overrightarrow{w}\\begin{pmatrix}${ux}-${ecritureParentheseSiNegatif(vx)}\\\\${uy}-${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$.<br>`
            texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wx}\\\\${wy}\\end{pmatrix}$.<br>`
          }
          if (wx === 0 && wy === 0) {
            texteCorr += 'Ici $\\overrightarrow{w}$ est un vecteur nul.<br>'
            texteCorr += 'Ce résultat était prévisible puisque $\\overrightarrow{u}$ et $\\overrightarrow{v}$ sont égaux $\\overrightarrow{u}=\\overrightarrow{v}$.'
          }
          break

        case 't2': // On donne 2 vecteurs à coordonnées fractionnaires
          listeFractions1 = [[1, 2], [3, 2], [5, 2], [1, 3], [2, 3], [4, 3], [5, 3], [1, 4],
            [3, 4], [5, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6]]
          frac1 = choice(listeFractions1)
          ux = new FractionEtendue(frac1[0], frac1[1])
          frac2 = choice(listeFractions1)
          uy = new FractionEtendue(frac2[0], frac2[1])

          frac3 = choice(listeFractions1)
          while (frac3[1] === frac1[1]) {
            frac3 = choice(listeFractions1)
          }
          vx = new FractionEtendue(frac3[0], frac3[1])
          frac4 = choice(listeFractions1)
          while (frac4[1] === frac2[1]) {
            frac4 = choice(listeFractions1)
          }
          vy = randint(-9, 9, [0])

          a = frac1[0] * frac3[1] - frac3[0] * frac1[1]
          b = frac1[1] * frac3[1]

          c = frac2[0] - frac2[1] * vy
          d = frac2[1]

          texte = `Dans un repère orthonormé $(O;\\vec \\imath,\\vec \\jmath)$, on donne les vecteurs suivants : $\\vec{u}\\begin{pmatrix}${ux.texFraction}\\\\[0.7em]${uy.texFraction}\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}${vx.texFraction}\\\\[0.7em]${vy}\\end{pmatrix}$.<br>`
          texte += 'Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{u}-\\overrightarrow{v}$.'

          texteCorr = `$\\overrightarrow{w}\\begin{pmatrix}${ux.texFraction}-${vx.texFraction}\\\\[0.7em]${uy.texFraction}-${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$`
          if (a > 0 && c < 0) {
            wx = new FractionEtendue(a, b).simplifie()
            wy = new FractionEtendue(c * -1, d).simplifie()
            texteCorr += ` soit $\\overrightarrow{w}\\begin{pmatrix}${wx.texFraction}\\\\[0.7em]-${wy.texFraction}\\end{pmatrix}$.<br>`
          }
          if (a < 0 && c > 0) {
            wx = new FractionEtendue(a * -1, b).simplifie()
            wy = new FractionEtendue(c, d).simplifie()
            texteCorr += ` soit $\\overrightarrow{w}\\begin{pmatrix}-${wx.texFraction}\\\\[0.7em]${wy.texFraction}\\end{pmatrix}$.<br>`
          }
          if (a < 0 && c < 0) {
            wx = new FractionEtendue(a * -1, b).simplifie()
            wy = new FractionEtendue(c * -1, d).simplifie()
            texteCorr += ` soit $\\overrightarrow{w}\\begin{pmatrix}-${wx.texFraction}\\\\[0.7em]-${wy.texFraction}\\end{pmatrix}$.<br>`
          }
          if (a > 0 && c > 0) {
            wx = new FractionEtendue(a, b).simplifie()
            wy = new FractionEtendue(c, d).simplifie()
            texteCorr += ` soit $\\overrightarrow{w}\\begin{pmatrix}${wx.texFraction}\\\\[0.7em]${wy.texFraction}\\end{pmatrix}$.<br>`
          }
          if (this.correctionDetaillee) {
            texteCorr = 'Soit $\\vec{u}\\begin{pmatrix}x\\\\y\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}$ deux vecteurs dans un repère $(O;\\vec \\imath,\\vec \\jmath)$.<br>'
            texteCorr += 'On sait d\'après le cours que $\\overrightarrow{w}=\\overrightarrow{u}-\\overrightarrow{v}$ aura pour coordonnées $\\overrightarrow{w}\\begin{pmatrix}x-x\'\\\\y-y\'\\end{pmatrix}$.<br>'
            texteCorr += `On applique ici aux données de l'énoncé :
            $\\overrightarrow{w}\\begin{pmatrix}${ux.texFraction}-${vx.texFraction}\\\\[0.7em]${uy.texFraction}-${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$.<br>`
            if (a > 0 && c < 0) {
              wx = new FractionEtendue(a, b).simplifie()
              wy = new FractionEtendue(c * -1, d).simplifie()
              texteCorr += ` soit $\\overrightarrow{w}\\begin{pmatrix}${wx.texFraction}\\\\[0.7em]-${wy.texFraction}\\end{pmatrix}$.<br>`
            }
            if (a < 0 && c > 0) {
              wx = new FractionEtendue(a * -1, b).simplifie()
              wy = new FractionEtendue(c, d).simplifie()
              texteCorr += ` soit $\\overrightarrow{w}\\begin{pmatrix}-${wx.texFraction}\\\\[0.7em]${wy.texFraction}\\end{pmatrix}$.<br>`
            }
            if (a < 0 && c < 0) {
              wx = new FractionEtendue(a * -1, b).simplifie()
              wy = new FractionEtendue(c * -1, d).simplifie()
              texteCorr += ` soit $\\overrightarrow{w}\\begin{pmatrix}-${wx.texFraction}\\\\[0.7em]-${wy.texFraction}\\end{pmatrix}$.<br>`
            }
            if (a > 0 && c > 0) {
              wx = new FractionEtendue(a, b).simplifie()
              wy = new FractionEtendue(c, d).simplifie()
              texteCorr += ` soit $\\overrightarrow{w}\\begin{pmatrix}${wx.texFraction}\\\\[0.7em]${wy.texFraction}\\end{pmatrix}$.<br>`
            }
          }
          if (wx === 0 && wy === 0) {
            texteCorr += 'Ici $\\overrightarrow{w}$ est un vecteur nul.<br>'
            texteCorr += 'Ce résultat était prévisible puisque $\\overrightarrow{u}$ et $\\overrightarrow{v}$ sont égaux $\\overrightarrow{u}=\\overrightarrow{v}$.'
          }
          break

        case 't3': // On donne 4 points à coordonnées entières
          xA = randint(-9, 9)
          yA = randint(-9, 9, [xA])
          xB = randint(-9, 9)
          yB = randint(-9, 9, [xB])
          xC = randint(-9, 9)
          yC = randint(-9, 9, [xC])
          xD = randint(-9, 9)
          yD = randint(-9, 9, [xD])
          wx = (xB - xA) - (xD - xC)
          wy = (yB - yA) - (yD - yC)

          texte = `Dans un repère orthonormé $(O;\\vec \\imath,\\vec \\jmath)$, on donne les points suivants : $A\\left(${xA};${yA}\\right)$, $B\\left(${xB};${yB}\\right)$, $C\\left(${xC};${yC}\\right)$ et $D\\left(${xD};${yD}\\right)$.<br>`
          texte += 'Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{AB}-\\overrightarrow{CD}$.'

          texteCorr = `$\\overrightarrow{AB}\\begin{pmatrix}${xB}-${ecritureParentheseSiNegatif(xA)}\\\\${yB}-${ecritureParentheseSiNegatif(yA)}\\end{pmatrix}$ soit $\\overrightarrow{AB}\\begin{pmatrix}${xB - xA}\\\\${yB - yA}\\end{pmatrix}$.<br><br>`
          texteCorr += `$\\overrightarrow{CD}\\begin{pmatrix}${xD}-${ecritureParentheseSiNegatif(xC)}\\\\${yD}-${ecritureParentheseSiNegatif(yC)}\\end{pmatrix}$ soit $\\overrightarrow{CD}\\begin{pmatrix}${xD - xC}\\\\${yD - yC}\\end{pmatrix}$.<br><br>`
          texteCorr += `$\\overrightarrow{w}\\begin{pmatrix}${xB - xA}-${ecritureParentheseSiNegatif(xD - xC)}\\\\${yB - yA}-${ecritureParentheseSiNegatif(yD - yC)}\\end{pmatrix}$ soit $\\overrightarrow{w}\\begin{pmatrix}${wx}\\\\${wy}\\end{pmatrix}$.<br>`
          if (this.correctionDetaillee) {
            texteCorr = 'On sait d\'après le cours que si $A(x_A;y_A)$ et $B(x_B;y_B)$ sont deux points d\'un repère, alors on a $\\overrightarrow{AB}\\begin{pmatrix}x_B-x_A\\\\y_B-y_A\\end{pmatrix}$.<br>'
            texteCorr += 'On applique ici aux données de l\'énoncé :<br><br>'
            texteCorr += `$\\overrightarrow{AB}\\begin{pmatrix}${xB}-${ecritureParentheseSiNegatif(xA)}\\\\${yB}-${ecritureParentheseSiNegatif(yA)}\\end{pmatrix}$ soit $\\overrightarrow{AB}\\begin{pmatrix}${xB - xA}\\\\${yB - yA}\\end{pmatrix}$.<br><br>`
            texteCorr += `$\\overrightarrow{CD}\\begin{pmatrix}${xD}-${ecritureParentheseSiNegatif(xC)}\\\\${yD}-${ecritureParentheseSiNegatif(yC)}\\end{pmatrix}$ soit $\\overrightarrow{CD}\\begin{pmatrix}${xD - xC}\\\\${yD - yC}\\end{pmatrix}$.<br><br>`
            texteCorr += 'Soit $\\vec{u}\\begin{pmatrix}x\\\\y\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}$ deux vecteurs dans un repère $(O;\\vec \\imath,\\vec \\jmath)$.<br>'
            texteCorr += 'On sait d\'après le cours que $\\overrightarrow{w}=\\overrightarrow{u}-\\overrightarrow{v}$ aura pour coordonnées $\\overrightarrow{w}\\begin{pmatrix}x-x\'\\\\y-y\'\\end{pmatrix}$.<br>'
            texteCorr += `On applique ici aux données de l'énoncé : $\\overrightarrow{w}\\begin{pmatrix}${xB - xA}-${ecritureParentheseSiNegatif(xD - xC)}\\\\${yB - yA}-${ecritureParentheseSiNegatif(yD - yC)}\\end{pmatrix}$.<br>`
            texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wx}\\\\${wy}\\end{pmatrix}$.<br>`
          }
          if (wx === 0 && wy === 0) {
            texteCorr += 'Ici $\\overrightarrow{w}$ est un vecteur nul.<br>'
            texteCorr += 'Ce résultat était prévisible puisque $\\overrightarrow{AB}$ et $\\overrightarrow{CD}$ sont égaux $\\overrightarrow{AB}=\\overrightarrow{CD}$.'
          }
          break
      }
      if (this.questionJamaisPosee(i, ux, uy, vx, vy, wx, wy, a, b, c, d, listeFractions1, frac1, frac2, frac3, frac4, xA, yA, xB, yB, xC, yC, xD, yD)) { // Si la question n'a jamais été posée, on en créé une autre
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
