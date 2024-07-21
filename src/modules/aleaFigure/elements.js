/* eslint-disable no-useless-constructor */
import { point, tracePoint } from '../../lib/2d/points.js'
import { latexParCoordonnees } from '../../lib/2d/textes.ts'
/* eslint-disable no-unused-vars */
import { context } from '../context.js'
import { GVCartesian, GVCoordinates } from './coordinates.js'
import { aleaName } from '../outilsMathjs.ts'
import { dot, round, cross } from 'mathjs'
import { circularPermutation, getDimensions } from './outils.js'

/**
 * @class
 * @classdesc Graphic object like Point, Line, Segment etc.
 */
export class GVGraphicObject {
  visible
  /** boolean */
  _name
  /** string */
  color /** string */ = 'black'

  constructor () {
    this.visible = false
    this.name = ''
  }

  aleaName (...name /** (string | GVGraphicObject)[] */) {
    this.name = aleaName(name.map(x => {
      if (x instanceof GVGraphicObject) {
        return x.name
      } else {
        return x
      }
    }), name.length).join('')
  }

  set name (newname) {
    this._name = newname
  }

  get name () {
    return this._name
  }

  getGGB () {
    return this.name
  }

  /**
     * Move this right to figures
     * @param figures
     */
  moveRight (...figures/** GVGraphicObject[] */) {
    const [xmin1, ymin1, ymax1] = getDimensions(this)
    const [, ymin2, xmax2, ymax2] = getDimensions(...figures)
    const P1 = new GVPoint(xmin1, ymin1)
    const P2 = new GVPoint(xmax2, ymax2)
    const t = new GVVector(P1, P2)
    this.move(t.add(new GVVector(4, 0)).sub(new GVVector(0, (ymax2 - ymin2 + ymax1 - ymin1) / 2)))
  }

  /**
     * Déplace l'objet
     * @param {GVVector} V
     */
  move (V /** GVVector */) {
    if (this instanceof GVPoint) {
      this.x = this.add(V).x
      this.y = this.add(V).y
    } else if (this instanceof GVPolygon) {
      for (const P of this.vertices) {
        P.x = P.add(V).x
        P.y = P.add(V).y
      }
    }
  }
}

/**
 * @class
 * @classdesc Caracteristics of a point in an euclidean plan
 */
export class GVPoint extends GVGraphicObject {
  coordinates
  /** GVCoordinates */
  polarCoordinates
  /** GVPolar */
  cartesianCoordinates
  /** GVCartesian */
  type
  /** string */
  x
  /** number */
  y
  /** number */
  r
  /** number */
  theta
  /** number */
  ggb
  /** string */
  dot
  /** any */
  labelPoints
  /** [GVPoint, GVPoint, GVPoint] */
  label /** boolean */ = false
  M2D

  /** any */
  constructor (arg1/** GVCoordinates | number */, arg2 /** number */ = 0) {
    super()
    if (arg1 instanceof GVCoordinates) {
      this.coordinates = arg1
    } else {
      this.coordinates = new GVCartesian(arg1, arg2)
    }
    this.polarCoordinates = this.getPolarCoordinates()
    this.cartesianCoordinates = this.getCartesianCoordinates()
    this.name = ''
    this.type = 'Point'
    this.x = this.cartesianCoordinates.x
    this.y = this.cartesianCoordinates.y
    this.r = this.polarCoordinates.r
    this.theta = this.polarCoordinates.theta
    this.ggb = `${this.name} = (${this.x},${this.y})`
    this.M2D = point(this.x, this.y, '', 'above right')
  }

  getPolarCoordinates ()/** GVCartesian */ {
    return this.coordinates.getPolarCoordinates()
  }

  getCartesianCoordinates () {
    return this.coordinates.getCartesianCoordinates()
  }

  xSVG = function (coeff) {
    return round(this.x * coeff, 3)
  }

  ySVG = function (coeff) {
    return -round(this.y * coeff, 3)
  }

  getRotate (O /** GVPoint */, angle /** number */) {
    return new GVPoint(
      new GVCartesian(
        (this.x - O.x) * Math.cos(angle) - (this.y - O.y) * Math.sin(angle) + O.x,
        (this.x - O.x) * Math.sin(angle) + (this.y - O.y) * Math.cos(angle) + O.y
      ))
  }

