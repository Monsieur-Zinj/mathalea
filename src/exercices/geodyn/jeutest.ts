import Exercice from '../Exercice'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom'

export const titre = 'Un jeu'
export const interactifReady = true
export const interactifType = 'custom'

/**
 *
 *
 *
 */

/* export const ref = 'jeutest'
export const refs = {
  'fr-fr': ['jeutest'],
  'fr-ch': []
} */
export const uuid = 'e2024'

class jeutest extends Exercice {
  // On déclare des propriétés supplémentaires pour cet exercice afin de pouvoir les réutiliser dans la correction
  figure!: Figure
  idApigeom!: string
  constructor () {
    super()
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    this.reponse = ''
    this.formatChampTexte = 'none'
    this.exoCustomResultat = true
  }

  nouvelleVersion (): void {
    this.idApigeom = `apigeomEx${this.numeroExercice}F0`
    this.figure = new Figure({ xMin: -5, yMin: -5, width: 800, height: 500, border: false })
    this.figure.options.labelAutomaticBeginsWith = 'A'
    this.figure.create('Grid', { strokeWidthGrid: 1, color: 'black', yMin: 0, yMax: 5, xMax: 3, xMin: 0, axeX: false, axeY: false, labelX: false, labelY: false })
    this.figure.snapGrid = true
    this.figure.create('TextByPosition', { anchor: 'middleCenter', text: '4', x: 0.5, y: 0.5 })
    this.figure.options.color = 'blue'
    this.figure.options.shape = 'o'
    this.figure.options.labelIsVisible = false
    const enonce = 'Mettre des points sur la grille.'
    this.figure.setToolbar({ tools: ['POINT', 'DRAG', 'REMOVE', 'UNDO', 'REDO'], position: 'top' })
    const emplacementPourFigure = figureApigeom({ exercice: this, idApigeom: this.idApigeom, figure: this.figure })
    const texteCorr = 'Plus tard'
    // const figureCorrection = createAnimationConstructionRectangle()
    // const emplacementPourFigureCorrection = figureApigeom({ animation: true, exercice: this, idApigeom: `apigeomEx${this.numeroExercice}Correction`, figure: figureCorrection })
    this.question = enonce + emplacementPourFigure
    this.correction = texteCorr // + emplacementPourFigureCorrection
  }

  correctionInteractive = () => {
    this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[this.idApigeom] = this.figure.json
    const divFeedback = document.querySelector(`#feedbackEx${this.numeroExercice}Q${0}`) as HTMLDivElement
    const { isValid, message } = this.figure.checkCoords({ x: 1, y: 1 })
    divFeedback.innerHTML = message
    this.figure.isDynamic = false
    this.figure.divButtons.style.display = 'none'
    this.figure.divUserMessage.style.display = 'none'
    this.figure.buttons.get('SHAKE')?.click()
    if (isValid) {
      return ['OK']
    } else {
      return ['KO']
    }
  }
}

export default jeutest

// function createAnimationConstructionRectangle () : Figure {
//   const figure = new Figure({ xMin: 0, yMin: 0, width: 800, height: 500, border: true })
//   figure.setToolbar({ position: 'top', tools: ['RESTART', 'PLAY_SKIP_BACK', 'PLAY', 'PLAY_SKIP_FORWARD', 'PAUSE'] })
//   const description = figure.create('TextByPosition', { anchor: 'bottomLeft', backgroundColor: 'white', text: 'Si un quarilatère non croisé a ses côtés opoosés deux à deux de même longueur alors c\'est un parallélogramme.', x: 10, y: 15 })
//   const A = figure.create('Point', { x: 8, y: 11, label: 'A' })
//   const B = figure.create('Point', { x: 18, y: 12, label: 'B' })
//   const C = figure.create('Point', { x: 20, y: 9, label: 'C' })
//   const sAB = figure.create('Segment', { point1: A, point2: B })
//   const sBC = figure.create('Segment', { point1: B, point2: C })
//   figure.saveState()
//   description.text = 'On trace la droite parallèle à $(AB)$ passant par C.'
//   const dCD = figure.create('LineParallel', { point: C, line: sAB })
//   figure.saveState()
//   description.text = 'On trace la droite parallèle à $(BC)$ passant par A.'
//   const dAD = figure.create('LineParallel', { point: A, line: sBC })
//   figure.saveState()
//   description.text = 'On place le point $D$ à l\'intersection des deux droites en utilisant bien le bouton « Point intersection » et pas le bouton « Point libre ».'
//   const D = figure.create('PointIntersectionLL', { line1: dCD, line2: dAD, label: 'D' })
//   figure.saveState()
//   description.text = 'On peut cacher les droites et tracer le parallélogramme.'
//   dCD.hide()
//   dAD.hide()
//   figure.create('Polygon', { points: [A, B, C, D] })
//   figure.saveState()
//   return figure
// }
