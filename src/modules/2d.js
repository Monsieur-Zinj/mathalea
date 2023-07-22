import Decimal from 'decimal.js'
import { abs, random, round } from 'mathjs'
import { angleModulo, angleOriente } from '../lib/2d/angles.js'
import { afficheCoteSegment } from '../lib/2d/codages.js'
import { Droite, droite, droiteParPointEtPerpendiculaire, mediatrice } from '../lib/2d/droites.js'
import { carre, pattern, polygone } from '../lib/2d/polygones.js'
import { DemiDroite, longueur, Segment, segment, vecteur } from '../lib/2d/segmentsVecteurs.js'
import { homothetie, projectionOrtho, rotation, similitude, translation } from '../lib/2d/transformations.js'
import { arrondi } from '../lib/outils/nombres.js'
import { stringNombre } from '../lib/outils/texNombre.js'
import { colorToLatexOrHTML, ObjetMathalea2D, vide2d } from './2dGeneralites.js'
import { context } from './context.js'
import { degCos, degSin, radians } from './mathFonctions/trigo.js'
import { egal, inferieurouegal, randint, superieurouegal } from './outils.js'

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%% LES POINTS %%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/**
 * A = point('A') //son nom
 * A = point(x,y) //ses coordonnées
 * A = point(x,y,'A') //ses coordonnées et son nom
 * A = point(x,y,'A',below') //ses coordonnées,son nom et la position de son label
 * @author Rémi Angot
 * @class
 */
export function Point (arg1, arg2, arg3, positionLabel = 'above') {
  this.typeObjet = 'point'
  ObjetMathalea2D.call(this, { classe: false })
  this.nom = ' ' // Le nom d'un point est par défaut un espace. On pourra chercher tous les objets qui ont ce nom pour les nommer automatiquement
  if (arguments.length === 1) {
    this.nom = arg1
  } else if (arguments.length === 2) {
    if (isNaN(arg1) || isNaN(arg2)) window.notify(`Point : les coordonnées ne sont pas valides ${arg1} ${arg2}`)
    else {
      this.x = arg1
      this.y = arg2
    }
  } else {
    if (isNaN(arg1) || isNaN(arg2)) window.notify(`Point : les coordonnées ne sont pas valides ${arg1} ${arg2}`)
    else {
      this.x = arg1
      this.y = arg2
    }
    this.nom = arg3
  }
  this.positionLabel = positionLabel
  this.bordures = [this.x, this.y, this.x, this.y]
  this.xSVG = function (coeff) {
    return arrondi(this.x * coeff, 1)
  }
  this.ySVG = function (coeff) {
    return arrondi(-this.y * coeff, 1)
  }

  /**
   * Teste l'appartenance d'un point à tout type de polygone (non convexe ou convexe). Pour info, la fonction utilise une triangulation du polygone réalisée par la librairie earcut Copyright (c) 2016, Mapbox.
   * @memberof Point
   * @param {Polygone} p Polygone dont on veut tester l'appartenance avec le point
   * @example M.estDansPolygone(p1) // Renvoie true si M appartient au polygone p1, false sinon
   * @author Jean-Claude Lhote
   * @return {boolean}
   */
  // JSDOC Validee par EE Aout 2022
  this.estDansPolygone = function (p) {
    for (const triangle of p.triangulation) {
      if (this.estDansTriangle(...triangle)) return true
    }
    return false
  }

  /**
   * Teste l'appartenance d'un point dans un triangle
   * @memberof Point
   * @param {Point} A Premier sommet du triangle
   * @param {Point} B Deuxième sommet du triangle
   * @param {Point} C Troisième sommet du triangle
   * @example M.estDansTriangle(V, S, T) // Renvoie true si M appartient au triangle VST, false sinon
   * @author Eric Elter
   * @return {boolean}
   */
  // JSDOC Validee par EE Aout 2022
  this.estDansTriangle = function (A, B, C) {
    const vMA = vecteur(this, A)
    const vMB = vecteur(this, B)
    const vMC = vecteur(this, C)
    const x1 = vMB.x * vMC.y - vMB.y * vMC.x
    const x2 = vMC.x * vMA.y - vMC.y * vMA.x
    const x3 = vMA.x * vMB.y - vMA.y * vMB.x
    return (superieurouegal(x1, 0) && superieurouegal(x2, 0) && superieurouegal(x3, 0)) || (inferieurouegal(x1, 0) && inferieurouegal(x2, 0) && inferieurouegal(x3, 0))
  }

  /**
   * Teste l'appartenance d'un point à un polygone convexe
   * @memberof Point
   * @param {Polygone} p Polygone dont on veut tester l'appartenance avec le point
   * @example M.estDansPolygoneConvexe(p1) // Renvoie true si M appartient au polygone convexe p1, false sinon
   * @author Jean-Claude Lhote
   * @return {boolean}
   */
  // JSDOC Validee par EE Aout 2022
  this.estDansPolygoneConvexe = function (p) {
    const l = p.listePoints.length
    if (l === 3) {
      return this.estDansTriangle(...p.listePoints)
    } else {
      const A = p.listePoints[0]
      const B = p.listePoints[1]
      const C = p.listePoints[l - 1]
      const p2 = polygone(...p.listePoints.slice(1))
      if (this.estDansTriangle(A, B, C)) return true
      else return this.estDansPolygoneConvexe(p2)
    }
  }

  /**
   * Teste l'appartenance d'un point dans un quadrilatère
   * @memberof Point
   * @param {Point} A Premier sommet du quadrilatère
   * @param {Point} B Deuxième sommet du quadrilatère
   * @param {Point} C Troisième sommet du quadrilatère
   * @param {Point} D Quatrième sommet du quadrilatère
   * @example M.estDansQuadrilatere(F, G, H, I) // Renvoie true si M appartient au quadrilatère FGHI, false sinon
   * @author Eric Elter
   * @return {boolean}
   */
  // JSDOC Validee par EE Aout 2022
  this.estDansQuadrilatere = function (A, B, C, D) {
    return this.estDansTriangle(A, B, C) || this.estDansTriangle(A, C, D)
  }

  /**
   * Teste l'appartenance d'un point sur un segment, un cercle, une droite ou une demi-droite
   * @memberof Point
   * @param {Segment | Cercle | Droite | DemiDroite} objet Objet géométrique dont on veut tester si le point en fait partie
   * @example M.estSur(s) // Renvoie true si M appartient au segment s (au préalablement défini), false sinon
   * @return {boolean}
   */
  // JSDOC Validee par EE Aout 2022
  this.estSur = function (objet) {
    if (objet instanceof Droite) return (egal(objet.a * this.x + objet.b * this.y + objet.c, 0, 0.000001))
    if (objet instanceof Segment) {
      const prodvect = (objet.extremite2.x - objet.extremite1.x) * (this.y - objet.extremite1.y) - (this.x - objet.extremite1.x) * (objet.extremite2.y - objet.extremite1.y)
      const prodscal = (this.x - objet.extremite1.x) * (objet.extremite2.x - objet.extremite1.x) + (this.y - objet.extremite1.y) * (objet.extremite2.y - objet.extremite1.y)
      const prodscalABAB = (objet.extremite2.x - objet.extremite1.x) ** 2 + (objet.extremite2.y - objet.extremite1.y) ** 2
      return (egal(prodvect, 0, 0.000001) && superieurouegal(prodscal, 0) && inferieurouegal(prodscal, prodscalABAB))
    }
    if (objet instanceof DemiDroite) {
      const OM = vecteur(objet.extremite1, this)
      const vd = vecteur(objet.extremite1, objet.extremite2)
      const prodscal = OM.x * vd.x + OM.y * vd.y
      const prodvect = OM.x * vd.y - OM.y * vd.x
      return (egal(prodvect, 0, 0.000001) && superieurouegal(prodscal, 0, 0.000001))
    }
    if (objet instanceof Cercle) return egal(longueur(this, objet.centre), objet.rayon, 0.000001)
  }
}

/**
 * Crée un objet Point ayant les propriétés suivantes :
 * @param {number} x abscisse
 * @param {number} y ordonnée
 * @param {string} A son nom qui apparaîtra
 * @param {string} positionLabel Les possibilités sont : 'left', 'right', 'below', 'above', 'above right', 'above left', 'below right', 'below left'. Si on se trompe dans l'orthographe, ce sera 'above left' et si on ne précise rien, pour un point ce sera 'above'.
 * @return {Point}
 */
export function point (x, y, A, positionLabel = 'above') {
  return new Point(x, y, A, positionLabel)
}

/**
 * @author Jean-Claude Lhote
 * @param {number} x abscisse
 * @param {number} y ordonnée
 * @param {object} param2 permet de définir le rayon du 'plot', sa couleur, sa couleur de remplissage
 */
export function Plot (x, y, {
  rayon = 0.05,
  couleur = 'black',
  couleurDeRemplissage = 'black',
  opacite = 1,
  opaciteDeRemplissage = 1
} = {}) {
  ObjetMathalea2D.call(this, {})
  if (isNaN(x) || isNaN(y)) window.notify('Plot : les coordonnées ne sont pas valides', { x, y })
  this.color = colorToLatexOrHTML(couleur) // EE : 08/05/2022
  this.couleurDeRemplissage = colorToLatexOrHTML(couleurDeRemplissage)
  this.rayon = rayon
  this.x = x
  this.y = y
  this.bordures = [x - rayon, y - rayon, x + rayon, y + rayon]
  this.opacite = opacite
  this.opaciteDeRemplissage = opaciteDeRemplissage
  this.svg = function (coeff) {
    if (this.couleurDeRemplissage[0] === '') {
      return `\n\t <circle cx="${this.x * coeff}" cy="${-this.y * coeff}" r="${this.rayon * coeff}" stroke="${this.color[0]}" stroke-opacity="${this.opacite || 1}"/>`
    } else {
      return `\n\t <circle cx="${this.x * coeff}" cy="${-this.y * coeff}" r="${this.rayon * coeff}" stroke="${this.color[0]}" fill="${this.couleurDeRemplissage[0]}" stroke-opacity="${this.opacite || 1}" fill-opacity="${this.opaciteDeRemplissage || 1}"/>`
    }
  }
  this.tikz = function () {
    const tableauOptions = []
    if (this.color[1].length > 1 && this.color[1] !== 'black') {
      tableauOptions.push(`color=${this.color[1]}`)
    }
    if (this.epaisseur !== 1) {
      tableauOptions.push(`line-width=${this.epaisseur}`)
    }
    if (this.opacite !== 1) {
      tableauOptions.push(`opacity=${this.opacite}`)
    }
    if (this.opaciteDeRemplissage !== 1) {
      tableauOptions.push(`fill opacity=${this.opaciteDeRemplissage}`)
    }
    if (this.couleurDeRemplissage !== '') {
      tableauOptions.push(`fill=${this.couleurDeRemplissage[1]}`)
    }
    let optionsDraw = []
    if (tableauOptions.length > 0) {
      optionsDraw = '[' + tableauOptions.join(',') + ']'
    }
    return `\n\t \\filldraw${optionsDraw} (${this.x},${this.y}) circle (${this.rayon});`
  }
}

export function plot (x, y, {
  rayon = 0.05,
  couleur = 'black',
  couleurDeRemplissage = 'black',
  opacite = 1,
  opaciteDeRemplissage = 1
} = {}) {
  return new Plot(arrondi(x), arrondi(y), { rayon, couleur, couleurDeRemplissage, opacite, opaciteDeRemplissage })
}

/**
 * tracePoint(A) // Place une croix à l'emplacement du point A
 * tracePoint(A,B,C,D) // Place une croix pour les différents points
 * tracePoint(A,B,C,D,'blue') // Place une croix pour les différents points
 * Après coup, on peut notamment changer l'épaissseur, le style et l'opacité du point par :
 * pt = tracePoint(A)
 * pt.epaisseur = 5 (par défaut : 1)
 * pt.opacite = 0.2 (par défaut : 0.8 = 80%)
 * pt.style = '#' (choix parmi 'x','o','#','|','+','.' et par défaut : 'x')
 * @author Rémi Angot et Jean-Claude Lhote
 */
export function TracePoint (...points) {
  ObjetMathalea2D.call(this, {})
  this.taille = 3
  this.tailleTikz = this.taille / 30
  this.epaisseur = 1
  this.opacite = 0.8
  this.style = 'x'
  let xmin = 1000
  let xmax = -1000
  let ymin = 1000
  let ymax = -1000
  let lePoint
  if (typeof points[points.length - 1] === 'string') {
    this.color = colorToLatexOrHTML(points[points.length - 1])
    points.length--
  } else this.color = colorToLatexOrHTML('black')
  for (const unPoint of points) {
    if (unPoint.typeObjet !== 'point3d' && unPoint.typeObjet !== 'point') window.notify('TracePoint : argument invalide', { ...points })
    lePoint = unPoint.typeObjet === 'point' ? unPoint : unPoint.c2d
    xmin = Math.min(xmin, lePoint.x - this.taille / context.pixelsParCm)
    xmax = Math.max(xmax, lePoint.x + this.taille / context.pixelsParCm)
    ymin = Math.min(ymin, lePoint.y - this.taille / context.pixelsParCm)
    ymax = Math.max(ymax, lePoint.y + this.taille / context.pixelsParCm)
  }
  this.bordures = [xmin, ymin, xmax, ymax]
  this.svg = function (coeff) {
    const objetssvg = []
    let s1
    let s2
    let p1
    let p2
    let c, A
    for (const unPoint of points) {
      if (unPoint.typeObjet === 'point3d') {
        A = unPoint.c2d
      } else {
        A = unPoint
      }
      if (A.constructor === Point) {
        if (this.style === 'x') {
          s1 = segment(point(A.x - this.taille / coeff, A.y + this.taille / coeff),
            point(A.x + this.taille / coeff, A.y - this.taille / coeff), this.color[0])
          s2 = segment(point(A.x - this.taille / coeff, A.y - this.taille / coeff),
            point(A.x + this.taille / coeff, A.y + this.taille / coeff), this.color[0])
          s1.epaisseur = this.epaisseur
          s2.epaisseur = this.epaisseur
          s1.opacite = this.opacite
          s2.opacite = this.opacite
          objetssvg.push(s1, s2)
          s1.isVisible = false
          s2.isVisible = false
        } else if (this.style === 'o') {
          p1 = point(A.x, A.y)
          c = cercle(p1, this.taille / coeff, this.color[0])
          c.isVisible = false
          c.epaisseur = this.epaisseur
          c.opacite = this.opacite
          c.couleurDeRemplissage = this.color
          c.opaciteDeRemplissage = this.opacite / 2
          objetssvg.push(c)
        } else if (this.style === '#') {
          p1 = point(A.x - this.taille / coeff, A.y - this.taille / coeff)
          p2 = point(A.x + this.taille / coeff, A.y - this.taille / coeff)
          c = carre(p1, p2, this.color[0])
          c.isVisible = false
          c.epaisseur = this.epaisseur
          c.opacite = this.opacite
          c.couleurDeRemplissage = this.color[0]
          c.opaciteDeRemplissage = this.opacite / 2
          objetssvg.push(c)
        } else if (this.style === '+') {
          s1 = segment(point(A.x, A.y + this.taille / coeff),
            point(A.x, A.y - this.taille / coeff), this.color[0])
          s2 = segment(point(A.x - this.taille / coeff, A.y),
            point(A.x + this.taille / coeff, A.y), this.color[0])
          s1.epaisseur = this.epaisseur
          s2.epaisseur = this.epaisseur
          s1.opacite = this.opacite
          s2.opacite = this.opacite
          objetssvg.push(s1, s2)
        } else if (this.style === '|') {
          s1 = segment(point(A.x, A.y + this.taille / coeff),
            point(A.x, A.y - this.taille / coeff), this.color[0])
          s1.epaisseur = this.epaisseur
          s1.opacite = this.opacite
          objetssvg.push(s1)
        } else if (this.style === '.') {
          s1 = plot(A.x, A.y, {
            couleur: this.color[0],
            rayon: this.epaisseur * 0.05,
            couleurDeRemplissage: this.color[0]
          })
          objetssvg.push(s1)
        }
      }
    }
    let code = ''
    for (const objet of objetssvg) {
      code += '\n\t' + objet.svg(coeff)
    }
    code = `<g id="${this.id}">` + code + '</g>'
    return code
  }
  this.tikz = function () {
    const objetstikz = []
    let s1
    let s2
    let p1
    let p2
    let c, A
    for (const unPoint of points) {
      if (unPoint.typeObjet === 'point3d') {
        A = unPoint.c2d
      } else {
        A = unPoint
      }
      if (A.constructor === Point) {
        if (this.style === 'x') {
          this.tailleTikz = this.taille / 16 // EE : Sinon, on ne voit pas la croix.
          s1 = segment(point(A.x - this.tailleTikz, A.y + this.tailleTikz),
            point(A.x + this.tailleTikz, A.y - this.tailleTikz), this.color[1])
          s2 = segment(point(A.x - this.tailleTikz, A.y - this.tailleTikz),
            point(A.x + this.tailleTikz, A.y + this.tailleTikz), this.color[1])
          s1.epaisseur = this.epaisseur / 1.6
          s2.epaisseur = this.epaisseur / 1.6
          s1.opacite = this.opacite
          s2.opacite = this.opacite
          objetstikz.push(s1, s2)
        } else if (this.style === 'o') {
          p1 = point(A.x, A.y)
          c = cercle(p1, this.tailleTikz, this.color[1])
          c.epaisseur = this.epaisseur
          c.opacite = this.opacite
          c.couleurDeRemplissage = this.color
          c.opaciteDeRemplissage = this.opacite / 2
          objetstikz.push(c)
        } else if (this.style === '#') {
          p1 = point(A.x - this.tailleTikz, A.y - this.tailleTikz)
          p2 = point(A.x + this.tailleTikz, A.y - this.tailleTikz)
          c = carre(p2, p1, this.color[1])
          c.epaisseur = this.epaisseur
          c.opacite = this.opacite
          c.couleurDeRemplissage = this.color
          c.opaciteDeRemplissage = this.opacite / 2
          objetstikz.push(c)
        } else if (this.style === '+') {
          s1 = segment(point(A.x, A.y + this.tailleTikz),
            point(A.x, A.y - this.tailleTikz), this.color[1])
          s2 = segment(point(A.x - this.tailleTikz, A.y),
            point(A.x + this.tailleTikz, A.y), this.color[1])
          s1.epaisseur = this.epaisseur
          s2.epaisseur = this.epaisseur
          s1.opacite = this.opacite
          s2.opacite = this.opacite
          objetstikz.push(s1, s2)
        } else if (this.style === '|') {
          s1 = segment(point(A.x, A.y + this.tailleTikz),
            point(A.x, A.y - this.tailleTikz), this.color[1])
          s1.epaisseur = this.epaisseur
          s1.opacite = this.opacite
          objetstikz.push(s1)
        } else if (this.style === '.') {
          s1 = plot(A.x, A.y, {
            couleur: this.color[0],
            rayon: this.epaisseur * 0.05,
            couleurDeRemplissage: this.color[0] // je mets la couleur html, car elle va être parsée par colorToLatexOrHtml à nouveau
          })
          objetstikz.push(s1)
        }
      }
    }
    let code = ''
    for (const objet of objetstikz) {
      code += '\n\t' + objet.tikz()
    }
    return code
  }
}