  /**
     *
     * @param {GVVector|GVPoint} X
     * @returns {GVPoint}
     */
  add (X) {
    return new GVPoint(new GVCartesian(this.x + X.x, this.y + X.y))
  }

  /**
     *
     * @param {GVVector|GVPoint} X
     * @returns {GVPoint}
     */
  sub (X) {
    return new GVPoint(new GVCartesian(this.x - X.x, this.y - X.y))
  }

  /**
     * homothétie de centre (0,0) de rapport k
     * @param {number} k
     * @returns {GVPoint}
     */
  multiply (k) {
    return new GVPoint(new GVCartesian(this.x * k, this.y * k))
  }

  /**
     * homothétie de centre (0,0) de rapport 1/k
     * @param {number} k
     * @returns {GVPoint}
     */
  divide (k) {
    if (k !== 0) return new GVPoint(new GVCartesian(this.x / k, this.y / k))
  }

  /**
     * retourne les coordonnées barycentrique du GVPoint dans le repère formé par les trois GVPoint en argument.
     * @param {GVPoint} A
     * @param {GVPoint} B
     * @param {GVPoint} C
     * @returns {[number,number,number]}
     */
  getBarycentriqueCoords (A, B, C) {
    const a = determinant(B.sub(this), C.sub(this))
    const b = determinant(C.sub(this), A.sub(this))
    const c = determinant(A.sub(this), B.sub(this))
    return [a, b, c]
  }

  /**
     * retourne true si le GVPoint est à l'intérieur du triangle formé par les 3 GVPoints en argument
     * @param {GVPoint} A
     * @param {GVPoint} B
     * @param {GVPoint} C
     * @returns {boolean}
     */
  isInTriangle (A /** GVPoint */, B /** GVPoint */, C /** GVPoint */) /** boolean */ {
    return Math.min(...this.getBarycentriqueCoords(A, B, C)) > 0 || Math.max(...this.getBarycentriqueCoords(A, B, C)) < 0
  }

  /**
     * Get the symetric of P with this
     * @param {GVPoint} P
     * @returns {GVPoint}
     */
  getSymetric (P) {
    return barycentre([this, P], [2, -1])
  }

  /**
     *
     * @param {GVPoint} O
     * @param {number} k
     * @returns {GVPoint}
     */
  getHomothetic (O, k) {
    return new GVPoint(
      new GVCartesian(
        k * this.x + (1 - k) * O.x,
        k * this.y + (1 - k) * O.y
      ))
  }

  /**
     * Retourne un vecteur position du GVPoint (origine (0;0) extrémité le GVPoint.
     * @returns {GVVector}
     */
  getVector () {
    return new GVVector(this.x, this.y)
  }

  /**
     * Retourne une déclaration pour geogebra utilisé par la méthode exportGGB() qui elle est inutilisée.
     * @returns {string}
     */
  getGGB () {
    this.ggb = `${this.name} = (${this.x},${this.y})`
    return `${this.name} = (${this.x},${this.y})`
  }

  showName (scaleppc /** number */ = 1) /** string */ {
    let label
    /** any */
    const splitname = this.name.split('_')
    const nameFormat = splitname.length === 1 ? splitname[0] : `${splitname[0]}_{${splitname[1]}}`
    if (this.labelPoints !== undefined) {
      const P1 = this.labelPoints[0]
      const P3 = this.labelPoints[2]
      const S = this.labelPoints[1]
      const v1 = P1.sub(S).getVector().getNormed()
      const v3 = P3.sub(S).getVector().getNormed()
      let P /** GVPoint */
      if (v1.colinear(v3)) { // Colinéaires
        P = S.add(v1.getNormal().multiply(scaleppc * 0.4))
      } else { // Non colinéaires
        P = S.getSymetric(S.add(v1.add(v3).getNormed().multiply(scaleppc * 0.4)))
      }
      label = latexParCoordonnees(nameFormat, P.x, P.y, 'black', 0, 0, '', 8)
      //
      this.labelPoints = [P1, S, P3]
    } else {
      label = latexParCoordonnees(nameFormat, this.x, this.y + 0.2 * scaleppc, 'black', 0, 0, '', 8)
    }
    this.label = true
    return label
  }

