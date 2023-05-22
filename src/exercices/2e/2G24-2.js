import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint, choice, ecritureParentheseSiNegatif, combinaisonListes } from '../../modules/outils.js'
import FractionEtendue from '../../modules/FractionEtendue.js'

export const titre = 'Calculer les coordonnées de la somme de deux vecteurs'
export const dateDePublication = '21/05/2023'

/**
 * Somme de deux vecteur à l'aide des coordonnées
 * @author Stéphan Grignon
 */
export const uuid = '49570'
export const ref = '2G24-2'
export default function Calculercoordonneessommevecteurs () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.nbQuestions = 2
  this.nbCols = 2
  this.nbColsCorr = 2
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
    for (let i = 0, ux, uy, vx, vy, wx, wy, a, b, f, c, d, g, xA, yA, xB, yB, xC, yC, xD, yD, texte, texteCorr, typesDeQuestions, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]

      switch (typesDeQuestions) {
        case 1:
          ux = randint(0, 9) * choice([-1, 1])
          if (ux === 0) {
            uy = randint(1, 9) * choice([-1, 1])
          } else {
            uy = randint(0, 9) * choice([-1, 1])
          } // Premier vecteur jamais nul
          vx = randint(0, 9) * choice([-1, 1])
          if (vx === 0) {
            vy = randint(1, 9) * choice([-1, 1])
          } else {
            vy = randint(0, 9) * choice([-1, 1])
          } // Second vecteur jamais nul
          wx = ux + vx
          wy = uy + vy

          texte = 'Dans un repère orthonormé $(O,\\vec i,\\vec j)$, on donne les vecteurs suivants :'
          texte += ` $\\vec{u}\\left(${ux};${uy}\\right)$ et $\\vec{v}\\left(${vx};${vy}\\right)$.`
          texte += '<br>Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{u}+\\overrightarrow{v}$.'

          texteCorr = '<br>Soit $\\vec{u}\\left(x;y\\right)$ et $\\vec{v}\\left(x\';y\'\\right)$ deux vecteurs dans un repère $(O,\\vec i,\\vec j)$.'
          texteCorr += '<br>On sait d\'après le cours que $\\overrightarrow{w}=\\overrightarrow{u}+\\overrightarrow{v}$ aura pour coordonnées $\\overrightarrow{w}\\begin{pmatrix}x+x\'  \\\\y+y\'\\end{pmatrix}$<br>'
          texteCorr += '<br>On applique ici aux données de l\'énoncé :'
          texteCorr += ` $\\overrightarrow{w}\\begin{pmatrix}${ux}+${ecritureParentheseSiNegatif(vx)}  \\\\${uy}+${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$<br>`
          texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wx}  \\\\${wy}\\end{pmatrix}$<br>`
          if (wx === 0 && wy === 0) {
            texteCorr += 'Ici $\\overrightarrow{w}$ est un vecteur nul.<br>'
            texteCorr += 'Ce résultat était prévisible puisque $\\overrightarrow{u}$ et $\\overrightarrow{v}$ sont opposés $\\overrightarrow{u}=-\\overrightarrow{v}$.<br>'
          }
          break

        case 2:
          a = randint(1, 5)
          b = randint(2, 6, [a])
          f = new FractionEtendue(a, b)
          c = randint(1, 5)
          d = randint(2, 6, [c])
          g = new FractionEtendue(c, d)
          ux = choice([f, randint(1, 9)]) * choice([-1, 1])
          uy = choice([f, randint(1, 9)], [ux]) * choice([-1, 1])
          vx = choice([g, randint(1, 9)]) * choice([-1, 1])
          vy = choice([g, randint(1, 9)], [vx]) * choice([-1, 1])
          // Chaque vecteur à une coordonnée fractionnaire
          wx = ux + vx
          wy = uy + vy

          texte = 'Dans un repère orthonormé $(O,\\vec i,\\vec j)$, on donne les vecteurs suivants :'
          texte += ` $\\vec{u}\\left(${ux};${uy}\\right)$ et $\\vec{v}\\left(${vx};${vy}\\right).$`
          texte += '<br>Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{u}+\\overrightarrow{v}$.'

          texteCorr = '<br>Soit $\\vec{u}\\left(x;y\\right)$ et $\\vec{v}\\left(x\';y\'\\right)$ deux vecteurs dans un repère $(O,\\vec i,\\vec j)$.'
          texteCorr += '<br>On sait d\'après le cours que $\\overrightarrow{w}=\\overrightarrow{u}+\\overrightarrow{v}$ aura pour coordonnées $\\overrightarrow{w}\\begin{pmatrix}x+x\'  \\\\y+y\'\\end{pmatrix}$<br>'
          texteCorr += ' <br>On applique ici aux données de l\'énoncé :'
          texteCorr += `$\\overrightarrow{w}\\begin{pmatrix}${ux}+${ecritureParentheseSiNegatif(vx)}  \\\\${uy}+${ecritureParentheseSiNegatif(vy)}\\end{pmatrix}$<br>`
          texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wx}  \\\\${wy}\\end{pmatrix}$<br>`
          if (wx === 0 && wy === 0) {
            texteCorr += 'Ici $\\overrightarrow{w}$ est un vecteur nul.<br>'
            texteCorr += 'Ce résultat était prévisible puisque $\\overrightarrow{u}$ et $\\overrightarrow{v}$ sont opposés $\\overrightarrow{u}=-\\overrightarrow{v}$.<br>'
          }
          break

        case 3:
          xA = randint(0, 9) * choice([-1, 1])
          yA = randint(0, 9, [xA]) * choice([-1, 1])
          xB = randint(0, 9) * choice([-1, 1])
          yB = randint(0, 9, [xB]) * choice([-1, 1])
          xC = randint(0, 9) * choice([-1, 1])
          yC = randint(0, 9, [xC]) * choice([-1, 1])
          xD = randint(0, 9) * choice([-1, 1])
          yD = randint(0, 9, [xD]) * choice([-1, 1])
          wx = (xB - xA) + (xD - xC)
          wy = (yB - yA) + (yD - yC)

          texte = 'Dans un repère orthonormé $(O,\\vec i,\\vec j)$, on donne les points suivants :'
          texte += ` $A\\left(${xA};${yA}\\right)$, $B\\left(${xB};${yB}\\right)$, $C\\left(${xC};${yC}\\right)$ et $D\\left(${xD};${yD}\\right)$.`
          texte += '<br>* Déterminer les coordonnées des vecteurs $\\overrightarrow{AB}$ et $\\overrightarrow{CD}$.'
          texte += '<br>* Déterminer les coordonnées du vecteur $\\overrightarrow{w}=\\overrightarrow{AB}+\\overrightarrow{CD}$.'

          texteCorr = '<br>On sait d\'après le cours, que si $A(x_A;y_A)$ et $B(x_B;y_B)$ sont deux points d\'un repère,'
          texteCorr += '<br>alors on a $\\overrightarrow{AB}\\begin{pmatrix}x_B-x_A  \\\\y_B-y_A\\end{pmatrix}$<br>'
          texteCorr += '<br>On applique ici aux données de l\'énoncé :<p>'
          texteCorr += `<br>$\\overrightarrow{AB}\\begin{pmatrix}${xB}-${ecritureParentheseSiNegatif(xA)}  \\\\${yB}-${ecritureParentheseSiNegatif(yA)}\\end{pmatrix}$ soit $\\overrightarrow{AB}\\begin{pmatrix}${xB - xA}  \\\\${yB - yA}\\end{pmatrix}$<p>`
          texteCorr += `<br>$\\overrightarrow{CD}\\begin{pmatrix}${xD}-${ecritureParentheseSiNegatif(xC)}  \\\\${yD}-${ecritureParentheseSiNegatif(yC)}\\end{pmatrix}$ soit $\\overrightarrow{CD}\\begin{pmatrix}${xD - xC}  \\\\${yD - yC}\\end{pmatrix}$<p>`
          texteCorr += '<br>Soit $\\vec{u}\\left(x;y\\right)$ et $\\vec{v}\\left(x\';y\'\\right)$ deux vecteurs dans un repère $(O,\\vec i,\\vec j)$.'
          texteCorr += '<br>On sait d\'après le cours que $\\overrightarrow{w}=\\overrightarrow{u}+\\overrightarrow{v}$ aura pour coordonnées $\\overrightarrow{w}\\begin{pmatrix}x+x\'  \\\\y+y\'\\end{pmatrix}$<br>'
          texteCorr += '<br>On applique ici aux données de l\'énoncé :'
          texteCorr += ` $\\overrightarrow{w}\\begin{pmatrix}${xB - xA}+${ecritureParentheseSiNegatif(xD - xC)}  \\\\${yB - yA}+${ecritureParentheseSiNegatif(yD - yC)}\\end{pmatrix}$<br>`
          texteCorr += `Ce qui donne au final : $\\overrightarrow{w}\\begin{pmatrix}${wx}  \\\\${wy}\\end{pmatrix}$<br>`
          if (wx === 0 && wy === 0) {
            texteCorr += 'Ici $\\overrightarrow{w}$ est un vecteur nul.<br>'
            texteCorr += 'Ce résultat était prévisible puisque $\\overrightarrow{AB}$ et $\\overrightarrow{CD}$ sont opposés $\\overrightarrow{AB}=-\\overrightarrow{CD}$.<br>'
          }
          break
      }
      if (this.questionJamaisPosee(i, ux, uy, vx, vy, wx, wy, a, b, f, c, d, g, xA, yA, xB, yB, xC, yC, xD, yD)) { // Si la question n'a jamais été posée, on en créé une autre
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