/**
 * @param  {Point} args Points précédemment créés. Si le dernier argument est une chaîne de caractère, définit la couleur des points tracés.
 * @return  {TracePoint} TracePoint
 * @example tracePoint(A,B,C,'red) // Trace les points A,B,C précédemment créés en rouge
 * @example tracePoint(A).style = '|' // Le style du point A sera '|' et non 'x' par défaut.
 * @example tracePoint(A).epaisseur = 5 // L'épaisseur du style du point sera 5 et non 1 par défaut.
 * @example tracePoint(A).opacite = 0.4 // L'opacité du style du point sera 40% et non 80%(0.8) par défaut.
 */
export function tracePoint (...args) {
  return new TracePoint(...args)
}

/**
 * P=tracePointSurDroite(A,d) //Ajoute un trait perpendiculaire à d supposée tracée marquant la posiion du point A
 * P=tracePointSurDroite(A,B) //Ajoute un trait perpendiculaire à la droite (AB) supposée tracée marquant la posiion du point A
 *
 * @author Rémi Angot et Jean-Claude Lhote
 */
export function TracePointSurDroite (A, O, color = 'black') {
  ObjetMathalea2D.call(this, {})
  this.color = color
  this.lieu = A
  this.taille = 0.2
  this.x = A.x
  this.y = A.y
  let M, d
  this.bordures = [A.x - 0.2, A.y - 0.2, A.x + 0.2, A.x + 0.2]

  if (O.constructor === Point) {
    if (longueur(this.lieu, O) < 0.001) {
      window.notify('TracePointSurDroite : points trop rapprochés pour définir une droite', {
        A,
        O
      })
    }
    M = pointSurSegment(this.lieu, O, 1)
    this.direction = rotation(M, this.lieu, 90)
  }
  if (O.constructor === Droite) {
    d = droiteParPointEtPerpendiculaire(this.lieu, O)
    d.isVisible = false
    this.direction = pointSurSegment(point(d.x1, d.y1), point(d.x2, d.y2), 1)
  }
  this.svg = function (coeff) {
    const A1 = pointSurSegment(this.lieu, this.direction, this.taille * 20 / coeff)
    const A2 = pointSurSegment(this.lieu, this.direction, -this.taille * 20 / coeff)
    const s = segment(A1, A2, this.color)
    this.id = s.id
    return s.svg(coeff)
  }
  this.tikz = function () {
    const A1 = pointSurSegment(this.lieu, this.direction, this.taille / context.scale)
    const A2 = pointSurSegment(this.lieu, this.direction, -this.taille / context.scale)
    const s = segment(A1, A2, this.color)
    return s.tikz()
  }
}

export function tracePointSurDroite (A, O, color = 'black') {
  return new TracePointSurDroite(A, O, color)
}

export function traceMilieuSegment (A, B) {
  return new TracePointSurDroite(milieu(A, B), droite(A, B))
}

/**
 * M = milieu(A,B) //M est le milieu de [AB]
 * M = milieu(A,B,'M') //M est le milieu [AB] et se nomme M
 * M = milieu(A,B,'M','below') //M est le milieu [AB], se nomme M et le nom est en dessous du point
 *
 * @author Rémi Angot
 */
export function milieu (A, B, nom, positionLabel = 'above') {
  if (isNaN(longueur(A, B))) window.notify('milieu : Quelque chose ne va pas avec les points', { A, B })
  const x = (A.x + B.x) / 2
  const y = (A.y + B.y) / 2
  return new Point(x, y, nom, positionLabel)
}

/**
 * M = pointSurSegment(A,B,l) //M est le point de [AB] à l cm de A
 * M = pointSurSegment(A,B,l,'M') //M est le point de [AB] à l cm de A et se nomme M
 * M = pointSurSegment(A,B,l,'M','below') //M est le point de [AB] à l cm de A, se nomme M et le nom est en dessous du point
 *
 * M = pointSurSegment(A,B,'h','M') // M est un point au hasard sur [AB] (on peut écrire n'importe quel texte à la place de 'h')
 * M = pointSurSegment(A,B) // M est un point au hasard sur [AB]
 * Sécurité ajoutée par Jean-Claude Lhote : si AB=0, alors on retourne A
 * @author Rémi Angot
 */
export function pointSurSegment (A, B, l, nom = '', positionLabel = 'above') {
  if (isNaN(longueur(A, B))) window.notify('pointSurSegment : Quelque chose ne va pas avec les points', { A, B })
  if (longueur(A, B) === 0) return A
  if (l === undefined || typeof l === 'string') {
    l = (longueur(A, B) * randint(15, 85)) / 100
  }
  return homothetie(B, A, l / longueur(A, B), nom, positionLabel)
}

/**
 *
 * @param {Cercle} c
 * @param {number} angle
 * @param {string} nom
 * @param {string} positionLabel
 * M = pointSurCercle(c,'','M') // M est un point choisi au hasard sur le cercle c et se nomme M.
 * N = pointSurCercle(c,90) // N est le point du cercle c situé à 90° par rapport à l'horizontale, donc au dessus du centre de c
 * P = pointSurCercle(c,-90) // P est le point du cercle c situé à l'opposé du point N précédent.
 * @author Jean-Claude Lhote
 */
export function pointSurCercle (c, angle, nom, positionLabel = 'above') {
  if (typeof angle !== 'number') angle = randint(-180, 180)
  const x = c.centre.x + c.rayon * Math.cos(radians(angle))
  const y = c.centre.y + c.rayon * Math.sin(radians(angle))
  return point(x, y, nom, positionLabel)
}

/**
 * Retourne un point sur la droite d dont l'abscisse est x. Si c'est impossible (droite verticale) alors ce sera le point dont l'ordonnée vaut x.
 * @param {Droite} d
 * @param {number} x Abscisse du point
 * @param {string} nom Nom du point
 * @param {string} [positionLabel='above'] Facultatif, 'above' par défaut.
 * @return {Point} Point de la droite d dont l'abscisse est x
 * @author Jean-Claude Lhote
 */
export function pointSurDroite (d, x, nom, positionLabel = 'above') {
  // si d est parallèle à l'axe des ordonnées, le paramètre x servira pour y.
  if (d.b === 0) return point(-d.c / d.a, x, nom, positionLabel)
  else if (d.a === 0) return point(x, -d.c / d.b, nom, positionLabel)
  else return point(x, (-d.c - d.a * x) / d.b, nom, positionLabel)
}

/**
 * Renvoie 'M' le point d'intersection des droites d1 et d2
 * @param {Droite} d
 * @param {Droite} f
 * @param {string} nom  le nom du point d'intersection. Facultatif, vide par défaut.
 * @param {string} [positionLabel='above'] Facultatif, 'above' par défaut.
 * @return {Point} Point 'M' d'intersection de d1 et de d2
 * @author Jean-Claude Lhote
 */
export function pointIntersectionDD (d, f, nom = '', positionLabel = 'above') {
  let x, y
  if (f.a * d.b - f.b * d.a === 0) {
    // Les droites sont parallèles, pas de point d'intersection
    return false
  } else {
    y = (f.c * d.a - d.c * f.a) / (f.a * d.b - f.b * d.a)
  }
  if (egal(d.a, 0, 0.01)) { // si d est horizontale alors f ne l'est pas donc f.a<>0
    x = (-f.c - f.b * y) / f.a
  } else { // d n'est pas horizontale donc ...
    x = (-d.c - d.b * y) / d.a
  }
  return point(x, y, nom, positionLabel)
}

/**
 * @example pointAdistance(A,d,angle,nom="",positionLabel="above") // Seuls le point A et la distance d sont obligatoires, angle peut être choisi : il s'agit de l'angle signé avec l'axe [OI) sinon, il est choisi aléatoirement.
 * @example p=pointAdistance(A,5,'M') // Place un point aléatoirement à 5 unités de A et lui donne le nom de 'M'.
 * @author Jean-Claude Lhote
 */
export function pointAdistance (...args) {
  const l = args.length
  const angle = randint(1, 360)
  const A = args[0]
  const B = point(A.x + 1, A.y)
  const d = args[1]
  if (l < 2) {
    return false
  }
  if (l === 2) {
    return similitude(B, A, angle, d)
  } else if (l === 3) {
    if (typeof (args[2]) === 'number') {
      return similitude(B, A, args[2], d)
    } else {
      return similitude(B, A, angle, d, args[2])
    }
  } else if (l === 4) {
    if (typeof (args[2]) === 'number') {
      return similitude(B, A, args[2], d, args[3])
    } else {
      return similitude(B, A, angle, d, args[2], args[3])
    }
  } else {
    return similitude(B, A, args[2], d, args[3], args[4])
  }
}

/**  Nomme les points passés en argument, le nombre d'arguments n'est pas limité.
 * @param  {...Point[]} points Points mis à la suite
 * @param {string} [color = 'black'] Couleur des points : du type 'blue' ou du type '#f15929'
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} color Couleur des points. À associer obligatoirement à colorToLatexOrHTML().
 * @property {number} taille Taille de la boite contenant le nom des points
 * @property {number} largeur Largeur de la boite contenant le nom des points
 * @property {number[]} bordures Coordonnées de la fenêtre d'affichage du genre [-2,-2,5,5]
 * @author Rémi Angot
 * @class
 */
// JSDOC Validee par EE Septembre 2022
export function LabelPoint (...points) {
  ObjetMathalea2D.call(this, {})
  if (!this.taille) this.taille = 10
  if (!this.largeur) this.largeur = 10
  if (typeof points[points.length - 1] === 'string') {
    this.color = colorToLatexOrHTML(points[points.length - 1])
    points.length--
  } else this.color = colorToLatexOrHTML('black')
  let xmin = 1000
  let xmax = -1000
  let ymin = 1000
  let ymax = -1000
  let lePoint
  for (const unPoint of points) {
    if (unPoint.typeObjet !== 'point3d' && unPoint.typeObjet !== 'point') window.notify('LabelPoint : argument invalide', { ...points })
    lePoint = unPoint.typeObjet === 'point' ? unPoint : unPoint.c2d
    xmin = Math.min(xmin, lePoint.x - ((lePoint.positionLabel.indexOf('left') + this.positionLabel.indexOf('left')) !== -2 ? 4 : 0)) // 4 à cause de 3G40
    xmax = Math.max(xmax, lePoint.x + ((lePoint.positionLabel.indexOf('right') + this.positionLabel.indexOf('right')) !== -2 ? 0 : 1))
    ymin = Math.min(ymin, lePoint.y - ((lePoint.positionLabel.indexOf('below') + this.positionLabel.indexOf('below')) !== -2 ? 0 : 1))
    ymax = Math.max(ymax, lePoint.y + ((lePoint.positionLabel.indexOf('above') + this.positionLabel.indexOf('above')) !== -2 ? 2 : 0))
  }
  this.bordures = [xmin, ymin, xmax, ymax]
  this.svg = function (coeff) {
    let code = ''
    let x
    let y, A
    if (Array.isArray(points[0])) {
      // Si le premier argument est un tableau
      this.listePoints = points[0]
    } else {
      this.listePoints = points
    }
    for (const unPoint of this.listePoints) {
      if (unPoint.typeObjet === 'point3d') {
        A = unPoint.c2d
      } else {
        A = unPoint
      }
      if (A.nom !== undefined) {
        x = A.x
        y = A.y
        if (this.positionLabel === '' && unPoint.typeObjet === 'point3d') A.positionLabel = this.positionLabel
        switch (A.positionLabel) {
          case 'left':
            code += texteParPosition(A.nom, x - 10 / coeff, y, 'milieu', this.color[0], this.taille / 10, 'middle', true).svg(coeff) + '\n'
            break
          case 'right':
            code += texteParPosition(A.nom, x + 10 / coeff, y, 'milieu', this.color[0], this.taille / 10, 'middle', true).svg(coeff) + '\n'
            break
          case 'below':
            code += texteParPosition(A.nom, x, y - 10 / coeff, 'milieu', this.color[0], this.taille / 10, 'middle', true).svg(coeff) + '\n'
            break
          case 'above':
            code += texteParPosition(A.nom, x, y + 10 / coeff, 'milieu', this.color[0], this.taille / 10, 'middle', true).svg(coeff) + '\n'
            break
          case 'above left':
            code += texteParPosition(A.nom, x - 10 / coeff, y + 10 / coeff, 'milieu', this.color[0], this.taille / 10, 'middle', true).svg(coeff) + '\n'
            break
          case 'above right':
            code += texteParPosition(A.nom, x + 10 / coeff, y + 10 / coeff, 'milieu', this.color[0], this.taille / 10, 'middle', true).svg(coeff) + '\n'
            break
          case 'below left':
            code += texteParPosition(A.nom, x - 10 / coeff, y - 10 / coeff, 'milieu', this.color[0], this.taille / 10, 'middle', true).svg(coeff) + '\n'
            break
          case 'below right':
            code += texteParPosition(A.nom, x + 10 / coeff, y - 10 / coeff, 'milieu', this.color[0], this.taille / 10, 'middle', true).svg(coeff) + '\n'
            break
          default:
            code += texteParPosition(A.nom, x, y, 'milieu', this.color[0], this.taille / 10, 'middle', true).svg(coeff) + '\n'
            break
        }
      }
    }

    code = `<g id="${this.id}">${code}</g>`
    return code
  }
  this.tikz = function () {
    let code = ''
    let A
    let style = ''
    if (this.color[0] !== 'black') {
      style = `,color=${this.color[1]}`
    }
    for (const unPoint of points) {
      if (unPoint.typeObjet === 'point3d') {
        A = unPoint.c2d
      } else {
        A = unPoint
      }

      code += A.nom === '' ? '' : `\t\\draw (${arrondi(A.x)},${arrondi(A.y)}) node[${A.positionLabel}${style}] {$${A.nom}$};\n`
    }
    return code
  }
}

