import Exercice from '../ExerciceTs'
import Figure from 'apigeom'
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

type Coords = { label: string, x: number, y: number }

class ReperagePointDuPlan extends Exercice {
  figure!: Figure
  points: Coords[] = []
  divButtons!: HTMLDivElement
  idApigeom!: string
  exoCustomResultat = true // Cela permet de renvoyer un tableau de résultats
  constructor () {
    super()
    this.typeExercice = 'simple'
    this.exoCustomResultat = true
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    // Pour un exercice de type simple qui n'utilise pas le champ de réponse
    this.reponse = ''
    this.formatChampTexte = 'none'
  }

  nouvelleVersion (numeroExercice: number): void {
    this.figure = new Figure({ snapGrid: true, xMin: -6.3, yMin: -6.3, width: 378, height: 378 })
    this.figure.create('Grid')
    this.figure.options.labelAutomaticForPoints = true
    this.figure.options.limitNumberOfElement.set('Point', 4)
    let x1 = randint(-6, -1)
    let x2 = randint(1, 6, x1)
    let x3 = randint(-6, 6, [0, x1, x2])
    let x4 = 0
    let y1 = randint(-6, -1)
    let y2 = randint(1, 6, y1)
    let y3 = randint(-6, 6, [0, y1, y2])
    let y4 = 0
    // On mélange en évitant le couple (0,0)
    while ([[x1, y1], [x2, y2], [x3, y3], [x4, y4]].some(e => e[0] === 0 && e[1] === 0)) {
      [x1, x2, x3, x4] = [x1, x2, x3, x4].sort(() => Math.random() - 0.5)
      ;[y1, y2, y3, y4] = [y1, y2, y3, y4].sort(() => Math.random() - 0.5)
    }
    this.points = [
      { label: 'A', x: x1, y: y1 },
      { label: 'B', x: x2, y: y2 },
      { label: 'C', x: x3, y: y3 },
      { label: 'D', x: x4, y: y4 }
    ]
    const figureCorr = new Figure({ snapGrid: true, xMin: -7, yMin: -7, width: 420, height: 420, isDynamic: false })
    figureCorr.create('Grid', { xMin: -6, yMin: -6, xMax: 6, yMax: 6 })
    for (const coord of this.points) {
      figureCorr.create('Point', { x: coord.x, y: coord.y, color: 'green', thickness: 3, label: coord.label })
    }
    let enonce = 'Placer les points suivants : '
    enonce += `$A(${x1}\\;;\\;${y1})$ ; $B(${x2}\\;;\\;${y2})$ ; $C(${x3}\\;;\\;${y3})$ et $D(${x4}\\;;\\;${y4})$.`
    this.idApigeom = `apigeomEx${numeroExercice}F0`
    const emplacementPourFigure = `<div class="m-6" id="${this.idApigeom}"></div><div class="m-6" id="feedback${this.idApigeom}"></div>`
    const texteCorr = figureCorr.getStaticHtml()

    if (context.isHtml) {
      this.question = enonce + emplacementPourFigure
      this.correction = texteCorr
    } else {
      this.question = enonce + `\n\n\\bigskip\n\\Reperage[Plan,AffichageNom,AffichageGrad]{%
        -5/0/,0/-5/,5/0/,0/5/%
        }`
      this.correction = `\\Reperage[Plan,AffichageNom,AffichageGrad]{%
        -5/0/,0/-5/,5/0/,0/5/,${x1}/${y1}/A,${x2}/${y2}/B,${x3}/${y3}/C,${x4}/${y4}/D%
        }`
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
        this.divButtons.classList.add('mb-10')
        this.divButtons.style.display = 'flex'
        container.appendChild(this.divButtons)
        this.figure.setContainer(container)
        this.figure.isDynamic = !!this.interactif
        this.divButtons.style.display = this.interactif ? 'flex' : 'none'
        this.figure.divUserMessage.style.fontSize = '1em'
        this.figure.divUserMessage.style.pointerEvents = 'none'
        this.figure.divUserMessage.style.top = '-50px'
      }
    })
  }

  correctionInteractive = () => {
    this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[this.idApigeom] = this.figure.json
    const resultat = []
    const divFeedback = document.querySelector(`#feedback${this.idApigeom}`) as HTMLDivElement
    for (const coord of this.points) {
      const { points, isValid, message } = this.figure.testCoords({ label: coord.label, x: coord.x, y: coord.y })
      if (isValid) {
        resultat.push('OK')
      } else {
        divFeedback.innerHTML += message + '<br>'
        if (points[0] !== undefined) {
          const point = points[0]
          point.color = 'red'
          point.thickness = 3
          const textLabel = point.elementTextLabel as TextByPosition
          textLabel.color = 'red'
        }
        const pointCorr = this.figure.create('Point', { x: coord.x, y: coord.y, color: 'green', thickness: 3, label: coord.label })
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
