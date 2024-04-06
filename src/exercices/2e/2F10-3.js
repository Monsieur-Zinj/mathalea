import { droite } from '../../lib/2d/droites.js'
import { point, tracePoint } from '../../lib/2d/points.js'
import { repere } from '../../lib/2d/reperes.js'
import { labelPoint, texteParPosition } from '../../lib/2d/textes.ts'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureParentheseSiNegatif, reduireAxPlusB } from '../../lib/outils/ecritures'
import { pgcd } from '../../lib/outils/primalite'
import { texteGras } from '../../lib/format/style'
import Exercice from '../Exercice'
import { mathalea2d, colorToLatexOrHTML } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { min, max } from 'mathjs'
import { fraction } from '../../modules/fractions'
export const titre = 'Représentation graphique d\'une fonction affine'
export const dateDeModifImportante = '08/05/2023'

/**
* @author Stéphane Guyon (mise à jour avec les cas Gilles Mora)
* 2F10-3
*/
export const uuid = 'c360e'
export const ref = '2F10-3'
export const refs = {
  'fr-fr': ['2F10-3'],
  'fr-ch': ['10FA5-15']
}
export default class Representerfonctionaffine extends Exercice {
  constructor () {
    super()
    this.consigne = 'Représenter graphiquement ' + (this.nbQuestions === 1 ? 'la fonction affine suivante  $f$ définie' : 'les fonctions affines suivantes  $f$ définies') + ' sur $\\mathbb R$ par :'
    this.nbQuestions = 3 // On complète le nb de questions
    this.tailleDiaporama = 3
    this.sup = 1
    this.besoinFormulaireNumerique = ['Types de question ', 3, '1 : Valeurs entières\n2 : Valeurs fractionnaires\n3 : Mélange des deux cas précédents']
  }

