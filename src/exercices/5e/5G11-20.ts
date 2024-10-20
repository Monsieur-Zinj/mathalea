import Exercice from '../Exercice'
import { gestionnaireFormulaireTexte, randint } from '../../modules/outils'
import { shuffle } from '../../lib/outils/arrayOutils'
import { choisitLettresDifferentes } from '../../lib/outils/aleatoires'
import { context } from '../../modules/context'
import figureApigeom from '../../lib/figureApigeom'
import { wrapperApigeomToMathalea } from '../../lib/apigeom/apigeomZoom'
import type PointApigeom from 'apigeom/src/elements/points/Point'
import SuperFigure from 'apigeom'
import { rotationCoord } from 'apigeom/src/elements/calculus/Coords'
import checkSegment from 'apigeom/src/check/checkSegment'
import checkPolygon from 'apigeom/src/check/checkPolygon'
import checkRay from 'apigeom/src/check/checkRay'
import checkLine from 'apigeom/src/check/checkLine'
import checkCoords from 'apigeom/src/check/checkCoords'
import checkCircle from 'apigeom/src/check/checkCircleRadius'
import { isGeoDynamic } from '../../lib/types/referentiels'

export const titre = 'Construire des symétriques de figures par rapport à un point'
export const dateDePublication = '28/09/2024'
export const interactifReady = true
export const interactifType = 'custom'

export const uuid = 'd37ea'
export const refs = {
  'fr-fr': ['5G11-20'],
  'fr-ch': []
}

/**
 * fonction pour verifier qu'on est dans le cadre
 * @param points
 */
function checkDistance (points: {x: number, y:number}[]) {
  const [x0, y0] = [points[0].x, points[0].y]
  const [x1, y1] = [points[1].x, points[1].y]
  const [x2, y2] = [points[2].x, points[2].y]
  if ((x0 ** 2 + y0 ** 2) < 16 ||
   (x0 ** 2 + y0 ** 2) > 25 ||
    (x1 - x0) ** 2 + (y1 - y0) ** 2 > 40 ||
     (x1 - x0) ** 2 + (y1 - y0) ** 2 < 16 ||
   0.5 * Math.abs(x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1)) < 8
  ) return false // ça c'est pour éviter les centres de cercle trop excentrés et les rayons de cercle trop importants
  for (const point of points) {
    if (point.y < -8 || point.y > 8) {
      return false
    }
  }
  return true
}

/**
 * Construction interactive de symétriques de points
 * @author Jean-Claude Lhote
 */
class ConstructionsSymetrieCentraleFigures extends Exercice {
  antecedents!: PointApigeom[][]
  labels!: string[][]
  centres!: PointApigeom[]
  typesDeQuestions!: ('segment'|'droite'|'demidroite'|'cercle'|'triangle')[]
  nbPoints!: number[]
  exoCustomResultat: boolean
  figuresApiGeom!: SuperFigure[]
  constructor () {
    super()
    this.exoCustomResultat = true
    this.nbQuestions = 6
    this.spacing= context.isHtml ? 1 : 0.1
    this.spacingCorr = context.isHtml ? 1 : 0.1
    this.besoinFormulaireNumerique = [
      'Type d\'aide',
      4,
      'Quadrillages\nDemi-droites en pointillés\nMarques de compas\nAucune'
    ]
    this.besoinFormulaire2Texte = ['Type de figures', '1 : Segment\n2 : Droite\n3 : Demi-droite\n4 : Cercle\n5 : Triangle\n6 : Mélange']
    this.sup = 1
    this.sup2 = '6'
  }

