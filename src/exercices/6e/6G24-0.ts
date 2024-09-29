import Exercice from '../Exercice'
import {
  droiteHorizontaleParPoint,
  droiteParPointEtPente,
  droiteParPointEtPerpendiculaire,
  droiteVerticaleParPoint,
  Droite
} from '../../lib/2d/droites'
import { point, TracePoint, Point, pointSurDroite } from '../../lib/2d/points'
import { colorToLatexOrHTML, mathalea2d, Vide2d } from '../../modules/2dGeneralites'
import { grille } from '../../lib/2d/reperes'
import { egal, randint } from '../../modules/outils'
import { choice, combinaisonListes, shuffle } from '../../lib/outils/arrayOutils'
import { labelPoint, latexParCoordonnees, LatexParCoordonnees } from '../../lib/2d/textes'
import { projectionOrtho, symetrieAxiale } from '../../lib/2d/transformations'
import { cercleCentrePoint } from '../../lib/2d/cercle'
import { choisitLettresDifferentes } from '../../lib/outils/aleatoires'
import { codageAngleDroit } from '../../lib/2d/angles'
import { context } from '../../modules/context'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom'
import type PointApigeom from 'apigeom/src/elements/points/Point'
import { reflectOverLineCoord } from 'apigeom/src/elements/calculus/Coords'
import { codageMilieu } from '../../lib/2d/codages'
import type Line from 'apigeom/src/elements/lines/Line'

export const titre = 'Construire des symétriques de points'
export const dateDePublication = '07/01/2024'
export const interactifReady = true
export const interactifType = 'custom'

export const uuid = '26ea4'
export const ref = '6G24-0'
export const refs = {
  'fr-fr': ['6G24-0'],
  'fr-ch': ['9ES6-11']
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
    if (point.x < -7.5 || point.x > 7.5 || point.y < -7.5 || point.y > 7.5 || point.x === point.y || point.x === -point.y) {
      return false
    }
  }
  return true
}

/**
 * Construction interactive de symétriques de points
 * @author Jean-Claude Lhote
 */
class ConstrctionsSymetriquesPoints extends Exercice {
  figuresApiGeom!: Figure[]
  idApigeom!: string[]
  nbPoints!: number
  antecedents!: object[][]
  labels!: string[][]
  d!: Line[]
  exoCustomResultat: boolean
  constructor () {
    super()
    this.exoCustomResultat = true
    this.nbQuestions = 2
    this.spacingCorr = 1
    this.besoinFormulaireNumerique = ['Choix de l\'axe', 5, 'Axe horizontal\nAxe vertical\nAxe oblique /\nAxe oblique \\\nMélange']
    this.besoinFormulaire2Numerique = [
      'Type d\'aide',
      4,
      'Quadrillages\nPerpendiculaires en pointillés\nMarques de compas\nAucune'
    ]
    this.besoinFormulaire3Numerique = ['Nombre de points à construire (5 maxi)', 5]
    this.sup = 1
    this.sup2 = 1
    this.sup3 = 3
    this.nbPoints = 3
  }