  nouvelleVersion () {
    this.sup = parseInt(this.sup)
    this.listeQuestions = []
    this.listeCorrections = []
    let typesDeQuestionsDisponibles = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [1]
    }
    if (this.sup === 2) {
      typesDeQuestionsDisponibles = [2]
    }
    if (this.sup === 3) {
      typesDeQuestionsDisponibles = [1, 2]
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    const textO = texteParPosition('O', -0.5, -0.5, 0, 'black', 1)
    for (let i = 0, a, b, r, c, d, tA, lA, tB, lB, xA, yA, xB, yB, f, typesDeQuestions, texte, texteCorr, cadre, cadreFenetreSvg, cpt = 0;
      i < this.nbQuestions && cpt < 50;) { // on rajoute les variables dont on a besoin
      typesDeQuestions = listeTypeDeQuestions[i]
      switch (typesDeQuestions) {
        case 1:
          {
            f = (x) => a * x + b
            a = randint(0, 3, [0]) * choice([-1, 1])// coefficient non nul a de la fonction affine
            b = randint(0, 3, [0]) * choice([-1, 1])// ordonnée à l'origine b non nulle de la fonction affine
            f = (x) => a * x + b

            xA = 0
            yA = f(xA)
            xB = randint(1, 3) * choice([-1, 1])// Abscisse de B
            yB = f(xB)// Ordonnée de B

            const A = point(xA, yA, 'A')
            const B = point(xB, yB, 'B')
            c = droite(A, B)
            c.color = colorToLatexOrHTML('red')
            c.epaisseur = 2

            cadre = {
              xMin: min(-5, xA - 1, xB - 1),
              yMin: min(-5, yA - 1, yB - 1),
              xMax: max(5, xA + 1, xB + 1),
              yMax: max(5, yA + 1, yB + 1)
            }
            // C'est bizarre mais c'est parce que dans mathAlea, les attributs n'ont pas de majuscules.
            // Donc même quand c'est le même cadre, on doit le faire.
            cadreFenetreSvg = {
              xmin: cadre.xMin,
              ymin: cadre.yMin,
              xmax: cadre.xMax,
              ymax: cadre.yMax,
              scale: 0.6
            }

            r = repere(cadre)

            tA = tracePoint(A, 'red') // Variable qui trace les points avec une croix
            tB = tracePoint(B, 'red') // Variable qui trace les points avec une croix
            lA = labelPoint(A, 'red')// Variable qui trace les nom s A et B
            lB = labelPoint(B, 'red')// Variable qui trace les nom s A et B

            tA.taille = 5
            tA.epaisseur = 2
            tB.taille = 5
            tB.epaisseur = 2

            texte = `$f(x)=${reduireAxPlusB(a, b)}$ <br>`
            if (a !== 0) {
              texteCorr = 'On sait que la représentation graphique d\'une fonction affine est une droite.<br>'
              texteCorr += 'Il suffit donc de déterminer les coordonnées de deux points pour pouvoir représenter $f$.<br>'
              texteCorr += `Comme $f(${xA})=${yA}$, on a  $A(${xA};${yA}) \\in \\mathcal{C_f}$.<br>`
              texteCorr += 'On cherche un deuxième point, et on prend un antécédent au hasard :<br>'
              texteCorr += `Soit $x=${xB}$ :<br>`
              texteCorr += `On calcule : $f(${xB})=${a} \\times ${ecritureParentheseSiNegatif(xB)}${ecritureAlgebrique(b)}=${yB}$.<br>`
              texteCorr += `On en déduit que $B(${xB};${yB}) \\in \\mathcal{C_f}$.<br>`
            } else {
              texteCorr = 'On observe que $f$ est une fonction constante.<br>'
              texteCorr += `Sa représentation graphique est donc une droite parallèle à l'axe des abscisses, d'équation $y=${yA}$.<br>`
            }
            texteCorr += mathalea2d(cadreFenetreSvg,
              lA, lB, r, c, tA, tB, textO) }
          texteCorr += `<br>${texteGras('Remarque')} : pour tracer la droite, on peut aussi utiliser le coefficient directeur de la droite ($${a}$) et son ordonnée à l'origine ($${b}$).<br>`
          break

        case 2: // cas du coefficient directeur fractionnaire
          { a = randint(-5, 5, [0]) // numérateur coefficient directeur non nul
            b = randint(-5, 5, [0]) // ordonnée à l'origine non nulle
            d = randint(2, 5) // dénominateur coefficient directeur non multiple du numérateur pour éviter nombre entier
            while (pgcd(a, d) !== 1) {
              a = randint(-5, 5, [0]) // numérateur coefficient directeur non nul
              b = randint(-5, 5, [0]) // ordonnée à l'origine non nulle
              d = randint(2, 5)
            }
            f = (x) => a / d * x + b
            xA = 0 // Abscisse de A
            yA = f(xA)// Ordonnée de A
            xB = d
            yB = f(xB)

            const A1 = point(xA, yA, 'A')
            const B1 = point(xB, yB, 'B')
            c = droite(A1, B1)
            c.color = colorToLatexOrHTML('red')
            c.epaisseur = 2

            cadre = {
              xMin: min(-5, xA - 1, xB - 1),
              yMin: min(-5, yA - 1, yB - 1),
              xMax: max(5, xA + 1, xB + 1),
              yMax: max(5, yA + 1, yB + 1)
            }

            cadreFenetreSvg = {
              xmin: cadre.xMin,
              ymin: cadre.yMin,
              xmax: cadre.xMax,
              ymax: cadre.yMax,
              scale: 0.6
            }

            texte = `$f(x)=${texFractionReduite(a, d)}x ${ecritureAlgebrique(b)}$ <br>`

            texteCorr = 'On sait que la représentation graphique d\'une fonction affine est une droite.<br>'
            texteCorr += 'Il suffit donc de déterminer les coordonnées de deux points pour pouvoir représenter $f$.<br>'
            texteCorr += `Comme $f(${xA})=${yA}$, on a : $A(${xA};${yA}) \\in \\mathcal{C_f}$.<br>`
            texteCorr += 'On cherche un deuxième point, et on prend un antécédent qui facilite les calculs :<br>'
            texteCorr += `Par exemple $x=${xB}$ :<br>`
            texteCorr += `On calcule : $f(${xB})=${texFractionReduite(a, d)} \\times ${ecritureParentheseSiNegatif(xB)}${ecritureAlgebrique(b)}=${yB}$.<br>`
            texteCorr += `On en déduit que $B(${xB};${yB}) \\in \\mathcal{C_f}$.<br>`

            tA = tracePoint(A1, 'red') // Variable qui trace les points avec une croix
            lA = labelPoint(A1, 'red')// Variable qui trace les nom s A et B
            tB = tracePoint(B1, 'red') // Variable qui trace les points avec une croix
            lB = labelPoint(B1, 'red')// Variable qui trace les nom s A et B

            r = repere(cadre)// On définit le repère
            texteCorr += mathalea2d(
              cadreFenetreSvg,
              r, c, tA, lA, tB, lB, textO)
            // On trace le graphique
            texteCorr += `<br>${texteGras('Remarque')} : pour tracer la droite, on peut aussi utiliser le coefficient directeur de la droite ($${texFractionReduite(a, d)}$) et son ordonnée à l'origine ($${b}$).<br>`
          }
          break
      }

      if (this.questionJamaisPosee(i, a, b)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}

function texFractionReduite (a, b) {
  const frac = fraction(a, b)
  return frac.simplifie().toLatex()
}