  showDot () {
    const splitname = this.name.split('_')
    let nameFormat = splitname.length === 1 ? splitname[0] : `${splitname[0]}_{${splitname[1]}}`
    if (context.isHtml) nameFormat = `$${nameFormat}$`
    this.dot = tracePoint(point(this.x, this.y, nameFormat, 'above'))
    return this
  }

  set name (newname) {
    this._name = newname
    this.ggb = `${this.name} = (${this.x},${this.y})`
  }

  get name () {
    return this._name
  }
}

/**
 * @class
 * @property {number} x
 * @property {number} y
 * @property {number} norme
 */
export class GVVector {
  x /** number */ = 0
  y /** number */ = 0
  norme

  /** number */
  constructor (arg1 /** number | GVPoint */, arg2 /** number | GVPoint */) {
    if (typeof arg1 === 'number' && typeof arg2 === 'number') {
      this.x = arg1
      this.y = arg2
    } else if (arg1 instanceof GVPoint && arg2 instanceof GVPoint) {
      this.x = arg2.x - arg1.x
      this.y = arg2.y - arg1.y
    }
    this.norme = Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  /**
     * retourne un vecteur directeur colinéaire de norme 1
     * @returns {GVVector}
     */
  getNormed () {
    const xy = Math.sqrt(this.x ** 2 + this.y ** 2)
    return new GVVector(this.x / xy, this.y / xy)
  }

  /**
     * retourne le vecteur normal
     * @returns {GVVector}
     */
  getNormal () {
    return new GVVector(-this.y, this.x)
  }

  /**
     * Ajoute vectoriellement un GVPoint ou un GVVector
     * @param {GVPoint | GVVector} X
     * @returns {GVVector}
     */
  add (X) {
    return new GVVector(this.x + X.x, this.y + X.y)
  }

  /**
     * soustrait vectoriellement un GVPoint ou un GVVector
     * @param {GVPoint | GVVector} X
     * @returns {GVVector}
     */
  sub (X) {
    return new GVVector(this.x - X.x, this.y - X.y)
  }

  /**
     * multiplie le GVVector par k
     * @param {number} k
     * @returns {GVVector}
     */
  multiply (k) {
    return new GVVector(this.x * k, this.y * k)
  }

  /**
     * retoune l'opposé du GVVector
     * @returns {GVVector}
     */
  neg () {
    return new GVVector(-this.x, -this.y)
  }

  /**
     * Retourne lle produit scalaire du GVVector et de X
     * @param {GVVector|GVPoint} X
     * @returns {number}
     */
  dot (X) {
    return dot([this.x, this.y], [X.x, X.y]) // ne pas confondre ce dot qui vient de mathjs et le this.dot() de GVVector !
  }

  /**
     * retourne le produit vectoriel du GVVector avec X
     * @param {GVVector|GVPoint} X
     * @returns {math.MathCollection}
     */
  cross (X) {
    return cross([this.x, this.y, 0], [X.x, X.y, 0]) // ne pas confondre ce cross qui vient de mathjs et le this.cross() de GVVector !
  }

  /**
     * retourne true si le GVVector et V sont colinéaires
     * @param {GVVector} V
     * @returns {boolean}
     */
  colinear (V) {
    return parseFloat(cross([this.x, this.y, 0], [V.x, V.y, 0])[2].toFixed(15)) === 0
  }
}

/**
 * @class
 * @property {GVVector} direction
 * @property {GVPoint} A
 * @property {GVPoint|GVVector} B
 * @property {string} type
 * @property {number} a
 * @property{number} b
 * @property {number} c
 * @property {string} ggb
 * @classdesc Caracteristics of a line in an euclidean plan (ax+by=c)
 */
export class GVLine extends GVGraphicObject {
  direction
  A
  B
  type
  a = 0
  b = 0
  c = 0
  ggb
  // Une droite sera définie par deux points distincts ou un point et une direction
  // Il faudrait deux constructeurs ?
  constructor (A, B) {
    super()
    this.direction = B instanceof GVVector ? B : new GVVector(B.x - A.x, B.y - A.y)
    this.A = A
    this.B = B instanceof GVPoint ? B : new GVPoint(new GVCartesian(A.x + B.x, A.y + B.y))
    this.getEquation()
    this.type = 'Line'
    this.ggb = `${this.name}: ${this.a}*x+${this.b}*y=${this.c})`
  }