  nouvelleVersion (numeroExercice: number) {
    const marks: string[] = ['//', '///', 'x', 'O', '|||']
    const colors: string[] = context.isHtml ? ['red', 'green', 'purple', 'blue', 'gray'] : ['gray', 'gray', 'gray', 'gray', 'gray']
    this.answers = {}
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    let choixDeLaxe: number[] = []
    this.figuresApiGeom = []
    this.idApigeom = []
    if (this.sup === 5) {
      choixDeLaxe = combinaisonListes([1, 2, 3, 4], this.nbQuestions)
    } else {
      choixDeLaxe = combinaisonListes([this.sup], this.nbQuestions)
    }
    this.nbPoints = Math.max(Math.min(this.sup3, 5), 1) // on veut entre 1 et 5 points à construire
    this.antecedents = []
    this.labels = []
    this.d = []
    for (let i = 0; i < this.nbQuestions; i++) {
      let enonce = ''
      let antecedents: Array<Point> = []
      const middle: Point[] = []
      const symetriques: Point[] = []
      const objets = []
      let objetsCorrection: object[] = []
      const d: Droite[] = []
      let labelD!: LatexParCoordonnees|Vide2d

      objets.length = 0
      objetsCorrection.length = 0
      middle.length = 0
      symetriques.length = 0
      antecedents.length = 0
      let nuage: {x: number, y:number}[] = []
      // On construit les points
      do {
        for (let x = -4; x < 4; x += 2) {
          nuage.push({ y: ((randint(1, 3) * 2) + 1) * choice([-0.5, 0.5]), x })
        }
        // On transforme les points en fonction du choix de l'axe
        if (choixDeLaxe[i] === 1) {
          for (let n = 0; n < nuage.length; n++) {
            nuage[n] = { x: nuage[n].x * 2, y: nuage[n].y * 2 }
          }
        } else if (choixDeLaxe[i] === 2) {
          for (let n = 0; n < nuage.length; n++) {
            nuage[n] = { x: nuage[n].y * 2, y: nuage[n].x * 2 }
          }
        } else if (choixDeLaxe[i] === 3) {
          for (let n = 0; n < nuage.length; n++) {
            nuage[n] = {
              x: Math.round(Math.sqrt(2) * (nuage[n].x - nuage[n].y)),
              y: Math.round(Math.sqrt(2) * (nuage[n].x + nuage[n].y))
            }
          }
        } else {
          for (let n = 0; n < nuage.length; n++) {
            nuage[n] = { x: nuage[n].x + nuage[n].y, y: nuage[n].y - nuage[n].x }
          }
        }
        nuage = shuffle(nuage)
        nuage = nuage.slice(0, this.nbPoints)
      } while (!checkDistance(nuage))

      this.labels[i] = Array.from(choisitLettresDifferentes(nuage.length, 'Q', true))

      // Les antécédents sont des points nommés
      antecedents = shuffle(nuage).map((el, k) => point(el.x, el.y, this.labels[i][k])) // on mélange et on ne prendra que les nbPoints premiers
      const O = point(0, 0, '', 'above')

      if (choixDeLaxe[i] === 1) {
        d[i] = droiteHorizontaleParPoint(O) as Droite
        labelD = latexParCoordonnees('(d)', -7.5, -0.8, 'black', 0, 0, '', 8)
      } else if (choixDeLaxe[i] === 2) {
        d[i] = droiteVerticaleParPoint(O) as Droite
        labelD = latexParCoordonnees('(d)', -0.8, -7.5, 'black', 0, 0, '', 8)
      } else if (choixDeLaxe[i] === 3) {
        d[i] = droiteParPointEtPente(O, 1) as Droite
        labelD = latexParCoordonnees('(d)', -7.5, -6.2, 'black', 0, 0, '', 8)
      } else {
        d[i] = droiteParPointEtPente(O, -1) as Droite
        labelD = latexParCoordonnees('(d)', -7.5, 6.2, 'black', 0, 0, '', 8)
      }
      const guideDroites = []
      for (let k = 0; k < this.nbPoints; k++) {
        const guide = droiteParPointEtPerpendiculaire(antecedents[k], d[i]) as Droite
        guide.pointilles = 2
        guide.color = colorToLatexOrHTML(colors[k])
        guide.opacite = 0.8
        guideDroites.push(guide)
      }
      enonce = `${this.sup2 === 1 ? 'Placer' : 'Construire'} le${this.nbPoints > 1 ? 's' : ''} symétrique${this.nbPoints > 1 ? 's' : ''} $${this.nbPoints > 1 ? this.labels[i].slice(0, this.nbPoints - 1).join('\',') + '\'' : (this.labels[i][0] + '\' ')}$` + (this.nbPoints > 1 ? ` et $${this.labels[i][this.nbPoints - 1] + '\''}$` : '') + (this.nbPoints > 1 ? ' respectifs ' : '')
      enonce += `${this.nbPoints > 1 ? ' des' : ' du'} point${this.nbPoints > 1 ? 's' : ''} $${this.nbPoints > 1 ? this.labels[i].slice(0, this.nbPoints - 1).join(',') : (this.labels[i][0]) + '$ par rapport à la droite $(d).'}$` + (this.nbPoints > 1 ? ` et $${this.labels[i][this.nbPoints - 1]}$ par rapport à la droite $(d)$.<br>` : '<br>')
      const guidesArc = []
      for (let k = 0; k < this.nbPoints; k++) {
        symetriques[k] = symetrieAxiale(antecedents[k] as Point, d[i])
        middle[k] = projectionOrtho(antecedents[k], d[i]) as Point
        /*  const angleOffset = choice([-12, -10, -8, 8, 10, 12])
          const ext1 = rotation(symetriques[k], middle[k], 3 * angleOffset)
          const ext2 = rotation(symetriques[k], middle[k], -angleOffset)
         */
        const guide = cercleCentrePoint(middle[k], antecedents[k], colors[k])
        guide.pointilles = 2
        guide.opacite = 0.8
        guidesArc.push(guide)
      }
      if (this.sup2 === 1) {
        objets.push(grille(-8, -8, 8, 8, 'gray', 0.5, 1, 0))
      } else if (this.sup2 === 2) {
        enonce += 'Les droites tracées en pointillés sont perpendiculaires à $(d)$.<br>'
        objets.push(...guideDroites)
      } else if (this.sup2 === 3) {
        enonce += 'Les cercles tracés en pointillés sont centrés sur $(d)$.<br>'
        objets.push(...guidesArc)
      }
      objets.push(d[i], labelD)
      for (let k = 0; k < this.nbPoints; k++) {
        objets.push(new TracePoint(antecedents[k]))
        const sym = symetrieAxiale(antecedents[k] as Point, d[i], (antecedents[k] as Point).nom + '\'')
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
      const pointSurD = pointSurDroite(d[i], 50, '', 'above')
      for (let k = 0; k < this.nbPoints; k++) {
        const carre = codageAngleDroit(antecedents[k], middle[k], pointSurD, 'blue', 0.3, 0.5)

        objetsCorrection.push(carre)
      }
      const options = {}
      if (this.sup2 === 1) Object.assign(options, { snapGrid: true, dx: 1, dy: 1 })
      if (context.isHtml && this.interactif) {
        this.figuresApiGeom[i] = new Figure(Object.assign(options, { xMin: -10, yMin: -10, width: 300, height: 300 }))
        this.figuresApiGeom[i].scale = 0.5
        this.figuresApiGeom[i].setToolbar({ tools: ['NAME_POINT', 'POINT_ON', 'POINT_INTERSECTION', 'LINE_PERPENDICULAR', 'CIRCLE_CENTER_POINT', 'UNDO', 'REDO', 'REMOVE'], position: 'top' })
        const O = this.figuresApiGeom[i].create('Point', { x: 0, y: 0, isVisible: false, isSelectable: false })
        let pointB
        if (choixDeLaxe[i] === 1) {
          pointB = this.figuresApiGeom[i].create('Point', { x: 7, y: 0, isVisible: false })
        } else if (choixDeLaxe[i] === 2) {
          pointB = this.figuresApiGeom[i].create('Point', { x: 0, y: 7, isVisible: false })
        } else if (choixDeLaxe[i] === 3) {
          pointB = this.figuresApiGeom[i].create('Point', { x: 7, y: 7, isVisible: false })
        } else {
          pointB = this.figuresApiGeom[i].create('Point', { x: 7, y: -7, isVisible: false })
        }
        this.d[i] = this.figuresApiGeom[i].create('Line', { point1: O, point2: pointB }) as Line
        this.d[i].color = 'blue'
        this.d[i].thickness = 2
        const labelX = labelD.x
        const labelY = labelD.y
        this.figuresApiGeom[i].create('TextByPosition', { text: '$(d)$', x: labelX, y: labelY })
        this.antecedents[i] = []
        for (let k = 0; k < this.nbPoints; k++) {
          (this.antecedents[i][k] as PointApigeom) = this.figuresApiGeom[i].create('Point', { x: antecedents[k].x, y: antecedents[k].y, isFree: false, isSelectable: true, label: antecedents[k].nom })
        }
        if (this.sup2 === 1) {
          this.figuresApiGeom[i].create('Grid', { xMin: -10, yMin: -10, xMax: 10, yMax: 10, stepX: 1, stepY: 1, color: 'gray', axeX: false, axeY: false, labelX: false, labelY: false })
        }
        if (this.sup2 === 2) {
          for (let k = 0; k < this.nbPoints; k++) {
            this.figuresApiGeom[i].create('LinePerpendicular', { point: (this.antecedents[i][k] as PointApigeom), line: this.d[i], isDashed: true, color: 'gray' })
          }
        }
        if (this.sup2 === 3) {
          for (let k = 0; k < this.nbPoints; k++) {
            this.figuresApiGeom[i].create('CircleCenterPoint', {
              center: this.figuresApiGeom[i].create('Point', { isVisible: false, x: middle[k].x, y: middle[k].y }),
              point: (this.antecedents[i][k] as PointApigeom),
              isDashed: true,
              color: 'gray'
            })
          }
        }
        this.figuresApiGeom[i].options.limitNumberOfElement.set('Point', 1)
        this.idApigeom[i] = `apiGeomEx${numeroExercice}F${i}`
        const emplacementPourFigure = figureApigeom({ exercice: this, idApigeom: this.idApigeom[i], figure: this.figuresApiGeom[i], question: i })
        this.listeQuestions.push(enonce + '<br><br>' + emplacementPourFigure)
      } else {
        this.listeQuestions.push(enonce + '<br><br>' + mathalea2d({ xmin: -10, xmax: 10, ymin: -10, ymax: 10, scale: 0.5, pixelsParCm: 15 }, objets))
      }
      this.listeCorrections.push(mathalea2d({ xmin: -10, xmax: 10, ymin: -10, ymax: 10, scale: 0.5, pixelsParCm: 15 }, objetsCorrection))
    }
  }

  correctionInteractive = (i: number) => {
    if (this.answers === undefined) this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[this.idApigeom[i]] = this.figuresApiGeom[i].json
    const resultat = []
    const divFeedback = document.querySelector(`#feedbackEx${this.numeroExercice}Q${i}`) as HTMLDivElement
    let feedback = ''

    // on crée les bons symétriques :
    for (let k = 0; k < this.nbPoints; k++) {
      const { x, y } = reflectOverLineCoord((this.antecedents[i][k] as PointApigeom), this.d[i])
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
          matchPoint.color = 'green'
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

export default ConstrctionsSymetriquesPoints