/**  Nomme les points passés en argument, le nombre d'arguments n'est pas limité.
 * @param  {...any} args Points mis à la suite
 * @param {string} [color = 'black'] Couleur des points : du type 'blue' ou du type '#f15929'
 * @example labelPoint(A,B,C) // Retourne le nom des points A, B et C en noir
 * @example labelPoint(A,B,C,'red') // Retourne le nom des points A, B et C en rouge
 * @example labelPoint(A,B,C,'#f15929') // Retourne le nom des points A, B et C en orange (code couleur HTML : #f15929)
 * @author Rémi Angot
 * @return {LabelPoint}
 */
// JSDOC Validee par EE Septembre 2022
export function labelPoint (...args) {
  return new LabelPoint(...args)
}

/**
 * Associe à tous les points passés en paramètre, son label, défini préalablement en Latex. Par exemple, si besoin de nommer le point A_1.
 * @param {number} [distance=1.5] Taille de l'angle
 * @param {string} [label=''] Si vide, alors affiche la mesure de l'angle sinon affiche ce label.
 * @param {Object} parametres À saisir entre accolades
 * @param {Point|Point[]} [parametres.points = []] Point ou tableau de points
 * @param {string} [parametres.color = 'black'] Couleur du label : du type 'blue' ou du type '#f15929'
 * @param {number} [parametres.taille = 8] Taille du label
 * @param {number} [parametres.largeur = 10] Largeur en pixels du label à des fins de centrage
 * @param {number} [parametres.hauteur = 10] Hauteur en pixels du label à des fins de centrage
 * @param {string} [parametres.couleurDeRemplissage=''] Couleur de fond de ce label : du type 'blue' ou du type '#f15929'
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} color Couleur du label. À associer obligatoirement à colorToLatexOrHTML().
 * @property {number} taille Taille du label
 * @property {number} largeur Largeur en pixels du label à des fins de centrage
 * @property {number} hauteur Hauteur en pixels du label à des fins de centrage
 * @property {string} couleurDeRemplissage Couleur de fond de ce label. À associer obligatoirement à colorToLatexOrHTML().
 * @author Rémi Angot et Jean-Claude Lhote
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function LabelLatexPoint ({
  points = [],
  color = 'black',
  taille = 8,
  largeur = 10,
  hauteur = 10,
  couleurDeRemplissage = ''
} = {}) {
  ObjetMathalea2D.call(this, {})
  this.taille = taille
  this.largeur = largeur
  this.hauteur = hauteur
  this.couleurDeRemplissage = couleurDeRemplissage
  this.color = color

  const offset = 0.25 * Math.log10(this.taille) // context.pixelsParCm ne correspond pas forcément à la valeur utilisée par mathalea2d... cela peut entrainer un trés léger écart
  let x
  let y
  let A
  const objets = []
  if (Array.isArray(points[0])) {
    // Si le premier argument est un tableau
    this.listePoints = points[0]
  } else {
    this.listePoints = points
  }
  for (const unPoint of this.listePoints) {
    if (unPoint.typeObjet === 'point3d') {
      A = unPoint.c2d
    } else {
      A = unPoint
    }
    x = arrondi(A.x)
    y = arrondi(A.y)
    switch (A.positionLabel) {
      case 'left':
        objets.push(latexParCoordonnees(A.nom, x - offset, y, this.color, this.largeur, this.hauteur, this.couleurDeRemplissage, this.taille))
        break
      case 'right':
        objets.push(latexParCoordonnees(A.nom, x + offset, y, this.color, this.largeur, this.hauteur, this.couleurDeRemplissage, this.taille))
        break
      case 'below':
        objets.push(latexParCoordonnees(A.nom, x, y - offset, this.color, this.largeur, this.hauteur, this.couleurDeRemplissage, this.taille))
        break
      case 'above':
        objets.push(latexParCoordonnees(A.nom, x, y + offset, this.color, this.largeur, this.hauteur, this.couleurDeRemplissage, this.taille))
        break
      case 'above right':
        objets.push(latexParCoordonnees(A.nom, x + offset, y + offset, this.color, this.largeur, this.hauteur, this.couleurDeRemplissage, this.taille))
        break
      case 'below left':
        objets.push(latexParCoordonnees(A.nom, x - offset, y - offset, this.color, this.largeur, this.hauteur, this.couleurDeRemplissage, this.taille))
        break
      case 'below right':
        objets.push(latexParCoordonnees(A.nom, x + offset, y - offset, this.color, this.largeur, this.hauteur, this.couleurDeRemplissage, this.taille))
        break
      default:
        objets.push(latexParCoordonnees(A.nom, x - offset, y + offset, this.color, this.largeur, this.hauteur, this.couleurDeRemplissage, this.taille))
        break
    }
  }

  this.svg = function (coeff) {
    let code = ''
    for (const objet of objets) {
      code += objet.svg(coeff) + '\n'
    }
    code = `<g id="${this.id}">${code}</g>`
    return code
  }
  this.tikz = function () {
    let code = ''
    for (const objet of objets) {
      code += objet.tikz() + '\n'
    }
    return code
  }
}

/**
 * Associe à tous les points passés en paramètre, son label, défini préalablement en Latex. Par exemple, si besoin de nommer le point A_1.
 * @param {number} [distance=1.5] Taille de l'angle
 * @param {string} [label=''] Si vide, alors affiche la mesure de l'angle sinon affiche ce label.
 * @param {Object} parametres À saisir entre accolades
 * @param {Point|Point[]} [parametres.points] Point ou tableau de points
 * @param {string} [parametres.color = 'black'] Couleur du label : du type 'blue' ou du type '#f15929'
 * @param {number} [parametres.taille = 8] Taille du label
 * @param {number} [parametres.largeur = 10] Largeur en pixels du label à des fins de centrage
 * @param {number} [parametres.hauteur = 10] Hauteur en pixels du label à des fins de centrage
 * @param {string} [parametres.couleurDeRemplissage=''] Couleur de fond de ce label : du type 'blue' ou du type '#f15929'
 * @author Rémi Angot et Jean-Claude Lhote
 * @return {LabelLatexPoint}
 */
