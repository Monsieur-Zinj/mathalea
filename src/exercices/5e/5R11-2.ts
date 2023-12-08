import { point, tracePoint } from '../../lib/2d/points.js'
import { droiteGraduee } from '../../lib/2d/reperes.js'
import { labelPoint } from '../../lib/2d/textes.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils.js'
import { arrondi } from '../../lib/outils/nombres.js'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import Exercice from '../ExerciceTs'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import figureApigeom from '../../lib/figureApigeom.js'
import GraduatedLine from 'apigeom/src/elements/grid/GraduatedLine.js'
import Figure from 'apigeom'
export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'

export const titre = 'Placer un point d\'abscisse un nombre relatif'

/**
* Placer un point d'abscisse un nombre relatif
* @author Jean-Claude Lhote et Rémi Angot
* Référence 5R11-2
*/
export const uuid = '6d576'
export const ref = '5R11-2'

type goodAnswer = { label: string, value: number }[]

class PlacerPointsSurAxeRelatifs extends Exercice {
  goodAnswers: goodAnswer[] = []
  figures: Figure[] = []
  constructor () {
    super()
    this.consigne = ''
    this.nbQuestions = 5
    this.nbQuestionsModifiable = true
    this.nbCols = 1
    this.nbColsCorr = 1
    this.spacing = 1
    this.spacingCorr = 1
    this.sup = 1
    this.besoinFormulaireNumerique = ['Niveau de difficulté', 4, '1 : Nombre relatif à une décimale\n2 : Nombre relatif à deux décimales\n3 : Nombre relatif à trois décimales\n4 : Mélange']
    this.listePackages = ['tkz-euclide']
  }

