import earcut from 'earcut'
import { colorToLatexOrHTML, ObjetMathalea2D } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { randint } from '../../modules/outils.js'
import { arrondi, rangeMinMax } from '../outils/nombres'
import { Point, point, pointAdistance, pointSurSegment } from './points.js'
import { longueur, segment, vecteur } from './segmentsVecteurs.js'
import { latexParCoordonnees, texteParPoint, texteParPosition } from './textes.ts'
import { homothetie, rotation, translation } from './transformations.js'
import { aireTriangle } from './triangle.js'

/**
 * Crée le barycentre d'un polygone
 * @param {Polygone} p Polygone dont on veut créer le barycentre
 * @param {string} [nom = ''] Nom du barycentre
 * @param {string} [positionLabel = 'above'] Position du nom par rapport au point
 * @example G = barycentre(pol) // Crée G, le barycentre du polygone pol, sans lui donner de nom
 * @example G = barycentre(pol,'G','below') // Crée G, le barycentre du polygone pol, en notant G sous le point, s'il est tracé et labellisé.
 * @author Jean-Claude Lhote
 * @return {Point}
 */
// JSDOC Validee par EE Juin 2022
export function barycentre (p, nom = '', positionLabel = 'above') {
  let sommex = 0
  let sommey = 0
  let nbsommets = 0
  for (const point of p.listePoints) {
    sommex += point.x
    sommey += point.y
    nbsommets++
  }
  const x = sommex / nbsommets
  const y = sommey / nbsommets
  return new Point(x, y, nom, positionLabel)
}

/**
 * polyline(A,B,C,D,E) //Trace la ligne brisée ABCDE
 *
 * @author Rémi Angot
 */
export function Polyline (...points) {
  ObjetMathalea2D.call(this, {})
  if (Array.isArray(points[0])) {
    // Si le premier argument est un tableau
    this.listePoints = points[0]
    this.color = colorToLatexOrHTML(points[1])
  } else {
    this.listePoints = points
    this.color = colorToLatexOrHTML('black')
  }
  let xmin = 1000
  let xmax = -1000
  let ymin = 1000
  let ymax = -1000
  for (const unPoint of this.listePoints) {
    if (unPoint.typeObjet !== 'point') window.notify('Polyline : argument invalide', { ...points })
    xmin = Math.min(xmin, unPoint.x)
    xmax = Math.max(xmax, unPoint.x)
    ymin = Math.min(ymin, unPoint.y)
    ymax = Math.max(ymax, unPoint.y)
  }
  this.bordures = [xmin, ymin, xmax, ymax]
  this.nom = ''
  if (this.listePoints.length < 15) {
    // Ne nomme pas les lignes brisées trop grandes (pratique pour les courbes de fonction)
    for (const point of points) {
      this.nom += point.nom
    }
  }
  this.svg = function (coeff) {
    if (this.epaisseur !== 1) {
      this.style += ` stroke-width="${this.epaisseur}" `
    }
    switch (this.pointilles) {
      case 1:
        this.style += ' stroke-dasharray="6 10" '
        break
      case 2:
        this.style += ' stroke-dasharray="6 3" '
        break
      case 3:
        this.style += ' stroke-dasharray="3 2 6 2 " '
        break
      case 4:
        this.style += ' stroke-dasharray="1 2" '
        break
      case 5:
        this.style += ' stroke-dasharray="5 5" '
        break
    }

    if (this.opacite !== 1) {
      this.style += ` stroke-opacity="${this.opacite}" `
    }
    let binomeXY = ''
    for (const point of this.listePoints) {
      binomeXY += `${point.xSVG(coeff)},${point.ySVG(coeff)} `
    }
    return `<polyline points="${binomeXY}" fill="none" stroke="${this.color[0]}" ${this.style} id="${this.id}" />`
  }
  this.tikz = function () {
    const tableauOptions = []
    if (this.color[1].length > 1 && this.color[1] !== 'black') {
      tableauOptions.push(`color=${this.color[1]}`)
    }
    if (this.epaisseur !== 1) {
      tableauOptions.push(`line width = ${this.epaisseur}`)
    }
    switch (this.pointilles) {
      case 1:
        tableauOptions.push(' dash dot ')
        break
      case 2:
        tableauOptions.push(' densely dash dot dot ')
        break
      case 3:
        tableauOptions.push(' dash dot dot ')
        break
      case 4:
        tableauOptions.push(' dotted ')
        break
      case 5:
        tableauOptions.push(' dashed ')
        break
    }

    if (this.opacite !== 1) {
      tableauOptions.push(`opacity = ${this.opacite}`)
    }

    let optionsDraw = []
    if (tableauOptions.length > 0) {
      optionsDraw = '[' + tableauOptions.join(',') + ']'
    }
    let binomeXY = ''
    for (const point of this.listePoints) {
      binomeXY += `(${arrondi(point.x)},${arrondi(point.y)})--`
    }
    binomeXY = binomeXY.substr(0, binomeXY.length - 2)
    return `\\draw${optionsDraw} ${binomeXY};`
  }
  this.svgml = function (coeff, amp) {
    let code = ''
    let s
    for (let k = 1; k < this.listePoints.length; k++) {
      s = segment(this.listePoints[k - 1], this.listePoints[k], this.color)
      s.epaisseur = this.epaisseur
      s.opacite = this.opacite
      code += s.svgml(coeff, amp)
    }
    return code
  }
  this.tikzml = function (amp) {
    const tableauOptions = []
    if (this.color[1].length > 1 && this.color[1] !== 'black') {
      tableauOptions.push(`color=${this.color[1]}`)
    }
    if (this.epaisseur !== 1) {
      tableauOptions.push(`line width = ${this.epaisseur}`)
    }
    if (this.opacite !== 1) {
      tableauOptions.push(`opacity = ${this.opacite}`)
    }
    tableauOptions.push(`decorate,decoration={random steps , segment length=3pt, amplitude = ${amp}pt}`)

    let optionsDraw = []
    if (tableauOptions.length > 0) {
      optionsDraw = '[' + tableauOptions.join(',') + ']'
    }
    let binomeXY = ''
    for (const point of this.listePoints) {
      binomeXY += `(${arrondi(point.x)},${arrondi(point.y)})--`
    }
    binomeXY = binomeXY.substr(0, binomeXY.length - 2)
    return `\\draw${optionsDraw} ${binomeXY};`
  }
}