// JSDOC Validee par EE Juin 2022
export function labelLatexPoint ({
  points,
  color = 'black',
  taille = 8,
  largeur = 10,
  hauteur = 10,
  background = ''
} = {}) {
  return new LabelLatexPoint({ points, color, taille, largeur, hauteur, background })
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%% LES DROITES %%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/**
 * d = droite(A,B) // La droite passant par A et B
 * d = droite(A,B,'(d)') // La droite passant par A et B se nommant (d)
 * d = droite(a,b,c,'(d)') // La droite définie par les coefficients de ax +by + c=0 (équation de la droite (a,b)!==(0,0))
 * d = droite(A,B,'(d)','blue') //La droite passant par A et B se nommant (d) et de couleur bleue
 *
 * @author Rémi Angot
 */

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%% LES DROITES REMARQUABLES %%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%% LES LIGNES BRISÉES %%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%% 3D EN PERSPECTIVE CAVALIERES %%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/**
 *
 * @param {int} Longueur
 * @param {int} largeur
 * @param {int} profondeur
 *
 */
export function Pave (L = 10, l = 5, h = 5, origine = point(0, 0), cote = true, angleDeFuite = 30, coefficientDeFuite = 0.5) {
  ObjetMathalea2D.call(this, {})
  const objets = []
  const A = origine
  const B = point(A.x + L, A.y)
  const C = point(B.x, B.y + l)
  const D = point(A.x, A.y + l)
  const p = polygone(A, B, C, D)
  const E = pointAdistance(A, h * coefficientDeFuite, angleDeFuite)
  const F = translation(B, vecteur(A, E))
  const G = translation(C, vecteur(A, E))
  const H = translation(D, vecteur(A, E))
  const sAE = segment(A, E)
  const sBF = segment(B, F)
  const sCG = segment(C, G)
  const sDH = segment(D, H)
  const sEF = segment(E, F)
  const sFG = segment(F, G)
  const sGH = segment(G, H)
  const sHE = segment(H, E)
  sAE.pointilles = 5
  sEF.pointilles = 5
  sHE.pointilles = 5

  objets.push(p, sAE, sBF, sCG, sDH, sEF, sFG, sGH, sHE)
  if (cote) {
    objets.push(afficheCoteSegment(segment(B, A), '', 1))
    objets.push(afficheCoteSegment(segment(A, D), '', 1))
    objets.push(afficheCoteSegment(segment(F, B), h + ' cm', 1))
  }
  this.svg = function (coeff) {
    let code = ''
    for (const objet of objets) {
      objet.color = this.color
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

export function pave (...args) {
  return new Pave(...args)
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%% LES VECTEURS %%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%% LES SEGMENTS %%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%% LES DEMI-DROITES %%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/*********************************************/
/** ***************Triangles ******************/

/*********************************************/

/*********************************************/
/** ************* Parallélogrammes ***********/

/**  Déplace les labels des sommets d'un polygone s'ils sont mal placés nativement
 * @param {Polygone} p Polygone sur lequel les labels de ses sommets sont mal placés
 * @param {string} nom Points mal placés sous la forme, par exemple, 'AB'. Chaque point doit être représenté par un SEUL caractère.
 * @param {string} positionLabel Les possibilités sont : 'left', 'right', 'below', 'above', 'above right', 'above left', 'below right', 'below left'. Si on se trompe dans l'orthographe, ce sera 'above left' et si on ne précise rien, pour un point ce sera 'above'.
 * @example deplaceLabel(p1,'MNP','below') // S'il y a des points nommés 'M', 'N' ou 'P' dans le polygone p1, leur nom sera mis en dessous du point.
 * // Ne fonctionne pas avec les points du type A1 ou A_1.
 * @author Rémi Angot
 */
// JSDOC Validee par EE Aout 2022
export function deplaceLabel (p, nom, positionLabel) {
  for (let i = 0; i < p.listePoints.length; i++) {
    for (const lettre in nom) {
      if (p.listePoints[i].nom === nom[lettre]) {
        p.listePoints[i].positionLabel = positionLabel
        labelPoint(p.listePoints[i])
      }
    }
  }
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%% LES CERCLES ET ARCS %%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/**
 * Construit le cercle (ou le disque) de centre O, de rayon r
 * @param {Point} O Centre du cercle
 * @param {number} r Rayon du cercle
 * @param {string} [color = 'black'] Couleur du cercle ou 'none' : du type 'blue' ou du type '#f15929'
 * @param {string} [couleurDeRemplissage = 'none'] Couleur de remplissage ou 'none' : du type 'blue' ou du type '#f15929'
 * @param {string} [couleurDesHachures = 'none'] Couleur des hachures ou 'none' : du type 'blue' ou du type '#f15929' Si 'none' ou '', pas de hachures.
 * @param {number} [epaisseur = 1] Epaisseur du cercle
 * @param {number} [pointilles = 0] Style des pointillés du cercle (entier entre 1 et 5). Si autre chose, pas de pointillés.
 * @param {number} [opacite = 1] Opacité du cercle
 * @param {number} [opaciteDeRemplissage = 1.1] Opacité du disque si couleur de remplissage choisie.
 * @param {number} [epaisseurDesHachures = 1] Epaisseur des hachures si couleur de hachures choisie.
 * @param {number} [distanceDesHachures = 10] Distance des hachures si couleur de remplissage choisie.
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} svgml Sortie, à main levée, au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} tikzml Sortie, à main levée, au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {Point} centre Centre du cercle
 * @property {number} rayon Rayon du cercle
 * @property {string} color Couleur du cercle ou 'none'. À associer obligatoirement à colorToLatexOrHTML().
 * @property {string} couleurDeRemplissage Couleur de remplissage ou 'none'. À associer obligatoirement à colorToLatexOrHTML().
 * @property {number} epaisseur Epaisseur du cercle
 * @property {number} pointilles Style des pointillés du cercle (entier entre 1 et 5). Si autre chose, pas de pointillés.
 * @property {number} opacite Opacité du cercle
 * @property {number} opaciteDeRemplissage Opacité du disque si couleur de remplissage choisie.
 * @property {string} hachures Hachures ou pas ?
 * @property {string} couleurDesHachures Couleur des hachures ou 'none'. À associer obligatoirement à colorToLatexOrHTML(). Si 'none' ou '', pas de hachures.
 * @property {number} epaisseurDesHachures Epaisseur des hachures si couleur de hachures choisie.
 * @property {number} distanceDesHachures Distance des hachures si couleur de remplissage choisie.
 * @property {number[]} bordures Coordonnées de la fenêtre d'affichage du genre [-2,-2,5,5]
 * @author Rémi Angot
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function Cercle (O, r, color = 'black', couleurDeRemplissage = 'none', couleurDesHachures = 'none', epaisseur = 1, pointilles = 0, opacite = 1, opaciteDeRemplissage = 1.1, epaisseurDesHachures = 1, distanceDesHachures = 10) {
  ObjetMathalea2D.call(this, {})
  this.color = colorToLatexOrHTML(color)
  this.centre = O
  this.rayon = r
  this.couleurDeRemplissage = colorToLatexOrHTML(couleurDeRemplissage)
  this.opaciteDeRemplissage = opaciteDeRemplissage
  this.hachures = couleurDesHachures !== 'none' && couleurDesHachures !== ''
  this.couleurDesHachures = colorToLatexOrHTML(couleurDesHachures)
  this.epaisseurDesHachures = epaisseurDesHachures
  this.distanceDesHachures = distanceDesHachures
  this.bordures = [O.x - r, O.y - r, O.x + r, O.y + r]
  this.epaisseur = epaisseur
  this.pointilles = pointilles
  this.opacite = opacite

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
        couleurDesHachures: this.couleurDesHachures[0],
        couleurDeRemplissage: this.couleurDeRemplissage[0],
        opaciteDeRemplissage: this.opaciteDeRemplissage
      }) + `<circle cx="${O.xSVG(coeff)}" cy="${O.ySVG(coeff)}" r="${r * coeff}" stroke="${this.color[0]}" ${this.style} id="${this.id}" fill="url(#pattern${this.id})" />`
    } else {
      if (this.opacite !== 1) {
        this.style += ` stroke-opacity="${this.opacite}" `
      }
      if (this.couleurDeRemplissage === '') {
        this.style += ' fill="none" '
      } else {
        this.style += ` fill="${this.couleurDeRemplissage[0]}" `
        this.style += ` fill-opacity="${this.opaciteDeRemplissage}" `
      }

      return `<circle cx="${O.xSVG(coeff)}" cy="${O.ySVG(coeff)}" r="${r * coeff
      }" stroke="${this.color[0]}" ${this.style} id="${this.id}" />`
    }
  }
  this.tikz = function () {
    let optionsDraw = []
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
    if (this.opaciteDeRemplissage !== 1) {
      tableauOptions.push(`fill opacity = ${this.opaciteDeRemplissage}`)
    }
    if (this.couleurDeRemplissage !== '' && this.couleurDeRemplissage[1] !== 'none') {
      tableauOptions.push(`preaction={fill,color = ${this.couleurDeRemplissage[1]}}`)
    }

    if (this.hachures) {
      tableauOptions.push(pattern({
        motif: this.hachures,
        id: this.id,
        distanceDesHachures: this.distanceDesHachures,
        epaisseurDesHachures: this.epaisseurDesHachures,
        couleurDesHachures: this.couleurDesHachures[1],
        couleurDeRemplissage: this.couleurDeRemplissage[1],
        opaciteDeRemplissage: this.opaciteDeRemplissage
      }))
    }

    if (tableauOptions.length > 0) {
      optionsDraw = '[' + tableauOptions.join(',') + ']'
    }
    return `\\draw${optionsDraw} (${O.x},${O.y}) circle (${r});`
  }
  this.svgml = function (coeff, amp) {
    this.style = ''
    if (this.epaisseur !== 1) {
      this.style += ` stroke-width="${this.epaisseur}" `
    }

    if (this.opacite !== 1) {
      this.style += ` stroke-opacity="${this.opacite}" `
    }
    this.style += ' fill="none" '
    let code = `<path d="M ${O.xSVG(coeff) + r * coeff} ${O.ySVG(coeff)} S ${O.xSVG(coeff) + r * coeff} ${O.ySVG(coeff)}, `
    let compteur = 1
    for (let k = 1, variation; k < 181; k++) {
      variation = (random(0, 2) - 1) * amp / 10
      code += `${O.xSVG(coeff) + round((r + variation) * Math.cos(2 * k * Math.PI / 180) * coeff, 2)} ${O.ySVG(coeff) + round((r + variation) * Math.sin(2 * k * Math.PI / 180) * coeff, 2)}, `
      compteur++
    }
    if (compteur % 2 === 0) code += ` ${O.xSVG(coeff) + r * coeff} ${O.ySVG(coeff)}, `
    code += ` ${O.xSVG(coeff) + r * coeff} ${O.ySVG(coeff)} Z" stroke="${this.color[0]}" ${this.style}"/>`
    return code
  }
  this.tikzml = function (amp) {
    let optionsDraw = []
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
    tableauOptions.push(`decorate,decoration={random steps , amplitude = ${amp}pt}`)
    optionsDraw = '[' + tableauOptions.join(',') + ']'

    const code = `\\draw${optionsDraw} (${O.x},${O.y}) circle (${r});`
    return code
  }
}

/**
 * Construit le cercle (ou le disque) de centre O, de rayon r
 * @param {Point} O Centre du cercle
 * @param {number} r Rayon du cercle
 * @param {string} [color = 'black'] Couleur du cercle ou 'none' : du type 'blue' ou du type '#f15929'
 * @param {string} [couleurDeRemplissage = 'none'] Couleur de remplissage ou 'none' : du type 'blue' ou du type '#f15929'
 * @param {string} [couleurDesHachures = 'none'] Couleur des hachures ou 'none' : du type 'blue' ou du type '#f15929' Si 'none' ou '', pas de hachures.
 * @param {number} [epaisseur = 1] Epaisseur du cercle
 * @param {number} [pointilles = 0] Style des pointillés du cercle (entier entre 1 et 5). Si autre chose, pas de pointillés.
 * @param {number} [opacite = 1] Opacité du cercle
 * @param {number} [opaciteDeRemplissage = 1.1] Opacité du disque si couleur de remplissage choisie.
 * @param {number} [epaisseurDesHachures = 1] Epaisseur des hachures si couleur de hachures choisie.
 * @param {number} [distanceDesHachures = 10] Distance des hachures si couleur de remplissage choisie.
 * @example cercle (A,5)
 * // Construit un cercle c1 noir de centre A et de rayon 5
 * @example cercle (A,5,'red','blue','#f15929',3,2,0.3,0.8)
 * // Construit un disque de centre A et de rayon 5, de bord rouge à 30 % d'opacité et en pointillés, rempli en bleu à 80 % d'opacité, et avec des hachures orange de 1 d'épaisseur et avec 10 d'écart entre deux hachures
 * @example cercle (A,5,'red','blue','#f15929',3,2,0.3,0.8,2,12)
 * // Construit un disque de centre A et de rayon 5, de bord rouge à 30 % d'opacité et en pointillés, rempli en bleu à 80 % d'opacité, et avec des hachures orange de 2 d'épaisseur et avec 12 d'écart entre deux hachures
 * @return {Cercle}
 * @author Rémi Angot
 */
// JSDOC Validee par EE Juin 2022
export function cercle (O, r, color = 'black', couleurDeRemplissage = 'none', couleurDesHachures = 'none', epaisseur = 1, pointilles = 0, opacite = 1, opaciteDeRemplissage = 1.1, epaisseurDesHachures = 1, distanceDesHachures = 10) {
  return new Cercle(O, r, color, couleurDeRemplissage, couleurDesHachures, epaisseur, pointilles, opacite, opaciteDeRemplissage, epaisseurDesHachures, distanceDesHachures)
}

/**  Trace l'ellipse de centre O et de rayon rx et ry (la construction, dite “par réduction d’ordonnée”, montre que l'ellipse est la transformée de Newton de 2 cercles concentriques)
 * @param {Point} O Centre de l'ellipse
 * @param {number} rx Premier rayon de l'ellipse
 * @param {number} ry Second rayon de l'ellipse
 * @param {string} [color = 'black'] Couleur de l'ellipse : du type 'blue' ou du type '#f15929'
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} svgml Sortie, à main levée, au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} tikzml Sortie, à main levée, au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {Point} centre Centre du cercle
 * @property {number} rx Premier rayon de l'ellipse
 * @property {number} ry Second rayon de l'ellipse
 * @property {string} color Couleur de l'ellipse. À associer obligatoirement à colorToLatexOrHTML().
 * @property {string} couleurDeRemplissage Couleur de remplissage. À associer obligatoirement à colorToLatexOrHTML().
 * @property {number} opaciteDeRemplissage Opacité de l'ellipse si couleur de remplissage choisie.
 * @property {number[]} bordures Coordonnées de la fenêtre d'affichage du genre [-2,-2,5,5]
 * @author Rémi Angot
 * @class
 */
// JSDOC Validee par EE Aout 2022
export function Ellipse (O, rx, ry, color = 'black') {
  ObjetMathalea2D.call(this, {})
  this.color = colorToLatexOrHTML(color)
  this.centre = O
  this.rx = rx
  this.ry = ry
  this.couleurDeRemplissage = colorToLatexOrHTML('none')
  this.opaciteDeRemplissage = 1
  this.bordures = [O.x - rx, O.y - ry, O.x + rx, O.y + ry]
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
    if (this.couleurDeRemplissage === '') {
      this.style += ' fill="none" '
    } else {
      this.style += ` fill="${this.couleurDeRemplissage[0]}" `
      this.style += ` fill-opacity="${this.opaciteDeRemplissage}" `
    }

    return `<ellipse cx="${O.xSVG(coeff)}" cy="${O.ySVG(coeff)}" rx="${rx * coeff}" ry="${ry * coeff}" stroke="${this.color[0]}" ${this.style} id="${this.id}" />`
  }
  this.tikz = function () {
    let optionsDraw = []
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
    if (this.opaciteDeRemplissage !== 1) {
      tableauOptions.push(`fill opacity = ${this.opaciteDeRemplissage}`)
    }
    if (this.couleurDeRemplissage !== '' && this.couleurDeRemplissage[1] !== 'none') {
      tableauOptions.push(`preaction={fill,color = ${this.couleurDeRemplissage[1]}}`)
    }
    if (tableauOptions.length > 0) {
      optionsDraw = '[' + tableauOptions.join(',') + ']'
    }
    return `\\draw${optionsDraw} (${O.x},${O.y}) ellipse (${rx}cm and ${ry}cm);`
  }
  this.svgml = function (coeff, amp) {
    if (this.epaisseur !== 1) {
      this.style += ` stroke-width="${this.epaisseur}" `
    }

    if (this.opacite !== 1) {
      this.style += ` stroke-opacity="${this.opacite}" `
    }

    let code = `<path d="M ${O.xSVG(coeff) + rx * coeff} ${O.ySVG(coeff)} C ${O.xSVG(coeff) + rx * coeff} ${O.ySVG(coeff)}, `
    let compteur = 1
    for (let k = 1, variation; k < 181; k++) {
      variation = (random(0, 2) - 1) * amp / 10
      code += `${O.xSVG(coeff) + round((rx + variation) * Math.cos(2 * k * Math.PI / 180) * coeff, 2)} ${O.ySVG(coeff) + round((ry + variation) * Math.sin(2 * k * Math.PI / 180) * coeff, 2)}, `
      compteur++
    }
    if (compteur % 2 === 0) code += ` ${O.xSVG(coeff) + rx * coeff} ${O.ySVG(coeff)}, `
    code += ` ${O.xSVG(coeff) + rx * coeff} ${O.ySVG(coeff)} Z" stroke="${this.color[0]}" ${this.style}"/>`
    return code
  }
  this.tikzml = function (amp) {
    let optionsDraw = []
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
    tableauOptions.push(`decorate,decoration={random steps , amplitude = ${amp}pt}`)
    optionsDraw = '[' + tableauOptions.join(',') + ']'

    const code = `\\draw${optionsDraw} (${O.x},${O.y}) ellipse (${rx}cm and ${ry}cm);`
    return code
  }
}

/**  Trace l'ellipse de centre O et de rayon rx et ry (la construction, dite “par réduction d’ordonnée”, montre que l'ellipse est la transformée de Newton de 2 cercles concentriques)
 * @param {Point} O Centre de l'ellipse
 * @param {number} rx Premier rayon de l'ellipse
 * @param {number} ry Second rayon de l'ellipse
 * @param {string} [color = 'black'] Couleur de l'ellipse : du type 'blue' ou du type '#f15929'
 * @example ellipse(M, 1, 3) // Trace, en noir, l'ellipse de centre M et de rayons 1 et 3
 * @example ellipse(M, 1, 3, 'red') // Trace, en rouge, l'ellipse de centre M et de rayons 1 et 3
 * @author Rémi Angot
 * @return {Ellipse}
 */
// JSDOC Validee par EE Aout 2022
export function ellipse (O, rx, ry, color = 'black') {
  return new Ellipse(O, rx, ry, color)
}

/**
 * @param {Droite} d la droite qui intecepte (ou pas le cercle)
 * @param {Cercle} C le cercle
 * @param {string} nom le nom du point d'intersection
 * @param {entier} n 1 pour le premier point, 2 sinon. Si il n'y a qu'un seul point d'intesection, l'un ou l'autre renvoie ce point.
 * @example I = pointItersectionLC(d,c,'I',1) // I est le premier point d'intersection si il existe de la droite (d) et du cercle (c)
 * @author Jean-Claude Lhote
 */
export function pointIntersectionLC (d, C, nom = '', n = 1) {
  const O = C.centre
  const r = C.rayon
  const a = d.a
  const b = d.b
  const c = d.c
  const xO = O.x
  const yO = O.y
  let Delta, delta, xi, yi, xiPrime, yiPrime
  if (egal(b, 0, 0.000001)) {
    // la droite est verticale
    xi = -c / a
    xiPrime = xi
    Delta = 4 * (-xO * xO - (c * c) / (a * a) - (2 * xO * c) / a + r * r)
    if (Delta < 0) return false
    else if (egal(Delta, 0)) {
      // un seul point d'intersection
      yi = yO + Math.sqrt(Delta) / 2
      yiPrime = yi
    } else {
      // deux points d'intersection
      yi = yO - Math.sqrt(Delta) / 2
      yiPrime = yO + Math.sqrt(Delta) / 2
    }
  } else if (egal(a, 0, 0.0000001)) {
    // la droite est horizontale
    yi = -c / b
    yiPrime = yi
    Delta = 4 * (-yO * yO - (c * c) / (b * b) - (2 * yO * c) / b + r * r)
    if (Delta < 0) return false
    else if (egal(Delta, 0)) {
      // un seul point d'intersection
      xi = xO + Math.sqrt(Delta) / 2
      xiPrime = xi
    } else {
      // deux points d'intersection
      xi = xO - Math.sqrt(Delta) / 2
      xiPrime = xO + Math.sqrt(Delta) / 2
    }
  } else {
    // cas général
    Delta = (2 * ((a * c) / (b * b) + (yO * a) / b - xO)) ** 2 - 4 * (1 + (a / b) ** 2) * (xO * xO + yO * yO + (c / b) ** 2 + (2 * yO * c) / b - r * r)
    if (Delta < 0) return false
    else if (egal(Delta, 0)) {
      // un seul point d'intersection
      delta = Math.sqrt(Delta)
      xi = (-2 * ((a * c) / (b * b) + (yO * a) / b - xO) - delta) / (2 * (1 + (a / b) ** 2))
      xiPrime = xi
      yi = (-a * xi - c) / b
      yiPrime = yi
    } else {
      // deux points d'intersection
      delta = Math.sqrt(Delta)
      xi = (-2 * ((a * c) / (b * b) + (yO * a) / b - xO) - delta) / (2 * (1 + (a / b) ** 2))
      xiPrime = (-2 * ((a * c) / (b * b) + (yO * a) / b - xO) + delta) / (2 * (1 + (a / b) ** 2))
      yi = (-a * xi - c) / b
      yiPrime = (-a * xiPrime - c) / b
    }
  }
  if (n === 1) {
    if (yiPrime > yi) {
      return point(xiPrime, yiPrime, nom)
    } else {
      return point(xi, yi, nom)
    }
  } else {
    if (yiPrime > yi) {
      return point(xi, yi, nom)
    } else {
      return point(xiPrime, yiPrime, nom)
    }
  }
}

/**
 * M = pointIntersectionCC(c1,c2,'M') // M est le point d'intersection le plus haut des cercles c1 et c2
 * M = pointIntersectionCC(c1,c2,'M',2) // M est le point d'intersection le plus bas des cercles c1 et c2
 * La fonction ne renvoie rien si les cercles n'ont pas de points d'intersection
 * @author Rémi Angot
 * @Source https://stackoverflow.com/questions/12219802/a-javascript-function-that-returns-the-x-y-points-of-intersection-between-two-ci
 */
export function pointIntersectionCC (c1, c2, nom = '', n = 1) {
  const O1 = c1.centre
  const O2 = c2.centre
  const r0 = c1.rayon
  const r1 = c2.rayon
  const x0 = O1.x
  const x1 = O2.x
  const y0 = O1.y
  const y1 = O2.y
  const dx = x1 - x0
  const dy = y1 - y0
  const d = Math.sqrt(dy * dy + dx * dx)
  if (d > r0 + r1) {
    return false
  }
  if (d < Math.abs(r0 - r1)) {
    return false
  }
  const a = (r0 * r0 - r1 * r1 + d * d) / (2.0 * d)
  const x2 = x0 + (dx * a) / d
  const y2 = y0 + (dy * a) / d
  const h = Math.sqrt(r0 * r0 - a * a)
  const rx = -dy * (h / d)
  const ry = dx * (h / d)
  const xi = x2 + rx
  const xiPrime = x2 - rx
  const yi = y2 + ry
  const yiPrime = y2 - ry
  if (n === 1) {
    if (yiPrime > yi) {
      return point(xiPrime, yiPrime, nom)
    } else {
      return point(xi, yi, nom)
    }
  } else {
    if (yiPrime > yi) {
      return point(xi, yi, nom)
    } else {
      return point(xiPrime, yiPrime, nom)
    }
  }
}

/**
 * Construit le cercle (ou le disque) de centre O, passant par M
 * @param {Point} O Centre du cercle
 * @param {number} M Point du cercle
 * @param {string} [color = 'black'] Couleur du cercle ou 'none' : du type 'blue' ou du type '#f15929'
 * @param {string} [couleurDeRemplissage = 'none'] Couleur de remplissage ou 'none' : du type 'blue' ou du type '#f15929'
 * @param {string} [couleurDesHachures = 'none'] Couleur des hachures ou 'none' : du type 'blue' ou du type '#f15929' Si 'none' ou '', pas de hachures.
 * @param {number} [epaisseur = 1] Epaisseur du cercle
 * @param {number} [pointilles = 0] Style des pointillés du cercle (entier entre 1 et 5). Si autre chose, pas de pointillés.
 * @param {number} [opacite = 1] Opacité du cercle
 * @param {number} [opaciteDeRemplissage = 1.1] Opacité du disque si couleur de remplissage choisie.
 * @param {number} [epaisseurDesHachures = 1] Epaisseur des hachures si couleur de hachures choisie.
 * @param {number} [distanceDesHachures = 10] Distance des hachures si couleur de remplissage choisie.
 * @example cercleCentrePoint (A,B)
 * // Construit un cercle c1 noir de centre A, passant par B
 * @example cercleCentrePoint (A,B,'red','blue','#f15929',3,2,0.3,0.8)
 * // Construit un disque de centre A, passant par B, de bord rouge à 30 % d'opacité et en pointillés, rempli en bleu à 80 % d'opacité, et avec des hachures orange de 1 d'épaisseur et avec 10 d'écart entre deux hachures
 * @example cercleCentrePoint (A,B,'red','blue','#f15929',3,2,0.3,0.8,2,12)
 * // Construit un disque de centre A, passant par B, de bord rouge à 30 % d'opacité et en pointillés, rempli en bleu à 80 % d'opacité, et avec des hachures orange de 2 d'épaisseur et avec 12 d'écart entre deux hachures
 * @return {Cercle}
 * @author Rémi Angot
 */
// JSDOC Validee par EE Juin 2022
export function cercleCentrePoint (O, M, color = 'black', couleurDeRemplissage = 'none', couleurDesHachures = 'none', epaisseur = 1, pointilles = 0, opacite = 1, opaciteDeRemplissage = 1.1, epaisseurDesHachures = 1, distanceDesHachures = 10) {
  return new Cercle(O, longueur(O, M), color, couleurDeRemplissage, couleurDesHachures, epaisseur, pointilles, opacite, opaciteDeRemplissage, epaisseurDesHachures, distanceDesHachures)
}

/** Trace un arc de cercle, connaissant une extrémité, son centre et la mesure de l'angle
 * @param {Point} M Extrémité de départ de l'arc
 * @param {Point} Omega Centre de l'arc
 * @param {number|Point} angle Mesure de l'angle compris entre -360 et 360 (valeur négative = sens indirect) ou bien point formant un angle avec M et Omega.
 * @param {boolean} [rayon = false] Si true, les rayons délimitant l'arc sont ajoutés.
 * @param {string} [couleurDeRemplissage = 'none'] Couleur ou 'none' : du type 'blue' ou du type '#f15929'
 * @param {string} [color = 'black'] Couleur de l'arc ou 'none' : du type 'blue' ou du type '#f15929'
 * @param {number} [opaciteDeRemplissage = 0.2] Opacité de remplissage de 0 à 1.
 * @param {string} [couleurDesHachures = 'none'] Couleur des hachures ou 'none' : du type 'blue' ou du type '#f15929' Si 'none', pas de hachures.
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} svgml Sortie, à main levée, au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} tikzml Sortie, à main levée, au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} color Couleur de l'arc ou 'none'. À associer obligatoirement à colorToLatexOrHTML().
 * @property {string} couleurDeRemplissage Couleur ou 'none'. À associer obligatoirement à colorToLatexOrHTML().
 * @property {number} opaciteDeRemplissage Opacité de remplissage de 0 à 1.
 * @property {string} hachures Hachures ou pas ?
 * @property {string} couleurDesHachures Couleur des hachures ou 'none'. À associer obligatoirement à colorToLatexOrHTML(). Si 'none' ou '', pas de hachures.
 * @property {number} [opacite = 1] Opacité du cercle de 0 à 1.
 * @property {number} [epaisseurDesHachures = 1] Epaisseur des hachures si couleur de hachures choisie.
 * @property {number} [distanceDesHachures = 10] Distance des hachures si couleur de remplissage choisie.
 * @property {number} [pointilles = 0] Type de pointillés choisis (entre 1 et 5). Si autre nombre, pas de pointillés.
 * @property {number[]} bordures Coordonnées de la fenêtre d'affichage du genre [-2,-2,5,5]
 * @author Jean-Claude Lhote
 * @class
 **/
// JSDOC Validee par EE Juin 2022
export function Arc (M, Omega, angle, rayon = false, couleurDeRemplissage = 'none', color = 'black', opaciteDeRemplissage = 0.2, couleurDesHachures = 'none') {
  ObjetMathalea2D.call(this, {})
  this.color = colorToLatexOrHTML(color)
  this.couleurDeRemplissage = colorToLatexOrHTML(couleurDeRemplissage)
  this.opaciteDeRemplissage = opaciteDeRemplissage
  this.opacite = 1
  this.hachures = couleurDesHachures !== 'none' && couleurDesHachures !== ''
  this.couleurDesHachures = colorToLatexOrHTML(couleurDesHachures)
  this.epaisseurDesHachures = 1
  this.distanceDesHachures = 10
  this.pointilles = 0
  const med = rotation(M, Omega, angle / 2)
  if (typeof (angle) !== 'number') {
    angle = angleOriente(M, Omega, angle)
  }
  const l = longueur(Omega, M)
  let large = 0
  let sweep = 0
  const A = point(Omega.x + 1, Omega.y)
  const azimut = angleOriente(A, Omega, M)
  const anglefin = azimut + angle
  const angleSVG = angleModulo(angle)
  if (angle > 180) {
    sweep = 0 // option pour path : permet de savoir quel morceau de cercle tracé parmi les 2 possibles. Voir https://developer.mozilla.org/fr/docs/Web/SVG/Tutorial/Paths pour plus de détails
    large = 1 // option pour path : permet de savoir sur un morceau de cercle choisi, quel parcours prendre.
  } else if (angle < -180) {
    large = 1
    sweep = 1
  } else {
    large = 0
    sweep = 1 - (angle > 0)
  }
  const N = rotation(M, Omega, angleSVG)
  this.bordures = [Math.min(M.x, N.x, med.x) - 0.1, Math.min(M.y, N.y, med.y) - 0.1, Math.max(M.x, N.x, med.x) + 0.1, Math.max(M.y, N.y, med.y) + 0.1]
  if (rayon) {
    this.svg = function (coeff) {
      this.style = ''
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
          couleurDesHachures: this.couleurDesHachures[0],
          couleurDeRemplissage: this.couleurDeRemplissage[0],
          opaciteDeRemplissage: this.opaciteDeRemplissage
        }) + `<path d="M${M.xSVG(coeff)} ${M.ySVG(coeff)} A ${l * coeff} ${l * coeff} 0 ${large} ${sweep} ${N.xSVG(coeff)} ${N.ySVG(coeff)} L ${Omega.xSVG(coeff)} ${Omega.ySVG(coeff)} Z" stroke="${this.color[0]}"  ${this.style} id="${this.id}" fill="url(#pattern${this.id})" />`
      } else {
        if (this.opacite !== 1) {
          this.style += ` stroke-opacity="${this.opacite}" `
        }
        if (this.couleurDeRemplissage === '' || this.couleurDeRemplissage === undefined) {
          this.style += ' fill="none" '
        } else {
          this.style += ` fill="${this.couleurDeRemplissage[0]}" `
          this.style += ` fill-opacity="${this.opaciteDeRemplissage}" `
        }
        return `<path d="M${M.xSVG(coeff)} ${M.ySVG(coeff)} A ${l * coeff} ${l * coeff} 0 ${large} ${sweep} ${N.xSVG(coeff)} ${N.ySVG(coeff)} L ${Omega.xSVG(coeff)} ${Omega.ySVG(coeff)} Z" stroke="${this.color[0]}" ${this.style}/>`
      }
    }
  } else {
    this.svg = function (coeff) {
      this.style = ''
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
      if (this.couleurDeRemplissage === '' || this.couleurDeRemplissage === undefined) {
        this.style += ' fill="none" '
      } else {
        this.style += ` fill="${this.couleurDeRemplissage[0]}" `
        this.style += ` fill-opacity="${this.opaciteDeRemplissage}" `
      }
      return `<path d="M${M.xSVG(coeff)} ${M.ySVG(coeff)} A ${l * coeff} ${l * coeff} 0 ${large} ${sweep} ${N.xSVG(coeff)} ${N.ySVG(coeff)}" stroke="${this.color[0]}" ${this.style} id="${this.id}" />`
    }
  }
  this.tikz = function () {
    let optionsDraw = []
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
    if (rayon && (this.couleurDeRemplissage[1] !== 'none' && this.couleurDeRemplissage !== '')) {
      tableauOptions.push(`preaction={fill,color = ${this.couleurDeRemplissage[1]},opacity = ${this.opaciteDeRemplissage}}`)
    }

    if (this.hachures) {
      tableauOptions.push(pattern({
        motif: this.hachures,
        id: this.id,
        distanceDesHachures: this.distanceDesHachures,
        couleurDesHachures: this.couleurDesHachures[1],
        couleurDeRemplissage: this.couleurDeRemplissage[1],
        opaciteDeRemplissage: this.opaciteDeRemplissage
      }))
    }
    if (tableauOptions.length > 0) {
      optionsDraw = '[' + tableauOptions.join(',') + ']'
    }
    if (rayon) return `\\draw  ${optionsDraw} (${N.x},${N.y}) -- (${Omega.x},${Omega.y}) -- (${M.x},${M.y}) arc (${azimut}:${anglefin}:${longueur(Omega, M)}) ;`
    else return `\\draw${optionsDraw} (${M.x},${M.y}) arc (${azimut}:${anglefin}:${longueur(Omega, M)}) ;`
  }
  let code, P

  this.svgml = function (coeff, amp) {
    this.style = ''
    if (this.epaisseur !== 1) {
      this.style += ` stroke-width="${this.epaisseur}" `
    }
    if (this.opacite !== 1) {
      this.style += ` stroke-opacity="${this.opacite}" `
    }
    this.style += ' fill="none" '
    code = `<path d="M${M.xSVG(coeff)} ${M.ySVG(coeff)} S ${M.xSVG(coeff)} ${M.ySVG(coeff)}, `
    let compteur = 1
    const r = longueur(Omega, M)
    for (let k = 0, variation; abs(k) <= abs(angle) - 2; k += angle < 0 ? -2 : 2) {
      variation = (random(0, 2) - 1) / r * amp / 10
      P = rotation(homothetie(M, Omega, 1 + variation), Omega, k)
      code += `${round(P.xSVG(coeff), 2)} ${round(P.ySVG(coeff), 2)}, `
      compteur++
    }
    P = rotation(M, Omega, angle)
    if (compteur % 2 === 0) code += `${P.xSVG(coeff)} ${P.ySVG(coeff)}, ` // Parce qu'on utilise S et non C dans le path
    code += `${P.xSVG(coeff)} ${P.ySVG(coeff)}`
    code += `" stroke="${color}" ${this.style}/>`
    return code
  }

  this.tikzml = function (amp) {
    let optionsDraw = []
    const tableauOptions = []
    const A = point(Omega.x + 1, Omega.y)
    const azimut = arrondi(angleOriente(A, Omega, M), 1)
    const anglefin = arrondi(azimut + angle, 1)
    if (this.color[1].length > 1 && this.color[1] !== 'black') {
      tableauOptions.push(`color=${this.color[1]}`)
    }
    if (this.epaisseur !== 1) {
      tableauOptions.push(`line width = ${this.epaisseur}`)
    }
    if (this.opacite !== 1) {
      tableauOptions.push(`opacity = ${this.opacite}`)
    }
    tableauOptions.push(`decorate,decoration={random steps , amplitude = ${amp}pt}`)

    optionsDraw = '[' + tableauOptions.join(',') + ']'

    return `\\draw${optionsDraw} (${M.x},${M.y}) arc (${azimut}:${anglefin}:${arrondi(longueur(Omega, M), 2)}) ;`
  }
}

/** Trace un arc de cercle, connaissant une extrémité, son centre et la mesure de l'angle
 * @param {Point} M Extrémité de départ de l'arc
 * @param {Point} Omega Centre de l'arc
 * @param {number} angle Mesure de l'angle compris entre -360 et 360 (valeur négative = sens indirect)
 * @param {boolean} [rayon = false] Booléen. Si true, les rayons délimitant l'arc sont ajoutés.
 * @param {string} [couleurDeRemplissage = 'none'] Couleur ou 'none' : du type 'blue' ou du type '#f15929'
 * @param {string} [color = 'black'] Couleur de l'arc ou 'none' : du type 'blue' ou du type '#f15929'
 * @param {number} [opaciteDeRemplissage = 0.2] Opacité de remplissage de 0 à 1.
 * @param {string} [couleurDesHachures = 'none'] Couleur des hachures ou 'none' : du type 'blue' ou du type '#f15929' Si 'none', pas de hachures.
 * @example arc(M,O,35)
 // Trace l'arc en noir de centre O, d'extrémité M et d'angle orienté 35° (sans remplissage et sans hachures)
 * @example arc(M,O,true,-40,'red','green',0.8,'white')
 // Trace l'arc en vert de centre O, d'extrémité M et d'angle orienté -40°, rempli en rouge à 80 %, avec des hachures blanches
 * @return {Arc}
 * @author Jean-Claude Lhote
 */
// JSDOC Validee par EE Juin 2022
export function arc (M, Omega, angle, rayon = false, couleurDeRemplissage = 'none', color = 'black', opaciteDeRemplissage = 0.2, couleurDesHachures = 'none') {
  return new Arc(M, Omega, angle, rayon, couleurDeRemplissage, color, opaciteDeRemplissage, couleurDesHachures)
}

/** Trace un arc de cercle, connaissant deux extrémités et la mesure de l'angle
 * @param {Point} M Première extrémité de l'arc
 * @param {Point} N Deuxième extrémité de l'arc
 * @param {number} angle Mesure de l'angle compris entre -360 et 360 (valeur négative = sens indirect)
 * @param {boolean} [rayon = false] Booléen. Si true, les rayons délimitant l'arc sont ajoutés.
 * @param {boolean} [couleurDeRemplissage = 'none'] Couleur ou 'none' : du type 'blue' ou du type '#f15929'
 * @param {string} [color = 'black'] Couleur de l'arc ou 'none' : du type 'blue' ou du type '#f15929'
 * @param {number} [opaciteDeRemplissage = 0.2] Opacité de remplissage de 0 à 1.
 * @param {string} [couleurDesHachures = 'none'] Couleur des hachures ou 'none' : du type 'blue' ou du type '#f15929' Si 'none', pas de hachures.
 * @example arcPointPointAngle(A,B,35)
 // Trace l'arc en noir d'extrémités A et B (dans cet ordre) et d'angle orienté 35° (sans remplissage et sans hachures)
 * @example arcPointPointAngle(A,B,true,-40,'red','green',0.8,'white')
 // Trace l'arc en vert d'extrémités A et B (dans cet ordre) et d'angle orienté -40°, rempli en rouge à 80 %, avec des hachures blanches
 * @return {Arc}
 * @author Jean-Claude Lhote
 */
// JSDOC Validee par EE Juin 2022
export function arcPointPointAngle (M, N, angle, rayon = false, couleurDeRemplissage = 'none', color = 'black', opaciteDeRemplissage = 0.2, couleurDesHachures = 'none') {
  let anglerot
  if (angle < 0) anglerot = (angle + 180) / 2
  else anglerot = (angle - 180) / 2
  const d = mediatrice(M, N)
  d.isVisible = false
  const e = droite(N, M)
  e.isVisible = false
  const f = rotation(e, N, anglerot)
  f.isVisible = false
  const determinant = d.a * f.b - f.a * d.b
  const Omegax = (d.b * f.c - f.b * d.c) / determinant
  const Omegay = (f.a * d.c - d.a * f.c) / determinant
  const Omega = point(Omegax, Omegay)
  return new Arc(M, Omega, angle, rayon, couleurDeRemplissage, color, opaciteDeRemplissage, couleurDesHachures)
}

/**
 * m = traceCompas(O, A, 20) trace un arc de cercle de centre O qui commence 10° avant A et finit 10° après.
 *@author Jean-Claude Lhote
 */
export function traceCompas (
  O,
  A,
  angle = 20,
  color = 'gray',
  opacite = 1.1,
  epaisseur = 1,
  pointilles = ''
) {
  const B = rotation(A, O, -angle / 2)
  const a = arc(B, O, angle, false)
  a.epaisseur = epaisseur
  a.opacite = opacite
  a.color = colorToLatexOrHTML(color)
  a.pointilles = pointilles
  return a
}

/**
 * @param {Point} centre centre de l'ellipse
 * @param {number} Rx rayon en X
 * @param {number} Ry rayon en Y
 * @param {string} hemisphere 'nord' pour tracer au dessus du centre, 'sud' pour tracer en dessous
 * @param {boolean | number} pointilles Si false, l'ar est en trait plein, sinon en pointillés
 * @param {boolean} rayon Si true, alors l'arc est fermé par un segment.
 * @param {string} color Facultatif, 'black' par défaut
 * @param {string} couleurDeRemplissage si 'none' alors pas de remplissage.
 * @param {number} opaciteDeRemplissage Transparence de remplissage de 0 à 1. Facultatif, 0.2 par défaut
 * @author Jean-Claude Lhote
 * @return {SemiEllipse} Objet SemiEllipse
 */
export function SemiEllipse ({
  centre,
  Rx,
  Ry,
  hemisphere = 'nord',
  pointilles = false,
  rayon = false,
  couleurDeRemplissage = 'none',
  color = 'black',
  opaciteDeRemplissage = 0.2
}) {
  ObjetMathalea2D.call(this, {})
  this.color = colorToLatexOrHTML(color)
  this.couleurDeRemplissage = colorToLatexOrHTML(couleurDeRemplissage)
  this.opaciteDeRemplissage = opaciteDeRemplissage
  this.hachures = false
  this.couleurDesHachures = colorToLatexOrHTML('black')
  this.epaisseurDesHachures = 1
  this.distanceDesHachures = 10
  this.pointilles = pointilles
  const angle = hemisphere === 'nord' ? 180 : -180
  const M = point(centre.x + Rx, centre.y)
  const med = homothetie(rotation(M, centre, angle / 2), centre, Ry / Rx)

  let large = 0
  let sweep = 0
  if (angle > 180) {
    sweep = 0 // option pour path : permet de savoir quel morceau de cercle tracé parmi les 2 possibles. Voir https://developer.mozilla.org/fr/docs/Web/SVG/Tutorial/Paths pour plus de détails
    large = 1 // option pour path : permet de savoir sur un morceau de cercle choisi, quel parcours prendre.
  } else if (angle < -180) {
    large = 1
    sweep = 1
  } else {
    large = 0
    sweep = 1 - (angle > 0)
  }
  const N = rotation(M, centre, angle)
  this.bordures = [Math.min(M.x, N.x, med.x) - 0.1, Math.min(M.y, N.y, med.y) - 0.1, Math.max(M.x, N.x, med.x) + 0.1, Math.max(M.y, N.y, med.y) + 0.1]
  if (rayon) {
    this.svg = function (coeff) {
      this.style = ''
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
          couleurDesHachures: this.couleurDesHachures[0],
          couleurDeRemplissage: this.couleurDeRemplissage[0],
          opaciteDeRemplissage: this.opaciteDeRemplissage
        }) + `<path d="M${M.xSVG(coeff)} ${M.ySVG(coeff)} A ${Rx * coeff} ${Ry * coeff} 0 ${large} ${sweep} ${N.xSVG(coeff)} ${N.ySVG(coeff)} L ${centre.xSVG(coeff)} ${centre.ySVG(coeff)} Z" stroke="${this.color[0]}"  ${this.style} id="${this.id}" fill="url(#pattern${this.id})" />`
      } else {
        if (this.opacite !== 1) {
          this.style += ` stroke-opacity="${this.opacite}" `
        }
        if (this.couleurDeRemplissage !== 'none') {
          this.style += ` fill-opacity="${this.opaciteDeRemplissage}" `
        }

        return `<path d="M${M.xSVG(coeff)} ${M.ySVG(coeff)} A ${Rx * coeff} ${Ry * coeff} 0 ${large} ${sweep} ${N.xSVG(coeff)} ${N.ySVG(coeff)} L ${centre.xSVG(coeff)} ${centre.ySVG(coeff)} Z" stroke="${this.color[0]}" fill="${this.couleurDeRemplissage[0]}" ${this.style}/>`
      }
    }
  } else {
    this.svg = function (coeff) {
      this.style = ''
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
      this.style += ` fill-opacity="${this.opaciteDeRemplissage}" `

      return `<path d="M${M.xSVG(coeff)} ${M.ySVG(coeff)} A ${Rx * coeff} ${Ry * coeff} 0 ${large} ${sweep} ${N.xSVG(coeff)} ${N.ySVG(coeff)}" stroke="${this.color[0]}" fill="${this.couleurDeRemplissage[0]}" ${this.style} id="${this.id}" />`
    }
  }
  this.tikz = function () {
    let optionsDraw = []
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

    if ((this.couleurDeRemplissage !== 'none' || this.couleurDeRemplissage !== '')) {
      tableauOptions.push(`fill opacity = ${this.opaciteDeRemplissage}`)
      tableauOptions.push(`fill = ${this.couleurDeRemplissage[1]}`)
    }

    if (this.hachures) {
      tableauOptions.push(pattern({
        motif: this.hachures,
        id: this.id,
        distanceDesHachures: this.distanceDesHachures,
        couleurDesHachures: this.couleurDesHachures[1],
        couleurDeRemplissage: this.couleurDeRemplissage[1],
        opaciteDeRemplissage: this.opaciteDeRemplissage
      }))
    }
    if (tableauOptions.length > 0) {
      optionsDraw = '[' + tableauOptions.join(',') + ']'
    }
    if (couleurDeRemplissage !== 'none') return `\\filldraw  ${optionsDraw} (${M.x},${M.y}) arc [start angle=0, end angle = ${angle}, x radius = ${Rx}, y radius = ${Ry}]; -- cycle ;`
    else return `\\draw${optionsDraw} (${M.x},${M.y}) arc [start angle=0, end angle = ${angle}, x radius = ${Rx}, y radius = ${Ry}];`
  }
  let code, P

  this.svgml = function (coeff, amp) {
    this.style = ''
    if (this.epaisseur !== 1) {
      this.style += ` stroke-width="${this.epaisseur}" `
    }
    if (this.opacite !== 1) {
      this.style += ` stroke-opacity="${this.opacite}" `
    }
    this.style += ' fill="none" '
    code = `<path d="M${M.xSVG(coeff)} ${M.ySVG(coeff)} S ${M.xSVG(coeff)} ${M.ySVG(coeff)}, `
    let compteur = 1
    const r = longueur(centre, M)
    for (let k = 0, variation; abs(k) <= abs(angle) - 2; k += angle < 0 ? -2 : 2) {
      variation = (random(0, 2) - 1) / r * amp / 10
      P = rotation(homothetie(M, centre, 1 + variation), centre, k)
      code += `${round(P.xSVG(coeff), 2)} ${round(P.ySVG(coeff), 2)}, `
      compteur++
    }
    P = rotation(M, centre, angle)
    if (compteur % 2 === 0) code += `${P.xSVG(coeff)} ${P.ySVG(coeff)}, ` // Parce qu'on utilise S et non C dans le path
    code += `${P.xSVG(coeff)} ${P.ySVG(coeff)}`
    code += `" stroke="${this.color[0]}" ${this.style}/>`
    return code
  }

  this.tikzml = function (amp) {
    let optionsDraw = []
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

    tableauOptions.push(`decorate,decoration={random steps , amplitude = ${amp}pt}`)

    optionsDraw = '[' + tableauOptions.join(',') + ']'
    if (this.couleurDeRemplissage[1] !== 'none') return `\\filldraw  ${optionsDraw} (${M.x},${M.y}) arc [start angle=0, end angle = ${angle}, x radius = ${Rx}, y radius = ${Ry}]; -- cycle ;`
    else return `\\draw${optionsDraw} (${M.x},${M.y}) arc [start angle=0, end angle = ${angle}, x radius = ${Rx}, y radius = ${Ry}];`
  }
}

