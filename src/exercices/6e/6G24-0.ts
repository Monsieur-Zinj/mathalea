import Exercice from '../ExerciceTs'
import {
  droiteHorizontaleParPoint,
  droiteParPointEtPente,
  droiteParPointEtPerpendiculaire,
  droiteVerticaleParPoint,
  Droite
} from '../../lib/2d/droites'
import { point, TracePoint, Point, pointSurDroite } from '../../lib/2d/points'
import { colorToLatexOrHTML, mathalea2d } from '../../modules/2dGeneralites'
import { grille } from '../../lib/2d/reperes'
import { egal, randint } from '../../modules/outils'
import { choice, combinaisonListes, shuffle } from '../../lib/outils/arrayOutils'
import { labelPoint, latexParCoordonnees } from '../../lib/2d/textes'
import { longueur } from '../../lib/2d/segmentsVecteurs'
import { projectionOrtho, symetrieAxiale } from '../../lib/2d/transformations'
import { cercleCentrePoint } from '../../lib/2d/cercle'
import { choisitLettresDifferentes } from '../../lib/outils/aleatoires'
import { codageAngleDroit } from '../../lib/2d/angles'
import { context } from '../../modules/context'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom'
import type PointApigeom from 'apigeom/src/elements/points/Point'
import { reflectOverLineCoord } from 'apigeom/src/elements/calculus/Coords'

export const titre = 'Construire des symétriques de points'
export const dateDePublication = '07/01/2024'
export const interactifReady = true
export const interactifType = 'custom'

export const uuid = '26ea4'
export const ref = '6G24-0'

function checkDistance (points: Point[], d: Droite) {
  for (const pointA of points) {
    for (const pointB of points) {
      const l = longueur(pointA, pointB)
      if (l > 0 && l < 2.5) {
        return false
      }
      const l2 = longueur(pointB, symetrieAxiale(pointA, d))
      if (l2 < 2.5) {
        return false
      }
    }
  }
  for (const point of points) {
    const H: Point = projectionOrtho(point, d) as Point
    if (longueur(H, point) < 2) return false
  }
  return true
}
class ConstrctionsSymetriquesPoints extends Exercice {
  figures!: Figure[]
  idApigeom!: string[]
  nbPoints!: number
  antecedents!: object[][]
  labels!: string[][]
  d!: object[]
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
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    let choixDeLaxe: number[] = []
    this.figures = []
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
      let antecedents: object[] = []
      const middle: Point[] = []
      const centre: Point[] = []
      const symetriques: Point[] = []
      const objets = []
      let objetsCorrection: object[] = []
      const d: Droite[] = []
      let labelD

