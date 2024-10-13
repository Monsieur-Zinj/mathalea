import Exercice from '../Exercice'
import { point, TracePoint, Point } from '../../lib/2d/points'
import { colorToLatexOrHTML, fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import { grille } from '../../lib/2d/reperes'
import { contraindreValeur, egal, randint } from '../../modules/outils'
import { shuffle } from '../../lib/outils/arrayOutils'
import { labelPoint } from '../../lib/2d/textes'
import { rotation } from '../../lib/2d/transformations'
import { cercleCentrePoint } from '../../lib/2d/cercle'
import { choisitLettresDifferentes } from '../../lib/outils/aleatoires'
import { context } from '../../modules/context'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom'
import type PointApigeom from 'apigeom/src/elements/points/Point'
import { codageMilieu } from '../../lib/2d/codages'
import { demiDroite } from '../../lib/2d/segmentsVecteurs'
import type SuperFigure from 'apigeom'
import { rotationCoord } from 'apigeom/src/elements/calculus/Coords'

export const titre = 'Construire des symétriques de points par rapport à un point'
export const dateDePublication = '27/09/2024'
export const interactifReady = true
export const interactifType = 'custom'

export const uuid = '67c96'
export const refs = {
  'fr-fr': ['5G11-10'],
  'fr-ch': []
}

/**
 * Fonction pour positionner le label
 * @param pointA
 * @param pointB
 */
function positionneLabel (pointA: Point, pointB: Point) {
  if (pointA.x < pointB.x) return 'above left'
  else if (pointA > pointB.x) return 'below right'
  else {
    if (pointA.y > pointB.y) return 'above left'
    else return 'below right'
  }
}

/**
 * fonction pour verifier qu'on est dans le cadre
 * @param points
 */
function checkDistance (points: {x: number, y:number}[]) {
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
class ConstrctionsSymetrieCentralePoints extends Exercice {
  antecedents!: object[][]
  labels!: string[][]
  centres!: Point[]|PointApigeom[]
  exoCustomResultat: boolean
  nbPoints!: number
  figuresApiGeom!: SuperFigure[]
  constructor () {
    super()
    this.exoCustomResultat = true
    this.nbQuestions = 1
    this.spacingCorr = 1
    this.besoinFormulaireNumerique = [
      'Type d\'aide',
      4,
      'Quadrillages\nDemi-droites en pointillés\nMarques de compas\nAucune'
    ]
    this.besoinFormulaire2Numerique = ['Nombre de points à construire (5 maxi)', 5]
    this.sup = 1
    this.sup2 = 3
  }

  nouvelleVersion () {
    const marks: string[] = ['//', '///', 'x', 'O', '|||']
    const colors: string[] = context.isHtml ? ['red', 'green', 'purple', 'blue', 'gray'] : ['gray', 'gray', 'gray', 'gray', 'gray']
    this.answers = {}
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.figuresApiGeom = []
    this.nbPoints = contraindreValeur(1, 5, this.sup2, 3) // on veut entre 1 et 5 points à construire
    this.antecedents = []
    this.labels = []
    this.centres = []
    for (let i = 0; i < this.nbQuestions; i++) {
      let enonce = ''
      let antecedents: Array<Point> = []
      const symetriques: Point[] = []
      const objets = []
      let objetsCorrection: object[] = []

      objets.length = 0
      objetsCorrection.length = 0
      symetriques.length = 0
      antecedents.length = 0
      let nuage: {x: number, y:number}[] = []
      // On construit les points
      do {
        nuage = []
        for (let x = -8; x < 8; x += 1) {
          if (x !== 0) nuage.push({ y: (randint(2, 8) + 1) * (-1) ** x, x })
        }
        nuage = shuffle(nuage)
        nuage = nuage.slice(0, this.nbPoints)
      } while (!checkDistance(nuage))

      this.labels[i] = Array.from(choisitLettresDifferentes(nuage.length, 'Q', true))
      const labelCentre = choisitLettresDifferentes(1, this.labels[i].join('') + 'Q', true)[0]

      // Les antécédents sont des points nommés
      antecedents = shuffle(nuage).map((el, k) => point(el.x, el.y, this.labels[i][k])) // on mélange et on ne prendra que les this.nbPoints premiers
      this.centres[i] = point(0, 0, labelCentre, 'above')

      const guideDroites = []
      for (let k = 0; k < this.nbPoints; k++) {
        const guide = demiDroite(antecedents[k], this.centres[i] as Point)
        guide.pointilles = 2
        guide.color = colorToLatexOrHTML(colors[k])
        guide.opacite = 0.8
        guideDroites.push(guide)
      }
      enonce = `${this.sup === 1 ? 'Placer' : 'Construire'} le${this.nbPoints > 1 ? 's' : ''} symétrique${this.nbPoints > 1 ? 's' : ''} $${this.nbPoints > 1 ? this.labels[i].slice(0, this.nbPoints - 1).join('\',') + '\'' : (this.labels[i][0] + '\' ')}$` + (this.nbPoints > 1 ? ` et $${this.labels[i][this.nbPoints - 1] + '\''}$` : '') + (this.nbPoints > 1 ? ' respectifs ' : '')
      enonce += `${this.nbPoints > 1 ? ' des' : ' du'} point${this.nbPoints > 1 ? 's' : ''} $${this.nbPoints > 1 ? this.labels[i].slice(0, this.nbPoints - 1).join(',') : (this.labels[i][0]) + `$ par rapport au point $${labelCentre}$.`}$` + (this.nbPoints > 1 ? ` et $${this.labels[i][this.nbPoints - 1]}$ par rapport au point $${labelCentre}$..<br>` : '<br>')
      const guidesArc = []
      for (let k = 0; k < this.nbPoints; k++) {
        symetriques[k] = rotation(antecedents[k] as Point, this.centres[i] as Point, 180)
        /*  const angleOffset = choice([-12, -10, -8, 8, 10, 12])
          const ext1 = rotation(symetriques[k], middle[k], 3 * angleOffset)
          const ext2 = rotation(symetriques[k], middle[k], -angleOffset)
         */
        const guide = cercleCentrePoint(this.centres[i], antecedents[k], colors[k])
        guide.pointilles = 2
        guide.opacite = 0.8
        guidesArc.push(guide)
      }
      if (this.sup === 1) {
        objets.push(grille(-8, -8, 8, 8, 'gray', 0.5, 1, 0))
      } else if (this.sup === 2) {
        enonce += `Les demi-droites tracées en pointillés passent par $${labelCentre}$.<br>`
        objets.push(...guideDroites)
      } else if (this.sup === 3) {
        enonce += `Les cercles tracés en pointillés sont centrés en $${labelCentre}$.<br>`
        objets.push(...guidesArc)
      }
      objets.push(new TracePoint(this.centres[i]), labelPoint(this.centres[i] as Point))
      objetsCorrection.push(new TracePoint(this.centres[i]), labelPoint(this.centres[i] as Point))
      for (let k = 0; k < this.nbPoints; k++) {
        objets.push(new TracePoint(antecedents[k]))
        const sym = rotation(antecedents[k] as Point, this.centres[i] as Point, 180, (antecedents[k] as Point).nom + '\'')
        sym.positionLabel = positionneLabel(sym, antecedents[k])
        antecedents[k].positionLabel = positionneLabel(antecedents[k], sym)
        const egalite = codageMilieu(antecedents[k], sym, colors[k], marks[k])
        const trace: TracePoint = new TracePoint(sym)
        trace.color = colorToLatexOrHTML('red')
        const labelSym = labelPoint(sym)
        const label = labelPoint(antecedents[k])
        objets.push(label)
        objetsCorrection.push(trace, labelSym, egalite)
      }
      objetsCorrection = [...objets, ...objetsCorrection, ...guideDroites]
      if (this.sup2 === 2) {
        guideDroites.forEach(guide => {
          guide.epaisseur = 1
          guide.opacite = 0.8
        })
        objetsCorrection.push(...guideDroites)
      }
      if (this.sup2 === 3) {
        guidesArc.forEach(guide => {
          guide.epaisseur = 1
          guide.opacite = 0.8
        })
        objetsCorrection.push(...guidesArc)
      }
      const options = {}
      if (this.sup === 1) Object.assign(options, { snapGrid: true, dx: 1, dy: 1 })
      if (context.isHtml && this.interactif) {
        this.figuresApiGeom[i] = new Figure(Object.assign(options, { xMin: -10, yMin: -10, width: 600, height: 600 }))
        this.figuresApiGeom[i].scale = 1
        this.figuresApiGeom[i].setToolbar({ tools: ['NAME_POINT', 'POINT_ON', 'POINT_INTERSECTION', 'CIRCLE_CENTER_POINT', 'RAY', 'UNDO', 'REDO', 'REMOVE'], position: 'top' })
        this.centres[i] = this.figuresApiGeom[i].create('Point', { x: 0, y: 0, isVisible: true, isSelectable: true, label: labelCentre })
        this.antecedents[i] = []
        for (let k = 0; k < this.nbPoints; k++) {
          (this.antecedents[i][k] as PointApigeom) = this.figuresApiGeom[i].create('Point', { x: antecedents[k].x, y: antecedents[k].y, isFree: false, isSelectable: true, label: antecedents[k].nom })
        }
        if (this.sup === 1) {
          this.figuresApiGeom[i].create('Grid', { xMin: -10, yMin: -10, xMax: 10, yMax: 10, stepX: 1, stepY: 1, color: 'gray', axeX: false, axeY: false, labelX: false, labelY: false })
        }
        if (this.sup === 2) {
          for (let k = 0; k < this.nbPoints; k++) {
            this.figuresApiGeom[i].create('Ray', { point1: (this.antecedents[i][k] as PointApigeom), point2: this.centres[i] as PointApigeom, isDashed: true, color: 'gray' })
          }
        }
        if (this.sup === 3) {
          for (let k = 0; k < this.nbPoints; k++) {
            this.figuresApiGeom[i].create('CircleCenterPoint', {
              center: this.figuresApiGeom[i].create('Point', { isVisible: false, x: this.centres[i].x, y: this.centres[i].y }),
              point: (this.antecedents[i][k] as PointApigeom),
              isDashed: true,
              color: 'gray'
            })
          }
        }
        this.figuresApiGeom[i].options.limitNumberOfElement.set('Point', 1)
        const emplacementPourFigure = figureApigeom({ exercice: this, i, figure: this.figuresApiGeom[i], defaultAction: 'NAME_POINT' })
        this.listeQuestions.push(enonce + '<br><br>' + emplacementPourFigure)
      } else {
        this.listeQuestions.push(enonce + '<br><br>' + mathalea2d(Object.assign({ scale: 0.5, pixelsParCm: 20 }, fixeBordures([...objets, ...objetsCorrection])), objets))
      }
      this.listeCorrections.push(mathalea2d(Object.assign({ scale: 0.5, pixelsParCm: 20 }, fixeBordures(objetsCorrection)), objetsCorrection))
    }
  }

  correctionInteractive = (i: number) => {
    if (this.answers === undefined) this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[this.figuresApiGeom[i].id] = this.figuresApiGeom[i].json
    const resultat = []
    const divFeedback = document.querySelector(`#feedbackEx${this.numeroExercice}Q${i}`) as HTMLDivElement
    let feedback = ''

    // on crée les bons symétriques :
    for (let k = 0; k < this.nbPoints; k++) {
      const { x, y } = rotationCoord(this.antecedents[i][k] as PointApigeom, this.centres[i] as PointApigeom, 180)
      const elts = Array.from(this.figuresApiGeom[i].elements.values())
      const points = elts
        .filter(e => e.type !== 'pointer' &&
              (e.type === 'Point' || e.type === 'PointOnLine' || e.type === 'PointOnCircle' || e.type === 'PointIntersectionLL' || e.type === 'PointIntersectionLC' || e.type === 'PointIntersectionCC')) as PointApigeom[]
      const matchPoint = points.find(p => p.label === `${this.labels[i][k]}'`) as PointApigeom
      const sym = points.find(p => egal(x, p.x, 0.001) && egal(y, p.y, 0.001)) as PointApigeom
      if (matchPoint != null) {
        if (egal(x, matchPoint.x, 0.001) && egal(y, matchPoint.y, 0.001)) {
          matchPoint.color = 'green'
          matchPoint.thickness = 2
          matchPoint.colorLabel = 'green'
          resultat.push('OK')
        } else {
          matchPoint.color = 'red'
          matchPoint.thickness = 2
          matchPoint.colorLabel = 'green'
          feedback += `Il y a  bien un point nommé $${(this.antecedents[i][k] as PointApigeom).label}'$ mais ce n'est pas le symétrique de $${(this.antecedents[i][k] as PointApigeom).label}$ !<br>`
          resultat.push('KO')
        }
      } else {
        if (sym != null) {
          sym.color = 'green'
          sym.thickness = 2
          sym.colorLabel = 'red'
          feedback += `Tu as bien construit le symétrique de $${(this.antecedents[i][k] as PointApigeom).label}$ mais tu ne l'as pas nommé $${(this.antecedents[i][k] as PointApigeom).label}'$ !<br>`
        } else {
          feedback += `Il n'y a pas de point symétrique de $${(this.antecedents[i][k] as PointApigeom).label}$ et il n'y a pas de point nommé $${(this.antecedents[i][k] as PointApigeom).label}'$ !<br>`
        }
        resultat.push('KO')
      }
    }
    if (divFeedback) divFeedback.innerHTML = feedback
    this.figuresApiGeom[i].isDynamic = false
    this.figuresApiGeom[i].divButtons.style.display = 'none'
    this.figuresApiGeom[i].divUserMessage.style.display = 'none'
    return resultat
  }
}

export default ConstrctionsSymetrieCentralePoints