  nouvelleVersion () {
    if (this.interactif) this.consigne = 'Placer les points sur la droite graduée, puis vérifier la réponse.'
    let typesDeQuestions
    let objets = []
    let objetsCorr = []
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.contenu = '' // Liste de questions
    this.contenuCorrection = '' // Liste de questions corrigées
    if (this.sup === 4) { typesDeQuestions = combinaisonListes([1, 2, 3], this.nbQuestions) } else { typesDeQuestions = combinaisonListes([parseInt(this.sup)], this.nbQuestions) }

    this.contenu = this.consigne
    for (let i = 0, abs0, abs1, abs2, abs3, l1, l2, l3, x1, x2, x3, x11, x22, x33, A, B, C, pas1, pas2, texte, texteCorr; i < this.nbQuestions; i++) {
      l1 = lettreDepuisChiffre(i * 3 + 1)
      l2 = lettreDepuisChiffre(i * 3 + 2)
      l3 = lettreDepuisChiffre(i * 3 + 3)
      objets = []
      objetsCorr = []
      switch (typesDeQuestions[i]) {
        case 1: // Placer des décimaux relatifs sur un axe (1 décimale)
          abs0 = randint(-7, -3)
          pas1 = 1
          pas2 = 10
          break

        case 2: // Placer des décimaux relatifs sur un axe (2 décimales)
          abs0 = randint(-4, -2) / 10
          pas1 = 10
          pas2 = 10
          break

        default: // Placer des décimaux relatifs sur un axe (3 décimales)
          abs0 = randint(-10, -2) / 100
          pas1 = 100
          pas2 = 10
          break
      }
      x1 = randint(0, 2)
      x2 = randint(3, 4)
      x3 = randint(5, 6)
      x11 = randint(1, 9); x22 = randint(1, 9); x33 = randint(1, 3)
      abs1 = arrondi(abs0 + x1 / pas1 + x11 / pas1 / pas2, typesDeQuestions[i]) // le type de questions est égal au nombre de décimales.
      abs2 = arrondi(abs0 + x2 / pas1 + x22 / pas1 / pas2, typesDeQuestions[i])
      abs3 = arrondi(abs0 + x3 / pas1 + x33 / pas1 / pas2, typesDeQuestions[i])

      A = point(changeCoord(abs1, abs0, pas1), 0, l1, 'above')
      B = point(changeCoord(abs2, abs0, pas1), 0, l2, 'above')
      C = point(changeCoord(abs3, abs0, pas1), 0, l3, 'above')
      this.goodAnswers[i] = [
        { label: l1, value: arrondi(abs1, 4) },
        { label: l2, value: arrondi(abs2, 4) },
        { label: l3, value: arrondi(abs3, 4) }
      ]
      objets.push(droiteGraduee({
        Unite: 3 * pas1,
        Min: abs0,
        Max: abs0 + 6.9 / pas1,
        x: abs0,
        y: 0,
        thickSecDist: 1 / pas2 / pas1,
        thickSec: true,
        labelsPrincipaux: true,
        thickDistance: 1 / pas1
        // thickOffset: 2
      }))
      objetsCorr.push(droiteGraduee({
        Unite: 3 * pas1,
        Min: abs0,
        Max: abs0 + 6.9 / pas1,
        x: abs0,
        y: 0,
        thickSecDist: 1 / pas2 / pas1,
        thickSec: true,
        labelsPrincipaux: true,
        thickDistance: 1 / pas1
      }))
      const axeGradue = droiteGraduee({
        Unite: 3 * pas1,
        Min: abs0,
        Max: abs0 + 6.9 / pas1,
        x: abs0,
        y: 0,
        thickSecDist: 1 / pas2 / pas1,
        thickSec: true,
        labelsPrincipaux: true,
        thickDistance: 1 / pas1
      })
      objets.push(axeGradue)
      const t1 = tracePoint(A, 'blue')
      const t2 = tracePoint(B, 'blue')
      const t3 = tracePoint(C, 'blue')
      // @ts-expect-error Problème de typage de labelPoint
      const noms = labelPoint(A, B, C)
      t1.taille = 5
      t1.epaisseur = 2
      t2.taille = 5
      t2.epaisseur = 2
      t3.taille = 5
      t3.epaisseur = 2

      // @ts-expect-error Problème de typage de labelPoint
      objets.push(labelPoint(A, B, C), tracePoint(A, B, C))
      texteCorr = mathalea2d({ xmin: abs0 - 0.5, xmax: abs0 + 22, ymin: -1, ymax: 1, scale: 0.75 }, axeGradue, t1, t2, t3, noms)
      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texte,
          propositions: [{ texte: texteCorr, statut: 0, feedback: '' }]
        }
      }

      if (this.interactif && !context.isAmc) {
        texte = `Placer les points : $${l1}(${texNombre(abs1, 5)}), ${l2}(${texNombre(abs2, 5)}), ${l3}(${texNombre(abs3, 5)})$.<br>`
        const figure = apigeomGraduatedLine({ xMin: abs0, xMax: abs0 + 7 })
        figure.options.labelAutomaticBeginsWith = l1
        this.figures[i] = figure
        texte += figureApigeom({ exercice: this, idApigeom: `ex${this.numeroExercice}Q${i}`, figure })

        const figureCorr = apigeomGraduatedLine({ xMin: abs0, xMax: abs0 + 7 })
        figureCorr.isDynamic = false

        figureCorr.create('Point', { x: abs1, y: 0, label: l1 })
        figureCorr.create('Point', { x: abs2, y: 0, label: l2 })
        figureCorr.create('Point', { x: abs3, y: 0, label: l3 })
        if (context.isHtml) {
          texteCorr = figureCorr.getStaticHtml()
        } else {
          texteCorr = latexGraduatedLine({ xMin: abs0, xMax: abs0 + 7 })
        }
      } else {
        texte = `Placer les points : $${l1}(${texNombre(abs1, 5)}), ${l2}(${texNombre(abs2, 5)}), ${l3}(${texNombre(abs3, 5)})$.<br>`
      }