  /**
     * retourne l'ordonnée du point de la droite d'abscisse x si il existe
     * @param {number} x
     * @returns {undefined|number}
     */
  getYPoint (x) {
    return this.b === 0 ? undefined : (this.c - this.a * x) / this.b
  }

  /**
     * retourne l'abscisse du point de la droite d'ordonnée y si il existe
     * @param {number} y
     * @returns {undefined|number}
     */
  getXPoint (y) {
    return this.a === 0 ? undefined : (this.c - this.b * y) / this.a
  }

  /**
     * renseigne l'équation de la droite (ses propriétés a, b et c
     */
  getEquation () {
    const directionUnit = this.direction.getNormed()
    this.a = -directionUnit.y
    this.b = directionUnit.x
    this.c = this.a * this.A.x + this.b * this.A.y
  }

  /**
     * retourne le point d'intersection de la droite avec une autre
     * @param {GVLine} L
     * @returns {GVPoint|undefined}
     */
  getIntersect (L) {
    const delta = L.a * this.b - this.a * L.b
    if (delta.toFixed(15) !== '0') {
      const deltax = -(L.b * this.c - this.b * L.c)
      const deltay = L.a * this.c - this.a * L.c
      const point = new GVPoint(new GVCartesian(deltax / delta, deltay / delta))
      return point
    }
  }

  /**
     * Retourne la perpendiculaire à cette droite passant par P
     * @param {GVPoint} P
     * @returns {GVLine}
     */
  getPerpendicularLine (P) {
    return new GVLine(P, this.direction.getNormal())
  }

  /**
     * Get the symétric of P with this
     * @param {GVPoint} P
     * @returns {GVPoint}
     */
  getSymetric (P) {
    return barycentre([this.getIntersect(this.getPerpendicularLine(P)), P], [2, -1])
  }

  /**
     * Renseigne la propriété name de l'objet ainsi que sa propriété ggb
     * @param {string} newname
     */
  set name (newname) {
    this._name = newname
    this.ggb = `${this.name}: ${this.a}*x+${this.b}*y=${this.c})`
  }

  /**
     * récupère la propriété name de l'objet
     * @returns {*}
     */
  get name () {
    return this._name
  }
}

/**
 * Retourne le déterminant de deux vecteurs
 * @param {GVVector|GVPoint} X
 * @param {GVVector|GVPoint} Y
 * @returns {number}
 */
export function determinant (X, Y) {
  return X.x * Y.y - X.y * Y.x
}

/**
 * Retourne le baricentre d'une liste de GVPoint affectés des coefficients d'une liste de nombres
 * @param {GVPoint[]} P
 * @param {number[]} a
 * @returns {GVPoint}
 */
export function barycentre (P /** GVPoint[] */, a /** number[] */) /** GVPoint */ {
  if (Array.isArray(P) && Array.isArray(a) && P.length === a.length) {
    const pointsPonderes = P.map((x, i) => x.multiply(a[i]))
    return pointsPonderes.reduce((accumulator, curr) => accumulator.add(curr)).divide(a.reduce((accumulator, curr) => accumulator + curr))
  } else {
    window.notify('fonction barycentre() de AleaFigure mal employée', { points: P, coefficients: a })
  }
}

/**
 * @class
 * @property {boolean} label
 * @property {string} text
 * @property {string} textColor
 * @property {boolean} direct
 * @property {'Segment'} type
 * @param {GVPoint} A
 * @param {GVPoint} B
 * @classdesc Caracteristics of a segment in an euclidean plan
 */
export class GVSegment extends GVLine {
  label
  text = ''
  textColor = 'black'
  direct = true

  constructor (A, B) {
    super(A, B)
    this.type = 'Segment'
    this.A = A
    this.B = B
    this.aleaName(this.A, this.B)
    this.getEquation()
  }

  /**
     * Retourne le label de l'objet et fixe la propriété label de l'objet à true
     * @returns {Vide2d|LatexParCoordonnees}
     */
  showLabel () {
    let label
    const P = new GVPoint((this.A.x + this.B.x) / 2, (this.A.y + this.B.y) / 2)
    if (context.isHtml) {
      label = latexParCoordonnees(this.name, P.x, P.y, 'black', 0, 0, '')
    } else {
      label = latexParCoordonnees(this.name, P.x, P.y, 'black', 0, 0, '')
    }
    this.label = true
    return label
  }
}

/**
 * @class
 * @property {GVPoint} A // centre
 * @property {GVPoint|number} B point de passage ou rayon
 * @property {number} r rayon
 * @property {'Circle'} type
 * @classdesc Caracteristics of a circle in an euclidean plan
 */
export class GVCircle extends GVGraphicObject {
  A
  B
  type
  a = 0
  b = 0
  r = 0

