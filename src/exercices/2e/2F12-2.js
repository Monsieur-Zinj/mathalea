import { courbe } from '../../lib/2d/courbes.js'
import { droite, droiteParPointEtPente } from '../../lib/2d/droites.js'
import { point } from '../../lib/2d/points.js'
import { repere } from '../../lib/2d/reperes.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { latexParCoordonnees } from '../../lib/2d/textes.ts'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { arrondi } from '../../lib/outils/nombres'
import Exercice from '../deprecatedExercice.js'

import { mathalea2d } from '../../modules/2dGeneralites.js'

import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { sqrt } from 'mathjs'
import { context } from '../../modules/context.js'

export const titre = 'Résoudre graphiquement une inéquation avec une fonction de référence'
export const dateDePublication = '14/02/2023'
/**
 * Description didactique de l'exercice
 * @author Gilles Mora
 * Référence
 */
export const uuid = '277d3'
export const ref = '2F12-2'
export const refs = {
  'fr-fr': ['2F12-2'],
  'fr-ch': []
}
export default function ResoudreGraphFonctionRef () {
  Exercice.call(this)
  this.consigne = ''
  this.nbQuestions = 1
  // this.nbQuestionsModifiable = false
  this.nbCols = 1 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
  this.sup = 4
  this.tailleDiaporama = 2 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.spacing = 1.5 // Interligne des questions
  this.spacingCorr = 1 // Interligne des réponses
  this.nouvelleVersion = function () {
    let typeDeQuestionsDisponibles
    if (this.sup === 1) {
      typeDeQuestionsDisponibles = ['typeE1', 'typeE2']
    } else if (this.sup === 2) {
      typeDeQuestionsDisponibles = ['typeE3', 'typeE4']
    } else if (this.sup === 3) {
      typeDeQuestionsDisponibles = ['typeE5', 'typeE6']
    } else if (this.sup === 4) {
      typeDeQuestionsDisponibles = ['typeE1', 'typeE2', 'typeE3', 'typeE4', 'typeE5', 'typeE6']
    }
    //
    // variables communes à tous les cas et sortis des cases et même de la boucle.
    const o = latexParCoordonnees('O', -0.2, -0.3, 'black', 0, 0, '')
    const O = point(0, 0)

    const listeTypeQuestions = combinaisonListes(typeDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // Boucle principale où i+1 correspond au numéro de la question
      const choix = choice([true, false])
      switch (listeTypeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'typeE1':// x^2<k
          {
            const a = randint(1, 30)
            const A = point(1.73, 3)
            const Ax = point(A.x, 0)
            const sAAx = segment(A, Ax)
            sAAx.epaisseur = 2
            sAAx.pointilles = 5
            const B = point(-1.73, 3)
            const Bx = point(B.x, 0)
            const sBBx = segment(B, Bx)
            sBBx.epaisseur = 2
            sBBx.pointilles = 5
            const sAxBx = segment(Bx, Ax, 'red')
            sAxBx.epaisseur = 2
            sAxBx.styleExtremites = choix ? ']-[' : '[-]'
            sAxBx.tailleExtremites = 6
            const Texte1 = latexParCoordonnees(`y=${a}`, 4, 2.7, 'green', 0, 0, '')
            const Texte2 = latexParCoordonnees('y=x^2', 3, 4.5, 'blue', 0, 0, '')
            const Texte3 = latexParCoordonnees(`-\\sqrt{${a}}`, -1.73, -0.6, 'red', 0, 0, '')
            const Texte4 = latexParCoordonnees(`\\sqrt{${a}}`, 1.73, -0.6, 'red', 0, 0, '')
            const r1 = repere({
              xMin: -4,
              yMin: -1,
              yMax: 5,
              xMax: 4,
              xUnite: 1,
              yUnite: 1,
              axeXStyle: '->',
              axeYStyle: '->',
              grilleX: false,
              grilleY: false,
              xThickListe: [0],
              yThickListe: [0],
              xLabelListe: [-6],
              yLabelListe: [-6]

            })
            const f = x => x ** 2
            const Cg = droite(point(-3, 3), point(3, 3), '', 'green')
            Cg.epaisseur = 2
            const graphique = mathalea2d({
              xmin: -5,
              xmax: 5,
              ymin: -1,
              ymax: 5,
              pixelsParCm: 30,
              scale: 0.7
            }, r1, o)
            const graphiqueC = mathalea2d({
              xmin: -6,
              xmax: 6,
              ymin: -2,
              ymax: 5,
              pixelsParCm: 30,
              scale: 1
            }, courbe(f, {
              repere: r1,
              color: 'blue',
              epaisseur: 2
            }), Cg
            , r1, o, sAAx, sBBx, sAxBx, Texte1, Texte2, Texte3, Texte4)
            texte = `Résoudre graphiquement l'inéquation : $x^2${choix ? '<' : ' \\leqslant '}${a}$.<br>`
            if (!context.isHtml) {
              texte += 'On pourra utiliser le repère suivant.<br>'
              texte += `    ${graphique}`
            }
            texteCorr = `Pour résoudre graphiquement cette inéquation : <br>
            $\\bullet$ On trace la parabole d'équation $y=x^2$. <br>
            $\\bullet$ On trace la droite horizontale d'équation $y=${a}$. Cette droite coupe la parabole en $-\\sqrt{${a}}$ et $\\sqrt{${a}}$. <br>
            $\\bullet$  Les solutions de l'inéquation sont les abscisses des points de la courbe qui se situent ${choix ? 'strictement en dessous de' : ' sur ou sous '} la droite.<br>`
            texteCorr += `${graphiqueC}<br>`

            if (a === 1 || a === 4 || a === 9 || a === 16 || a === 25) {
              texteCorr += `Comme la fonction carré est définie sur $\\mathbb{R}$ et que $\\sqrt{${a}}=${arrondi(Math.sqrt(a), 0)}$, l'ensemble des solutions de l'inéquation $x^2${choix ? '<' : ' \\leqslant '}${a}$ est :
            ${choix ? `$S=]-${arrondi(Math.sqrt(a), 0)}\\,;\\,${arrondi(Math.sqrt(a), 0)}[$.` : `$S=[-${arrondi(Math.sqrt(a), 0)}\\,;\\,${arrondi(Math.sqrt(a), 0)}]$.`} `
            } else {
              texteCorr += `Comme la fonction carré est définie sur $\\mathbb{R}$, l'ensemble des solutions de l'inéquation $x^2${choix ? '<' : ' \\leqslant '}${a}$ est : ${choix ? `$S=]-\\sqrt{${a}}\\,;\\,\\sqrt{${a}}[$` : `$S=[-\\sqrt{${a}}\\,;\\,\\sqrt{${a}}]$`}.`
            }
          }
          break

        case 'typeE2':// x^2>k
          {
            const a = randint(1, 30)
            const A = point(1.73, 3)
            const Ax = point(A.x, 0)
            const sAAx = segment(A, Ax)
            sAAx.epaisseur = 2
            sAAx.pointilles = 5
            const B = point(-1.73, 3)
            const Bx = point(B.x, 0)
            const sBBx = segment(B, Bx)
            sBBx.epaisseur = 2
            sBBx.pointilles = 5
            const BxI = point(-4, 0)
            const sBxBxI = segment(BxI, Bx, 'red')
            sBxBxI.epaisseur = 2
            sBxBxI.styleExtremites = choix ? '-[' : '-]'
            sBxBxI.tailleExtremites = 6
            const AxI = point(4, 0)
            const sAxAxI = segment(Ax, AxI, 'red')
            sAxAxI.epaisseur = 2
            sAxAxI.styleExtremites = '[-'
            sAxAxI.tailleExtremites = 6
            const Texte1 = latexParCoordonnees(`y=${a}`, 4, 2.7, 'green', 0, 0, '')
            const Texte2 = latexParCoordonnees('y=x^2', 3, 4.5, 'blue', 0, 0, '')
            const Texte3 = latexParCoordonnees(`-\\sqrt{${a}}`, -1.73, -0.6, 'red', 0, 0, '')
            const Texte4 = latexParCoordonnees(`\\sqrt{${a}}`, 1.73, -0.6, 'red', 0, 0, '')
            const r1 = repere({
              xMin: -4,
              yMin: -1,
              yMax: 5,
              xMax: 4,
              xUnite: 1,
              yUnite: 1,
              axeXStyle: '->',
              axeYStyle: '->',
              grilleX: false,
              grilleY: false,
              xThickListe: [-6],
              yThickListe: [-6],
              xLabelListe: [-6],
              yLabelListe: [-6]
            })
            const f = x => x ** 2
            const Cg = droite(point(-6, 3), point(6, 3), '', 'green')
            Cg.epaisseur = 2
            const graphique = mathalea2d({
              xmin: -5,
              xmax: 6,
              ymin: -1,
              ymax: 5,
              pixelsParCm: 30,
              scale: 0.7
            }, r1, o)
            const graphiqueC = mathalea2d({
              xmin: -5,
              xmax: 6,
              ymin: -2,
              ymax: 5.5,
              pixelsParCm: 30,
              scale: 1
            }, courbe(f, {
              repere: r1,
              color: 'blue',
              epaisseur: 2
            }),
            Cg
            , r1, o, sAAx, sBBx, sAxAxI, sBxBxI, Texte1, Texte2, Texte3, Texte4)
            texte = `Résoudre graphiquement l'inéquation : $x^2${choix ? '>' : ' \\geqslant '}${a}$.<br>`
            if (!context.isHtml) {
              texte += 'On pourra utiliser le repère suivant.<br>'
              texte += `    ${graphique}`
            }
            texteCorr = `Pour résoudre graphiquement cette inéquation : <br>
            $\\bullet$ On trace la parabole d'équation $y=x^2$. <br>
            $\\bullet$ On trace la droite horizontale d'équation $y=${a}$. <br>
            $\\bullet$    Les solutions de l'inéquation sont les abscisses des points de la courbe qui se situent ${choix ? 'strictement au dessus de' : ' sur ou au dessus de '} la droite.<br>`
            texteCorr += `${graphiqueC}<br>`

            if (a === 1 || a === 4 || a === 9 || a === 16 || a === 25) {
              texteCorr += `Comme la fonction carré est définie sur $\\mathbb{R}$ et que $\\sqrt{${a}}=${arrondi(Math.sqrt(a), 0)}$, l'ensemble des solutions de l'inéquation $x^2${choix ? '>' : ' \\geqslant '}${a}$ est :
            ${choix ? `$S=]-\\infty\\,;\\,-${arrondi(Math.sqrt(a), 0)}[\\cup ]${arrondi(Math.sqrt(a), 0)}\\,;\\, +\\infty[$.` : `$S=]-\\infty\\,;\\,-${arrondi(Math.sqrt(a), 0)}]\\cup [${arrondi(Math.sqrt(a), 0)}\\,;\\, +\\infty[$.`} `
            } else {
              texteCorr += `Comme la fonction carré est définie sur $\\mathbb{R}$, l'ensemble des solutions de l'inéquation $x^2${choix ? '>' : ' \\geqslant '}${a}$ est : ${choix ? `$S=]-\\infty\\,;\\,-\\sqrt{${a}}[\\cup ]\\sqrt{${a}}\\,;\\, +\\infty[$` : `$S=]-\\infty\\,;\\,-\\sqrt{${a}}]\\cup [\\sqrt{${a}}\\,;\\, +\\infty[$`}.`
            }
          }
          break

        case 'typeE3':// 1/x<k
          {
            const a = randint(-9, 9, [-1, 0, 1])

            const A = point(0.5, 2)
            const A2 = point(-1, -1)
            const Ax = point(A.x, 0)
            const A2x = point(A2.x, 0)
            const sAAx = segment(A, Ax)
            const sA2A2x = segment(A2, A2x)
            sAAx.epaisseur = 2
            sAAx.pointilles = 5
            sA2A2x.epaisseur = 2
            sA2A2x.pointilles = 5
            const AxI = point(-4, 0)
            const sAxIAx = segment(AxI, Ax, 'red')
            sAxIAx.epaisseur = 2
            sAxIAx.tailleExtremites = 6
            sAxIAx.styleExtremites = choix ? ']-' : '[-'
            const sA2xO = segment(A2x, O, 'red')
            sA2xO.epaisseur = 2
            sA2xO.tailleExtremites = 6
            sA2xO.styleExtremites = choix ? ']-[' : '[-['
            const sAxIO = segment(AxI, O, 'red')
            sAxIO.epaisseur = 2
            sAxIO.styleExtremites = '-['
            sAxIO.tailleExtremites = 6
            const AxI2 = point(4, 0)
            const sAxI2Ax = segment(Ax, AxI2, 'red')
            sAxI2Ax.epaisseur = 2
            sAxI2Ax.tailleExtremites = 6
            sAxI2Ax.styleExtremites = choix ? ']-' : '[-'
            const Texte1 = latexParCoordonnees(`y=${a}`, 4, 2.3, 'green', 0, 0, '')
            const Texte1B = latexParCoordonnees(`y=${a}`, 4, -1.3, 'green', 0, 0, '')
            const Texte2 = latexParCoordonnees('y=\\dfrac{1}{x}', 1.2, 3, 'blue', 0, 0, '')
            const Texte3 = latexParCoordonnees(`\\dfrac{1}{${a}}`, 0.5, -1, 'red', 0, 0, '')
            const Texte3B = latexParCoordonnees(`-\\dfrac{1}{${-a}}`, -1.2, 1, 'red', 0, 0, '')

            const r1 = repere({
              xMin: -4,
              yMin: -3,
              yMax: 4,
              xMax: 4,
              xUnite: 1,
              yUnite: 1,
              axeXStyle: '->',
              axeYStyle: '->',
              grilleX: false,
              grilleY: false,
              xThickListe: [0],
              yThickListe: [0],
              xLabelListe: [-6],
              yLabelListe: [-6]

            })
            const f = x => 1 / x
            const Cg1 = droiteParPointEtPente(point(0, 2), 0, '', 'green')
            Cg1.epaisseur = 2
            const Cg2 = droiteParPointEtPente(point(0, -1), 0, '', 'green')
            Cg2.epaisseur = 2
            const graphique = mathalea2d({
              xmin: -5,
              xmax: 5,
              ymin: -3,
              ymax: 4,
              pixelsParCm: 30,
              scale: 0.7
            }, r1, o)

            const graphiqueC1 = mathalea2d({ // 1/x<k avec k>0
              xmin: -6,
              xmax: 6,
              ymin: -3,
              ymax: 4,
              pixelsParCm: 30,
              scale: 1
            }, courbe(f, {
              repere: r1,
              color: 'blue',
              epaisseur: 2
            }),
            Cg1
            , r1, o, sAAx, sAxIO, sAxI2Ax, Texte1, Texte2, Texte3)

            const graphiqueC2 = mathalea2d({ // 1/x<k avec k<0
              xmin: -6,
              xmax: 6,
              ymin: -3,
              ymax: 4,
              pixelsParCm: 30,
              scale: 1
            }, courbe(f, {
              repere: r1,
              color: 'blue',
              epaisseur: 2
            }),
            Cg2
            , r1, o, sA2A2x, sA2xO, Texte1B, Texte2, Texte3B)

            texte = `Résoudre graphiquement l'inéquation : $\\dfrac{1}{x}${choix ? '<' : ' \\leqslant '}${a}$.<br>`
            if (!context.isHtml) {
              texte += 'On pourra utiliser le repère suivant.<br>'
              texte += `    ${graphique}`
            }
            texteCorr = `Pour résoudre graphiquement cette inéquation : <br>
            $\\bullet$ On trace l'hyperbole d'équation $y=\\dfrac{1}{x}$. <br>
            $\\bullet$ On trace la droite horizontale d'équation $y=${a}$. Cette droite coupe l'hyperbole en un point dont l'abscisse est : ${a > 0 ? `$\\dfrac{1}{${a}}$` : `$-\\dfrac{1}{${-a}}$`}.<br>
            $\\bullet$    Les solutions de l'inéquation sont les abscisses des points de la courbe qui se situent ${choix ? 'strictement en dessous de' : ' sur ou sous '} la droite.<br>`
            if (a > 0) {
              texteCorr += `${graphiqueC1}<br>`
              texteCorr += `Comme la fonction inverse est définie sur $\\mathbb{R}^*$, $0$ est une valeur interdite et donc l'ensemble des solutions de l'inéquation $\\dfrac{1}{x}${choix ? '<' : ' \\leqslant '}${a}$ est :
            ${choix ? `$S=]-\\infty\\,;\\,0[\\cup\\left]\\dfrac{1}{${a}}\\,;\\,+\\infty\\right[$.` : `$S=]-\\infty\\,;\\,0[\\cup\\left[\\dfrac{1}{${a}}\\,;\\,+\\infty\\right[$.`} `
            } else {
              texteCorr += `${graphiqueC2}<br>`
              texteCorr += `Comme la fonction inverse est définie sur $\\mathbb{R}^*$, $0$ est une valeur interdite et donc l'ensemble des solutions de l'inéquation $\\dfrac{1}{x}${choix ? '<' : ' \\leqslant '}${a}$ est :
              ${choix ? `$S=\\left]-\\dfrac{1}{${-a}}\\,;\\,0\\right[$.` : `$S=\\left[-\\dfrac{1}{${-a}}\\,;\\,0\\right[$.`} `
            }
          }

          break

        case 'typeE4':// 1/x>k
          {
            const a = randint(-9, 9, [-1, 0, 1])

            const A = point(0.5, 2)
            const A2 = point(-1, -1)
            const Ax = point(A.x, 0)
            const A2x = point(A2.x, 0)
            const sAAx = segment(A, Ax)
            const sA2A2x = segment(A2, A2x)
            sAAx.epaisseur = 2
            sAAx.pointilles = 5
            sA2A2x.epaisseur = 2
            sA2A2x.pointilles = 5
            const AxI = point(-4, 0)
            const sAxIAx = segment(Ax, AxI, 'red')
            sAxIAx.epaisseur = 2
            sAxIAx.tailleExtremites = 6
            sAxIAx.styleExtremites = choix ? ']-' : '[-'
            const AxIP = point(4, 0)
            const sAxIPAx = segment(AxIP, O, 'red')
            sAxIPAx.epaisseur = 2
            sAxIPAx.tailleExtremites = 6
            sAxIPAx.styleExtremites = '-['
            const sAxIA2x = segment(AxI, A2x, 'red')
            sAxIA2x.epaisseur = 2
            sAxIA2x.tailleExtremites = 2
            sAxIA2x.styleExtremites = choix ? '-[' : '-]'
            const sA2xO = segment(A2x, O, 'red')
            sA2xO.epaisseur = 2
            sA2xO.tailleExtremites = 6
            sA2xO.styleExtremites = choix ? ']-[' : '[-['
            const sAxO = segment(Ax, O, 'red')
            sAxO.epaisseur = 2
            sAxO.tailleExtremites = 6
            sAxO.styleExtremites = choix ? ']-[' : '[-['
            const Texte1 = latexParCoordonnees(`y=${a}`, 4, 2.3, 'green', 0, 0, '')
            const Texte1B = latexParCoordonnees(`y=${a}`, 4, -1.3, 'green', 0, 0, '')
            const Texte2 = latexParCoordonnees('y=\\dfrac{1}{x}', 1.2, 3, 'blue', 0, 0, '')
            const Texte3 = latexParCoordonnees(`\\dfrac{1}{${a}}`, 0.5, -1, 'red', 0, 0, '')
            const Texte3B = latexParCoordonnees(`-\\dfrac{1}{${-a}}`, -1.2, 1, 'red', 0, 0, '')
            const r1 = repere({
              xMin: -4,
              yMin: -3,
              yMax: 4,
              xMax: 4,
              xUnite: 1,
              yUnite: 1,
              axeXStyle: '->',
              axeYStyle: '->',
              grilleX: false,
              grilleY: false,
              xThickListe: [0],
              yThickListe: [0],
              xLabelListe: [-6],
              yLabelListe: [-6]

            })
            const f = x => 1 / x
            const Cg1 = droiteParPointEtPente(point(0, 2), 0, '', 'green')
            Cg1.epaisseur = 2
            const Cg2 = droiteParPointEtPente(point(0, -1), 0, '', 'green')
            Cg2.epaisseur = 2
            const graphique = mathalea2d({
              xmin: -5,
              xmax: 5,
              ymin: -3,
              ymax: 4,
              pixelsParCm: 30,
              scale: 0.7
            }, r1, o)

            const graphiqueC1 = mathalea2d({ // 1/x>k avec a>0
              xmin: -6,
              xmax: 6,
              ymin: -3,
              ymax: 4,
              pixelsParCm: 30,
              scale: 1
            }, courbe(f, {
              repere: r1,
              color: 'blue',
              epaisseur: 2
            }),
            Cg1, r1, o, sAAx, sAxO, Texte1, Texte2, Texte3)

            const graphiqueC2 = mathalea2d({ // 1/x>k avec a<0
              xmin: -6,
              xmax: 6,
              ymin: -3,
              ymax: 4,
              pixelsParCm: 30,
              scale: 1
            }, courbe(f, {
              repere: r1,
              color: 'blue',
              epaisseur: 2
            }),
            Cg2, r1, o, sA2A2x, sAxIA2x, sAxIPAx, Texte1B, Texte2, Texte3B)
            texte = `Résoudre graphiquement l'inéquation : $\\dfrac{1}{x}${choix ? '>' : ' \\geqslant '}${a}$.<br>`
            if (!context.isHtml) {
              texte += 'On pourra utiliser le repère suivant.<br>'
              texte += `    ${graphique}`
            }
            texteCorr = `Pour résoudre graphiquement cette inéquation : <br>
            $\\bullet$ On trace l'hyperbole d'équation $y=\\dfrac{1}{x}$. <br>
            $\\bullet$ On trace la droite horizontale d'équation $y=${a}$. Cette droite coupe l'hyperbole en un point dont l'abscisse est : ${a > 0 ? `$\\dfrac{1}{${a}}$` : `$-\\dfrac{1}{${-a}}$`}. <br>
            $\\bullet$    Les solutions de l'inéquation sont les abscisses des points de la courbe qui se situent ${choix ? 'strictement au dessus de' : ' sur ou au dessus de '} la droite.<br>`
            if (a > 0) {
              texteCorr += `${graphiqueC1}<br>`
              texteCorr += `Comme la fonction inverse est définie sur $\\mathbb{R}^*$, $0$ est une valeur interdite et donc l'ensemble des solutions de l'inéquation $\\dfrac{1}{x}${choix ? '>' : ' \\geqslant '}${a}$ est :
            ${choix ? `$S=\\left]0\\,;\\,\\dfrac{1}{${a}}\\right[$.` : `$S=\\left]0\\,;\\,\\dfrac{1}{${a}}\\right]$.`} `
            } else {
              texteCorr += `${graphiqueC2}<br>`
              texteCorr += `Comme la fonction inverse est définie sur $\\mathbb{R}^*$, $0$ est une valeur interdite et donc l'ensemble des solutions de l'inéquation $\\dfrac{1}{x}${choix ? '>' : ' \\geqslant '}${a}$ est :
              ${choix ? `$S=\\left]-\\infty\\,;\\,-\\dfrac{1}{${-a}}\\right[\\cup ]0\\,;\\,+\\infty[$.` : `$S=\\left]-\\infty\\,;\\,-\\dfrac{1}{${-a}}\\right]\\cup ]0\\,;\\,+\\infty[$.`} `
            }
          }

          break

        case 'typeE5':// sqrt(x)<k
          {
            const a = randint(1, 12)
            const A = point(2.25, 1.5)
            const Ax = point(A.x, 0)
            const sAAx = segment(A, Ax)
            sAAx.epaisseur = 2
            sAAx.pointilles = 5
            const sAxBx = segment(O, Ax, 'red')
            sAxBx.epaisseur = 2
            sAxBx.tailleExtremites = 6
            sAxBx.styleExtremites = choix ? '[-[' : '[-]'
            const Texte1 = latexParCoordonnees(`y=${a}`, 4, 1.2, 'green', 0, 0, '')
            const Texte2 = latexParCoordonnees('y=\\sqrt{x}', 3, 2.3, 'blue', 0, 0, '')
            const Texte3 = latexParCoordonnees(`${a ** 2}`, 2.25, -0.6, 'red', 0, 0, '')
            const r1 = repere({
              xMin: -1,
              yMin: -1,
              yMax: 4,
              xMax: 5,
              xUnite: 1,
              yUnite: 1,
              axeXStyle: '->',
              axeYStyle: '->',
              grilleX: false,
              grilleY: false,
              xThickListe: [0],
              yThickListe: [0],
              xLabelListe: [-6],
              yLabelListe: [-6]

            })
            const f = x => sqrt(x)
            const Cg = droiteParPointEtPente(point(0, 1.5), 0, '', 'green')
            Cg.epaisseur = 2
            const graphique = mathalea2d({
              xmin: -2,
              xmax: 6,
              ymin: -1,
              ymax: 4,
              pixelsParCm: 30,
              scale: 0.7
            }, r1, o)
            const graphiqueC = mathalea2d({
              xmin: -1,
              xmax: 5,
              ymin: -1,
              ymax: 4,
              pixelsParCm: 30,
              scale: 1
            }, courbe(f, {
              repere: r1,
              color: 'blue',
              epaisseur: 2
            }),
            Cg
            , r1, o, sAAx, sAxBx, Texte1, Texte2, Texte3)
            texte = `Résoudre graphiquement l'inéquation : $\\sqrt{x}${choix ? '<' : ' \\leqslant '}${a}$.<br>`
            if (!context.isHtml) {
              texte += 'On pourra utiliser le repère suivant.<br>'
              texte += `    ${graphique}`
            }
            texteCorr = `Pour résoudre graphiquement cette inéquation : <br>
            $\\bullet$ On trace la courbe d'équation $y=\\sqrt{x}$. <br>
            $\\bullet$ On trace la droite horizontale d'équation $y=${a}$. Cette droite coupe la courbe en $${a}^2=${a ** 2}$. <br>
            $\\bullet$  Les solutions de l'inéquation sont les abscisses des points de la courbe qui se situent ${choix ? 'strictement en dessous de' : ' sur ou sous '} la droite.<br>`
            texteCorr += `${graphiqueC}<br>`
            texteCorr += `Comme la fonction racine carrée est définie sur $[0\\,;\\,+\\infty[$, l'ensemble des solutions de l'inéquation $\\sqrt{x}${choix ? '<' : ' \\leqslant '}${a}$ est :
            ${choix ? `$S=[0\\,;\\,${a ** 2}[$.` : `$S=[0\\,;\\,${a ** 2}]$.`} `
          }
          break
        case 'typeE6':// sqrt(x)>k
          {
            const a = randint(1, 12)
            const A = point(2.25, 1.5)
            const AInf = point(5, 0)
            const Ax = point(A.x, 0)
            const sAAx = segment(A, Ax)
            sAAx.epaisseur = 2
            sAAx.pointilles = 5
            const sAxBx = segment(Ax, O, 'red')
            sAxBx.epaisseur = 2
            sAxBx.tailleExtremites = 6
            sAxBx.styleExtremites = choix ? ']-[' : '[-['
            const sAxAInf = segment(Ax, AInf, 'red')
            sAxAInf.epaisseur = 2
            sAxAInf.tailleExtremites = 6
            sAxAInf.styleExtremites = choix ? ']-' : '[-'
            const Texte1 = latexParCoordonnees(`y=${a}`, 4, 1.2, 'green', 0, 0, '')
            const Texte2 = latexParCoordonnees('y=\\sqrt{x}', 3, 2.3, 'blue', 0, 0, '')
            const Texte3 = latexParCoordonnees(`${a ** 2}`, 2.25, -0.6, 'red', 0, 0, '')
            const r1 = repere({
              xMin: -1,
              yMin: -1,
              yMax: 4,
              xMax: 5,
              xUnite: 1,
              yUnite: 1,
              axeXStyle: '->',
              axeYStyle: '->',
              grilleX: false,
              grilleY: false,
              xThickListe: [0],
              yThickListe: [0],
              xLabelListe: [-6],
              yLabelListe: [-6]

            })
            const f = x => sqrt(x)
            const Cg = droiteParPointEtPente(point(0, 1.5), 0, '', 'green')
            Cg.epaisseur = 2
            const graphique = mathalea2d({
              xmin: -2,
              xmax: 6,
              ymin: -1,
              ymax: 4,
              pixelsParCm: 30,
              scale: 0.7
            }, r1, o)
            const graphiqueC = mathalea2d({
              xmin: -1,
              xmax: 5,
              ymin: -1,
              ymax: 4,
              pixelsParCm: 30,
              scale: 1
            }, courbe(f, {
              repere: r1,
              color: 'blue',
              epaisseur: 2
            }),
            Cg
            , r1, o, sAAx, sAxAInf, Texte1, Texte2, Texte3)
            texte = `Résoudre graphiquement l'inéquation : $\\sqrt{x}${choix ? '>' : ' \\geqslant '}${a}$.<br>`
            if (!context.isHtml) {
              texte += 'On pourra utiliser le repère suivant.<br>'
              texte += `    ${graphique}`
            }
            texteCorr = `Pour résoudre graphiquement cette inéquation : <br>
            $\\bullet$ On trace la courbe d'équation $y=\\sqrt{x}$. <br>
            $\\bullet$ On trace la droite horizontale d'équation $y=${a}$. Cette droite coupe la courbe en $${a}^2=${a ** 2}$. <br>
            $\\bullet$  Les solutions de l'inéquation sont les abscisses des points de la courbe qui se situent ${choix ? 'strictement au dessus de' : ' sur ou au dessus de'} la droite.<br>`
            texteCorr += `${graphiqueC}<br>`
            texteCorr += `Comme la fonction racine carrée est définie sur $[0\\,;\\,+\\infty[$, l'ensemble des solutions de l'inéquation $\\sqrt{x}${choix ? '>' : ' \\geqslant '}${a}$ est :
            ${choix ? `$S=]${a ** 2}\\,;\\,+\\infty[$.` : `$S=[${a ** 2}\\,;\\,+\\infty[$.`} `
          }
          break
      }
      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Choix des questions', 4, '1 : Avec la fonction carré\n2 : Avec la fonction inverse\n3 : Avec la fonction racine carrée\n4 : Mélange']
}
