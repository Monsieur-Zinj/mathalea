import { courbe } from '../../lib/2d/courbes.js'
import { point, tracePoint } from '../../lib/2d/points.js'
import { repere } from '../../lib/2d/reperes.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { latexParCoordonnees, texteParPosition } from '../../lib/2d/textes.ts'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { texFractionReduite } from '../../lib/outils/deprecatedFractions.js'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { abs } from 'mathjs'

export const titre = 'Étudier graphiquement la parité d\'une fonction'

/**
 * Reconnaître la parité d'une fonction
* @author Stéphane Guyon
* 2F20
*/
export const uuid = '6e82d'
export const ref = '2F25-1'
export const refs = {
  'fr-fr': ['2F25-1'],
  'fr-ch': []
}
export default function EtudierGraphiqueParite () {
  Exercice.call(this)
  this.titre = titre
  this.video = ''
  this.consigne = 'Déterminer, par lecture graphique mais en le justifiant, si la fonction $f$ représentée est paire, impaire ou ni paire, ni impaire.'
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.nbQuestions = 1

  this.nouvelleVersion = function () {
    let typesDeQuestionsDisponibles = []
    typesDeQuestionsDisponibles = [1, 2, 3, 4, 5, 6]//

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, cpt = 0, A, B, s1, s2, s3, s4, a, b, c, f, r, rC, x, C, traceAetB, labA1, labA0, labB0, lA, lB = [], typesDeQuestions; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      const o = texteParPosition('O', -0.3, -0.3, 0, 'black', 1)
      switch (typesDeQuestions) {
        case 1:// Cas f(x)=ax+b
          a = randint(-2, 2, [0])
          b = randint(-2, 2, [0])
          r = repere({
            xMin: -5,
            xMax: 5,
            yMin: -5,
            yMax: 5,
            grilleX: false,
            grilleY: false,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -5,
            grilleSecondaireYMax: 5,
            grilleSecondaireXMin: -5,
            grilleSecondaireXMax: 5
          })
          rC = repere({
            xMin: -5,
            xMax: 5,
            yMin: -7,
            yMax: 7,
            grilleX: false,
            grilleY: false,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -7,
            grilleSecondaireYMax: 7,
            grilleSecondaireXMin: -5,
            grilleSecondaireXMax: 5
          })
          x = randint(-1, 1, [0]) * 2
          f = x => a * x + b
          C = courbe(f, { repere: rC, step: 0.25, color: 'blue' })
          B = point(x, a * x + b)
          A = point(-x, -a * x + b)

          labA0 = latexParCoordonnees('-x', -x, 0.8 * (a > 0 ? 1 : -1), 'red', 20, 10, 'white', 8)
          labB0 = latexParCoordonnees('x', x, 0.8 * (a > 0 ? -1 : 1), 'red', 20, 10, 'white', 8)
          lA = latexParCoordonnees('M\'', -x - 1.1, -a * x + b, 'red', 15, 10, 'white', 6)
          lB = latexParCoordonnees('M', x - 1.1, a * x + b, 'red', 15, 10, 'white', 6)
          labA1 = latexParCoordonnees('f(-x)', 0.5, -a * x + b, 'red', 30, 10, 'white', 8)
          // labB1 = latexParCoordonnees('f(x)', -1.5, a * x + b, 'red', 25, 10, 'white', 8)
          traceAetB = tracePoint(A, B, 'red') // Variable qui trace les points avec une croix
          traceAetB.taille = 4
          traceAetB.epaisseur = 2

          texte = mathalea2d({ xmin: -5, xmax: 5, ymin: -5, ymax: 5, scale: 0.7 }, r, C, o)
          texteCorr = 'On observe que la représentation graphique n\'admet pas l\'axe des ordonnées comme axe de symétries,'
          texteCorr += ' ni l\'origine comme centre de symétrie.<br> '
          texteCorr += `Prenons par exemple un point $M$ de la courbe, d'abscisse $${x}$, et `
          texteCorr += ` le point $M'$ aussi de la courbe, mais d'abscisse opposée : $${-x}$. <br>`
          texteCorr += `Les coordonnées sont $M(${x};${a * x + b})$ et  $M'(${-x};${-a * x + b})$. <br>`
          texteCorr += 'On observe bien que ces deux points ont des ordonnées ni égales, ni opposées.<br>'
          texteCorr += 'La fonction représentée est donc ni paire, ni impaire.<br>'

          texteCorr += '<br>' + mathalea2d({ xmin: -5, xmax: 5, ymin: -7, ymax: 7, scale: 0.7 }, rC, o, C, lA, lB, traceAetB)

          break
        case 2:// Cas f(x)=ax
          a = randint(-2, 2, [0])
          r = repere({
            xMin: -5,
            xMax: 5,
            yMin: -5,
            yMax: 5,
            grilleX: false,
            grilleY: false,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -5,
            grilleSecondaireYMax: 5,
            grilleSecondaireXMin: -5,
            grilleSecondaireXMax: 5
          })

          rC = repere({
            xMin: -5,
            xMax: 5,
            yMin: -7,
            yMax: 7,
            grilleX: false,
            grilleY: false,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -7,
            grilleSecondaireYMax: 7,
            grilleSecondaireXMin: -5,
            grilleSecondaireXMax: 5
          })

          x = randint(2, 3, [0])
          f = x => a * x
          C = courbe(f, { repere: r, step: 0.25, color: 'blue' })

          B = point(x, a * x)
          A = point(-x, -a * x)
          labA0 = latexParCoordonnees('-x', -x - 0.2, 0.8 * (a > 0 ? 1 : -1), 'red', 20, 10, 'white', 8)
          labB0 = latexParCoordonnees('x', x, 0.8 * (a > 0 ? -1 : 1), 'red', 20, 10, 'white', 8)
          lA = latexParCoordonnees('M\'', -x - 1, -a * x, 'red', 15, 10, 'white', 7)
          lB = latexParCoordonnees('M', x + 1, a * x, 'red', 15, 10, 'white', 7)
          labA1 = latexParCoordonnees('f(-x)=-f(x)', 3, 6, 'red', 90, 10, '', 10)

          traceAetB = tracePoint(A, B, 'red') // objet qui contient les croix des points
          s1 = segment(x, a * x, x, 0, 'red')
          s2 = segment(-x, -a * x, -x, 0, 'red')
          s3 = segment(-x, -a * x, 0, -a * x, 'red')
          s4 = segment(x, a * x, 0, a * x, 'red')
          s1.pointilles = 5
          s2.pointilles = 5
          s3.pointilles = 5
          s4.pointilles = 5
          s1.epaisseur = 2
          s2.epaisseur = 2
          s3.epaisseur = 2
          s4.epaisseur = 2
          traceAetB.taille = 4
          traceAetB.epaisseur = 2

          texte = mathalea2d({ xmin: -5, xmax: 5, ymin: -5, ymax: 5, scale: 0.7 }, r, C, o)
          texteCorr = 'On observe que la représentation graphique admet l\'origine comme centre de symétrie.<br> '
          texteCorr += 'Prenons un point $M$ de la courbe, d\'abscisse $x$, et '
          texteCorr += 'le point $M\'$ aussi de la courbe, mais d\'abscisse opposée : $-x$. <br>'
          texteCorr += 'Les coordonnées sont $M(x;f(x))$ et  $M\'(-x;f(-x))$. <br>'
          texteCorr += 'On observe bien que ces deux points qui ont des abscisses opposées, ont aussi des ordonnées opposées.<br>'
          texteCorr += 'La fonction représentée est impaire.<br>'

          texteCorr += '<br>' + mathalea2d({ xmin: -5, xmax: 6, ymin: -7, ymax: 7, scale: 0.7 }, rC, C, lA, lB, traceAetB, labB0, labA1, s1, s2, s3, s4, labA0)
          break
        case 3:// Cas f(x)=ax^2
          a = randint(-2, 2, [0])
          b = randint(1, 5)
          if (a > 0) { b = -b }

          r = repere({
            xMin: -4,
            xMax: 4,
            yMin: -6,
            yMax: 6,
            xUnite: 2,
            yUnite: 1,
            grilleX: false,
            grilleY: false,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -6,
            grilleSecondaireYMax: 6,
            grilleSecondaireXMin: -4,
            grilleSecondaireXMax: 4
          })

          rC = repere({
            xMin: -4,
            xMax: 4,
            yMin: -6,
            yMax: 6,
            xUnite: 2,
            yUnite: 1,
            grilleX: false,
            grilleY: false,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -6,
            grilleSecondaireYMax: 6,
            grilleSecondaireXMin: -4,
            grilleSecondaireXMax: 4
          })

          x = 1
          f = x => a * x * x + b
          C = courbe(f, { repere: r, color: 'blue' })

          B = point(2 * x, a * x * x + b)
          A = point(-2 * x, a * x * x + b)
          labA0 = latexParCoordonnees('-x', -2 * x - 0.2, -0.8, 'red', 20, 10, 'white', 8)
          labB0 = latexParCoordonnees('x', 2 * x, -0.8, 'red', 20, 10, 'white', 8)
          lA = latexParCoordonnees('M\'', -2 * x - 1, a * x * x + b, 'red', 15, 10, 'white', 7)
          lB = latexParCoordonnees('M', 2 * x + 1, a * x * x + b, 'red', 15, 10, 'white', 7)
          labA1 = latexParCoordonnees('f(-x)=f(x)', 3.5, 4.5, 'red', 80, 10, '', 14)
          traceAetB = tracePoint(A, B, 'red') // objet qui contient les croix des points
          s1 = segment(2 * x, a * x * x + b, 2 * x, 0, 'red')
          s2 = segment(-2 * x, a * x * x + b, -2 * x, 0, 'red')
          s3 = segment(-2 * x, a * x * x + b, 0, a * x * x + b, 'red')
          s4 = segment(2 * x, a * x * x + b, 0, a * x * x + b, 'red')
          s1.pointilles = 5
          s2.pointilles = 5
          s3.pointilles = 5
          s4.pointilles = 5
          s1.epaisseur = 2
          s2.epaisseur = 2
          s3.epaisseur = 2
          s4.epaisseur = 2
          traceAetB.taille = 4
          traceAetB.epaisseur = 2

          texte = mathalea2d({ xmin: -8, xmax: 8, ymin: -6, ymax: 6, scale: 0.7 }, r, C, o)
          texteCorr = 'On observe que la représentation graphique admet les ordonnées comme axe de symétrie.<br> '
          texteCorr += 'Prenons un point $M$ de la courbe, d\'abscisse $x$, et '
          texteCorr += 'le point $M\'$ aussi de la courbe, mais d\'abscisse opposée : $-x$. <br>'
          texteCorr += 'Les coordonnées sont $M(x;f(x))$ et  $M\'(-x;f(-x))$. <br>'
          texteCorr += 'On observe bien que ces deux points qui ont des abscisses opposées, ont des ordonnées égales.<br>'
          texteCorr += 'La fonction représentée est paire.<br>'

          texteCorr += '<br>' + mathalea2d({ xmin: -8, xmax: 8, ymin: -6, ymax: 6, scale: 0.7 }, rC, o, C, lA, lB, traceAetB, labB0, labA1, s1, s2, s3, s4, labA0)
          break
        case 4:// Cas f(x)=a(x-b)²+c
          a = randint(-1, 1, [0]) * 0.5
          b = randint(-3, 3, [0])
          c = randint(1, 3)
          if (a > 0) { c = -c }
          r = repere({
            xMin: -6,
            xMax: 6,
            yMin: -5,
            yMax: 5,
            xUnite: 1,
            yUnite: 1,
            grilleX: false,
            grilleY: false,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -5,
            grilleSecondaireYMax: 5,
            grilleSecondaireXMin: -6,
            grilleSecondaireXMax: 6
          })

          rC = repere({
            xMin: -6,
            xMax: 6,
            yMin: -8,
            yMax: 8,
            xUnite: 1,
            yUnite: 1,
            grilleX: false,
            grilleY: false,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -8,
            grilleSecondaireYMax: 8,
            grilleSecondaireXMin: -6,
            grilleSecondaireXMax: 6
          })
          x = 4 - abs(b)
          f = x => a * (x - b) * (x - b) + c
          C = courbe(f, { repere: rC, step: 0.25, color: 'blue' })

          B = point(x, a * (x - b) * (x - b) + c)
          A = point(-x, a * (-x - b) * (-x - b) + c)
          lA = latexParCoordonnees('M\'', -x - 1, a * (-x - b) * (-x - b) + c, 'red', 15, 10, 'white', 7)
          lB = latexParCoordonnees('M', x + 1, a * (x - b) * (x - b) + c, 'red', 15, 10, 'white', 7)
          // labA1 = latexParCoordonnees('f(-x)', 1.2, a * (x - b) * (x - b) + c, 'red', 30, 10, '', 8)
          // labB1 = latexParCoordonnees('f(x)', -2, a * (x - b) * (x - b) + c + 0.2, 'red', 25, 10, '', 8)
          traceAetB = tracePoint(A, B, 'red') // objet qui contient les croix des points

          traceAetB.taille = 4
          traceAetB.epaisseur = 2

          texte = mathalea2d({ xmin: -6, xmax: 6, ymin: -5, ymax: 5, scale: 0.6 }, r, C, o)
          texteCorr = 'On observe que la représentation graphique n\'admet pas l\'axe des ordonnées comme axe de symétries,'
          texteCorr += ' ni l\'origine comme centre de symétrie.<br> '
          texteCorr += `Prenons par exemple un point $M$ de la courbe, d'abscisse $${x}$, et `
          texteCorr += ` le point $M'$ aussi de la courbe, mais d'abscisse opposée : $${-x}$. <br>`
          texteCorr += `Les coordonnées sont $M(${x};${a * (x - b) * (x - b) + c})$ et  $M'(${-x};${a * (-x - b) * (-x - b) + c})$. <br>`
          texteCorr += 'On observe bien que ces deux points ont des ordonnées ni égales, ni opposées.<br>'
          texteCorr += 'La fonction représentée est donc ni paire, ni impaire.<br>'

          texteCorr += '<br>' + mathalea2d({ xmin: -6, xmax: 6, ymin: -8, ymax: 8, scale: 0.6 }, rC, o, C, lA, lB, traceAetB)
          break
        case 5:// Cas f(x)=1/ax+b
          a = randint(-2, 2, [0])
          b = randint(-3, 3, [0])
          c = Math.trunc(-b / a)
          r = repere({
            xMin: -6,
            xMax: 6,
            yMin: -5,
            yMax: 5,
            xUnite: 1,
            yUnite: 1,
            grilleX: false,
            grilleY: false,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -5,
            grilleSecondaireYMax: 5,
            grilleSecondaireXMin: -6,
            grilleSecondaireXMax: 6
          })

          rC = repere({
            xMin: -6,
            xMax: 6,
            yMin: -5,
            yMax: 5,
            xUnite: 1,
            yUnite: 1,
            xLabelMin: 10,
            yLabelMin: 10,
            grilleX: false,
            grilleY: false,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -5,
            grilleSecondaireYMax: 5,
            grilleSecondaireXMin: -6,
            grilleSecondaireXMax: 6
          })
          x = randint(-3, 3, [-b / a, 0, 1, -1])

          f = x => 1 / (a * x + b)
          C = courbe(f, { repere: r, step: 0.01, color: 'blue' })

          B = point(x, 1 / (a * x + b))
          A = point(-x, 1 / (-a * x + b))
          lA = texteParPosition('$M\'$', -x + (a > 0 ? -1 : 1), 1 / (-a * x + b) + (a > 0 ? 0.5 : -0.5), 0, 'red', 1.5)
          lB = texteParPosition('$M$', x - (a > 0 ? -1 : 1), 1 / (a * x + b) + (a > 0 ? 0.5 : -0.5), 0, 'red', 1.5)

          traceAetB = tracePoint(A, B, 'red') // objet qui contient les croix des points

          traceAetB.taille = 4
          traceAetB.epaisseur = 2

          texte = mathalea2d({ xmin: -6, xmax: 6, ymin: -5, ymax: 5, scale: 0.7 }, r, C, o)
          texteCorr = 'On observe que la représentation graphique n\'admet pas l\'axe des ordonnées comme axe de symétries,'
          texteCorr += ' ni l\'origine comme centre de symétrie.<br> '
          texteCorr += `Prenons par exemple un point $M$ de la courbe, d'abscisse $${x}$, et `
          texteCorr += ` le point $M'$ aussi de la courbe, mais d'abscisse opposée : $${-x}$. <br>`
          texteCorr += `Les coordonnées sont $M(${x};${texFractionReduite(1, a * x + b)})$ et  $M'(${-x};${texFractionReduite(1, -a * x + b)})$. <br>`
          texteCorr += 'On observe bien que ces deux points ont des ordonnées ni égales, ni opposées.<br>'
          texteCorr += 'La fonction représentée est donc ni paire, ni impaire.<br>'

          texteCorr += '<br>' + mathalea2d({ xmin: -6, xmax: 6, ymin: -5, ymax: 5, scale: 0.6 }, rC, o, C, lA, lB, traceAetB)
          break
        case 6:// Cas f(x)=1/ax
          a = randint(-3, 3, [0, 1, -1])
          r = repere({
            xMin: -4,
            xMax: 4,
            yMin: -5,
            yMax: 5,
            xUnite: 2,
            yUnite: 1,
            grilleX: false,
            grilleY: false,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -5,
            grilleSecondaireYMax: 5,
            grilleSecondaireXMin: -4,
            grilleSecondaireXMax: 4
          })
          rC = repere({
            xMin: -4,
            xMax: 4,
            yMin: -5,
            yMax: 5,
            xUnite: 2,
            yUnite: 1,
            xLabelMin: 10,
            yLabelMin: 10,
            grilleX: false,
            grilleY: false,
            grilleSecondaire: true,
            grilleSecondaireYDistance: 1,
            grilleSecondaireXDistance: 1,
            grilleSecondaireYMin: -5,
            grilleSecondaireYMax: 5,
            grilleSecondaireXMin: -4,
            grilleSecondaireXMax: 4
          })
          x = 2
          f = x => 1 / (a * x)
          C = courbe(f, { repere: r, step: 0.01, color: 'blue' })

          B = point(2 * x, 1 / (a * x))
          A = point(-2 * x, -1 / (a * x))
          labA0 = texteParPosition('$-x$', -2 * x - 0.2, -0.8, 0, 'red', 1)
          // labA0 = latexParCoordonnees('-x', -2*x - 0.2, -0.8, 'red', 20, 10, 'white', 8)
          labB0 = texteParPosition('$x$', 2 * x - 0.2, -0.8, 0, 'red', 1)
          // labB0 = latexParCoordonnees('x', 2 * x, -0.8, 'red', 20, 10, 'white', 8)
          lA = texteParPosition('$M\'$', 2 * (-x) - 0.2, 0.5, 0, 'red', 1)
          // lA = latexParCoordonnees('M\'', 2 * (-x), -1 / (a * x), 'red', 15, 10, 'white', 7)
          lB = texteParPosition('$M$', 2 * (x) - 0.2, 0.5, 0, 'red', 1)
          // lB = latexParCoordonnees('M', 2 * (x), 1 / (a * x), 'red', 15, 10, 'white', 7)
          labA1 = latexParCoordonnees('f(-x)=-f(x)', 3, 3, 'red', 80, 10, '', 14)
          traceAetB = tracePoint(A, B, 'red') // objet qui contient les croix des points
          s3 = segment(-2 * x, -1 / (a * x), 0, 0, 'red')
          s4 = segment(2 * x, 1 / (a * x), 0, 0, 'red')
          s3.pointilles = 5
          s4.pointilles = 5
          s3.epaisseur = 2
          s4.epaisseur = 2
          traceAetB.taille = 4
          traceAetB.epaisseur = 2

          texte = mathalea2d({ xmin: -8, xmax: 8, ymin: -5, ymax: 5, scale: 0.7 }, r, C, o)
          texteCorr = 'On observe que la représentation graphique admet l\'origine comme centre de symétrie.<br> '
          texteCorr += 'Prenons un point $M$ de la courbe, d\'abscisse $x$, et '
          texteCorr += 'le point $M\'$ aussi de la courbe, mais d\'abscisse opposée : $-x$. <br>'
          texteCorr += 'Les coordonnées sont $M(x;f(x))$ et  $M\'(-x;f(-x))$. <br>'
          texteCorr += 'On observe bien que ces deux points qui ont des abscisses opposées, ont aussi des ordonnées opposées.<br>'
          texteCorr += 'La fonction représentée est impaire.<br>'

          texteCorr += '<br>' + mathalea2d({ xmin: -8, xmax: 8, ymin: -5, ymax: 5, scale: 0.7 }, rC, C, lA, lB, o, traceAetB, labB0, labA1, s3, s4, labA0)
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