      if (!context.isHtml) {
        texte += latexGraduatedLine({ xMin: abs0, xMax: abs0 + 7, scale: 2 })
        const points = [
          { x: abs1, label: l1 },
          { x: abs2, label: l2 },
          { x: abs3, label: l3 }
        ]
        texteCorr = latexGraduatedLine({ xMin: abs0, xMax: abs0 + 7, points, scale: 2 })
      }

      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
    }

    this.exoCustomResultat = true
    listeQuestionsToContenu(this)
  }

  correctionInteractive = (i: number) => {
    const result: ('OK'|'KO')[] = []
    const figure = this.figures[i]
    const goodAnswer = this.goodAnswers[i]
    const divFeedback = document.querySelector(`#feedback${`ex${this.numeroExercice}Q${i}`}`)
    for (let j = 0; j < goodAnswer.length; j++) {
      const label = goodAnswer[j].label
      const x = goodAnswer[j].value
      const { isValid, message, points } = figure.checkCoords({ checkOnlyAbscissa: true, label, x, y: 0 })
      if (isValid) {
        result.push('OK')
        points[0].color = 'green'
        points[0].colorLabel = 'green'
      } else {
        result.push('KO')
        if (points[0] !== undefined) {
          points[0].color = 'red'
          points[0].colorLabel = 'red'
        }
      }
      if (divFeedback != null) {
        const p = document.createElement('p')
        p.innerText = message
        divFeedback.appendChild(p)
      }
    }
    return result
  }
}

export default PlacerPointsSurAxeRelatifs

// fonction qui retourne l'abscisse du point pour mathalea2d en fonction de l'abscisse de l'exercice
function changeCoord (x: number, abs0: number, pas1: number) {
  return (abs0 + (x - abs0) * 3 * pas1)
}

function apigeomGraduatedLine ({ xMin, xMax, step = 1, stepBis = 0.1, scale = 1 }: {
  xMin: number,
  xMax: number,
  step?: number,
  stepBis?: number,
  scale?: number
}): Figure {
  const width = 900
  const height = 80
  const figure = new Figure({ xMin: xMin - 1, yMin: -1.5, width, height, scale, dy: 10, dx: 0.1, xScale: 3, snapGrid: true })
  figure.setToolbar({ tools: ['POINT', 'DRAG', 'REMOVE'], position: 'top' })

  const d = new GraduatedLine(figure, { min: xMin, max: xMax, step, stepBis })
  d.draw()
  return figure
}

type Point = { x: number, label: string }

function latexGraduatedLine ({ xMin, xMax, step = 1, stepBis = 0.1, scale = 1, points = [] }: {
  xMin: number,
  xMax: number,
  step?: number,
  stepBis?: number,
  scale?: number,
  points?: Point[]
}): string {
  let result = `
  \\begin{tikzpicture}[xscale=${scale}]
     \\tkzInit[xmin=${xMin}, xmax=${xMax}, xstep=${step}]
     \\tkzDrawX[label={}, tickup=3pt, tickdn=3pt]
  `
  if (stepBis !== undefined) {
    result += `
    \\foreach \\i in {${xMin},${xMin + stepBis},...,${xMax}} {
         \\tkzHTick[mark=|,mark size=2pt]{\\i}
    }
    `
  }
  const start = arrondi(Math.ceil(xMin / step) * step)
  const end = arrondi(Math.floor(xMax / step) * step)
  for (let i = start; i <= end;) {
    result += '\n ' + `\\tkzText[below=0.2](${i},0){$${texNombre(i, 5)}$}`
    i = arrondi(i + step)
  }
  for (const point of points) {
    result += `
       \\tkzDefPoint(${point.x},0){${point.label}}
       \\tkzLabelPoints[above = 0.2](${point.label})
       \\tkzDrawPoints[shape = cross out, size = 4 pt](${point.label})
  `
  }
  result += '\\end{tikzpicture}'
  return result
}
