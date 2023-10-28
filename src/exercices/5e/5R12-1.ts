import Exercice from '../ExerciceTs'
import Figure from 'apigeom'
import Point from 'apigeom/src/elements/points/Point'
import { randint } from '../../modules/outils.js'
import type TextByPosition from 'apigeom/src/elements/text/TextByPosition.js'
import { context } from '../../modules/context'

export const titre = 'Placer des points dans un repère'
export const dateDePublication = '27/10/2023'
export const interactifReady = true
export const interactifType = 'custom'

/**
 * Placer un point dans un repère
 * @author Rémi Angot
 * Références 5R12-1
 */
export const uuid = '4dadb'
export const ref = '5R12-1'

type Coords = { x: number, y: number }

class ReperagePointDuPlan extends Exercice {
  figure!: Figure
  points: Coords[] = []
  divButtons!: HTMLDivElement
  idApigeom!: string
  exoCustomResultat = true // Cela permet de renvoyer un tableau de résultats
  constructor () {
    super()
    this.titre = titre
    this.consigne = ''
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    this.nbCols = 1
    this.nbColsCorr = 1
    this.spacing = 1
    this.spacingCorr = 1
    this.sup = 1
    this.sup2 = true
    this.listeAvecNumerotation = false
    this.exoCustomResultat = true
  }

  nouvelleVersion (numeroExercice: number): void {
    this.figure = new Figure({ snapGrid: true, xMin: -7, yMin: -7, width: 420, height: 450 })
    this.figure.create('Grid', { xMin: -6, yMin: -6, xMax: 6, yMax: 6 })
    this.figure.options.labelAutomaticForPoints = true
    let x1 = randint(-6, 1)
    let x2 = randint(1, 6, x1)
    let x3 = randint(-6, 6, [0, x1, x2])
    let x4 = 0
    let y1 = randint(-6, 1)
    let y2 = randint(1, 6, y1)
    let y3 = randint(-6, 6, [0, y1, y2])
    let y4 = 0
    // On mélange en évitant le couple (0,0)
    while ([[x1, y1], [x2, y2], [x3, y3], [x4, y4]].some(e => e[0] === 0 && e[1] === 0)) {
      [x1, x2, x3, x4] = [x1, x2, x3, x4].sort(() => Math.random() - 0.5)
      ;[y1, y2, y3, y4] = [y1, y2, y3, y4].sort(() => Math.random() - 0.5)
    }
    this.points = [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
      { x: x3, y: y3 },
      { x: x4, y: y4 }
    ]
    const figureCorr = new Figure({ snapGrid: true, xMin: -7, yMin: -7, width: 420, height: 420, isDynamic: false })
    figureCorr.create('Grid', { xMin: -6, yMin: -6, xMax: 6, yMax: 6 })
    figureCorr.create('Point', { x: x1, y: y1, color: 'green', thickness: 3, label: 'A' })
    figureCorr.create('Point', { x: x2, y: y2, color: 'green', thickness: 3, label: 'B' })
    figureCorr.create('Point', { x: x3, y: y3, color: 'green', thickness: 3, label: 'C' })
    figureCorr.create('Point', { x: x4, y: y4, color: 'green', thickness: 3, label: 'D' })
    let enonce = 'Placer les points suivants : '
    enonce += `$A(${x1}\\;;\\;${y1})$ ; $B(${x2}\\;;\\;${y2})$ ; $C(${x3}\\;;\\;${y3})$ et $D(${x4}\\;;\\;${y4})$.`
    this.idApigeom = `apigeomEx${numeroExercice}F0`
    const emplacementPourFigure = `<div class="mt-6" id="${this.idApigeom}"></div>`
    const texteCorr = figureCorr.getStaticHtml()
    this.listeQuestions = [enonce + emplacementPourFigure]
    this.listeCorrections = [texteCorr]

    // Sortie LaTeX avec ProfCollege
    if (!context.isHtml) {
      this.listeQuestions = [enonce + `\n\n\\bigskip\n\\Reperage[Plan,AffichageNom,AffichageGrad]{%
        -5/0/,0/-5/,5/0/,0/5/%
        }`]
      this.listeCorrections = [`\\Reperage[Plan,AffichageNom,AffichageGrad]{%
        -5/0/,0/-5/,5/0/,0/5/,${x1}/${y1}/A,${x2}/${y2}/B,${x3}/${y3}/C,${x4}/${y4}/D%
        }`]
    }

    // Pour revoir la copie de l'élève dans Capytale
    document.addEventListener(this.idApigeom, (event: Event) => {
      const customEvent = event as CustomEvent
      const json = customEvent.detail
      this.figure.loadJson(JSON.parse(json))
    })

    document.addEventListener('exercicesAffiches', () => {
      if (!context.isHtml) return
      const container = document.querySelector(`#${this.idApigeom}`) as HTMLDivElement
      if (container == null) return
      if (this.figure.container == null) {
        container.innerHTML = ''
        this.divButtons = this.figure.addButtons('POINT DRAG REMOVE')
        this.divButtons.style.display = 'flex'
        container.appendChild(this.divButtons)
        this.figure.setContainer(container)
        this.figure.isDynamic = !!this.interactif
        this.divButtons.style.display = this.interactif ? 'flex' : 'none'
        this.figure.divUserMessage.style.fontSize = '1em'
        this.figure.divUserMessage.style.pointerEvents = 'none'
        this.figure.divUserMessage.style.top = '-10px'
      }
    })
  }

  correctionInteractive = () => {
    const points = [...this.figure.elements.values()].filter(e => e.type === 'Point') as Point[]
    this.answers = {}
    this.answers[this.idApigeom] = this.figure.json
    const resultat = []
    for (let i = 0; i < 4; i++) {
      if (points[i] !== undefined && points[i].x === this.points[i].x && points[i].y === this.points[i].y) {
        resultat.push('OK')
      } else {
        if (points[i] !== undefined) {
          points[i].color = 'red'
          points[i].thickness = 3
          const textLabel = points[i].elementTextLabel as TextByPosition
          textLabel.color = 'red'
        }
        const pointCorr = this.figure.create('Point', { x: this.points[i].x, y: this.points[i].y, color: 'green', thickness: 3, label: String.fromCharCode(65 + i) })
        const pointCorrLabel = pointCorr.elementTextLabel as TextByPosition
        pointCorrLabel.color = 'green'
        resultat.push('KO')
      }
    }
    this.figure.isDynamic = false
    this.divButtons.style.display = 'none'
    this.figure.divUserMessage.style.display = 'none'
    return resultat
  }
}

export default ReperagePointDuPlan
