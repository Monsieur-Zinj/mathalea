import Exercice from '../Exercice.js'
import { context } from '../../modules/context.js'
import { setReponse } from '../../modules/gestionInteractif.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
import { listeQuestionsToContenu, randint, arrondi, texteGras, rienSi1, combinaisonListes, abs, ecritureParentheseSiNegatif, texFractionReduite, ecritureAlgebrique } from '../../modules/outils.js'
export const titre = 'Déterminer une fonction affine'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModificationImportante = '14/05/2023'
/**
 * Déterminer une fonction affine à partir de deux images
* @author Stéphane Guyon et Gilles Mora
* 2F20
*/
export const uuid = 'ef897'
export const ref = '2F10-4'
export default function Determinerfonctionaffine () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.nbCols = 1
  this.nbColsCorr = 1
  this.nbQuestions = 3
  this.spacingCorr = context.isHtml ? 2 : 1
  this.sup = 1
  this.comment = `Dans le premier cas, les nombres $a$ et $b$ obtenus sont des nombres entiers. <br>
  Le deuxième cas est plus complexe puisque les nombres $a$ et $b$ sont des fractions. <br>
  Dans le troisième cas, les nombres $a$ et $b$ sont quelconques.`

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let typesDeQuestionsDisponibles = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [1] // on donne f(a)=b et f(c)=d cas entier
    }
    if (this.sup === 2) {
      typesDeQuestionsDisponibles = [2] // on donne f(a)=b et f(c)=d cas fraction
    }
    if (this.sup === 3) {
      typesDeQuestionsDisponibles = [3] // On donne 2 points A(a;b) et B(c;d)
    }
    if (this.sup === 4) {
      typesDeQuestionsDisponibles = [1, 2, 3] // Mélange des cas précédents
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, cpt = 0, p, c, m, k1, k2, a, b, d, e, k, reponse, pfraction, typesDeQuestions; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]

      switch (typesDeQuestions) {
        case 1:
          k = randint(-6, 6, 0)// [-1,0,1]
          a = randint(1, 9)
          c = randint(1, 9, [a])
          p = randint(-9, 9)
          b = k * a + p
          d = k * c + p
          m = new FractionEtendue(b - d, a - c).simplifie()
          texte = ` Déterminer l'expression algébrique de la fonction affine $f$ définie sur $\\mathbb R$, sachant que
                        $f(${a})=${b}$ et que $f(${c})=${d}$.`
          if (context.isDiaporama) {
            texteCorr = `$f(x)=${rienSi1(m.texFraction)}x${m.texFraction * a - b === 0 ? '' : `${ecritureAlgebrique(b - m.texFraction * a)}`}$`
          } else {
            texteCorr = `$f$ est une fonction affine, elle a donc une expression de la forme  $f(x)=ax+b$ avec $a$ et $b$ des nombres réels.
                        <br>`
            texteCorr += 'D\'après le cours, on sait que pour $u\\neq v$, $a=\\dfrac{f(u)-f(v)}{u-v}$ <br>'
            texteCorr += `Avec $u=${a}$ et  $v=${c}$, on obtient  :  $a=\\dfrac{f(${a})-f(${c})}{${a}-${ecritureParentheseSiNegatif(c)}}=\\dfrac{${b}-${ecritureParentheseSiNegatif(d)}}{${a}-${ecritureParentheseSiNegatif(c)}}=\\dfrac{${b - d}}{${a - c}}=${m.texFraction}$.<br>`
            if (b === d) { // m=0 ; cas f constante
              texteCorr += '$f$ est une fonction constante, cas particulier des fonctions affines.<br>'
              texteCorr += `On a donc : $f(x)=${b}$`
            } else {
              texteCorr += 'On en déduit que la fonction $f$ s\'écrit sous la forme : '
              texteCorr += `   $f(x)=${m.texFraction} x +b.$<br>`
              texteCorr += `${texteGras('Remarque : ')}On obtient $b$ en utilisant (au choix)   une des deux données de l'énoncé, par exemple $f(${a})=${b}$.<br>`
              texteCorr += `Comme $f(x)=${m.texFraction}x +b$, alors $f(${a})=${m.texFraction}\\times ${a}+b$, soit $f(${a})=${m.texFraction * a}+b$. On en déduit :<br>`
              texteCorr += `$\\begin{aligned}f(${a})=${b}&\\iff ${m.texFraction * a}+b=${b}\\\\`
              texteCorr += `&\\iff b=${b - m.texFraction * a}\\\\`
              texteCorr += '\\end{aligned}$<br>'

              texteCorr += `On en déduit $f(x)=${rienSi1(m.texFraction)}x${m.texFraction * a - b === 0 ? '' : `${ecritureAlgebrique(b - m.texFraction * a)}`}$.`
            }
            reponse = [`${m.texFraction}x+${p}`]
            setReponse(this, i, reponse)
            if (this.interactif) {
              texte += ajouteChampTexteMathLive(this, i, 'largeur25 inline', { texte: '$f(x)=$' })
            }
          }
          break
        case 2:
          k1 = randint(-6, 6, 0)
          k2 = randint(-6, 6, k1)
          a = randint(1, 10)
          c = randint(1, 5, [a])
          p = randint(-9, 9)
          b = k1 * a + p
          d = k2 * c + p
          m = new FractionEtendue(b - d, a - c).simplifie()
          pfraction = new FractionEtendue(b * (a - c) - (b - d) * a, a - c).simplifie()
          while (Number.isInteger((b - d) / (a - c))) {
            k1 = randint(-6, 6, 0)
            k2 = k1 + 1
            a = randint(1, 9)
            c = randint(1, 9, [a])
            p = randint(-9, 9)
            b = k1 * a + p
            d = k2 * c + p
          }
          texte = ` Déterminer l'expression algébrique de la fonction affine $f$ définie sur $\\mathbb R$, sachant que
                          $f(${a})=${b}$ et que $f(${c})=${d}$.`
          if (context.isDiaporama) {
            if ((b * (a - c) - (b - d) * a) * (a - c) > 0) {
              texteCorr = ` $f(x)=${texFractionReduite(b - d, a - c)}x+${texFractionReduite(b * (a - c) - (b - d) * a, a - c)}$.`
            }
            if ((b * (a - c) - (b - d) * a) * (a - c) < 0) { texteCorr = ` $f(x)=${texFractionReduite(b - d, a - c)}x-${texFractionReduite(abs(b * (a - c) - (b - d) * a), abs(a - c))}$.` }
            if ((b * (a - c) - (b - d) * a) * (a - c) === 0) { texteCorr = `$f(x)=${texFractionReduite(b - d, a - c)}x.` }
          } else {
            texteCorr = `$f$ est une fonction affine, elle a donc une expression de la forme  $f(x)=ax+b$ avec $a$ et $b$ des nombres réels.<br>
                          `
            texteCorr += 'D\'après le cours, on sait que pour $u\\neq v$, $a=\\dfrac{f(u)-f(v)}{u-v}$ <br>'
            texteCorr += `Avec $u=${a}$ et  $v=${c}$, on obtient  :  $a=\\dfrac{f(${a})-f(${c})}{${a}-${ecritureParentheseSiNegatif(c)}}=\\dfrac{${b}-${ecritureParentheseSiNegatif(d)}}{${a}-${ecritureParentheseSiNegatif(c)}}=\\dfrac{${b - d}}{${a - c}}$.<br>`
            texteCorr += `D'où $a=${texFractionReduite(b - d, a - c)}$.<br>`
            if (b === d) { // m=0 ; cas f constante
              texteCorr += '$f$ est une fonction constante, cas particulier des fonctions affines.<br>'
              texteCorr += `On a donc : $f(x)=${b}$`
            } else {
              texteCorr += `On en déduit que la fonction $f$ s'écrit sous la forme : $f(x)=${texFractionReduite(b - d, a - c)}x +b.$<br>`
              texteCorr += `${texteGras('Remarque : ')}On obtient $b$ en utilisant (au choix)   une des deux données de l'énoncé, par exemple $f(${a})=${b}$.<br>`
              texteCorr += `Comme $f(x)=${texFractionReduite(b - d, a - c)}x +b$, alors $f(${a})=${texFractionReduite(b - d, a - c)}\\times ${a}+b$, soit $f(${a})=${texFractionReduite((b - d) * a, a - c)}+b$. On en déduit :<br>`
              texteCorr += `$\\begin{aligned}f(${a})=${b}&\\iff ${texFractionReduite((b - d) * a, a - c)}+b=${b}\\\\`
              texteCorr += `&\\iff b=${b} ${((b - d) * a) * (a - c) > 0 ? `${texFractionReduite((b - d) * a * (-1), a - c)}` : `+${texFractionReduite(abs((b - d) * a), abs(a - c))}`}\\\\`
              texteCorr += `&\\iff b=${texFractionReduite(b * (a - c) - (b - d) * a, a - c)}\\\\`
              texteCorr += '\\end{aligned}$<br>'
              if ((b * (a - c) - (b - d) * a) * (a - c) > 0) {
                texteCorr += `Ainsi, $f(x)=${texFractionReduite(b - d, a - c)}x+${texFractionReduite(b * (a - c) - (b - d) * a, a - c)}$.`
              }
              if ((b * (a - c) - (b - d) * a) * (a - c) < 0) { texteCorr += `Ainsi, $f(x)=${texFractionReduite(b - d, a - c)}x-${texFractionReduite(abs(b * (a - c) - (b - d) * a), abs(a - c))}$.` }
              if ((b * (a - c) - (b - d) * a) * (a - c) === 0) { texteCorr += `Ainsi, $f(x)=${texFractionReduite(b - d, a - c)}x.` }
            }
            reponse = [`\\dfrac{${b - d}}{${a - c}}x+\\dfrac{${b * (a - c) - (b - d) * a}}{${a - c}}`,
            `${arrondi((b - d) / (a - c), 3)}x+\\dfrac{${b * (a - c) - (b - d) * a}}{${a - c}}`,
            `=\\dfrac{${b - d}}{${a - c}}x+${arrondi((b * (a - c) - (b - d) * a) / (a - c), 3)}`,
            `${arrondi((b - d) / (a - c), 3)}x+${arrondi((b * (a - c) - (b - d) * a) / (a - c), 3)}`,
            `${m.texFraction}x+${pfraction.texFraction}`,
            `${m.texFraction}x+${arrondi((b * (a - c) - (b - d) * a) / (a - c), 3)}`,
            `${arrondi((b - d) / (a - c), 3)}x+${pfraction.texFraction}`]
            setReponse(this, i, reponse)
            if (this.interactif) {
              texte += '<br>' + ajouteChampTexteMathLive(this, i, 'largeur25 inline nospacebefore', { texte: '$f(x)=$' })
            }
          }
          break
        case 3:
          k1 = randint(-6, 6, 0)
          k2 = randint(-6, 6, k1)
          a = randint(1, 10)
          c = randint(1, 5, [a])
          p = randint(-9, 9)
          b = k1 * a + p
          d = k2 * c + p
          m = new FractionEtendue(b - d, a - c).simplifie()
          pfraction = new FractionEtendue(b * (a - c) - (b - d) * a, a - c).simplifie()
          texte = `Déterminer, en détaillant les calculs, l'expression algébrique de la fonction affine $f$ dont la représentation  graphique $\\mathscr{C_f}$ passe par les points $A(${a};${b})$ et $B(${c};${d})$.`
          if (context.isDiaporama) {
            if ((b * (a - c) - (b - d) * a) * (a - c) > 0) {
              texteCorr = ` $f(x)=${texFractionReduite(b - d, a - c)}x+${texFractionReduite(b * (a - c) - (b - d) * a, a - c)}$.`
            }
            if ((b * (a - c) - (b - d) * a) * (a - c) < 0) { texteCorr = ` $f(x)=${texFractionReduite(b - d, a - c)}x-${texFractionReduite(abs(b * (a - c) - (b - d) * a), abs(a - c))}$.` }
            if ((b * (a - c) - (b - d) * a) * (a - c) === 0) { texteCorr = `$f(x)=${texFractionReduite(b - d, a - c)}x.` }
          } else {
            texteCorr = `$f$ est une fonction affine, elle a donc une expression de la forme  $f(x)=ax+b$ avec $a$ et $b$ des nombres réels.<br>
                          `
            texteCorr += `Comme $A(${a};${b})\\in \\mathscr{C_f}$, on a  $f(${a})=${b}$  et comme $B(${c};${d})\\in \\mathscr{C_f}$, on a $f(${c})=${d}$ <br>`
            texteCorr += 'D\'après le cours, on sait que pour $u\\neq v$, $a=\\dfrac{f(u)-f(v)}{u-v}$ <br>'
            texteCorr += `Avec $u=${a}$ et  $v=${c}$, on obtient  :  $a=\\dfrac{f(${a})-f(${c})}{${a}-${ecritureParentheseSiNegatif(c)}}=\\dfrac{${b}-${ecritureParentheseSiNegatif(d)}}{${a}-${ecritureParentheseSiNegatif(c)}}=\\dfrac{${b - d}}{${a - c}}$.<br>`
            texteCorr += `D'où $a=${texFractionReduite(b - d, a - c)}$.<br>`
            if (b === d) { // m=0 ; cas f constante
              texteCorr += '$f$ est une fonction constante, cas particulier des fonctions affines.<br>'
              texteCorr += `On a donc : $f(x)=${b}$`
            } else {
              texteCorr += 'On en déduit que la fonction $f$ s\'écrit sous la forme : '
              texteCorr += `   $f(x)=${texFractionReduite(b - d, a - c)}x +b.$<br>`
              texteCorr += `${texteGras('Remarque : ')}On obtient $b$ en utilisant (au choix)   une des deux données de l'énoncé, par exemple $f(${a})=${b}$.<br>`
              texteCorr += `Comme $f(x)=${texFractionReduite(b - d, a - c)}x +b$, alors $f(${a})=${texFractionReduite(b - d, a - c)}\\times ${a}+b$, soit $f(${a})=${texFractionReduite((b - d) * a, a - c)}+b$. On en déduit :<br>`
              texteCorr += `$\\begin{aligned}f(${a})=${b}&\\iff ${texFractionReduite((b - d) * a, a - c)}+b=${b}\\\\`
              texteCorr += `&\\iff b=${b} ${((b - d) * a) * (a - c) > 0 ? `${texFractionReduite((b - d) * a * (-1), a - c)}` : `+${texFractionReduite(abs((b - d) * a), abs(a - c))}`}\\\\`
              texteCorr += `&\\iff b=${texFractionReduite(b * (a - c) - (b - d) * a, a - c)}\\\\`
              texteCorr += '\\end{aligned}$<br>'
              if ((b * (a - c) - (b - d) * a) * (a - c) > 0) {
                texteCorr += `Ainsi, $f(x)=${texFractionReduite(b - d, a - c)}x+${texFractionReduite(b * (a - c) - (b - d) * a, a - c)}$.`
              }
              if ((b * (a - c) - (b - d) * a) * (a - c) < 0) { texteCorr += `Ainsi, $f(x)=${texFractionReduite(b - d, a - c)}x-${texFractionReduite(abs(b * (a - c) - (b - d) * a), abs(a - c))}$.` }
              if ((b * (a - c) - (b - d) * a) * (a - c) === 0) { texteCorr += `Ainsi, $f(x)=${texFractionReduite(b - d, a - c)}x.` }
            }
            reponse = [`\\dfrac{${b - d}}{${a - c}}x+\\dfrac{${b * (a - c) - (b - d) * a}}{${a - c}}`,
            `${arrondi((b - d) / (a - c), 3)}x+\\dfrac{${b * (a - c) - (b - d) * a}}{${a - c}}`,
            `=\\dfrac{${b - d}}{${a - c}}x+${arrondi((b * (a - c) - (b - d) * a) / (a - c), 3)}`,
            `${arrondi((b - d) / (a - c), 3)}x+${arrondi((b * (a - c) - (b - d) * a) / (a - c), 3)}`,
            `${m.texFraction}x+${pfraction.texFraction}`,
            `${m.texFraction}x+${arrondi((b * (a - c) - (b - d) * a) / (a - c), 3)}`,
            `${arrondi((b - d) / (a - c), 3)}x+${pfraction.texFraction}`]
            setReponse(this, i, reponse)
            if (this.interactif) {
              texte += '<br>' + ajouteChampTexteMathLive(this, i, 'largeur25 inline nospacebefore', { texte: '$f(x)=$' })
            }
          }
          break
      }
      if (this.questionJamaisPosee(i, k, a, b, c, d, e)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 4, '1 : Avec deux images (nombres entiers)\n 2 : Avec deux images (fractions)\n 3 : Avec deux points\n 4 : Mélange des cas précédents']
}