/**
 * Trace une ligne brisée
 * @example polyline(A,B,C,D,E) // Trace la ligne brisée ABCDE en noir
 * @example polyline([A,B,C,D,E],'blue') // Trace la ligne brisée ABCDE en bleu
 * @example polyline([A,B,C,D,E],'#f15929') // Trace la ligne brisée ABCDE en orange (code couleur HTML : #f15929)
 * @author Rémi Angot
 */
export function polyline (...args) {
  return new Polyline(...args)
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%% LES POLYGONES %%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
/**
 * polygone(A,B,C,D,E) //Trace ABCDE
 * polygone([A,B,C,D],"blue") // Trace ABCD en bleu
 * polygone([A,B,C,D],"blue","red","green") // Trace ABCD en bleu, rempli en rouge et hachuré en vert.
 * @author Rémi Angot*
 * @class
 */
export function Polygone (...points) {
  ObjetMathalea2D.call(this, {})
  this.epaisseurDesHachures = 1
  this.distanceDesHachures = 10
  this.couleurDeRemplissage = ''
  this.opaciteDeRemplissage = 0.5
  if (Array.isArray(points[0])) {
    // Si le premier argument est un tableau
    this.listePoints = points[0]
    if (points[1]) {
      this.color = colorToLatexOrHTML(points[1])
    }
    if (points[2]) {
      this.couleurDeRemplissage = colorToLatexOrHTML(points[2])
    } else {
      this.couleurDeRemplissage = colorToLatexOrHTML('none')
    }
    if (points[3]) {
      this.couleurDesHachures = colorToLatexOrHTML(points[3])
      this.hachures = true
    } else {
      this.couleurDesHachures = colorToLatexOrHTML('black')
      this.hachures = false
    }
    this.nom = this.listePoints.map(el => el.nom).join('')
  } else {
    if (typeof points[points.length - 1] === 'string') {
      this.color = points[points.length - 1]
      points.splice(points.length - 1, 1)
    }
    this.listePoints = points
    this.nom = this.listePoints.map(el => el.nom).join('')
    this.couleurDeRemplissage = colorToLatexOrHTML('none')
    this.couleurDesHachures = colorToLatexOrHTML('none') // Rajout EE du 22/02/2024 pour 6N22 cas 3
    this.hachures = false
  }
  let xmin = 1000
  let xmax = -1000
  let ymin = 1000
  let ymax = -1000
  for (const unPoint of this.listePoints) {
    if (unPoint.typeObjet !== 'point') window.notify('Polygone : argument invalide', { ...points })
    xmin = Math.min(xmin, unPoint.x)
    xmax = Math.max(xmax, unPoint.x)
    ymin = Math.min(ymin, unPoint.y)
    ymax = Math.max(ymax, unPoint.y)
  }
  this.bordures = [xmin, ymin, xmax, ymax]

  this.binomesXY = function (coeff) {
    let liste = ''
    for (const point of this.listePoints) {
      liste += `${point.xSVG(coeff)},${point.ySVG(coeff)} `
    }
    return liste
  }
  this._triangulation = null
  this._flat = null
  Object.defineProperty(this, 'flat', {
    get: () => {
      if (this._flat === null) this._flat = polygoneToFlatArray(this)
      return this._flat
    }
  })
  Object.defineProperty(this, 'triangulation', {
    get: () => { // retourne une liste de triangles pavant le polygone
      if (this._triangulation === null) {
        const trianglesIndices = earcut(this.flat)
        this._triangulation = []
        for (let i = 0; i < trianglesIndices.length; i += 3) {
          this._triangulation.push([point(this.flat[trianglesIndices[i] * 2], this.flat[trianglesIndices[i] * 2 + 1]), point(this.flat[trianglesIndices[i + 1] * 2], this.flat[trianglesIndices[i + 1] * 2 + 1]), point(this.flat[trianglesIndices[i + 2] * 2], this.flat[trianglesIndices[i + 2] * 2 + 1])])
        }
      }
      return this._triangulation
    }
  })

  this._aire = null

  Object.defineProperty(this, 'aire', {
    get: () => {
      if (this._aire === null) {
        const triangles = this.triangulation
        this._aire = 0
        for (let i = 0; i < triangles.length; i++) {
          this._aire += aireTriangle(triangles[i])
        }
      }
      return this._aire
    }
  })

  this.svg = function (coeff) {
    if (this.epaisseur !== 1) {
      this.style += ` stroke-width="${this.epaisseur}" `
    }
    switch (this.pointilles) {
      case 1:
        this.style += ' stroke-dasharray="6 10" '
        break
      case 2:
        this.style += ' stroke-dasharray="6 3" '
        break
      case 3:
        this.style += ' stroke-dasharray="3 2 6 2 " '
        break
      case 4:
        this.style += ' stroke-dasharray="1 2" '
        break
      case 5:
        this.style += ' stroke-dasharray="5 5" '
        break
    }

    if (this.hachures) {
      if (this.couleurDeRemplissage.length < 1) {
        this.couleurDeRemplissage = colorToLatexOrHTML('none')
      }
      return pattern({
        motif: this.hachures,
        id: this.id,
        distanceDesHachures: this.distanceDesHachures,
        epaisseurDesHachures: this.epaisseurDesHachures,
        couleurDesHachures: this.couleurDesHachures[0] || 'black',
        couleurDeRemplissage: this.couleurDeRemplissage[0],
        opaciteDeRemplissage: this.opaciteDeRemplissage
      }) + `<polygon points="${this.binomesXY(coeff)}" stroke="${this.color[0]}" ${this.style} id="${this.id}" fill="url(#pattern${this.id})" />`
    } else {
      if (this.couleurDeRemplissage[0] === '' || this.couleurDeRemplissage[0] === undefined) {
        this.style += ' fill="none" '
      } else {
        this.style += ` fill="${this.couleurDeRemplissage[0]}" `
        this.style += ` fill-opacity="${this.opaciteDeRemplissage}" `
      }
      if (this.opacite !== 1) {
        this.style += ` stroke-opacity="${this.opacite}" `
      }
      return `<polygon points="${this.binomesXY(coeff)}" stroke="${this.color[0]}" ${this.style} id="${this.id}" />`
    }
  }
  this.tikz = function () {
    const tableauOptions = []
    if (this.color[1].length > 1 && this.color[1] !== 'black') {
      tableauOptions.push(`color=${this.color[1]}`)
    }
    if (this.epaisseur !== 1) {
      tableauOptions.push(`line width = ${this.epaisseur}`)
    }
    switch (this.pointilles) {
      case 1:
        tableauOptions.push(' dash dot ')
        break
      case 2:
        tableauOptions.push(' densely dash dot dot ')
        break
      case 3:
        tableauOptions.push(' dash dot dot ')
        break
      case 4:
        tableauOptions.push(' dotted ')
        break
      case 5:
        tableauOptions.push(' dashed ')
        break
    }
    if (this.opacite !== 1) {
      tableauOptions.push(`opacity=${this.opacite}`)
    }

    if (this.couleurDeRemplissage[1] !== '' && this.couleurDeRemplissage[1] !== 'none') {
      tableauOptions.push(`preaction={fill,color = ${this.couleurDeRemplissage[1]}${this.opaciteDeRemplissage !== 1 ? ', opacity = ' + this.opaciteDeRemplissage : ''}}`)
    }

    if (this.hachures) {
      tableauOptions.push(pattern({
        motif: this.hachures,
        id: this.id,
        distanceDesHachures: this.distanceDesHachures,
        couleurDesHachures: this.couleurDesHachures[1] ?? 'black',
        couleurDeRemplissage: this.couleurDeRemplissage[1],
        opaciteDeRemplissage: this.opaciteDeRemplissage
      }))
    }
    let optionsDraw = []
    if (tableauOptions.length > 0) {
      optionsDraw = '[' + tableauOptions.join(',') + ']'
    }

    let binomeXY = ''
    for (const point of this.listePoints) {
      binomeXY += `(${arrondi(point.x)},${arrondi(point.y)})--`
    }
    // if (this.couleurDeRemplissage === '') {
    return `\\draw${optionsDraw} ${binomeXY}cycle;`
    // } else {
    //  return `\\filldraw ${optionsDraw} ${binomeXY}cycle;`
    // }
  }
  this.svgml = function (coeff, amp) {
    let code = ''
    let segmentCourant
    let A, B
    for (let k = 1; k <= this.listePoints.length; k++) {
      B = this.listePoints[k % this.listePoints.length]
      A = this.listePoints[k - 1]
      segmentCourant = segment(A, B, this.color)
      segmentCourant.epaisseur = this.epaisseur
      segmentCourant.opacite = this.opacite
      code += segmentCourant.svgml(coeff, amp)
    }
    return code
  }
  this.tikzml = function (amp) {
    let code = ''
    let segmentCourant
    let A, B
    for (let k = 1; k <= this.listePoints.length; k++) {
      B = this.listePoints[k % this.listePoints.length]
      A = this.listePoints[k - 1]
      segmentCourant = segment(A, B, this.color)
      segmentCourant.isVisible = true
      segmentCourant.epaisseur = this.epaisseur
      segmentCourant.opacite = this.opacite
      code += '\t' + segmentCourant.tikzml(amp) + '\n'
    }
    return code
  }
}

/**
 * Propriétés possibles : .color, .opacite, .epaisseur, .couleurDeRemplissage, .opaciteDeRemplissage, .hachures (true or false), .distanceDesHachures, .epaisseurDesHachures,.couleurDesHachures
 * @return {Polygone} objet Polygone
 * @example polygone(A,B,C,D,E) //Trace ABCDE
 * @example polygone([A,B,C,D],"blue") // Trace ABCD en bleu
 * @example polygone([A,B,C,D],"#f15929") // Trace ABCD en orange (code couleur HTML : #f15929)
 * @author Rémi Angot
 */
export function polygone (...args) {
  return new Polygone(...args)
}

/**
 * Crée un groupe d'objets contenant le polygone et ses sommets
 * @param  {...any} args
 * @return {array} [polygone,sommets]
 * Si le dernier argument est un nombre, celui-ci sera utilisé pour fixer la distance entre le sommet et le label (par défaut 0.5)
 * @exemple [poly, sommets] = polygoneAvecNom(A, B, C, D) // où A, B, C, D sont des objets Point
 */
export function polygoneAvecNom (...args) {
  let k = 0.5
  if (typeof args[args.length - 1] === 'number') {
    k = args[args.length - 1]
    args.splice(args.length - 1, 1)
  }
  const p = polygone(...args)
  let nom = ''
  args.forEach(el => {
    nom += el.nom + ','
  })
  nom = nom.substring(0, nom.length - 1)
  p.sommets = nommePolygone(p, nom, k)
  p.sommets.bordures = []
  p.sommets.bordures[0] = p.bordures[0] - 1 - k
  p.sommets.bordures[1] = p.bordures[1] - 1 - k
  p.sommets.bordures[2] = p.bordures[2] + 1 + k
  p.sommets.bordures[3] = p.bordures[3] + 1 + k
  return [p, p.sommets]
}

/**
 * @description en une fois tous les sommets d'un polygone avec le tableau de string fourni
 * attention si on passe un string comme 'ABCD' ça fonctionne aussi...
 * Si on veut des noms de points à plus de 1 caractère, il faut soit les passer en tableau soit les séparer par des virgules au sein du string
 * @example renommePolygone(p, "A',B',C',D'") ou renommePolygone(p, ["A'","B'","C'","D'"])
 */
export function renommePolygone (p, noms) {
  noms = (typeof noms === 'string') ? noms.includes(',') ? noms.split(',') : noms : noms
  for (let i = 0; i < p.listePoints.length; i++) {
    if (noms[i] !== undefined) {
      p.listePoints[i].nom = noms[i]
    }
  }
}

/**
 * Trace le polygone régulier direct à n côtés qui a pour côté [AB]
 * Pour tracer le polygone régulier indirect de côté [AB], on iversera A et B
 * @param {Point} A
 * @param {Point} B
 * @param {integer} n Nombre de côtés
 * @param {string} [color = 'black'] Couleur de l'arc ou 'none' : du type 'blue' ou du type '#f15929'
 * @author Rémi Angot
 **/
export function polygoneRegulier (A, B, n, color = 'black') {
  const listePoints = [A, B]
  for (let i = 1; i < n - 1; i++) {
    listePoints[i + 1] = rotation(
      listePoints[i - 1],
      listePoints[i],
      -180 + 360 / n
    )
  }
  return new Polygone(listePoints, color)
}

/**
 * Trace un carré
 * @param {Point} A Un sommet du carré
 * @param {Point} B Un sommet du carré, consécutif au précédent
 * @param {string} [color = 'black'] Couleur de l'arc ou 'none' : du type 'blue' ou du type '#f15929'
 * @example carre(M,N)
 *  // Trace le carré noir de sommets consécutifs M et N dans le sens direct
 * @example carre(N,M)
 *  // Trace le carré noir de sommets consécutifs M et N dans le sens indirect
 * @example carre(M,N,'blue')
 *  // Trace le carré bleu de sommets consécutifs M et N dans le sens direct
 * @return {polygoneRegulier}
 * @author Rémi Angot
 */
// JSDOC Validee par EE Juin 2022
export function carre (A, B, color = 'black') {
  return polygoneRegulier(A, B, 4, color)
}

/**
 * polygoneRegulierParCentreEtRayon(O,r,n) //Trace le polygone régulier à n côtés et de rayon r
 *
 * @author Rémi Angot
 */
export function polygoneRegulierParCentreEtRayon (O, r, n, color = 'black') {
  const p = []
  p[0] = point(O.x + r, O.y)
  for (let i = 1; i < n; i++) {
    p[i] = rotation(p[i - 1], O, -360 / n)
  }
  return polygone(p, color)
}

/**
 * Un constructeur de boites rectangulaires.
 * remplace l'objet Mathalea2d Boite()
 * On construit une Boite de base puis on peut
 * Ajouter des couleurs avec la méthode addColor()
 * Ajouter du texte ou du latex dedans avec addTextIn()
 * Enfin, la méthode render() retourne l'objet Mathalea2d ou un array d'objet Mathalea2d pour la fonction mathalea2d()
 * Exemple : const maBoite = new BoiteBuilder({xMin:0, yMin:0, xMax:3, yMax: 2}).addTextIn({textIn: '\\dfrac{1}{2}'}).render()
 */
export class BoiteBuilder {
  constructor ({ xMin, xMax, yMin, yMax }) {
    this.xMin = xMin
    this.xMax = xMax
    this.yMin = yMin
    this.yMax = yMax
    this.forme = polygone([point(xMin, yMin), point(xMax, yMin), point(xMax, yMax), point(xMin, yMax)])
  }

  /**
     * l'objet ou l'array d'objet pour la fonction mathalea2d()
     * @return {[Polygone|Vide2d,LatexParCoordonnees|TexteParPoint)]|Polygone}
     */
  render () {
    return this.text ? [this.forme, this.text] : this.forme
  }

  /**
     * La méthode retourne l'objet afin de la rendre chaînable
     * @param {string} color
     * @param {string} colorBackground
     * @param {number} opacity
     * @param {number} backgroudOpacity
     * @return {BoiteBuilder}
     */
  addColor ({ color, colorBackground, opacity, backgroudOpacity }) {
    this.forme.color = colorToLatexOrHTML(color ?? 'black')
    this.forme.opacite = opacity ?? 1
    this.forme.couleurDeRemplissage = colorToLatexOrHTML(colorBackground ?? 'none')
    this.forme.opaciteDeRemplissage = backgroudOpacity ?? 0.7
    return this
  }

  /**
     * La méthode retourne l'objet afin de la rendre chaînable
     * @param {string} textIn si contient '\\' alors c'est une commande latex rendue par latexParCoordonnees()
     * @param {string} color
     * @param {number} opacity
     * @param {number} size (facteur d'agrandissement ou de réduction 1 par défaut)
     * @return {BoiteBuilder}
     */
  addTextIn ({ textIn, color, opacity, size }) {
    if (typeof textIn !== 'string') {
      window.notify('BoiteBuilder.addTextIn() requiert un texteIn de type string ', { textIn })
    }
    if (textIn.length > 0) {
      this.text = textIn.includes('\\')
        ? latexParCoordonnees(textIn, (this.xMin + this.xMax) / 2, (this.yMin + this.yMax) / 2, color ?? 'black', 50, 0, '', (size ?? 1) * 10)
        : texteParPosition(textIn, (this.xMin + this.xMax) / 2, (this.yMin + this.yMax) / 2, 0, color ?? 'black', size)
      this.text.opacite = opacity ?? 1
    }
    return this
  }
}

/**
 * @param {Polygone} P
 * @return {number[]} retourne la liste des coordonnées des sommets de P dans un seul tableau.
 * @author Jean-Claude Lhote
 */
export function polygoneToFlatArray (P) {
  const flatArray = []
  for (let i = 0; i < P.listePoints.length; i++) {
    flatArray.push(P.listePoints[i].x, P.listePoints[i].y)
  }
  return flatArray
}

/**
 *
 * @param {number[]} [data = []] tableau à une seule dimension (flat array) contenant les coordonnées des sommets (extérieurs et intérieurs) du polygone
 * @param {number[]} [holes = []] tableau à une seule dimension contenant les indices des points qui démarrent un 'trou' dans le tableau data (exemple : holes = [4, 8] indique que les points 4 à 7 définissent un trou ainsi que 8 et suivants, donc les coordonnées 8 à 15 et 16 à ...(ne pas oublier que 1 point = 2 coordonnées))
 * @param {string} [noms = ''] chaine donnant les noms des sommets
 * @param {string} [color = 'black'] couleur du polygone
 * @param {string} [couleurDeRemplissage = ' blue'] la couleur de remplissage
 * @param {string} [couleurDeFond = 'white'] la couleur des trous
 * @class
 */
export function PolygoneATrous ({
  data = [],
  holes = [],
  noms = '',
  color = 'black',
  couleurDeRemplissage = 'blue',
  couleurDeFond = 'white'
}) {
  ObjetMathalea2D.call(this, {})
  const triangles = earcut(data, holes) // on crée le pavage de triangles grâce à Mapbox/earcut

  this._triangulation = null

  Object.defineProperty(this, 'triangulation', {
    get: () => { // retourne la liste de triangles 2d.
      if (this._triangulation === null) {
        this._triangulation = []
        for (let i = 0, triangle; i < triangles.length; i += 3) {
          triangle = polygone([point(data[triangles[i] * 2], data[triangles[i] * 2 + 1]), point(data[triangles[i + 1] * 2], data[triangles[i + 1] * 2 + 1]), point(data[triangles[i + 2] * 2], data[triangles[i + 2] * 2 + 1])])
          triangle.color = colorToLatexOrHTML(color)
          triangle.couleurDeRemplissage = colorToLatexOrHTML('none')
          this._triangulation.push(triangle)
        }
      }
      return this._triangulation
    }
  })

  const sommetsContour = [] // on crée le polygone extérieur
  for (let i = 0; i < 2 * holes[0]; i += 2) {
    sommetsContour.push(point(data[i], data[i + 1]))
    if (noms.length >= data.length << 1) {
      sommetsContour[i >> 1].nom = noms[i << 1]
    }
  }
  // On cherche les bordures
  for (let i = 0, xmin = 1000, xmax = -1000, ymin = 1000, ymax = -1000; i < data.length; i += 2) {
    xmin = Math.min(xmin, data[i])
    xmax = Math.max(xmax, data[i])
    ymin = Math.min(ymin, data[i + 1])
    ymax = Math.max(ymax, data[i + 1])
    this.bordures = [xmin, ymin, xmax, ymax]
  }
  this.contour = polygone(...sommetsContour)
  this.trous = []
  this.color = color
  this.couleurDeRemplissage = couleurDeRemplissage
  this.contour.couleurDeRemplissage = colorToLatexOrHTML(couleurDeRemplissage)
  this.contour.color = colorToLatexOrHTML(this.color)
  this.couleurDeFond = couleurDeFond
  const trous = []
  let trou, trouPol
  for (let i = 0; i < holes.length; i++) {
    trous[i] = []
    for (let j = holes[i] * 2; j < (i !== holes.length - 1 ? holes[i + 1] * 2 : data.length); j += 2) {
      trou = point(data[j], data[j + 1])
      if (noms.length >= data.length >> 1) {
        trou.nom = noms[j >> 1]
      }
      trous[i].push(trou)
    }
    trouPol = polygone(...trous[i])
    trouPol.color = colorToLatexOrHTML(this.color)
    trouPol.couleurDeRemplissage = colorToLatexOrHTML(this.couleurDeFond)
    this.trous.push(trouPol)
  }
  this._aire = null
  Object.defineProperty(this, 'aire', {
    get: () => {
      if (this._aire === null) {
        this._aire = this.contour.aire
        for (let i = 0; i < this.trous.length; i++) {
          this._aire -= this.trous[i].aire
        }
      }
      return this._aire
    }
  })

  this.svg = function (coeff) {
    let code = this.contour.svg(coeff)
    for (let i = 0; i < this.trous.length; i++) {
      code += this.trous[i].svg(coeff)
    }
    return code
  }
  this.tikz = function () {
    let code = this.contour.tikz()
    for (let i = 0; i < this.trous.length; i++) {
      code += '\n\t' + this.trous[i].tikz()
    }
    return code
  }
}

/**
 * Cet objet permet de créer un polygone avec une surface contenant des 'trous' eux-mêmes polygonaux
 * cerise sur le gâteau, la propriété this.triangulation fournit une liste de triangles pavant le polygone
 * @param {number[]} [data = []] contient la liste des coordonnées des sommets (contour puis trous) 2 coordonnées par point dans l'ordre abscisse, ordonnée
 * @param {number[]}  [holes = []] tableau à une seule dimension contenant les indices des points qui démarrent un 'trou' dans le tableau data (exemple : holes = [4, 8] indique que les points 4 à 7 définissent un trou ainsi que 8 et suivants, donc les coordonnées 8 à 15 et 16 à ...(ne pas oublier que 1 point = 2 coordonnées))
 * @param {string} [noms = ''] contient les noms des sommets
 * @param {string} [color = 'black'] est la couleur des bords
 * @param {string} [couleurDeRemplissage = 'blue'] est la couleur de la surface
 * @param {string} [couleurDeFond = 'white'] est la couleur de remplissage des trous
 * @return {PolygoneaTrou} un polygone à trous (ou pas : il peut ne pas y avoir de trou !)
 */
export function polygoneATrous ({
  data = [],
  holes = [],
  noms = '',
  color = 'black',
  couleurDeRemplissage = 'blue',
  couleurDeFond = 'white'
}) {
  return new PolygoneATrous({ data, holes, noms, color, couleurDeRemplissage, couleurDeFond })
}

/*********************************************/
/**
 * fonction qui retourne le parallélogramme ABCD dont on donne les 3 premiers points A, B et C
 *
 * @param {string} NOM
 * @param {objet} A
 * @param {objet} B
 * @param {objet} C
 * @return {polygoneAvecNom}
 */
export function parallelogramme3points (NOM, A, B, C) {
  const D = translation(A, vecteur(B, C), NOM[3])
  A.nom = NOM[0]
  B.nom = NOM[1]
  C.nom = NOM[2]
  return polygoneAvecNom(A, B, C, D)
}

/**
 * parallelogramme2points1hauteur(A,B,5) renvoie un parallélogramme ABCD de base [AB] et de hauteur h
 * parallelogramme2points1hauteur(A,7,5) renvoie un parallélogramme ABCD de base 7cm (le point B est choisi sur le cercle de centre A et de rayon 7cm) et de hauteur h
 *
 * @param {String} NOM
 * @param {objet} A
 * @param {objet} B
 * @param {number} h
 * @return {polygoneAvecNom}
 */
export function parallelogramme2points1hauteur (NOM, A, B, h) {
  if (typeof B === 'number') {
    B = pointAdistance(A, B, randint(-180, 180))
  }
  A.nom = NOM[0]
  B.nom = NOM[1]
  let H = rotation(B, A, 90)
  H = pointSurSegment(A, H, h)
  const D = translation(H, homothetie(vecteur(A, B), A, randint(-5, 5, rangeMinMax(-2, 2)) / 10), NOM[3])
  const C = translation(D, vecteur(A, B), NOM[2])
  return polygoneAvecNom(A, B, C, D)
}

/**
 * @description Place les labels passés dans le deuxième paramètre aux sommets du polygone en les plaçant alignés avec le barycentre du polygone à une distance fixée du point
 * @description Si les noms peuvent avoir plusieurs caractères, il faudra ajouter des virgules entre chaque nom dans le string passé en argument.
 * @example nommePolygone (p, "A',B',C',D',E'", 0.5, 'red')
 * @example nommePolygone (p,'ABCDE',0.5,'red') nomme les sommets du polygone A, B, C, D et E. Les labels sont placés à une distance de 0,5 cm des sommets
 * @author Jean-Claude Lhote
 */
export function NommePolygone (p, nom = '', k = 0.5, color = 'black') {
  ObjetMathalea2D.call(this, {})
  this.poly = p
  this.dist = k
  const noms = nom.includes(',') ? nom.split(',') : nom
  for (let i = 0; i < p.listePoints.length; i++) {
    if (noms.length > 0) p.listePoints[i].nom = noms[i]
  }
  const G = barycentre(p)
  const objets = []
  let xMin = 1000
  let xMax = -1000
  let yMin = 1000
  let yMax = -1000
  for (const pt of p.listePoints) {
    const P = pointSurSegment(G, pt, longueur(G, pt) + (context.isHtml ? k * 20 / context.pixelsParCm : k / context.scale))
    P.positionLabel = 'center'
    objets.push(texteParPoint(pt.nom, P, 0, color, 1, 'milieu', true))
    xMin = Math.min(xMin, P.x - 0.5)
    xMax = Math.max(xMax, P.x + 0.5)
    yMin = Math.min(yMin, P.y - 0.5)
    yMax = Math.max(yMax, P.y + 0.5)
  }
  this.bordures = [xMin, yMin, xMax, yMax]
  this.svg = function (coeff) {
    let code = ''
    for (const objet of objets) {
      code += '\n\t' + objet.svg(coeff)
    }
    return code
  }
  this.tikz = function () {
    let code = ''
    for (const objet of objets) {
      code += '\n\t' + objet.tikz()
    }
    return code
  }
}

export function nommePolygone (...args) {
  return new NommePolygone(...args)
}

/**
 *
 * @param {number} index Choix du motif
 * le nom du motif sert dans la fonction pattern
 * @author Jean-Claude Lhote
 */
export function motifs (index) {
  switch (index) {
    case 0:
      return 'north east lines'
    case 1:
      return 'horizontal lines'
    case 2:
      return 'vertical lines'
    case 3:
      return 'dots'
    case 4:
      return 'crosshatch dots'
    case 5:
      return 'fivepointed stars'
    case 6:
      return 'sixpointed stars'
    case 7:
      return 'bricks'
    case 8:
      return 'checkerboard'
    case 9:
      return 'grid'
    case 10:
      return 'crosshatch'
    default:
      return 'north east lines'
  }
}

/**
 *
 * @param {object} param0 paramètres de définition du motif de remplissage
 * définit un motif de remplissage pour les polygones, les rectangles... ou tout élément SVG qui se remplit.
 * @author Jean-Claude Lhote
 */
export function pattern ({
  motif = 'north east lines',
  id,
  distanceDesHachures = 10,
  epaisseurDesHachures = 1,
  couleurDesHachures = 'black',
  couleurDeRemplissage = 'none',
  opaciteDeRemplissage = 0.5
}) {
  let myPattern = ''
  if (context.isHtml) {
    if (couleurDeRemplissage.length < 1) {
      couleurDeRemplissage = 'none'
    }
    switch (motif) {
      case 'north east lines':
        myPattern += `<pattern id="pattern${id}" width="${distanceDesHachures}" height="${distanceDesHachures}"  patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="${distanceDesHachures}" height="${distanceDesHachures}" fill="${couleurDeRemplissage}" fill-opacity="${opaciteDeRemplissage}"/>
            <line x1="0" y1="0" x2="0" y2="${distanceDesHachures}" style="stroke:${couleurDesHachures}; stroke-width:${epaisseurDesHachures}" />
            </pattern>`
        break
      case 'horizontal lines':
        myPattern += `<pattern id="pattern${id}" width="${distanceDesHachures}" height="${distanceDesHachures}"  patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="${distanceDesHachures}" height="${distanceDesHachures}" fill="${couleurDeRemplissage}" fill-opacity="${opaciteDeRemplissage}"/>
            <line x1="0" y1="${distanceDesHachures / 2}" x2="${distanceDesHachures}" y2="${distanceDesHachures / 2}" style="stroke:${couleurDesHachures}; stroke-width:${epaisseurDesHachures}" />
            </pattern>`
        break
      case 'vertical lines':
        myPattern += `<pattern id="pattern${id}" width="${distanceDesHachures}" height="${distanceDesHachures}"  patternTransform="rotate(0 0 0)" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="${distanceDesHachures}" height="${distanceDesHachures}" fill="${couleurDeRemplissage}" fill-opacity="${opaciteDeRemplissage}"/>
            <line x1="0" y1="0" x2="0" y2="${distanceDesHachures}" style="stroke:${couleurDesHachures}; stroke-width:${epaisseurDesHachures}" />
            </pattern>`
        break
      case 'dots':
        myPattern += `<pattern id="pattern${id}" width="${distanceDesHachures}" height="${distanceDesHachures}"  patternTransform="rotate(0 0 0)" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" fill="${couleurDesHachures}" fill-opacity="${opaciteDeRemplissage}"/>
            <circle cx="8" cy="3" r="1.5" fill="${couleurDesHachures}" fill-opacity="${opaciteDeRemplissage}"/>
            <circle cx="3" cy="8" r="1.5" fill="${couleurDesHachures}" fill-opacity="${opaciteDeRemplissage}"/>
            <circle cx="8" cy="8" r="1.5" fill="${couleurDesHachures}" fill-opacity="${opaciteDeRemplissage}"/>
            </pattern>`
        break
      case 'crosshatch dots':
        myPattern += `<pattern id="pattern${id}" width="12" height="12" x="12" y="12" patternTransform="rotate(0 0 0)" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="${couleurDesHachures}" fill-opacity="${opaciteDeRemplissage}"/>
          <circle cx="8" cy="2" r="1.5" fill="${couleurDesHachures}" fill-opacity="${opaciteDeRemplissage}"/>
          <circle cx="5" cy="5" r="1.5" fill="${couleurDesHachures}" fill-opacity="${opaciteDeRemplissage}"/>
          <circle cx="2" cy="8" r="1.5" fill="${couleurDesHachures}" fill-opacity="${opaciteDeRemplissage}"/>
          <circle cx="8" cy="8" r="1.5" fill="${couleurDesHachures}" fill-opacity="${opaciteDeRemplissage}"/>
          <circle cx="5" cy="11" r="1.5" fill="${couleurDesHachures}" fill-opacity="${opaciteDeRemplissage}"/>
          <circle cx="11" cy="5" r="1.5" fill="${couleurDesHachures}" fill-opacity="${opaciteDeRemplissage}"/>
          <circle cx="11" cy="11" r="1.5" fill="${couleurDesHachures}" fill-opacity="${opaciteDeRemplissage}"/>
          </pattern>`
        break
      case 'fivepointed stars':
        myPattern += `<pattern id="pattern${id}" width="12" height="12" x="10" y="10" patternTransform="rotate(0 0 0)" patternUnits="userSpaceOnUse">
          <polygon points="10,5 6.2,4.2 6.6,0.2 4.6,3.6 1,2 3.6,5 1,8 4.6,6.4 6.6,9.8 6.2,5.8 " stroke="${couleurDesHachures}"  fill="${couleurDeRemplissage}" fill-opacity="${opaciteDeRemplissage}" />
          </pattern>`
        break
      case 'sixpointed stars':
        myPattern += `<pattern id="pattern${id}"  width="12" height="12" x="10" y="10" patternTransform="rotate(0 0 0)" patternUnits="userSpaceOnUse">
        <polygon points="10,5 7.6,3.4 7.6,0.6 5,2 2.6,0.6 2.4,3.4 0,5 2.4,6.4 2.6,9.4 5,8 7.6,9.4 7.6,6.4 " stroke="${couleurDesHachures}" fill="${couleurDeRemplissage}" fill-opacity="${opaciteDeRemplissage}" />
        </pattern>`
        break
      case 'crosshatch':
        myPattern += `<pattern id="pattern${id}" width="12" height="12" x="10" y="10" patternTransform="rotate(0 0 0)" patternUnits="userSpaceOnUse">
          <polygon points="2,2 7.6,7.6 7,8.4 9.8,8.4 9.8,5.6 9,6.2 3.4,0.6 " stroke="${couleurDesHachures}"  fill="${couleurDeRemplissage}" fill-opacity="${opaciteDeRemplissage}" />
          </pattern>`
        break
      case 'bricks':
        myPattern += `<pattern id="pattern${id}" width="18" height="16" x="18" y="16" patternTransform="rotate(0 0 0)" patternUnits="userSpaceOnUse">
          <line x1="4" y1="2" x2="4" y2="4" stroke="${couleurDesHachures}" fill="${couleurDeRemplissage}" fill-opacity="${opaciteDeRemplissage}"  />
          <line x1="0" y1="4" x2="16" y2="4" stroke="${couleurDesHachures}" fill="${couleurDeRemplissage}" fill-opacity="${opaciteDeRemplissage}"   />
          <line x1="14" y1="4" x2="14" y2="12" stroke="${couleurDesHachures}" fill="${couleurDeRemplissage}" fill-opacity="${opaciteDeRemplissage}"   />
          <line x1="16" y1="12" x2="0" y2="12" stroke="${couleurDesHachures}" fill="${couleurDeRemplissage}" fill-opacity="${opaciteDeRemplissage}"   />
          <line x1="4" y1="12" x2="4" y2="16" stroke="${couleurDesHachures}" fill="${couleurDeRemplissage}" fill-opacity="${opaciteDeRemplissage}"   />
          </pattern>`
        break
      case 'grid':
        myPattern += `<pattern id="pattern${id}" width="10" height="10" x="10" y="10" patternTransform="rotate(0 0 0)" patternUnits="userSpaceOnUse">
          <polyline points="8,8 0,8 0,0 " fill="none" stroke="${couleurDesHachures}" />
          </pattern>`
        break
      case 'checkerboard':
        myPattern += `<pattern id="pattern${id}" width="8" height="8" x="8" y="8" patternTransform="rotate(0 0 0)" patternUnits="userSpaceOnUse">
          <polygon points="4,4 8,4 8,0 4,0 "  fill="${couleurDesHachures}" fill-opacity="${opaciteDeRemplissage}" />
          <polygon points="0,4 4,4 4,8 0,8 "  fill="${couleurDesHachures}" fill-opacity="${opaciteDeRemplissage}" />
        
          </pattern>`
        break
      default:
        myPattern += `<pattern id="pattern${id}" width="${distanceDesHachures}" height="${distanceDesHachures}"  patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="${distanceDesHachures}" height="${distanceDesHachures}" fill="${couleurDeRemplissage}" fill-opacity="${opaciteDeRemplissage}"/>
        <line x1="0" y1="0" x2="0" y2="${distanceDesHachures}" style="stroke:${couleurDesHachures}; stroke-width:${epaisseurDesHachures}" />
        </pattern>`
        break
    }
    return myPattern
  } else if (context.issortieNB) {
    switch (motif) {
      case 'north east lines':
        myPattern = `pattern = ${motif}`
        break
      case 'horizontal lines':
        myPattern = `pattern = ${motif}`
        break
      case 'vertical lines':
        myPattern = `pattern = ${motif}`
        break
      case 'dots':
        myPattern = `pattern = ${motif}`
        break
      case 'crosshatch dots':
        myPattern = `pattern = ${motif}`
        break
      case 'fivepointed stars':
        myPattern = `pattern = ${motif}`
        break
      case 'sixpointed stars':
        myPattern = `pattern = ${motif}`
        break
      case 'crosshatch':
        myPattern = `pattern = ${motif}`
        break
      case 'bricks':
        myPattern = `pattern = ${motif}`
        break
      case 'grid':
        myPattern = `pattern = ${motif}`
        break
      case 'checkerboard':
        myPattern = `pattern = ${motif}`
        break
      default:
        myPattern = 'pattern = north east lines'
        break
    }
    return myPattern
  } else { // Sortie Latex
    switch (motif) {
      case 'north east lines':
        myPattern = `pattern color = ${couleurDesHachures} , pattern = ${motif}`
        break
      case 'horizontal lines':
        myPattern = `pattern color = ${couleurDesHachures} , pattern = ${motif}`
        break
      case 'vertical lines':
        myPattern = `pattern color = ${couleurDesHachures} , pattern = ${motif}`
        break
      case 'dots':
        myPattern = `pattern color = ${couleurDesHachures} , pattern = ${motif}`
        break
      case 'crosshatch dots':
        myPattern = `pattern color = ${couleurDesHachures} , pattern = ${motif}`
        break
      case 'fivepointed stars':
        myPattern = `pattern color = ${couleurDesHachures} , pattern = ${motif}`
        break
      case 'sixpointed stars':
        myPattern = `pattern color = ${couleurDesHachures} , pattern = ${motif}`
        break
      case 'crosshatch':
        myPattern = `pattern color = ${couleurDesHachures} , pattern = ${motif}`
        break
      case 'bricks':
        myPattern = `pattern color = ${couleurDesHachures} , pattern = ${motif}`
        break
      case 'grid':
        myPattern = `pattern color = ${couleurDesHachures} , pattern = ${motif}`
        break
      case 'checkerboard':
        myPattern = `pattern color = ${couleurDesHachures} , pattern = ${motif}`
        break
      default:
        myPattern = `pattern color = ${couleurDesHachures} , pattern = north east lines`
        break
    }
    return `${myPattern}`
  }
}