/**
 * @param {Point} centre centre de l'ellipse
 * @param {number} Rx rayon en X
 * @param {number} Ry rayon en Y
 * @param {string} hemisphere 'nord' pour tracer au dessus du centre, 'sud' pour tracer en dessous
 * @param {boolean | number} pointilles Si false, l'ar est en trait plein, sinon en pointillés
 * @param {boolean} rayon Si true, alors l'arc est fermé par un segment.
 * @param {string} color Facultatif, 'black' par défaut
 * @param {string} couleurDeRemplissage si 'none' alors pas de remplissage.
 * @param {number} opaciteDeRemplissage Transparence de remplissage de 0 à 1. Facultatif, 0.2 par défaut
 * @author Jean-Claude Lhote
 * @return {SemiEllipse} Objet SemiEllipse
 */
export function semiEllipse ({
  centre,
  Rx,
  Ry,
  hemisphere = 'nord',
  pointilles = false,
  rayon = false,
  couleurDeRemplissage = 'none',
  color = 'black',
  opaciteDeRemplissage = 0.2
}) {
  return new SemiEllipse({
    centre,
    Rx,
    Ry,
    hemisphere,
    pointilles,
    rayon,
    couleurDeRemplissage,
    color,
    opaciteDeRemplissage
  })
}

