import Exercice from '../ExerciceTs'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom'

export const titre = 'Tracer un parallélogramme (sans tracer de parallèles)'
export const dateDePublication = '9/11/2023'
export const interactifReady = true
export const interactifType = 'custom'

/**
 * Tracer un rectangle
 * @author Rémi Angot
 * Références geoParallelogramme2
 */

export const ref = 'parallelogramme2'
export const uuid = '784a7'

class ConstructionParallelogramme extends Exercice {
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
    this.figure = new Figure({ xMin: 0, yMin: 0, width: 800, height: 500, border: true })
    this.figure.options.labelAutomaticForPoints = true
    const A = this.figure.create('Point', { x: 8, y: 11, label: 'A' })
    const B = this.figure.create('Point', { x: 18, y: 12, label: 'B' })
    const C = this.figure.create('Point', { x: 20, y: 9, label: 'C' })
    this.figure.create('Segment', { point1: A, point2: B })
    this.figure.create('Segment', { point1: B, point2: C })

    const enonce = 'Placer le point $D$ tel que $ABCD$ soit un parallélogramme.'
    this.figure.setToolbar({ tools: ['POINT', 'POINT_ON', 'POINT_INTERSECTION', 'SEGMENT', 'POLYGON', 'CIRCLE_CENTER_POINT', 'CIRCLE_RADIUS', 'NAME_POINT', 'DRAG', 'HIDE', 'REMOVE', 'UNDO', 'REDO', 'SHAKE'], position: 'top' })
    const emplacementPourFigure = figureApigeom({ exercice: this, idApigeom: this.idApigeom, figure: this.figure })
    let texteCorr = 'Un rectangle est un quadrilatère qui a 4 angles droits.'
    texteCorr += '<br>On peut tracer un rectangle de différentes façons.'
    texteCorr += '<br>Dans cette animation, on va tracer un quadrilatère avec 3 angles droits mais on n\'aurait pu aussi ne faire qu\'un angle droit et tracer des côtés opposés parallèles.'
    const figureCorrection = createAnimationConstructionRectangle()
    const emplacementPourFigureCorrection = figureApigeom({ animation: true, exercice: this, idApigeom: `apigeomEx${this.numeroExercice}Correction`, figure: figureCorrection })
    this.question = enonce + emplacementPourFigure
    this.correction = texteCorr + emplacementPourFigureCorrection
  }

  correctionInteractive = () => {
    this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[this.idApigeom] = this.figure.json
    const resultat = []
    let feedback = ''
    // 1 point par angle droit + 1 point si tout est correct (on ne vérifie pas que le triangle est tracé)
    const divFeedback = document.querySelector(`#feedback${this.idApigeom}`) as HTMLDivElement
    const { isValid, message } = this.figure.testSameDistance({ label1: 'AB', label2: 'CD' })
    resultat.push(isValid ? 'OK' : 'KO')
    if (message !== '') { feedback += message + '<br>' }
    const { isValid: isValid2, message: message2 } = this.figure.testSameDistance({ label1: 'BC', label2: 'AD' })
    resultat.push(isValid2 ? 'OK' : 'KO')
    if (message2 !== '') { feedback += message2 + '<br>' }
    if (isValid && isValid2) {
      resultat.push('OK', 'OK', 'OK')
      feedback += 'Le quadrilatère $ABCD$ a ses côtés opposés deux à deux de même longueur donc s\'il est non croisé, c\'est bien un parallélogramme.'
      feedback += '<br>Bravo !'
    } else {
      resultat.push('KO', 'KO', 'KO')
    }
    divFeedback.innerHTML = feedback
    this.figure.isDynamic = false
    this.figure.divButtons.style.display = 'none'
    this.figure.divUserMessage.style.display = 'none'
    this.figure.buttons.get('SHAKE')?.click()
    return resultat
  }
}

export default ConstructionParallelogramme

function createAnimationConstructionRectangle () : Figure {
  const figure = new Figure({ xMin: 0, yMin: 0, width: 800, height: 500, border: true })
  figure.setToolbar({ position: 'top', tools: ['RESTART', 'PLAY_SKIP_BACK', 'PLAY', 'PLAY_SKIP_FORWARD', 'PAUSE'] })
  const description = figure.create('TextByPosition', { anchor: 'bottomLeft', backgroundColor: 'white', text: 'Si un quarilatère non croisé a ses côtés opoosés deux à deux de même longueur alors c\'est un parallélogramme.', x: 10, y: 15 })
  const A = figure.create('Point', { x: 8, y: 11, label: 'A' })
  const B = figure.create('Point', { x: 18, y: 12, label: 'B' })
  const C = figure.create('Point', { x: 20, y: 9, label: 'C' })
  figure.create('Segment', { point1: A, point2: B })
  figure.create('Segment', { point1: B, point2: C })
  figure.saveState()
  description.text = 'Il faut placer le point $D$ tel que $AB = CD$ et $BC = AD$.'
  description.text += '<br>Donc $D$ est sur le cercle de centre $C$ et de rayon $AB$ et sur le cercle de centre $A$ et de rayon $BC$.'
  const lAB = figure.create('Distance', { point1: A, point2: B })
  const c1 = figure.create('CircleCenterDynamicRadius', { center: C, radius: lAB })
  const lBC = figure.create('Distance', { point1: B, point2: C })
  const c2 = figure.create('CircleCenterDynamicRadius', { center: A, radius: lBC })
  figure.saveState()
  description.text = 'On place le point $D$ à l\'intersection des deux cercles.'
  const D = figure.create('PointIntersectionCC', { circle1: c1, circle2: c2, label: 'D', n: 2 })
  figure.saveState()
  description.text = 'On peut cacher les cercles et tracer le parallélogrammz.'
  c1.hide()
  c2.hide()
  figure.create('Polygon', { points: [A, B, C, D] })
  figure.saveState()
  return figure
}
