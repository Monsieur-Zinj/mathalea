import Exercice from '../ExerciceTs'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom'
import { context } from '../../modules/context'
import { creerNomDePolygone } from '../../lib/outils/outilString'
import { randint } from '../../modules/outils'
import { mathaleaRenderDiv } from '../../lib/mathalea'

export const titre = 'Tracer un triangle à partir de longueurs des 3 côtés'
export const dateDePublication = '29/10/2023'
export const interactifReady = true
export const interactifType = 'custom'

/**
 * Tracer un triangle à partir de longueurs des 3 côtés
 * @author Rémi Angot
 * Références geoTriangle-1
 */
export const uuid = 'e514f'

type Triangle = { label: string, a: number, b: number, c: number }

class ConstructionTriangle extends Exercice {
  // On déclare des propriétés supplémentaires pour cet exercice afin de pouvoir les réutiliser dans la correction
  figure!: Figure
  triangle: Triangle = { label: 'ABC', a: 3, b: 4, c: 50 }
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
    this.triangle.label = creerNomDePolygone(3)
    while (!isTriangle(this.triangle)) {
      this.triangle.a = randint(3, 10)
      this.triangle.b = randint(3, 10, this.triangle.a)
      this.triangle.c = randint(3, 10, [this.triangle.a, this.triangle.b])
    }

    const [labelA, labelB, labelC] = this.triangle.label.split('') as [string, string, string]
    const [a, b, c] = [this.triangle.a, this.triangle.b, this.triangle.c]

    const enonce = `Tracer le triangle $${this.triangle.label}$ tel que $${labelA}${labelB}=${c}$ ; $${labelB}${labelC}=${a}$ et $${labelC}${labelA}=${b}$.`
    this.figure.setToolbar({ tools: ['POINT', 'POINT_ON', 'POINT_INTERSECTION', 'SEGMENT', 'POLYGON', 'CIRCLE_CENTER_POINT', 'CIRCLE_RADIUS', 'NAME_POINT', 'DRAG', 'HIDE', 'REMOVE', 'UNDO', 'REDO', 'SHAKE'], position: 'top' })
    const emplacementPourFigure = figureApigeom({ exercice: this, idApigeom: this.idApigeom, figure: this.figure })
    let texteCorr = `$${labelA}${labelB}=${c}$ donc $${labelB}$ est sur le cercle de centre $${labelA}$ et de rayon $${c}$.`
    texteCorr += `<br>$${labelB}${labelC}=${a}$ donc $${labelC}$ est sur le cercle de centre $${labelB}$ et de rayon $${a}$.`
    texteCorr += `<br>$${labelC}${labelA}=${b}$ donc $${labelC}$ est sur le cercle de centre $${labelA}$ et de rayon $${b}$.`
    if (context.isHtml) {
      this.question = enonce + emplacementPourFigure
      this.correction = texteCorr
    } else {
      this.question = enonce
      this.correction = ''
    }
  }

  correctionInteractive = () => {
    this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[this.idApigeom] = this.figure.json
    let resultat = []
    // 1 point par distance correcte + 2 points si tout est correct (on ne vérifie pas que le triangle est tracé)
    const divFeedback = document.querySelector(`#feedback${this.idApigeom}`) as HTMLDivElement
    let feedback = ''
    const [labelA, labelB, labelC] = this.triangle.label.split('') as [string, string, string]
    const [a, b, c] = [this.triangle.a, this.triangle.b, this.triangle.c]
    let { message, isValid } = this.figure.testDistance({ label1: labelA, label2: labelB, distance: c })
    if (message) feedback += message + '<br>'
    resultat.push(isValid ? 'OK' : 'KO')
    ;({ message, isValid } = this.figure.testDistance({ label1: labelB, label2: labelC, distance: a }))
    if (message) feedback += message + '<br>'
    resultat.push(isValid ? 'OK' : 'KO')
    ;({ message, isValid } = this.figure.testDistance({ label1: labelC, label2: labelA, distance: b }))
    if (message) feedback += message + '<br>'
    resultat.push(isValid ? 'OK' : 'KO')
    if (resultat.every(r => r === 'OK')) {
      feedback += '<br>Bravo !'
      resultat = [...resultat, 'OK', 'OK']
    } else {
      resultat = [...resultat, 'KO', 'KO']
    }
    divFeedback.innerHTML = feedback
    // Comme c'est asynchrone, il faut forcer le rendu LaTeX
    mathaleaRenderDiv(divFeedback)
    this.figure.isDynamic = false
    this.figure.divButtons.style.display = 'none'
    this.figure.divUserMessage.style.display = 'none'
    this.figure.buttons.get('SHAKE')?.click()
    return resultat
  }
}

function isTriangle (triangle: Triangle): boolean {
  const { a, b, c } = triangle
  return a + b > c && a + c > b && b + c > a
}

export default ConstructionTriangle