/**
 * Trace un cône
 * @param {Point} centre Centre de la base
 * @param {number} Rx Rayon sur l'axe des abscisses
 * @param {number} hauteur Distance verticale entre le centre et le sommet.
 * @param {string} [color = 'black'] Facultatif, 'black' par défaut
 * @param {string} [couleurDeRemplissage = 'none'] none' si on ne veut pas de remplissage, sinon une couleur du type 'blue' ou du type '#f15929'
 * @param {number} [opaciteDeRemplissage = 0.2] Taux d'opacité du remplissage
 * @author Jean-Claude Lhote
 * @private
 */
export function Cone ({
  centre,
  Rx,
  hauteur,
  couleurDeRemplissage = 'none',
  color = 'black',
  opaciteDeRemplissage = 0.2
}) {
  ObjetMathalea2D.call(this, {})
  const sommet = point(centre.x, centre.y + hauteur)
  this.sommet = sommet
  this.centre = centre
  this.color = color
  this.couleurDeRemplissage = couleurDeRemplissage
  this.opaciteDeRemplissage = opaciteDeRemplissage
  const objets = [
    semiEllipse({
      centre,
      Rx,
      Ry: Rx / 3,
      hemisphere: 'nord',
      rayon: false,
      pointilles: 1,
      couleurDeRemplissage,
      color: this.color,
      opaciteDeRemplissage
    }),
    semiEllipse({
      centre,
      Rx,
      Ry: Rx / 3,
      hemisphere: 'sud',
      rayon: false,
      pointilles: false,
      couleurDeRemplissage,
      color: this.color,
      opaciteDeRemplissage
    }),
    segment(point(centre.x + Rx, centre.y + 0.1), sommet, this.color),
    segment(point(centre.x - Rx, centre.y + 0.1), sommet, this.color)
  ]
  let xMin = 1000
  let yMin = 1000
  let yMax = -1000
  let xMax = -1000
  for (const obj of objets) {
    xMin = Math.min(xMin, obj.bordures[0])
    yMin = Math.min(yMin, obj.bordures[1])
    xMax = Math.max(xMax, obj.bordures[2])
    yMax = Math.max(yMax, obj.bordures[3])
  }
  this.bordures = [xMin, yMin, xMax, yMax]
  this.svg = function (coeff) {
    let code = ''
    for (const objet of objets) {
      objet.color = colorToLatexOrHTML(this.color)
      code += objet.svg(coeff) + '\n'
    }
    return code
  }
  this.tikz = function () {
    let code = ''
    for (const objet of objets) {
      objet.color = this.color
      code += objet.tikz() + '\n\t'
    }
    return code
  }
}

export function Sphere2d ({
  centre,
  Rx,
  couleurDeRemplissage = 'none',
  color = 'black',
  opaciteDeRemplissage = 0.2
}) {
  ObjetMathalea2D.call(this, {})
  const grandCercle = new Cercle(centre, Rx, color, couleurDeRemplissage)
  this.centre = centre
  this.color = color
  this.couleurDeRemplissage = couleurDeRemplissage
  this.opaciteDeRemplissage = opaciteDeRemplissage
  const objets = [grandCercle,
    semiEllipse({
      centre,
      Rx,
      Ry: Rx / 3,
      hemisphere: 'nord',
      rayon: false,
      pointilles: 1,
      couleurDeRemplissage,
      color: this.color,
      opaciteDeRemplissage
    }),
    semiEllipse({
      centre,
      Rx,
      Ry: Rx / 3,
      hemisphere: 'sud',
      rayon: false,
      pointilles: false,
      couleurDeRemplissage,
      color: this.color,
      opaciteDeRemplissage
    })
  ]
  let xMin = 1000
  let yMin = 1000
  let yMax = -1000
  let xMax = -1000
  for (const obj of objets) {
    xMin = Math.min(xMin, obj.bordures[0])
    yMin = Math.min(yMin, obj.bordures[1])
    xMax = Math.max(xMax, obj.bordures[2])
    yMax = Math.max(yMax, obj.bordures[3])
  }
  this.bordures = [xMin, yMin, xMax, yMax]
  this.svg = function (coeff) {
    let code = ''
    for (const objet of objets) {
      objet.color = colorToLatexOrHTML(this.color)
      code += objet.svg(coeff) + '\n'
    }
    return code
  }
  this.tikz = function () {
    let code = ''
    for (const objet of objets) {
      objet.color = this.color
      code += objet.tikz() + '\n\t'
    }
    return code
  }
}

