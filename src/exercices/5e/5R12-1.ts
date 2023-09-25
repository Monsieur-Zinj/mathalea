
import Exercice from "../ExerciceTs.js"
import Figure from 'apigeom/src/Figure'
import Point from 'apigeom/src/elements/points/Point'
import ui from 'apigeom/src/uiMachine.js'

import { interpret } from 'xstate'

export const titre = 'Placer un point dans un repère'
export const dateDePublication = '24/09/2023'
export const interactifReady = true
export const interactifType = 'custom'



class SuperFigure extends Figure {
  constructor ({ border = false, dx = 1, dy = 1, height = 400, isDynamic = true, pixelsPerUnit = 30, scale = 1, snapGrid = false, width = 400, xMin = -10, xScale = 1, yMin = -6, yScale = 1 }: { border?: boolean, dx?: number, dy?: number, height?: number, isDynamic?: boolean, pixelsPerUnit?: number, scale?: number, snapGrid?: boolean, width?: number, xMin?: number, xScale?: number, yMin?: number, yScale?: number } = {}) {
    super({ border, dx, dy, height, isDynamic, pixelsPerUnit, scale, snapGrid, width, xMin, xScale, yMin, yScale })
    console.log(this)
    const machineWithContext = ui.withContext({ figure: this, temp: { elements: [], htmlElement: [], values: [] } })
    this.ui = interpret(machineWithContext).start()
  }
}

/**
 * Placer un point dans un repère
 * @author Rémi Angot
 * Références 5R12-1
 */
export const uuid = '4dadb'
export const ref = '5R12-1'

class ReperagePointDuPlan extends Exercice {
  figure!: Figure
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
  }
  nouvelleVersion (numeroExercice: number): void {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.figure = new SuperFigure({ snapGrid: true, xMin: -6, yMin: -6 })
    this.figure.create('Grid')
    console.log(this.figure)
    let texte, texteCorr
    this.contenu = '' // Liste de questions
    this.contenuCorrection = '' // Liste de questions corrigées
    texte = 'Placer le point de coordonnées $(-4 ; 1).$'
    texteCorr = ''
    this.listeQuestions.push(texte)
    this.listeCorrections.push(texteCorr)
    this.listeQuestions[0] += `<div class="mt-6" id="apiGeomEx${numeroExercice}F0"></div>`
    this.listeCorrections[0] = ''
    document.addEventListener('exercicesAffiches', () => {
      const container = document.querySelector(`#apiGeomEx${numeroExercice}F0`) as HTMLDivElement
      if (container === null) return
      container.innerHTML = ''
      const buttons = this.figure.addButtons('POINT REMOVE')
      buttons.style.display = 'flex'
      container.appendChild(buttons)
      this.figure.setContainer(container)
    })
  }

  correctionInteractive = (i?: number) => {
      const points = [...this.figure.elements.values()].filter(e => e.type.includes('Point')) as Point[]
      const point = points[0]
      if (point === undefined) return 'KO'
      if (point.x === -4 && point.y === 1) return 'OK'
      return 'KO'
    }
}

export default ReperagePointDuPlan