  constructor (A, B) {
    super()
    this.type = 'Circle'
    this.A = A
    this.B = B instanceof GVPoint ? B : A
    this.r = B instanceof GVPoint ? Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2) : B
  }

  /**
     * Retourne un point du cercle correspondant à l'angle donné
     * @param {number} theta
     * @returns {GVPoint}
     */
  getPoint (theta) {
    return new GVPoint(
      new GVCartesian(
        this.A.x + this.r * Math.cos(theta),
        this.A.y + this.r * Math.sin(theta)
      )
    )
  }
}

/**
 * @class
 * @property {GVPoint} A
 * @property {GVPoint} B
 * @property {GVPoint} C
 * @property {number} angle
 * @property {'Angle'} type
 * @property {boolean} direct
 * @property {GVVector} vBA
 * @property {GVVector} vBC
 * @property {boolean} right = false
 * @property {strig} fillColor = 'none'
 * @property {number} fillOpacity = 0.2
 * @property {boolean} rayon = true
 * @classdesc Caracteristics of an angle
 */
export class GVAngle extends GVGraphicObject {
  A
  B
  C
  angle
  type
  direct
  vBA
  vBC
  right = false
  fillColor = 'none'
  fillOpacity = 0.2
  rayon = true

  constructor (A, B, C) {
    super()
    this.type = 'Angle'
    const vA = new GVVector(A.x, A.y)
    const vB = new GVVector(B.x, B.y)
    const vC = new GVVector(C.x, C.y)
    const vBA = vA.sub(vB).getNormed()
    const vBC = vC.sub(vB).getNormed()
    this.vBA = vBA
    this.vBC = vBC
    const cos = vBA.x * vBC.x + vBA.y * vBC.y
    this.angle = Math.acos(cos)
    this.A = B.add(vBA)
    this.B = B
    this.C = B.add(vBC)
    this.direct = cross([vBA.x, vBA.y, 0], [vBC.x, vBC.y, 0])[2] > 0
  }

  /**
     * Pour agrandir l'angle
     * @param {number} scale
     */
  scale (scale) {
    const vBA = this.vBA.multiply(scale)
    const vBC = this.vBC.multiply(scale)
    this.A = this.B.add(vBA)
    this.C = this.B.add(vBC)
  }
}

/**
 * @class
 * @property {GVPoint[]} vertices
 * @property {string} name
 * @classdesc Caracteristics of an angle
 */
export class GVPolygon extends GVGraphicObject {
  showLabels /** boolean */ = true

  constructor (...args /** GVPoint[] */) {
    super()
    this.vertices /** GVPoint[] */ = args
    this.name = circularPermutation(args.map(x => x.name)).join('')
  }

  /**
     * retourne les bordures d'un GVPolygon
     * @returns {[number,number,number,number]}
     */
  getDimensions () {
    const listXPoint = this.vertices.map(M => M.x)
    const listYPoint = this.vertices.map(M => M.y)
    const xmin = Math.min(...listXPoint)
    const xmax = Math.max(...listXPoint)
    const ymin = Math.min(...listYPoint)
    const ymax = Math.max(...listYPoint)
    return [xmin, ymin, xmax, ymax]
  }
}

/**
 * @class
 * @property {number} longueur
 * @property {number} largeur
 * @property {number} ratio
 * @classdesc Caracteristics of a triangle
 */
export class GVRectangle extends GVPolygon {
  longueur
  largeur
  ratio
  constructor (...args /** GVPoint[] */) {
    super(...args)
    const [A, B, C] = args
    const dimensions = [Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2), Math.sqrt((C.x - B.x) ** 2 + (C.y - B.y) ** 2)].sort()
    this.largeur = dimensions[0]
    this.longueur = dimensions[1]
    this.ratio = this.longueur / this.largeur
  }
}

/**
 * @class
 * @classdesc Caracteristics of a triangle
 */
export class GVTriangle extends GVPolygon {
  constructor (...args /** GVPoint[] */) {
    super(...args)
  }
}