export function sphere2d ({
  centre,
  Rx,
  couleurDeRemplissage = 'none',
  color = 'black',
  opaciteDeRemplissage = 0.2
}) {
  return new Sphere2d({ centre, Rx, couleurDeRemplissage, color, opaciteDeRemplissage })
}
// Cette fonction donne un rendu correct que si la hauteur est suffisamment grande
export function cone ({
  centre,
  Rx,
  hauteur,
  couleurDeRemplissage = 'none',
  color = 'black',
  opaciteDeRemplissage = 0.2
}) {
  return new Cone({ centre, Rx, hauteur, couleurDeRemplissage, color, opaciteDeRemplissage })
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%% LES COURBES DE BÉZIER %%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/* INUTLISEE - A SUPPRIMER ?
function CourbeDeBezier (A, B, C) {
   ObjetMathalea2D.call(this, { })
  this.svg = function (coeff) {
    const code = `<path d="M${A.xSVG(coeff)} ${A.ySVG(coeff)} Q ${B.xSVG(
      coeff
    )} ${B.ySVG(coeff)}, ${C.xSVG(coeff)} ${C.ySVG(
      coeff
    )}" stroke="black" fill="transparent"/>`
    return code
  }
}

export function courbeDeBezier (...args) {
  return new CourbeDeBezier(...args)
}
*/

export function Engrenage ({
  rayon = 1,
  rayonExt,
  rayonInt,
  nbDents = 12,
  xCenter = 0,
  yCenter = 0,
  couleur = 'black',
  couleurDeRemplissage = 'black',
  couleurDuTrou = 'white',
  dureeTour = 10,
  angleStart = 90,
  marqueur = null
} = {}) {
  ObjetMathalea2D.call(this)
  this.rayon = rayon
  this.rayonExt = rayonExt > rayon ? rayonExt : round(rayon * 4 / 3)
  this.rayonInt = rayonInt < rayon ? rayonInt : round(rayon * 3 / 4)
  this.nbDents = nbDents
  this.xCenter = xCenter
  this.yCenter = yCenter
  this.dureeTour = dureeTour
  this.marqueur = marqueur
  this.color = colorToLatexOrHTML(couleur)
  this.couleurDeRemplissage = colorToLatexOrHTML(couleurDeRemplissage)
  this.couleurDuTrou = colorToLatexOrHTML(couleurDuTrou)
  this.angleStart = angleStart
  this.bordures = [xCenter - rayonExt - 0.2, yCenter - rayonExt - 0.2, xCenter + rayonExt + 0.2, yCenter + rayonExt + 0.2]
  this.svg = function (coeff) {
    const xC = this.xCenter * coeff
    const yC = -this.yCenter * coeff
    const R1 = round(this.rayon * coeff)
    const R2 = round(this.rayonExt * coeff)
    const R0 = round(this.rayonInt * coeff)
    const angle = 360 / this.nbDents
    const r1x = round(R2 - R1)
    const r1y = round(R1 * degSin(0.125 * angle))
    const Ax = round(xC + R1 * degCos(angle * 0.25 + this.angleStart))
    const Ay = round(yC + R1 * degSin(angle * 0.25 + this.angleStart))
    let code = `<g class="roueEngrenage" id=roue${this.id}>
    <path stroke="${this.color[0]}" fill="${this.couleurDeRemplissage[0]}"
      d="M ${Ax},${Ay} `
    for (let i = 0; i < this.nbDents; i++) {
      const Bx = round(xC + R1 * degCos(angle * (-i - 0.25) + this.angleStart))
      const By = round(yC + R1 * degSin(angle * (-i - 0.25) + this.angleStart))
      const Cx = round(xC + R2 * degCos(angle * (-i + 0.125) + this.angleStart))
      const Cy = round(yC + R2 * degSin(angle * (-i + 0.125) + this.angleStart))
      const Dx = round(xC + R2 * degCos(angle * (-i - 0.125) + this.angleStart))
      const Dy = round(yC + R2 * degSin(angle * (-i - 0.125) + this.angleStart))
      const Ex = round(xC + R1 * degCos(angle * (-i - 0.75) + this.angleStart))
      const Ey = round(yC + R1 * degSin(angle * (-i - 0.75) + this.angleStart))
      code += `A${r1x} ${r1y} ${round(180 + this.angleStart - (i + 0.25) * angle)} 0 0 ${Cx} ${Cy} L${Dx} ${Dy} A${r1x} ${r1y} ${round(180 + this.angleStart - (i - 0.125) * angle)} 0 0 ${Bx} ${By} A${R1} ${R1} 0 0 0 ${Ex} ${Ey} `
    }
    code += 'Z"/>'
    if (typeof this.marqueur === 'number') code += `<circle cx="${round(xC + (R1 - 5) * degCos(this.marqueur))}" cy="${round(yC + (R1 - 5) * degSin(this.marqueur))}" r="3" stroke="HotPink" fill="Sienna" />`
    if (this.dureeTour !== 0) {
      code += `<animateTransform
      id="animRoue${this.id}"
      attributeName="transform"
      attributeType="XML"
      type="rotate"
      from="0 ${xC} ${yC}"
      to="${this.dureeTour < 0 ? -360 : 360} ${xC} ${yC}"
      dur="${abs(this.dureeTour)}"
      repeatCount="indefinite"
      />
      </g>
      <circle cx="${xC}" cy="${yC}" r="${R0}" stroke="${this.color[0]}" fill="${this.couleurDuTrou[0]}" />
      <text class="compteurDeTours" id="compteur${this.id}" fill="red" align="middle" dominant-baseline="middle" text-anchor="middle" x="${xC}" y="${yC}">0</text>`
    } else {
      code += `</g>
      <circle cx="${xC}" cy="${yC}" r="${R0}" stroke="${this.color[0]}" fill="${this.couleurDuTrou[0]}" />`
    }
    return code
  }
  this.tikz = function () {
    const R1 = this.rayon
    const R2 = this.rayonExt
    const R0 = this.rayonInt
    let code = `% engrenage de rayon ${this.rayon}, avec ${this.nbDents} dents centré en (${this.xCenter};${this.yCenter})
    \\foreach \\i in {1,2,...,${this.nbDents}}{
                  \\pgfmathparse{360*(\\i-1)/${this.nbDents}}\\let\\angle\\pgfmathresult
                  \\begin{scope}[shift={(${this.xCenter},${this.yCenter})}]
                      \\pgfmathparse{${this.rayon}*cos(${this.angleStart}+90/${this.nbDents})}\\let\\Ax\\pgfmathresult
                  \\pgfmathparse{${R1}*sin(${this.angleStart}+90/${this.nbDents})}\\let\\Ay\\pgfmathresult
                  \\pgfmathparse{${R1}*cos(${this.angleStart}-90/${this.nbDents})}\\let\\Bx\\pgfmathresult
                  \\pgfmathparse{${R1}*sin(${this.angleStart}-90/${this.nbDents})}\\let\\By\\pgfmathresult
                  \\pgfmathparse{${R2}*cos(${this.angleStart}+45/${this.nbDents})}\\let\\Cx\\pgfmathresult
                  \\pgfmathparse{${R2}*sin(${this.angleStart}+45/${this.nbDents})}\\let\\Cy\\pgfmathresult
                  \\pgfmathparse{${R2}*cos(${this.angleStart}-45/${this.nbDents})}\\let\\Dx\\pgfmathresult
                  \\pgfmathparse{${R2}*sin(${this.angleStart}-45/${this.nbDents})}\\let\\Dy\\pgfmathresult
                  \\pgfmathparse{${this.angleStart}-90/${this.nbDents}}\\let\\a\\pgfmathresult
                  \\pgfmathparse{${this.angleStart}-270/${this.nbDents}}\\let\\b\\pgfmathresult
                  \\fill[${this.couleurDeRemplissage[1]},draw,rotate=\\angle] (0,0) -- (\\Ax,\\Ay) to[bend left=15] (\\Cx,\\Cy) -- (\\Dx,\\Dy) to[bend left=15] (\\Bx,\\By) arc (\\a:\\b:${R1}cm) -- cycle;
                  \\draw[${this.color[1]},rotate=\\angle] (\\Ax,\\Ay) to[bend left=15] (\\Cx,\\Cy) -- (\\Dx,\\Dy) to[bend left=15] (\\Bx,\\By) arc (\\a:\\b:${R1}cm);
                  \\end{scope}}
              \\fill[${this.couleurDuTrou[1]},draw=${this.color[1]}] (${this.xCenter},${this.yCenter}) circle (${R0});
  `
    if (typeof this.marqueur === 'number') {
      code += `\\fill[HotPink,draw=black] (${arrondi(this.xCenter + (R1 - 0.2) * degCos(this.marqueur), 2)},${arrondi(this.yCenter + (R1 - 0.2) * degSin(this.marqueur), 2)}) circle (0.15);
`
    }
    return code
  }
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%% LES TRANSFORMATIONS %%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/**  Donne la distance entre le point A et la droite d
 * @param {point} A
 * @param {droite} d
 * @example distancePointDroite (M, d1) // Retourne la distance entre le point M et la droite d1
 * @author Jean-Claude Lhote
 * @return {longueur}
 */
// JSDOC Validee par EE Aout 2022
export function distancePointDroite (A, d) {
  const M = projectionOrtho(A, d)
  return longueur(A, M, 9)
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%% LE TRIANGLE %%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%% LES CODAGES %%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%% LES REPERES ET GRILLE %%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%% LES STATISTIQUES %%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%% LES COURBES DE FONCTIONS %%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%% LES INTERVALLES %%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

export function CrochetD (A, color = 'blue') {
  ObjetMathalea2D.call(this, {})
  this.epaisseur = 2
  this.color = colorToLatexOrHTML(color)
  this.taille = 0.2
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

    let code = `<polyline points="${A.xSVG(coeff) + this.taille * 20},${A.ySVG(coeff) +
    2 * this.taille * 20 / coeff * coeff
    } ${A.xSVG(coeff)},${A.ySVG(coeff) + 2 * this.taille * 20} ${A.xSVG(coeff)},${A.ySVG(coeff) +
    -2 * this.taille * 20
    } ${A.xSVG(coeff) + this.taille * 20},${A.ySVG(coeff) +
    -2 * this.taille * 20
    }" fill="none" stroke="${this.color[0]}" ${this.style} />`
    code += `\n\t<text x="${A.xSVG(coeff)}" y="${A.ySVG(coeff) +
    this.taille * 20 * 5
    }" text-anchor="middle" dominant-baseline="central" fill="${this.color[0]}">${A.nom
    }</text>\n `
    return code
  }
  this.tikz = function () {
    let code = `\\draw[very thick,color=${this.color[1]}] (${A.x + this.taille / context.scale},${A.y + this.taille / context.scale})--(${A.x
    },${A.y + this.taille / context.scale})--(${A.x},${A.y - this.taille / context.scale})--(${A.x + this.taille / context.scale},${A.y - this.taille / context.scale});`
    code += `\n\t\\draw[color=${this.color[1]}] (${A.x},${A.y - this.taille / context.scale}) node[below] {$${A.nom}$};`
    return code
  }
}

export function crochetD (...args) {
  return new CrochetD(...args)
}

export function CrochetG (A, color = 'blue') {
  ObjetMathalea2D.call(this, {})
  this.epaisseur = 2
  this.color = colorToLatexOrHTML(color)
  this.taille = 0.2

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

    let code = `<polyline points="${A.xSVG(coeff) - this.taille * 20},${A.ySVG(coeff) +
    2 * this.taille * 20
    } ${A.xSVG(coeff)},${A.ySVG(coeff) + 2 * this.taille * 20} ${A.xSVG(coeff)},${A.ySVG(coeff) -
    2 * this.taille * 20
    } ${A.xSVG(coeff) - this.taille * 20},${A.ySVG(coeff) -
    2 * this.taille * 20
    }" fill="none" stroke="${this.color[0]}" ${this.style} />`
    code += `\n\t<text x="${A.xSVG(coeff)}" y="${A.ySVG(coeff) +
    5 * this.taille * 20
    }" text-anchor="middle" dominant-baseline="central" fill="${this.color[0]}">${A.nom
    }</text>\n `
    return code
  }
  this.tikz = function () {
    let code = `\\draw[very thick,color=${this.color[1]}] (${A.x - this.taille / context.scale},${A.y + this.taille / context.scale})--(${A.x
    },${A.y + this.taille / context.scale})--(${A.x},${A.y - this.taille / context.scale})--(${A.x - this.taille / context.scale},${A.y - this.taille / context.scale});`
    code += `\n\t\\draw[color=${this.color[1]}] (${A.x},${A.y - this.taille / context.scale}) node[below] {$${A.nom}$};`
    return code
  }
}

export function crochetG (...args) {
  return new CrochetG(...args)
}

export function intervalle (A, B, color = 'blue', h = 0) {
  const A1 = point(A.x, A.y + h)
  const B1 = point(B.x, B.y + h)
  const s = segment(A1, B1, color)
  // s.styleExtremites = '->'

  s.epaisseur = 3
  return s
}

/*

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%% LES TEXTES %%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/**
 * texteParPoint('mon texte',A) // Écrit 'mon texte' avec A au centre du texte
 * texteParPoint('mon texte',A,'gauche') // Écrit 'mon texte' à gauche de A (qui sera la fin du texte)
 * texteParPoint('mon texte',A,'droite') // Écrit 'mon texte' à droite de A (qui sera le début du texte)
 * texteParPoint('mon texte',A,45) // Écrit 'mon texte' centré sur A avec une rotation de 45°
 * Si mathOn est true, la chaine est traitée par texteParPoint mais avec une police se rapprochant de la police Katex (quelques soucis d'alignement des caractères sur certains navigateurs)
 * Si le texte commence et finit par des $ la chaine est traitée par latexParPoint
 * @author Rémi Angot
 */
export function TexteParPoint (texte, A, orientation = 'milieu', color = 'black', scale = 1, ancrageDeRotation = 'middle', mathOn = false, opacite = 1) {
  ObjetMathalea2D.call(this, {})
  this.color = colorToLatexOrHTML(color)
  this.contour = false
  this.taille = 10 * scale
  this.opacite = opacite
  this.couleurDeRemplissage = this.color
  this.opaciteDeRemplissage = this.opacite
  if (typeof texte === 'number' || texte instanceof Decimal) texte = stringNombre(texte)
  this.bordures = [A.x - texte.length * 0.2, A.y - 0.4, A.x + texte.length * 0.2, A.y + 0.4]
  if (typeof texte !== 'string') {
    texte = String(texte)
  }
  texte = texte.replaceAll('$$', '$') // ça arrive que des fonctions ajoutent des $ alors qu'il y en a déjà...
  if (texte.charAt(0) === '$') {
    A.positionLabel = 'above'
    this.svg = function (coeff) {
      return latexParPoint(texte.substr(1, texte.length - 2), A, this.color, texte.length * 8, 12, '', 6).svg(coeff)
    }
    this.tikz = function () {
      let code = ''
      if (typeof orientation === 'number') {
        let anchor = 'center'
        if (ancrageDeRotation === 'gauche') {
          anchor = 'west'
        }
        if (ancrageDeRotation === 'droite') {
          anchor = 'east'
        }
        code = `\\draw [color=${this.color[1]}] (${arrondi(A.x)},${arrondi(A.y)
        }) node[anchor = ${anchor}, rotate = ${-orientation}] {${texte}};`
      } else {
        let anchor = ''
        if (orientation === 'gauche') {
          anchor = `node[anchor = east,scale=${scale}]`
        }
        if (orientation === 'droite') {
          anchor = `node[anchor = west,scale=${scale}]`
        }
        if (orientation === 'milieu') {
          anchor = `node[anchor = center,scale=${scale}]`
        }
        code = `\\draw [color=${this.color[1]}] (${A.x},${A.y}) ${anchor} {${texte}};`
      }
      return code
    }
  } else {
    this.svg = function (coeff) {
      let code = ''
      let style = ''
      if (mathOn) style = ' font-family= "Book Antiqua"; font-style= "italic" '
      if (this.contour) style += ` style="font-size: ${this.taille}px;fill: ${this.couleurDeRemplissage[0]};fill-opacity: ${this.opaciteDeRemplissage};stroke: ${this.color[0]};stroke-width: 0.5px;stroke-linecap: butt;stroke-linejoin:miter;stroke-opacity: ${this.opacite}" `
      else style += ` style="font-size:${this.taille}px;fill:${this.color[0]};fill-opacity:${this.opacite};${this.gras ? 'font-weight:bolder' : ''}" `
      if (typeof (orientation) === 'number') {
        code = `<text ${style} x="${A.xSVG(coeff)}" y="${A.ySVG(
          coeff
        )}" text-anchor = "${ancrageDeRotation}" dominant-baseline = "central" fill="${this.couleurDeRemplissage[0]
        }" transform="rotate(${orientation} ${A.xSVG(coeff)} ${A.ySVG(
          coeff
        )})" id="${this.id}" >${texte}</text>\n `
      } else {
        switch (orientation) {
          case 'milieu':
            code = `<text ${style} x="${A.xSVG(coeff)}" y="${A.ySVG(
              coeff
            )}" text-anchor="middle" dominant-baseline="central" fill="${this.couleurDeRemplissage[0]
            }" id="${this.id}" >${texte}</text>\n `
            break
          case 'gauche':
            code = `<text ${style} x="${A.xSVG(coeff)}" y="${A.ySVG(
              coeff
            )}" text-anchor="end" dominant-baseline="central" fill="${this.couleurDeRemplissage[0]
            }" id="${this.id}" >${texte}</text>\n `
            break
          case 'droite':
            code = `<text ${style} x="${A.xSVG(coeff)}" y="${A.ySVG(
              coeff
            )}" text-anchor="start" dominant-baseline="central" fill="${this.couleurDeRemplissage[0]
            }" id="${this.id}" >${texte}</text>\n `
            break
        }
      }
      return code
    }
    this.tikz = function () {
      let code = ''
      if (typeof orientation === 'number') {
        let anchor = 'center'
        if (ancrageDeRotation === 'gauche') {
          anchor = 'west'
        }
        if (ancrageDeRotation === 'droite') {
          anchor = 'east'
        }
        code = `\\draw [color=${this.color[1]}] (${arrondi(A.x)},${arrondi(A.y)
        }) node[anchor = ${anchor}, rotate = ${-orientation}] {${texte}};`
      } else {
        let anchor = ''
        if (orientation === 'gauche') {
          anchor = `node[anchor = east,scale=${scale}]`
        }
        if (orientation === 'droite') {
          anchor = `node[anchor = west,scale=${scale}]`
        }
        if (orientation === 'milieu') {
          anchor = `node[anchor = center,scale=${scale}]`
        }
        if (mathOn) {
          code = `\\draw [color=${this.color[1]},fill opacity = ${this.opacite}] (${arrondi(A.x)},${arrondi(A.y)}) ${anchor} {$${texte}$};`
        } else {
          code = `\\draw [color=${this.color[1]},fill opacity = ${this.opacite}] (${arrondi(A.x)},${arrondi(A.y)}) ${anchor} {${texte}};`
        }
      }
      return code
    }
  }
}

export function texteParPoint (texte, A, orientation = 'milieu', color = 'black', scale = 1, ancrageDeRotation = 'middle', mathOn = false, opacite = 1) {
  return new TexteParPoint(texte, A, orientation, color, scale, ancrageDeRotation, mathOn, opacite)
}

export function TexteParPointEchelle (texte, A, orientation = 'milieu', color = 'black', scale = 1, ancrageDeRotation = 'middle', mathOn = false, scaleFigure) {
  ObjetMathalea2D.call(this, {})
  this.color = colorToLatexOrHTML(color)
  this.contour = false
  this.taille = 10 * scale
  this.opacite = 1
  this.couleurDeRemplissage = colorToLatexOrHTML(color)
  this.opaciteDeRemplissage = this.opacite
  this.bordures = [A.x - texte.length * 0.2, A.y - 0.4, A.x + texte.length * 0.2, A.y + 0.4]
  if (texte.charAt(0) === '$') {
    this.svg = function (coeff) {
      return latexParPoint(texte.substr(1, texte.length - 2), A, this.color, texte.length * 8, 10, '', this.taille * 0.8).svg(coeff)
    }
    this.tikz = function () {
      let code = ''
      if (typeof orientation === 'number') {
        let anchor = 'center'
        if (ancrageDeRotation === 'gauche') {
          anchor = 'west'
        }
        if (ancrageDeRotation === 'droite') {
          anchor = 'east'
        }
        code = `\\draw [color=${this.color[1]}] (${arrondi(A.x)},${arrondi(A.y)
        }) node[anchor = ${anchor}, rotate = ${-orientation}] {${texte}};`
      } else {
        let anchor = ''
        if (orientation === 'gauche') {
          anchor = `node[anchor = east,scale=${(scale * scaleFigure * 1.25).toFixed(2)}]`
        }
        if (orientation === 'droite') {
          anchor = `node[anchor = west,scale=${(scale * scaleFigure * 1.25).toFixed(2)}]`
        }
        if (orientation === 'milieu') {
          anchor = `node[anchor = center,scale=${scale * scaleFigure * 1.25}]`
        }
        code = `\\draw [color=${this.color[1]}] (${arrondi(A.x)},${arrondi(A.y)}) ${anchor} {${texte}};`
      }
      return code
    }
  } else {
    this.svg = function (coeff) {
      let code = ''
      let style = ''
      if (mathOn) style = ' font-family= "Book Antiqua"; font-style= "italic" '
      if (this.contour) style += ` style="font-size: ${this.taille}px;fill: ${this.couleurDeRemplissage[0]};fill-opacity: ${this.opaciteDeRemplissage};stroke: ${this.color[0]};stroke-width: 0.5px;stroke-linecap: butt;stroke-linejoin:miter;stroke-opacity: ${this.opacite}" `
      else style += ` style="font-size:${this.taille}px;fill:${this.color[0]};fill-opacity:${this.opacite};${this.gras ? 'font-weight:bolder' : ''}" `
      if (typeof (orientation) === 'number') {
        code = `<text ${style} x="${A.xSVG(coeff)}" y="${A.ySVG(
          coeff
        )}" text-anchor = "${ancrageDeRotation}" dominant-baseline = "central" fill="${this.color[0]
        }" transform="rotate(${orientation} ${A.xSVG(coeff)} ${A.ySVG(
          coeff
        )})" id="${this.id}" >${texte}</text>\n `
      } else {
        switch (orientation) {
          case 'milieu':
            code = `<text ${style} x="${A.xSVG(coeff)}" y="${A.ySVG(
              coeff
            )}" text-anchor="middle" dominant-baseline="central" fill="${this.color[0]
            }" id="${this.id}" >${texte}</text>\n `
            break
          case 'gauche':
            code = `<text ${style} x="${A.xSVG(coeff)}" y="${A.ySVG(
              coeff
            )}" text-anchor="end" dominant-baseline="central" fill="${this.color[0]
            }" id="${this.id}" >${texte}</text>\n `
            break
          case 'droite':
            code = `<text ${style} x="${A.xSVG(coeff)}" y="${A.ySVG(
              coeff
            )}" text-anchor="start" dominant-baseline="central" fill="${this.color[0]
            }" id="${this.id}" >${texte}</text>\n `
            break
        }
      }

      return code
    }
    this.tikz = function () {
      let code = ''
      if (mathOn) texte = '$' + texte + '$'
      if (typeof orientation === 'number') {
        let anchor = 'center'
        if (ancrageDeRotation === 'gauche') {
          anchor = 'west'
        }
        if (ancrageDeRotation === 'droite') {
          anchor = 'east'
        }
        code = `\\draw [color=${this.color[1]},fill opacity = ${this.opacite}] (${arrondi(A.x)},${arrondi(A.y)
        }) node[anchor = ${anchor},scale=${scale * scaleFigure * 1.25}, rotate = ${-orientation}] {${texte}};`
      } else {
        let anchor = ''
        if (orientation === 'gauche') {
          anchor = `node[anchor = east,scale=${scale * scaleFigure * 1.25}]`
        }
        if (orientation === 'droite') {
          anchor = `node[anchor = west,scale=${scale * scaleFigure * 1.25}]`
        }
        if (orientation === 'milieu') {
          anchor = `node[anchor = center,scale=${scale * scaleFigure * 1.25}]`
        }
        code = `\\draw [color=${this.color[1]},fill opacity = ${this.opacite}] (${A.x},${A.y}) ${anchor} {${texte}};`
      }
      return code
    }
  }
}

export function texteParPointEchelle (texte, A, orientation = 'milieu', color = 'black', scale = 1, ancrageDeRotation = 'middle', mathOn = false, scaleFigure = 1) {
  return new TexteParPointEchelle(texte, A, orientation, color, scale, ancrageDeRotation, mathOn, scaleFigure)
}

export function texteParPositionEchelle (texte, x, y, orientation = 'milieu', color = 'black', scale = 1, ancrageDeRotation = 'middle', mathOn = false, scaleFigure = 1) {
  return texteParPointEchelle(texte, point(arrondi(x), arrondi(y), '', 'center'), orientation, color, scale, ancrageDeRotation, mathOn, scaleFigure)
}

/**
 * texteParPosition('mon texte',x,y) // Écrit 'mon texte' avec le point de coordonnées (x,y) au centre du texte.
 *
 * texteParPosition('mon texte',x,y,'gauche') // Écrit 'mon texte' à gauche du point de coordonnées (x,y) (qui sera la fin du texte)
 *
 * texteParPosition('mon texte',x,y,'droite') // Écrit 'mon texte' à droite du point de coordonnées (x,y) (qui sera le début du texte)
 *
 * texteParPosition('mon texte',x,y,45) // Écrit 'mon texte'  centré sur le point de coordonnées (x,y) avec une rotation de 45°
 *
 * @param {string} texte // Le texte qu'on veut afficher
 * @param {number} x // L'abscisse de la position initiale du texte
 * @param {number} y // L'ordonnée de la position initiale du texte
 * @param {string} orientation=['milieu'] // Angle d'orientation du texte ou bien 'milieu', gauche' ou 'droite'. Voir exemple
 * @param {string} [color='black'] // Couleur du texte
 * @param {number} [scale=1] // Echelle du texte.
 * @param {string} [ancrageDeRotation='middle'] // Choix parmi 'middle', 'start' ou 'end'. En cas d'orientation avec un angle, permet de savoir où est le centre de la rotation par rapport au texte.
 * @param {string} [mathOn=false] // Ecriture dans le style de Latex.
 *
 * @author Rémi Angot
 */
export function texteParPosition (texte, x, y, orientation = 'milieu', color = 'black', scale = 1, ancrageDeRotation = 'middle', mathOn = false, opacite) {
  return new TexteParPoint(texte, point(arrondi(x, 2), arrondi(y, 2)), orientation, color, scale, ancrageDeRotation, mathOn, opacite)
}

/**
 * latexParPoint('\\dfrac{3}{5}',A,'black',12,20,"white") Ecrit la fraction 3/5 à l'emplacement du label du point A en noir, avec un fond blanc.
 * 12 est la largeur en pixels 20 la hauteur en pixels (utilisé à des fins de centrage). Pour un bon centrage sur A, il faut que A.positionLabel='center'.
 * si colorBackground="", le fond est transparent.
 * tailleCaracteres est à 8 par défaut et correspond à \footnotesize. tailleCaracteres va de 5 = \small à 20 = \huge
 * @author Rémi Angot
 */
export function latexParPoint (texte, A, color = 'black', largeur = 20, hauteur = 12, colorBackground = 'white', tailleCaracteres = 8) {
  let x
  let y
  const coeff = context.pixelsParCm
  const offset = 10 * Math.log10(tailleCaracteres)
  switch (A.positionLabel) {
    case 'above':
      x = A.x
      y = A.y + offset / coeff
      break
    case 'below':
      x = A.x
      y = A.y - offset / coeff
      break
    case 'left':
      x = A.x - offset / coeff
      y = A.y
      break
    case 'right':
      x = A.x + offset / coeff
      y = A.y
      break
    case 'above right':
      x = A.x + offset / coeff
      y = A.y + offset / coeff
      break
    case 'above left':
      x = A.x - offset / coeff
      y = A.y + offset / coeff
      break
    case 'below right':
      x = A.x + offset / coeff
      y = A.y - offset / coeff
      break
    case 'below left':
      x = A.x - offset / coeff
      y = A.y - offset / coeff
      break
    case 'center':
      x = A.x
      y = A.y
      break
    default:
      x = A.x
      y = A.y
      break
  }
  return latexParCoordonnees(texte, arrondi(x), arrondi(y), color, largeur, hauteur, colorBackground, tailleCaracteres)
}

/**
 * @param {String} texte Le code latex qui sera mis en mode math en ligne. Ex : '\\dfrac{4}{5}\\text{cm}'
 * @param {Number} x abscisse du point de centrage
 * @param {Number} y ordonnée du point de centrage
 * @param {String} [color] couleur
 * @param {Number} [largeur] Dimensions de la 'box' rectangulaire conteneur de la formule en pixels en considérant la taille de caractère 8='\footnotesize'
 * @param {Number} [hauteur] Idem pour la hauteur de la box. Prévoir 20 par exemple pour une fraction. Permet le centrage correct.
 * @param {String} [colorBackground] Couleur du fond de la box. Chaine vide pour un fond transparent.
 * @param {Number} [tailleCaracteres] Taille de la police utilisée de 5 = \small à 20=\huge... agit sur la box en en modifiant les paramètres hauteur et largeur
 */
export function LatexParCoordonnees (texte, x, y, color, largeur, hauteur, colorBackground, tailleCaracteres) {
  ObjetMathalea2D.call(this, {})
  this.x = x
  this.y = y
  this.largeur = largeur * Math.log10(2 * tailleCaracteres)
  this.hauteur = hauteur * Math.log10(tailleCaracteres)
  this.colorBackground = colorToLatexOrHTML(colorBackground)
  this.color = colorToLatexOrHTML(color)
  this.texte = texte
  this.tailleCaracteres = tailleCaracteres
  this.bordures = [x - (this.texte.length ?? 0) * 0.2, y - 0.02 * this.hauteur, x + (this.texte.length ?? 0) * 0.2, y + 0.02 * this.hauteur]
  let taille
  if (this.tailleCaracteres > 19) taille = '\\huge'
  else if (this.tailleCaracteres > 16) taille = '\\LARGE'
  else if (this.tailleCaracteres > 13) taille = '\\Large'
  else if (this.tailleCaracteres > 11) taille = '\\large'
  else if (this.tailleCaracteres < 6) taille = '\\tiny'
  else if (this.tailleCaracteres < 8) taille = '\\scriptsize'
  else if (this.tailleCaracteres < 9) taille = '\\footnotesize'
  else if (this.tailleCaracteres < 10) taille = '\\small'
  else taille = '\\normalsize'
  this.svg = function (coeff) {
    const demiLargeur = this.largeur / 2
    const centrage = 0.4 * context.pixelsParCm * Math.log10(tailleCaracteres)
    if (this.colorBackground !== '') {
      return `<foreignObject style=" overflow: visible; line-height: 0;" x="${this.x * coeff - demiLargeur}" y="${-this.y * coeff - centrage - this.hauteur / 2}"  width="${this.largeur}" height="${this.hauteur}" id="${this.id}" ><div style="margin:auto;width:${this.largeur}px;height:${this.hauteur}px;position:fixed!important; text-align:center">
    $\\colorbox{${this.colorBackground[0]}}{$${taille} \\color{${this.color[0]}}{${this.texte}}$}$</div></foreignObject>`
    } else {
      return `<foreignObject style=" overflow: visible; line-height: 0;" x="${this.x * coeff - demiLargeur}" y="${-this.y * coeff - centrage - this.hauteur / 2}"  width="${this.largeur}" height="${this.hauteur}" id="${this.id}" ><div style="width:${this.largeur}px;height:${this.hauteur}px;position:fixed!important; text-align:center">
      $${taille} \\color{${this.color[0]}}{${this.texte}}$</div></foreignObject>`
    }
  }

  this.tikz = function () {
    let code
    if (this.colorBackground !== '') {
      code = `\\draw (${x},${y}) node[anchor = center] {\\colorbox ${this.colorBackground[1]}{${taille}  \\color${this.color[1]}{$${texte}$}}};`
    } else {
      code = `\\draw (${x},${y}) node[anchor = center] {${taille} \\color${this.color[1]}{$${texte}$}};`
    }

    return code
  }
}

export function latexParCoordonnees (texte, x, y, color = 'black', largeur = 50, hauteurLigne = 20, colorBackground = 'white', tailleCaracteres = 8) {
  if (texte === '') return vide2d()
  else return new LatexParCoordonnees(texte, x, y, color, largeur, hauteurLigne, colorBackground, tailleCaracteres)
}

/**
 * @param {String} texte Le code latex qui sera mis en mode math en ligne. Ex : '\\dfrac{4}{5}\\text{cm}'
 * @param {Number} x abscisse du point de centrage
 * @param {Number} y ordonnée du point de centrage
 * @param {String} [color] couleur
 * @param {Number} [largeur] Dimensions de la 'box' rectangulaire conteneur de la formule en pixels en considérant la taille de caractère 8='\footnotesize'
 * @param {Number} [hauteur] Idem pour la hauteur de la box. Prévoir 20 par exemple pour une fraction. Permet le centrage correct.
 * @param {String} [colorBackground] Couleur du fond de la box. Chaine vide pour un fond transparent.
 * @param {Number} [tailleCaracteres] Taille de la police utilisée de 5 = \small à 20=\huge... agit sur la box en en modifiant les paramètres hauteur et largeur
 * @Param {Struct} {options} options.anchor pour forcer la boite
 */
export function LatexParCoordonneesBox (texte, x, y, color, largeur, hauteur, colorBackground, tailleCaracteres, options) {
  ObjetMathalea2D.call(this, {})
  this.x = x
  this.y = y
  this.largeur = largeur // * Math.log10(2 * tailleCaracteres)
  this.hauteur = hauteur // * Math.log10(tailleCaracteres)
  this.colorBackground = colorToLatexOrHTML(colorBackground)
  this.color = colorToLatexOrHTML(color)
  this.texte = texte
  this.tailleCaracteres = tailleCaracteres
  this.bordures = [x - this.texte.length * 0.2, y - 0.02 * this.hauteur, x + this.texte.length * 0.2, y + 0.02 * this.hauteur]
  let taille
  if (this.tailleCaracteres > 19) taille = '\\huge'
  else if (this.tailleCaracteres > 16) taille = '\\LARGE'
  else if (this.tailleCaracteres > 13) taille = '\\Large'
  else if (this.tailleCaracteres > 11) taille = '\\large'
  else if (this.tailleCaracteres < 6) taille = '\\tiny'
  else if (this.tailleCaracteres < 8) taille = '\\scriptsize'
  else if (this.tailleCaracteres < 9) taille = '\\footnotesize'
  else if (this.tailleCaracteres < 10) taille = '\\small'
  else taille = '\\normalsize'

  let style = ''
  if (options.anchor !== undefined && options.anchor !== '') {
    switch (options.anchor) {
      case 'center': {
        let dy = 0
        if (options.dy === undefined || options.dy === '' || options.dy.indexOf('%') < 0) {
          dy = 0
        } else {
          dy = parseInt(options.dy.substr(0, options.dy.indexOf('%')))
        }
        let dx = 0
        if (options.dx === undefined || options.dx === '' || options.dx.indexOf('%') < 0) {
          dx = 0
        } else {
          dx = parseInt(options.dx.substr(0, options.dx.indexOf('%')))
        }
        style = `position:fixed;top: 50%;left: 50%;transform: translate(${-50 + dx}%, ${-50 + dy}%);`
        break
      }
      case 'above':
        style = 'position:fixed;bottom:0;'
        break
      case 'left':
        style = 'position:fixed;right:0;'
        break
      case 'right':
        style = 'position:fixed;left:0;'
        break
      case 'below':
        style = 'position:fixed;top:0;'
        break
    }
  }
  if (this.colorBackground !== '') {
    style += `background-color: ${this.colorBackground[0]};`
  }

  this.svg = function (coeff) {
    const demiLargeur = this.largeur / 2
    const centrage = 0 // 0.4 * context.pixelsParCm * Math.log10(tailleCaracteres)
    return `<foreignObject style=" overflow: visible; line-height: 0;" x="${this.x * coeff - demiLargeur}" y="${-this.y * coeff - centrage - this.hauteur / 2}"  width="${this.largeur}" height="${this.hauteur}" id="${this.id}" ><div style="width:${this.largeur}px;height:${this.hauteur}px;position:fixed!important; text-align:center">
      <div style='${style}'>
      $${taille} \\color{${this.color[0]}}{${this.texte}}$
      </div></div></foreignObject>`
    // <circle cx="${this.x * coeff - demiLargeur}" cy="${-this.y * coeff - centrage - this.hauteur / 2}" r="1" fill="red" stroke="blue" stroke-width="2"  />
    // <circle cx="${this.x * coeff}" cy="${-this.y * coeff}" r="1" fill="red" stroke="blue" stroke-width="2"  />`
  }

  this.tikz = function () {
    let code
    if (this.colorBackground !== '') {
      code = `\\draw (${x},${y}) node[anchor = center] {\\colorbox ${this.colorBackground[1]}{${taille}  \\color${this.color[1]}{$${texte}$}}};`
    } else {
      code = `\\draw (${x},${y}) node[anchor = center] {${taille} \\color${this.color[1]}{$${texte}$}};`
    }

    return code
  }
}

export function latexParCoordonneesBox (texte, x, y, color = 'black', largeur = 50, hauteurLigne = 20, colorBackground = 'white', tailleCaracteres = 8, options = {}) {
  if (texte === '') return vide2d()
  else return new LatexParCoordonneesBox(texte, x, y, color, largeur, hauteurLigne, colorBackground, tailleCaracteres, options)
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%% LES FONCTIONS - CALCULS %%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

