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
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let typesDeQuestionsDisponibles = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [1] // On donne 2 vecteurs à coordonnées entières
    }
    if (this.sup === 2) {
      typesDeQuestionsDisponibles = [2] // On donne 2 vecteurs à coordonnées fractionnaires
    }
    if (this.sup === 3) {
      typesDeQuestionsDisponibles = [3] // On donne 4 points à coordonnées entières
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, ux, uy, vx, vy, wx, wy, a, b, c, d, listeFractions1, frac1, frac2, frac3, frac4, xA, yA, xB, yB, xC, yC, xD, yD, texte, texteCorr, typesDeQuestions, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]

      switch (typesDeQuestions) {
        case 1:
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

          texte = `Dans un repère orthonormé $(O,\\vec i,\\vec j)$, on donne les vecteurs suivants : $\\vec{u}\\left(${ux};${uy}\\right)$ et $\\vec{v}\\left(${vx};${vy}\\right)$.<br>`
          texte += 'Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{u}-\\overrightarrow{v}$.'

          texteCorr = 'Soit $\\vec{u}\\left(x;y\\right)$ et $\\vec{v}\\left(x\';y\'\\right)$ deux vecteurs dans un repère $(O,\\vec i,\\vec j)$.<br>'
          texteCorr += 'On sait d\'après le cours que $\\overrightarrow{w}=\\overrightarrow{u}-\\overrightarrow{v}$ aura pour coordonnées $\\overrightarrow{w}\\begin{pmatrix}x-x\'  \\\\y-y\'\\end{pmatrix}$<br>'
          texteCorr += `On applique ici aux données de l'énoncé : $\\overrightarrow{w}\\begin{pmatrix}${ux}-${ecritureParentheseSiNegatif(vx)}  \\\\${uy}-${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$<br>`
          texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wx}  \\\\${wy}\\end{pmatrix}$<br>`
          if (wx === 0 && wy === 0) {
            texteCorr += 'Ici $\\overrightarrow{w}$ est un vecteur nul.<br>'
            texteCorr += 'Ce résultat était prévisible puisque $\\overrightarrow{u}$ et $\\overrightarrow{v}$ sont égaux $\\overrightarrow{u}=\\overrightarrow{v}$.'
          }
          break

        case 2:
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
          vy = new FractionEtendue(frac4[0], frac4[1])

          a = frac1[0] * frac3[1] - frac3[0] * frac1[1]
          b = frac1[1] * frac3[1]
          wx = new FractionEtendue(a, b).simplifie()

          c = frac2[0] * frac4[1] - frac4[0] * frac2[1]
          d = frac2[1] * frac4[1]
          wy = new FractionEtendue(c, d).simplifie()

          texte = `Dans un repère orthonormé $(O,\\vec i,\\vec j)$, on donne les vecteurs suivants : $\\vec{u}\\left(${ux.texFraction};${uy.texFraction}\\right)$ et $\\vec{v}\\left(${vx.texFraction};${vy.texFraction}\\right).$<br>`
          texte += 'Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{u}-\\overrightarrow{v}$.'

          texteCorr = 'Soit $\\vec{u}\\left(x;y\\right)$ et $\\vec{v}\\left(x\';y\'\\right)$ deux vecteurs dans un repère $(O,\\vec i,\\vec j)$.<br>'
          texteCorr += 'On sait d\'après le cours que $\\overrightarrow{w}=\\overrightarrow{u}-\\overrightarrow{v}$ aura pour coordonnées $\\overrightarrow{w}\\begin{pmatrix}x-x\'  \\\\y-y\'\\end{pmatrix}$<br>'
          texteCorr += `On applique ici aux données de l'énoncé : $\\overrightarrow{w}\\begin{pmatrix}${ux.texFraction}-${vx.texFraction}\\\\  \\\\${uy.texFraction}-${vy.texFraction}\\end{pmatrix}$<br>`
          texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wx.texFraction}\\\\  \\\\${wy.texFraction}\\end{pmatrix}$<br>`
          if (wx === 0 && wy === 0) {
            texteCorr += 'Ici $\\overrightarrow{w}$ est un vecteur nul.<br>'
            texteCorr += 'Ce résultat était prévisible puisque $\\overrightarrow{u}$ et $\\overrightarrow{v}$ sont égaux $\\overrightarrow{u}=\\overrightarrow{v}$.'
          }
          break

        case 3:
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

          texte = `Dans un repère orthonormé $(O,\\vec i,\\vec j)$, on donne les points suivants : $A\\left(${xA};${yA}\\right)$, $B\\left(${xB};${yB}\\right)$, $C\\left(${xC};${yC}\\right)$ et $D\\left(${xD};${yD}\\right)$.<br>`
          texte += '* Déterminer les coordonnées des vecteurs $\\overrightarrow{AB}$ et $\\overrightarrow{CD}$.<br>'
          texte += '* Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{AB}-\\overrightarrow{CD}$.'

          texteCorr = 'On sait d\'après le cours que si $A(x_A;y_A)$ et $B(x_B;y_B)$ sont deux points d\'un repère, alors on a $\\overrightarrow{AB}\\begin{pmatrix}x_B-x_A  \\\\y_B-y_A\\end{pmatrix}$<br>'
          texteCorr += 'On applique ici aux données de l\'énoncé :<br><br>'
          texteCorr += `$\\overrightarrow{AB}\\begin{pmatrix}${xB}-${ecritureParentheseSiNegatif(xA)}  \\\\${yB}-${ecritureParentheseSiNegatif(yA)}\\end{pmatrix}$ soit $\\overrightarrow{AB}\\begin{pmatrix}${xB - xA}  \\\\${yB - yA}\\end{pmatrix}$<br><br>`
          texteCorr += `$\\overrightarrow{CD}\\begin{pmatrix}${xD}-${ecritureParentheseSiNegatif(xC)}  \\\\${yD}-${ecritureParentheseSiNegatif(yC)}\\end{pmatrix}$ soit $\\overrightarrow{CD}\\begin{pmatrix}${xD - xC}  \\\\${yD - yC}\\end{pmatrix}$<br><br>`
          texteCorr += 'Soit $\\vec{u}\\left(x;y\\right)$ et $\\vec{v}\\left(x\';y\'\\right)$ deux vecteurs dans un repère $(O,\\vec i,\\vec j)$.<br>'
          texteCorr += 'On sait d\'après le cours que $\\overrightarrow{w}=\\overrightarrow{u}-\\overrightarrow{v}$ aura pour coordonnées $\\overrightarrow{w}\\begin{pmatrix}x-x\'  \\\\y-y\'\\end{pmatrix}$<br>'
          texteCorr += `On applique ici aux données de l'énoncé : $\\overrightarrow{w}\\begin{pmatrix}${xB - xA}-${ecritureParentheseSiNegatif(xD - xC)}  \\\\${yB - yA}-${ecritureParentheseSiNegatif(yD - yC)}\\end{pmatrix}$<br>`
          texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wx}  \\\\${wy}\\end{pmatrix}$<br>`
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
  this.besoinFormulaireNumerique = ['Situations différentes ', 3, '1 : Coordonnées entières\n 2 : Coordonnées en écriture fractionnaire\n 3 : A partir de quatre points']
}