  nouvelleVersion () {
    const marks: string[] = ['//', 'o', '||']
    const colors: string[] = context.isHtml ? ['red', 'green', 'purple', 'blue', 'gray'] : ['gray', 'gray', 'gray', 'gray', 'gray']
    this.answers = {}
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.figuresApiGeom = []
    this.antecedents = []
    this.labels = []
    this.centres = []
    this.typesDeQuestions = []
    this.nbPoints = []
    this.typesDeQuestions = gestionnaireFormulaireTexte({ nbQuestions: this.nbQuestions, saisie: this.sup2, min: 1, max: 5, melange: 6, defaut: 6, listeOfCase: ['segment', 'droite', 'demidroite', 'cercle', 'triangle'] }) as typeof this.typesDeQuestions
    for (let i = 0; i < this.nbQuestions; i++) {
      let nuage: {x: number, y:number}[] = []
      // On construit les points
      do {
        nuage = []
        for (let x = -8; x < 8; x += 1) {
          if (x !== 0) nuage.push({ y: (randint(2, 8) + 1) * (-1) ** x, x })
        }
        nuage = shuffle(nuage)
      } while (!checkDistance(nuage))
      nuage = nuage.slice(0, 3)
      this.labels[i] = Array.from(choisitLettresDifferentes(nuage.length, 'Q', true))
      const labelCentre = choisitLettresDifferentes(1, this.labels[i].join('') + 'Q', true)[0]
      let enonce = `Construire par symétrie de centre $${labelCentre}$, l'image `
      // Les antécédents sont des points nommés

      const options = {}
      if (this.sup === 1) Object.assign(options, { snapGrid: true, dx: 1, dy: 1 })

      this.figuresApiGeom[i] = new SuperFigure(Object.assign(options, { xMin: -10, yMin: -10, width: 300, height: 300, scale: 0.5 }))
      this.figuresApiGeom[i].options.latexHeight = 20
      this.figuresApiGeom[i].setToolbar({ tools: ['NAME_POINT', 'POINT_ON', 'POINT_INTERSECTION', 'CIRCLE_CENTER_POINT', 'RAY', 'LINE', 'SEGMENT', 'POLYGON', 'UNDO', 'REDO', 'REMOVE'], position: 'top' })
      this.centres[i] = this.figuresApiGeom[i].create('Point', { x: 0, y: 0, isVisible: true, isSelectable: true, label: labelCentre })
      this.antecedents[i] = nuage.map((el, k) => this.figuresApiGeom[i].create('Point', { x: el.x, y: el.y, isVisible: true, isSelectable: true, label: this.labels[i][k] }))

      switch (this.typesDeQuestions[i]) {
        case 'segment':
          this.nbPoints[i] = 2
          enonce += `du segment $[${this.labels[i][0]}${this.labels[i][1]}]$`
          this.figuresApiGeom[i].create('Segment', { point1: this.antecedents[i][0], point2: this.antecedents[i][1], isVisible: true })

          break
        case 'droite':
          this.nbPoints[i] = 2
          enonce += `de la droite $(${this.labels[i][0]}${this.labels[i][1]})$.`

          this.figuresApiGeom[i].create('Line', { point1: this.antecedents[i][0], point2: this.antecedents[i][1], isVisible: true })

          break
        case 'demidroite':
          this.nbPoints[i] = 2
          enonce += `de la demi-droite $(${this.labels[i][0]}${this.labels[i][1]})$.`
          this.figuresApiGeom[i].create('Ray', { point1: this.antecedents[i][0], point2: this.antecedents[i][1], isVisible: true })

          break
        case 'cercle':
          this.nbPoints[i] = 2
          enonce += `du cercle de centre $${this.labels[i][0]}$ passant par $${this.labels[i][1]}$.`
          this.figuresApiGeom[i].create('CircleCenterPoint', { center: this.antecedents[i][0], point: this.antecedents[i][1], isVisible: true })

          break
        case 'triangle':
          this.nbPoints[i] = 3
          enonce += `du triangle $${this.labels[i][0]}${this.labels[i][1]}${this.labels[i][2]}$`
          this.figuresApiGeom[i].create('Polygon', { points: [this.antecedents[i][0], this.antecedents[i][1], this.antecedents[i][2]], isVisible: true })

          break
        default:
          throw new Error('Type de question inconnu')
      }
      // On rend visible les points nécessaires à la figure.
      this.antecedents[i][0].isVisible = true
      this.antecedents[i][1].isVisible = true
      if (this.typesDeQuestions[i] !== 'triangle') { // Il n'y a que le triangle qui a 3 points.
        this.antecedents[i][2].isVisible = false
      }
      if (this.sup === 1) {
        this.figuresApiGeom[i].create('Grid', { xMin: -10, yMin: -10, xMax: 10, yMax: 10, stepX: 1, stepY: 1, color: 'gray', axeX: false, axeY: false, labelX: false, labelY: false })
      }
      if (this.sup === 2) {
        for (let k = 0; k < this.nbPoints[i]; k++) {
          this.figuresApiGeom[i].create('Ray', { point1: (this.antecedents[i][k] as PointApigeom), point2: this.centres[i] as PointApigeom, isDashed: true, color: 'gray' })
        }
      }
      if (this.sup === 3) {
        for (let k = 0; k < this.nbPoints[i]; k++) {
          this.figuresApiGeom[i].create('CircleCenterPoint', {
            center: this.figuresApiGeom[i].create('Point', { isVisible: false, x: this.centres[i].x, y: this.centres[i].y }),
            point: (this.antecedents[i][k] as PointApigeom),
            isDashed: true,
            color: 'gray'
          })
        }
      }
      this.figuresApiGeom[i].options.limitNumberOfElement.set('Point', 1)
      if (context.isHtml) {
        if (this.interactif) {
          this.listeQuestions.push(enonce + '<br>' + figureApigeom({ exercice: this, figure: this.figuresApiGeom[i], i, animation : true, defaultAction: 'NAME_POINT' }))
        } else {
          this.listeQuestions.push(enonce + '<br>' + wrapperApigeomToMathalea(this.figuresApiGeom[i]))
        }
      } else {
        this.listeQuestions.push(enonce + '<br><br>' + this.figuresApiGeom[i].tikz())
      }
      // On crée la figure pour la correction
      const correctionFig = new SuperFigure(Object.assign(options, { xMin: -10, yMin: -10, width: 300, height: 300, scale: 0.5, isDynamic: false }))
      correctionFig.setToolbar({ tools: ['UNDO'], position: 'top' })
      correctionFig.options.latexHeight = 20
      const sym: PointApigeom[] = []
      const centreCorrection = correctionFig.create('Point', { x: 0, y: 0, isVisible: true, isSelectable: false, label: this.centres[i].label })
      const copyAntecedents = this.antecedents[i].map((el, k) => correctionFig.create('Point', { x: el.x, y: el.y, isVisible: true, isSelectable: false, label: this.labels[i][k] }))
      if (this.typesDeQuestions[i] !== 'triangle') {
        copyAntecedents[2].isVisible = false
      }
      for (let k = 0; k < (this.typesDeQuestions[i] === 'triangle' ? 3 : 2); k++) {
        sym[k] = copyAntecedents[k].rotate(centreCorrection, 180, { label: this.antecedents[i][k].label + '\'' })
        correctionFig.create('Segment', { point1: copyAntecedents[k], point2: sym[k], isDashed: true, color: 'gray' })
        correctionFig.create('MarkBetweenPoints', { point1: sym[k], point2: centreCorrection, text: marks[k], fontSize: '10px', color: colors[k] })
        correctionFig.create('MarkBetweenPoints', { point2: copyAntecedents[k], point1: centreCorrection, text: marks[k], fontSize: '10px', color: colors[k] })
      }
      if (this.sup === 1) {
        correctionFig.create('Grid', { xMin: -10, yMin: -10, xMax: 10, yMax: 10, stepX: 1, stepY: 1, color: 'gray', axeX: false, axeY: false, labelX: false, labelY: false })
      }
      if (this.sup === 2) {
        for (let k = 0; k < this.nbPoints[i]; k++) {
          correctionFig.create('Ray', { point1: (this.antecedents[i][k] as PointApigeom), point2: this.centres[i] as PointApigeom, isDashed: true, color: 'gray' })
        }
      }
      if (this.sup === 3) {
        for (let k = 0; k < this.nbPoints[i]; k++) {
          correctionFig.create('CircleCenterPoint', {
            center: this.figuresApiGeom[i].create('Point', { isVisible: false, x: this.centres[i].x, y: this.centres[i].y }),
            point: (this.antecedents[i][k] as PointApigeom),
            isDashed: true,
            color: 'gray'
          })
        }
      }
      switch (this.typesDeQuestions[i]) {
        case 'segment':
          correctionFig.create('Segment', { point1: sym[0], point2: sym[1], color: 'orange', isVisible: true })
          correctionFig.create('Segment', { point1: copyAntecedents[0], point2: copyAntecedents[1], color: 'black', isVisible: true })
          break
        case 'droite':
          correctionFig.create('Line', { point1: sym[0], point2: sym[1], color: 'orange', isVisible: true })
          correctionFig.create('Line', { point1: copyAntecedents[0], point2: copyAntecedents[1], color: 'black', isVisible: true })

          break
        case 'demidroite':
          correctionFig.create('Ray', { point1: sym[0], point2: sym[1], color: 'orange', isVisible: true })
          correctionFig.create('Ray', { point1: copyAntecedents[0], point2: copyAntecedents[1], color: 'black', isVisible: true })

          break
        case 'cercle':
          correctionFig.create('CircleCenterPoint', { center: sym[0], point: sym[1], color: 'orange', isVisible: true })
          correctionFig.create('CircleCenterPoint', { center: copyAntecedents[0], point: copyAntecedents[1], color: 'black', isVisible: true })

          break
        case 'triangle':
          correctionFig.create('Polygon', { points: [sym[0], sym[1], sym[2]], color: 'orange', isVisible: true })
          correctionFig.create('Polygon', { points: [copyAntecedents[0], copyAntecedents[1], copyAntecedents[2]], color: 'black', isVisible: true })
          break
        default:
          throw new Error('Type de question inconnu')
      }

      this.listeCorrections.push(context.isHtml ? wrapperApigeomToMathalea(correctionFig) : correctionFig.tikz())
    }
  }