      do {
        objets.length = 0
        objetsCorrection.length = 0
        middle.length = 0
        symetriques.length = 0
        antecedents.length = 0
        const nuage = []

        // construire une liste de points aléatoires dans la grille (un par ligne soit 13 au total)
        if (choixDeLaxe[i] === 1) {
          for (let x = -6; x < 7; x += 1) {
            nuage.push({ y: randint(2, 6) * choice([-1, 1]), x })
          }
        } else if (choixDeLaxe[i] === 2) {
          for (let y = -6; y < 7; y += 1) {
            nuage.push({ x: randint(2, 6) * choice([-1, 1]), y })
          }
        } else if (choixDeLaxe[i] === 3) {
          for (let x = -6; x < 7; x += 1) {
            nuage.push({ y: randint(-6, 6, x), x })
          }
        } else {
          for (let x = -6; x < 7; x += 1) {
            nuage.push({ y: randint(-6, 6, -x), x })
          }
        }
        this.labels[i] = Array.from(choisitLettresDifferentes(nuage.length, 'Q', true))

        // Les antécédents sont des points nommés
        antecedents = shuffle(nuage).map((el, k) => point(el.x, el.y, this.labels[i][k], 'above left')) // on mélange et on ne prendra que les nbPoints premiers
        const O = point(0, 0, '', 'above')

        if (choixDeLaxe[i] === 1) {
          d[i] = droiteHorizontaleParPoint(O) as Droite
          labelD = latexParCoordonnees('(d)', -6.5, -0.8, 'black', 0, 0, '', 8)
        } else if (choixDeLaxe[i] === 2) {
          d[i] = droiteVerticaleParPoint(O) as Droite
          labelD = latexParCoordonnees('(d)', -0.8, -6.5, 'black', 0, 0, '', 8)
        } else if (choixDeLaxe[i] === 3) {
          d[i] = droiteParPointEtPente(O, 1) as Droite
          labelD = latexParCoordonnees('(d)', -6.5, -5.2, 'black', 0, 0, '', 8)
        } else {
          d[i] = droiteParPointEtPente(O, -1) as Droite
          labelD = latexParCoordonnees('(d)', -6.5, 5.2, 'black', 0, 0, '', 8)
        }
        const guideDroites = []
        for (let k = 0; k < this.nbPoints; k++) {
          const guide = droiteParPointEtPerpendiculaire(antecedents[k], d[i]) as Droite
          guide.pointilles = 2
          guide.color = colorToLatexOrHTML('gray')
          guide.opacite = 0.4
          guideDroites.push(guide)
        }
        enonce = `Construire les symétriques $${this.labels[i].slice(0, this.nbPoints - 1).join('\';') + '\''}$ et $${this.labels[i][this.nbPoints - 1] + '\''}$ des points $${this.labels[i].slice(0, this.nbPoints - 1).join(';')}$ et $${this.labels[i][this.nbPoints - 1]}$ par rapport à la droite $(d)$.<br>`
        const guidesArc = []
        for (let k = 0; k < this.nbPoints; k++) {
          symetriques[k] = symetrieAxiale(antecedents[k] as Point, d[i])
          centre[k] = pointSurDroite(d[i], k - 2.5, '', 'above')
          middle[k] = projectionOrtho(antecedents[k], d[i]) as Point
          /*  const angleOffset = choice([-12, -10, -8, 8, 10, 12])
          const ext1 = rotation(symetriques[k], middle[k], 3 * angleOffset)
          const ext2 = rotation(symetriques[k], middle[k], -angleOffset)
         */
          const guide = cercleCentrePoint(centre[k], antecedents[k], 'gray')
          guide.pointilles = 2
          guide.opacite = 0.4
          guidesArc.push(guide)
        }
        if (this.sup2 === 1) {
          objets.push(grille(-7, -7, 7, 7, 'gray', 0.5, 1, 0))
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
          const trace: TracePoint = new TracePoint(sym)
          trace.color = colorToLatexOrHTML('red')
          const labelSym = labelPoint(sym)
          const label = labelPoint(antecedents[k])
          objets.push(label)
          objetsCorrection.push(trace, labelSym)
        }
        objetsCorrection = [...objets, ...objetsCorrection]
        if (this.sup2 !== 2) {
          guideDroites.forEach(guide => {
            guide.epaisseur = 2
            guide.opacite = 1
          })
          objetsCorrection.push(...guideDroites)
        }
        if (this.sup2 !== 3) {
          guidesArc.forEach(guide => {
            guide.epaisseur = 2
            guide.opacite = 1
          })
          objetsCorrection.push(...guidesArc)
        }
        const pointSurD = pointSurDroite(d[i], 50, '', 'above')
        for (let k = 0; k < this.nbPoints; k++) {
          const carre = codageAngleDroit(antecedents[k], middle[k], pointSurD, 'blue', 0.3, 0.5)
          objetsCorrection.push(carre)
        }
      } while (!checkDistance(antecedents.slice(0, this.nbPoints) as Point[], d[i]))
      if (context.isHtml && this.interactif) {
        this.figures[i] = new Figure({ xMin: -7, yMin: -7, width: 420, height: 420 })
        this.figures[i].setToolbar({ tools: ['NAME_POINT', 'POINT_ON', 'POINT_INTERSECTION', 'LINE_PERPENDICULAR', 'CIRCLE_CENTER_POINT', 'UNDO', 'REDO', 'REMOVE'], position: 'top' })
        const O = this.figures[i].create('Point', { x: 0, y: 0, isVisible: false, isSelectable: false })
        let pointB
        if (choixDeLaxe[i] === 1) {
          pointB = this.figures[i].create('Point', { x: 1, y: 0, isVisible: false })
        } else if (choixDeLaxe[i] === 2) {
          pointB = this.figures[i].create('Point', { x: 0, y: 1, isVisible: false })
        } else if (choixDeLaxe[i] === 3) {
          pointB = this.figures[i].create('Point', { x: 1, y: 1, isVisible: false })
        } else {
          pointB = this.figures[i].create('Point', { x: 1, y: -1, isVisible: false })
        }
        this.d[i] = this.figures[i].create('Line', { point1: O, point2: pointB, color: 'blue', thickness: 2 })
        const labelX = labelD.x
        const labelY = labelD.y
        this.figures[i].create('TextByPosition', { text: '$(d)$', x: labelX, y: labelY })
        this.antecedents[i] = []
        for (let k = 0; k < this.nbPoints; k++) {
          (this.antecedents[i][k] as PointApigeom) = this.figures[i].create('Point', { x: antecedents[k].x, y: antecedents[k].y, isFree: false, isSelectable: true, label: antecedents[k].nom })
        }
        if (this.sup2 === 1) {
          this.figures[i].create('Grid', { stepX: 0.5, stepY: 0.5, color: 'gray', axeX: false, axeY: false, labelX: false, labelY: false })
        }
        if (this.sup2 === 2) {
          for (let k = 0; k < this.nbPoints; k++) {
            this.figures[i].create('LinePerpendicular', { point: (this.antecedents[i][k] as PointApigeom), line: this.d[i], isDashed: true, color: 'gray' })
          }
        }
        if (this.sup2 === 3) {
          for (let k = 0; k < this.nbPoints; k++) {
            this.figures[i].create('CircleCenterPoint', {
              center: this.figures[i].create('Point', { isVisible: false, x: centre[k].x, y: centre[k].y }),
              point: (this.antecedents[i][k] as PointApigeom),
              isDashed: true,
              color: 'gray'
            })
          }
        }
        this.figures[i].options.limitNumberOfElement.set('Point', 1)
        this.idApigeom[i] = `apigeomEx${numeroExercice}F${i}`
        const emplacementPourFigure = figureApigeom({ exercice: this, idApigeom: this.idApigeom[i], figure: this.figures[i] })
        this.listeQuestions.push(enonce + '<br><br>' + emplacementPourFigure)
      } else {
        this.listeQuestions.push(enonce + '<br><br>' + mathalea2d({ xmin: -7, xmax: 7, ymin: -7, ymax: 7, scale: 0.75 }, objets))
      }
      this.listeCorrections.push(mathalea2d({ xmin: -7, xmax: 7, ymin: -7, ymax: 7, scale: 0.75 }, objetsCorrection))
    }
  }

  correctionInteractive = (i: number) => {
    this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[this.idApigeom[i]] = this.figures[i].json
    const resultat = []
    const divFeedback = document.querySelector(`#feedback${this.idApigeom[i]}`) as HTMLDivElement
    let feedback = ''

    // on crée les bons symétriques :
    for (let k = 0; k < this.nbPoints; k++) {
      const { x, y } = reflectOverLineCoord((this.antecedents[i][k] as PointApigeom), this.d[i])
      const elts = Array.from(this.figures[i].elements.values())
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
    divFeedback.innerHTML = feedback
    // mathaleaRenderDiv(divFeedback)
    this.figures[i].isDynamic = false
    this.figures[i].divButtons.style.display = 'none'
    this.figures[i].divUserMessage.style.display = 'none'
    return resultat
  }
}

export default ConstrctionsSymetriquesPoints
