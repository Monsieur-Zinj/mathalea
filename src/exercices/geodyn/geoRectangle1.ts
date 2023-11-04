import Exercice from '../ExerciceTs'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom'

export const titre = 'Tracer un rectangle'
export const dateDePublication = '4/11/2023'
export const interactifReady = true
export const interactifType = 'custom'

/**
 * Tracer un rectangle
 * @author Rémi Angot
 * Références geoRectangle1
 */
export const uuid = '95526'

class ConstructionRectangle extends Exercice {
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

  nouvelleVersion (numeroExercice: number): void {
    this.idApigeom = `apigeomEx${numeroExercice}F0`
    this.figure = new Figure({ xMin: -7, yMin: -7, width: 800, height: 500, border: true })
    this.figure.options.labelAutomaticForPoints = true

    const enonce = 'Tracer un rectangle $ABCD$.'
    this.figure.setToolbar({ tools: ['POINT', 'POINT_ON', 'POINT_INTERSECTION', 'SEGMENT', 'LINE_PERPENDICULAR', 'LINE_PARALLEL', 'POLYGON', 'CIRCLE_CENTER_POINT', 'CIRCLE_RADIUS', 'NAME_POINT', 'DRAG', 'HIDE', 'REMOVE', 'UNDO', 'REDO', 'SHAKE'], position: 'top' })
    const emplacementPourFigure = figureApigeom({ exercice: this, idApigeom: this.idApigeom, figure: this.figure })
    const texteCorr = ''
    this.question = enonce + emplacementPourFigure
    this.correction = texteCorr
  }

  correctionInteractive = () => {
    this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[this.idApigeom] = this.figure.json
    const resultat = []
    let feedback = ''
    // 1 point par angle droit + 1 point si tout est correct (on ne vérifie pas que le triangle est tracé)
    const divFeedback = document.querySelector(`#feedback${this.idApigeom}`) as HTMLDivElement
    const { isValid, message } = this.figure.testAngle({ angle: 90, label1: 'A', label2: 'B', label3: 'C' })
    resultat.push(isValid ? 'OK' : 'KO')
    if (message !== '') { feedback += message + '<br>' }
    const { isValid: isValid2, message: message2 } = this.figure.testAngle({ angle: 90, label1: 'B', label2: 'C', label3: 'D' })
    resultat.push(isValid2 ? 'OK' : 'KO')
    if (message2 !== '') { feedback += message2 + '<br>' }
    const { isValid: isValid3, message: message3 } = this.figure.testAngle({ angle: 90, label1: 'C', label2: 'D', label3: 'A' })
    resultat.push(isValid3 ? 'OK' : 'KO')
    if (message3 !== '') { feedback += message3 + '<br>' }
    const { isValid: isValid4, message: message4 } = this.figure.testAngle({ angle: 90, label1: 'D', label2: 'A', label3: 'B' })
    resultat.push(isValid4 ? 'OK' : 'KO')
    if (message4 !== '') { feedback += message4 + '<br>' }
    if (isValid && isValid2 && isValid3 && isValid4) {
      resultat.push('OK')
      feedback += 'Bravo !'
    } else {
      resultat.push('KO')
    }
    divFeedback.innerHTML = feedback
    this.figure.isDynamic = false
    this.figure.divButtons.style.display = 'none'
    this.figure.divUserMessage.style.display = 'none'
    this.figure.buttons.get('SHAKE')?.click()
    return resultat
  }
}

export default ConstructionRectangle