  correctionInteractive = (i: number) => {
    if (this.answers === undefined) this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[this.figuresApiGeom[i].id] = this.figuresApiGeom[i].json
    const divFeedback = document.querySelector(`#feedbackEx${this.numeroExercice}Q${i}`) as HTMLDivElement
    const typefigure = this.typesDeQuestions[i]
    const cords1 = rotationCoord(this.antecedents[i][0], this.centres[i], 180)
    const cords2 = rotationCoord(this.antecedents[i][1], this.centres[i], 180)
    const cords3 = rotationCoord(this.antecedents[i][2], this.centres[i], 180)
    let resultat: {isValid: boolean, message: string} = { isValid: true, message: '' }
    let resultat2: {isValid: boolean, message: string} = { isValid: true, message: '' }
    let resultat3: {isValid: boolean, message: string} = { isValid: true, message: '' }
    let resultat4: {isValid: boolean, message: string} = { isValid: true, message: '' }
    switch (typefigure) {
      case 'segment':
        resultat = checkSegment({ figure: this.figuresApiGeom[i], point1: cords1, point2: cords2 })
        resultat2 = checkCoords({ figure: this.figuresApiGeom[i], x: cords1.x, y: cords1.y, label: this.antecedents[i][0].label + '\'', checkOnlyAbscissa: false })
        resultat3 = checkCoords({ figure: this.figuresApiGeom[i], x: cords2.x, y: cords2.y, label: this.antecedents[i][1].label + '\'', checkOnlyAbscissa: false })
        break

      case 'droite':
        resultat = checkLine({ figure: this.figuresApiGeom[i], point1: cords1, point2: cords2 })
        resultat2 = checkCoords({ figure: this.figuresApiGeom[i], x: cords1.x, y: cords1.y, label: this.antecedents[i][0].label + '\'', checkOnlyAbscissa: false })
        resultat3 = checkCoords({ figure: this.figuresApiGeom[i], x: cords2.x, y: cords2.y, label: this.antecedents[i][1].label + '\'', checkOnlyAbscissa: false })

        break

      case 'demidroite':
        resultat = checkRay({ figure: this.figuresApiGeom[i], point1: cords1, point2: cords2 })
        resultat2 = checkCoords({ figure: this.figuresApiGeom[i], x: cords1.x, y: cords1.y, label: this.antecedents[i][0].label + '\'', checkOnlyAbscissa: false })
        resultat3 = checkCoords({ figure: this.figuresApiGeom[i], x: cords2.x, y: cords2.y, label: this.antecedents[i][1].label + '\'', checkOnlyAbscissa: false })

        break

      case 'cercle':
        resultat = checkCircle({ figure: this.figuresApiGeom[i], center: cords1, labelCenter: this.antecedents[i][0].label + '\'', radius: Math.sqrt((cords2.x - cords1.x) ** 2 + (cords2.y - cords1.y) ** 2) })
        resultat2 = checkCoords({ figure: this.figuresApiGeom[i], x: cords1.x, y: cords1.y, label: this.antecedents[i][0].label + '\'', checkOnlyAbscissa: false })
        resultat3 = checkCoords({ figure: this.figuresApiGeom[i], x: cords2.x, y: cords2.y, label: this.antecedents[i][1].label + '\'', checkOnlyAbscissa: false })

        break

      case 'triangle':
        resultat = checkPolygon({ figure: this.figuresApiGeom[i], points: [cords1, cords2, cords3] })
        resultat2 = checkCoords({ figure: this.figuresApiGeom[i], x: cords1.x, y: cords1.y, label: this.antecedents[i][0].label + '\'', checkOnlyAbscissa: false })
        resultat3 = checkCoords({ figure: this.figuresApiGeom[i], x: cords2.x, y: cords2.y, label: this.antecedents[i][1].label + '\'', checkOnlyAbscissa: false })
        resultat4 = checkCoords({ figure: this.figuresApiGeom[i], x: cords3.x, y: cords3.y, label: this.antecedents[i][2].label + '\'', checkOnlyAbscissa: false })

        break

      default:
        throw new Error('Type de question inconnu')
    }
    if (resultat.isValid && resultat2.isValid && resultat3.isValid && (typefigure !== 'triangle' || resultat4.isValid)) {
      if (divFeedback) divFeedback.innerHTML = 'Bravo !'
      this.figuresApiGeom[i].isDynamic = false
      this.figuresApiGeom[i].divButtons.style.display = 'none'
      this.figuresApiGeom[i].divUserMessage.style.display = 'none'
      return ['OK', 'OK']
    } else {
      if (divFeedback) divFeedback.innerHTML = [resultat.message, resultat2.message, resultat3.message, resultat4.message].join('<br>')
      this.figuresApiGeom[i].isDynamic = false
      this.figuresApiGeom[i].divButtons.style.display = 'none'
      this.figuresApiGeom[i].divUserMessage.style.display = 'none'
      if (resultat.isValid) return ['OK', 'KO']
      return ['KO', 'KO']
    }
  }
}
export default ConstructionsSymetrieCentraleFigures
