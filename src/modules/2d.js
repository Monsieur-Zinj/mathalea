import Decimal from 'decimal.js'
import earcut from 'earcut'
import { abs, floor, isNumeric, random, round } from 'mathjs'
import { codageAngle, codageAngleDroit } from '../lib/2d/angles.js'
import {
  homothetie,
  projectionOrtho,
  rotation,
  similitude,
  symetrieAxiale,
  translation
} from '../lib/2d/transformations.js'
import { arrondi, nombreDeChiffresDe, unSiPositifMoinsUnSinon } from '../lib/outils/nombres.js'
import { stringNombre } from '../lib/outils/texNombre.js'
import { colorToLatexOrHTML, ObjetMathalea2D, vide2d } from './2dGeneralites.js'
import { context } from './context.js'
import { degCos, degSin, radians } from './mathFonctions/trigo.js'
import { calcul, egal, inferieurouegal, randint, superieurouegal } from './outils.js'

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

/**  Trace une droite
 * @param {Point | number} arg1 Premier point de la droite OU BIEN coefficient a de l'équation de la droite ax+by+c=0
 * @param {Point | number} arg2 Deuxième point de la droite OU BIEN coefficient b de l'équation de la droite ax+by+c=0
 * @param {string | number} arg3 Nom affiché de la droite OU BIEN coefficient c de l'équation de la droite ax+by+c=0
 * @param {string} arg4 Couleur de la droite : du type 'blue' ou du type '#f15929' OU BIEN Nom affiché de la droite si arg1 est un nombre
 * @param {string} arg5 Couleur de la droite : du type 'blue' ou du type '#f15929' si arg1 est un nombre
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} svgml Sortie, à main levée, au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} tikzml Sortie, à main levée, au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {number} a Coefficient a de l'équation de la droite ax+by+c=0
 * @property {number} b Coefficient b de l'équation de la droite ax+by+c=0
 * @property {number} c Coefficient c de l'équation de la droite ax+by+c=0
 * @property {number} x1 Abscisse de arg1 (si ce point existe)
 * @property {number} y1 Ordonnée de arg1 (si ce point existe)
 * @property {number} x2 Abscisse de arg2 (si ce point existe)
 * @property {number} y2 Ordonnée de arg2 (si ce point existe)
 * @property {string} nom Nom affiché de la droite
 * @property {string} color Couleur de la droite. À associer obligatoirement à colorToLatexOrHTML().
 * @property {Vecteur} normal Vecteur normal de la droite
 * @property {Vecteur} directeur Vecteur directeur de la droite
 * @property {number} angleAvecHorizontale Valeur de l'angle orienté entre la droite et l'horizontale
 * @author Jean-Claude Lhote
 * @class
 */
// JSDOC Validee par EE Aout 2022
export function Droite (arg1, arg2, arg3, arg4, arg5) {
  let a, b, c

  ObjetMathalea2D.call(this, {})
  if (arguments.length === 2) {
    if (isNaN(arg1.x) || isNaN(arg1.y) || isNaN(arg2.x) || isNaN(arg2.y)) {
      window.notify('Droite : (attendus : A et B) les arguments de sont pas des points valides', {
        arg1,
        arg2
      })
    }
    this.nom = ''
    this.x1 = arg1.x
    this.y1 = arg1.y
    this.x2 = arg2.x
    this.y2 = arg2.y
    this.a = this.y1 - this.y2
    this.b = this.x2 - this.x1
    this.c = (this.x1 - this.x2) * this.y1 + (this.y2 - this.y1) * this.x1
  } else if (arguments.length === 3) {
    if (typeof arg1 === 'number') {
      if (isNaN(arg1) || isNaN(arg2) || isNaN(arg3)) {
        window.notify('Droite : (attendus : a, b et c) les arguments de sont pas des nombres valides', {
          arg1,
          arg2,
          arg3
        })
      }

      // droite d'équation ax +by +c =0
      this.nom = ''
      this.a = arg1
      this.b = arg2
      this.c = arg3
      a = arg1
      b = arg2
      c = arg3
      if (egal(a, 0)) {
        this.x1 = 0
        this.x2 = 1
        this.y1 = -c / b
        this.y2 = -c / b
      } else if (egal(b, 0)) {
        this.y1 = 0
        this.y2 = 1
        this.x1 = -c / a
        this.x2 = -c / a
      } else {
        this.x1 = 0
        this.y1 = -c / b
        this.x2 = 1
        this.y2 = (-c - a) / b
      }
    } else {
      if (isNaN(arg1.x) || isNaN(arg1.y) || isNaN(arg2.x) || isNaN(arg2.y)) {
        window.notify('Droite : (attendus : A, B et "nom") les arguments de sont pas des points valides', {
          arg1,
          arg2
        })
      }
      this.x1 = arg1.x
      this.y1 = arg1.y
      this.x2 = arg2.x
      this.y2 = arg2.y
      this.a = this.y1 - this.y2
      this.b = this.x2 - this.x1
      this.c = (this.x1 - this.x2) * this.y1 + (this.y2 - this.y1) * this.x1
      this.nom = arg3
    }
  } else if (arguments.length === 4) {
    if (typeof arg1 === 'number') {
      if (isNaN(arg1) || isNaN(arg2) || isNaN(arg3)) {
        window.notify('Droite : (attendus : a, b, c et "nom") les arguments de sont pas des nombres valides', {
          arg1,
          arg2,
          arg3
        })
      }
      this.a = arg1
      this.b = arg2
      this.c = arg3
      a = arg1
      b = arg2
      c = arg3
      this.nom = arg4
      if (egal(a, 0)) {
        this.x1 = 0
        this.x2 = 1
        this.y1 = -c / b
        this.y2 = -c / b
      } else if (egal(b, 0)) {
        this.y1 = 0
        this.y2 = 1
        this.x1 = -c / a
        this.x2 = -c / a
      } else {
        this.x1 = 0
        this.y1 = -c / b
        this.x2 = 1
        this.y2 = (-c - a) / b
      }
    } else {
      if (isNaN(arg1.x) || isNaN(arg1.y) || isNaN(arg2.x) || isNaN(arg2.y)) {
        window.notify('Droite : (attendus : A, B, "nom" et "couleur") les arguments de sont pas des points valides', {
          arg1,
          arg2
        })
      }
      this.x1 = arg1.x
      this.y1 = arg1.y
      this.x2 = arg2.x
      this.y2 = arg2.y
      this.a = this.y1 - this.y2
      this.b = this.x2 - this.x1
      this.c = (this.x1 - this.x2) * this.y1 + (this.y2 - this.y1) * this.x1
      this.nom = arg3
      this.color = colorToLatexOrHTML(arg4)
    }
  } else { // arguments.length === 5
    if (isNaN(arg1) || isNaN(arg2) || isNaN(arg3)) {
      window.notify('Droite : (attendus : a, b, c et "nom") les arguments de sont pas des nombres valides', {
        arg1,
        arg2,
        arg3
      })
    }
    this.a = arg1
    this.b = arg2
    this.c = arg3
    a = arg1
    b = arg2
    c = arg3
    this.nom = arg4
    this.color = colorToLatexOrHTML(arg5)
    if (egal(a, 0)) {
      this.x1 = 0
      this.x2 = 1
      this.y1 = -c / b
      this.y2 = -c / b
    } else if (egal(b, 0)) {
      this.y1 = 0
      this.y2 = 1
      this.x1 = -c / a
      this.x2 = -c / a
    } else {
      this.x1 = 0
      this.y1 = -c / b
      this.x2 = 1
      this.y2 = (-c - a) / b
    }
  }
  if (this.b !== 0) this.pente = -this.a / this.b
  let xsav, ysav
  if (this.x1 > this.x2) {
    xsav = this.x1
    ysav = this.y1
    this.x1 = this.x2 + 0
    this.y1 = this.y2 + 0
    this.x2 = xsav
    this.y2 = ysav
  }
  this.normal = vecteur(this.a, this.b)
  this.directeur = vecteur(this.b, -this.a)
  this.angleAvecHorizontale = angleOriente(
    point(1, 0),
    point(0, 0),
    point(this.directeur.x, this.directeur.y)
  )
  let absNom, ordNom, leNom
  if (this.nom !== '') {
    if (egal(this.b, 0, 0.05)) { // ax+c=0 x=-c/a est l'équation de la droite
      absNom = -this.c / this.a + 0.8 // l'abscisse du label est décalé de 0.8
      ordNom = context.fenetreMathalea2d[1] + 1 // l'ordonnée du label est ymin +1
    } else if (egal(this.a, 0, 0.05)) { // by+c=0 y=-c/b est l'équation de la droite
      absNom = context.fenetreMathalea2d[0] + 0.8 // l'abscisse du label est xmin +1
      ordNom = -this.c / this.b + 0.8 // l'ordonnée du label est décalée de 0.8
    } else { // a et b sont différents de 0 ax+by+c=0 est l'équation
      // y=(-a.x-c)/b est l'aquation cartésienne et x=(-by-c)/a
      const y0 = (-this.a * (context.fenetreMathalea2d[0] + 1) - this.c) / this.b
      const y1 = (-this.a * (context.fenetreMathalea2d[2] - 1) - this.c) / this.b
      const x0 = (-this.b * (context.fenetreMathalea2d[1] + 1) - this.c) / this.a
      const x1 = (-this.b * (context.fenetreMathalea2d[3] - 1) - this.c) / this.a
      if (y0 > context.fenetreMathalea2d[1] && y0 < context.fenetreMathalea2d[3]) {
        absNom = context.fenetreMathalea2d[0] + 1
        ordNom = y0 + this.pente
      } else {
        if (y1 > context.fenetreMathalea2d[1] && y1 < context.fenetreMathalea2d[3]) {
          absNom = context.fenetreMathalea2d[2] - 1
          ordNom = y1 - this.pente
        } else {
          if (x0 > context.fenetreMathalea2d[0] && x0 < context.fenetreMathalea2d[2]) {
            absNom = x0
            ordNom = context.fenetreMathalea2d[1] + Math.abs(this.pente)
          } else {
            if (x1 > context.fenetreMathalea2d[0] && x1 < context.fenetreMathalea2d[2]) {
              absNom = x1
              ordNom = context.fenetreMathalea2d[3] + this.pente
            } else {
              absNom = (context.fenetreMathalea2d[0] + context.fenetreMathalea2d[2]) / 2
              ordNom = pointSurDroite(this, absNom).y
            }
          }
        }
      }
    }
    leNom = texteParPosition(this.nom, absNom, ordNom, 'milieu', this.color, 1, 'middle', true)
  } else leNom = vide2d()
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
    const A = point(this.x1, this.y1)
    const B = point(this.x2, this.y2)
    const A1 = pointSurSegment(A, B, -50)
    const B1 = pointSurSegment(B, A, -50)
    if (this.nom === '') {
      return `<line x1="${A1.xSVG(coeff)}" y1="${A1.ySVG(coeff)}" x2="${B1.xSVG(
        coeff
      )}" y2="${B1.ySVG(coeff)}" stroke="${this.color[0]}" ${this.style} id ="${this.id}" />`
    } else {
      return `<line x1="${A1.xSVG(coeff)}" y1="${A1.ySVG(coeff)}" x2="${B1.xSVG(
        coeff
      )}" y2="${B1.ySVG(coeff)}" stroke="${this.color[0]}" ${this.style} id ="${this.id}" />` + leNom.svg(coeff)
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
      tableauOptions.push(`opacity = ${this.opacite}`)
    }

    let optionsDraw = []
    if (tableauOptions.length > 0) {
      optionsDraw = '[' + tableauOptions.join(',') + ']'
    }
    const A = point(this.x1, this.y1)
    const B = point(this.x2, this.y2)
    const A1 = pointSurSegment(A, B, -50)
    const B1 = pointSurSegment(B, A, -50)

    if (this.nom !== '') {
      return `\\draw${optionsDraw} (${A1.x},${A1.y})--(${B1.x},${B1.y});` + leNom.tikz()
    } else {
      return `\\draw${optionsDraw} (${A1.x},${A1.y})--(${B1.x},${B1.y});`
    }
  }
  this.svgml = function (coeff, amp) {
    const A = point(this.x1, this.y1)
    const B = point(this.x2, this.y2)
    const A1 = pointSurSegment(A, B, -50)
    const B1 = pointSurSegment(B, A, -50)
    const s = segment(A1, B1, this.color[0])
    s.isVisible = this.isVisible
    return s.svgml(coeff, amp) + leNom.svg(coeff)
  }
  this.tikzml = function (amp) {
    const A = point(this.x1, this.y1)
    const B = point(this.x2, this.y2)
    const A1 = pointSurSegment(A, B, -50)
    const B1 = pointSurSegment(B, A, -50)
    const s = segment(A1, B1, this.color[1])
    s.isVisible = this.isVisible
    return s.tikzml(amp) + leNom.tikz()
  }
}

/**  Trace une droite définie par 2 points OU BIEN par les coefficients de son équation
 * @param {Point | number} arg1 Premier point de la droite OU BIEN coefficient a de l'équation de la droite ax+by+c=0 avec (a,b)!=(0,0)
 * @param {Point | number} arg2 Deuxième point de la droite OU BIEN coefficient b de l'équation de la droite ax+by+c=0 avec (a,b)!=(0,0)
 * @param {string | number} arg3 Nom affiché de la droite OU BIEN coefficient c de l'équation de la droite ax+by+c=0
 * @param {string} arg4 Couleur de la droite : du type 'blue' ou du type '#f15929' OU BIEN nom affiché de la droite si arg1 est un nombre
 * @param {string} arg5 Couleur de la droite : du type 'blue' ou du type '#f15929' si arg1 est un nombre
 * @example droite(M, N, '(d1)') // Trace la droite passant par M et N se nommant (d1) et de couleur noire
 * @example droite(M, N, '(d1)','blue') // Trace la droite passant par M et N se nommant (d1) et de couleur bleue
 * @example droite(m, n, p) // Trace la droite définie par les coefficients de mx+ny+p=0 et de couleur noire
 * @example droite(m, n, p, '(d1)', 'red') // Trace la droite définie par les coefficients de mx+ny+p=0, se nommant (d1) et de couleur rouge
 * @author Jean-Claude Lhote
 * @return {Droite}
 */
export function droite (...args) {
  return new Droite(...args)
}

/**  Donne la position du point A par rapport à la droite d
 * @param {Droite} d
 * @param {Point} A
 * @param {number} [tolerance = 0.0001] Seuil de tolérance pour évaluer la proximité entre d et A.
 * @example dessousDessus(d1, M) // Renvoie la position de M par rapport à d1 parmi ces 5 possibilités : 'sur', 'droite', 'gauche', 'dessous', 'dessus'
 * @example dessousDessus(d1, M, 0.005) // Renvoie la position de M par rapport à d1 parmi ces 5 possibilités : 'sur', 'droite', 'gauche', 'dessous', 'dessus' (avec une tolérance de 0,005)
 * @return {'sur' | 'droite' | 'gauche' | 'dessous' | 'dessus'}
 */
// JSDOC Validee par EE Aout 2022

export function dessousDessus (d, A, tolerance = 0.0001) {
  if (egal(d.a * A.x + d.b * A.y + d.c, 0, tolerance)) return 'sur'
  if (egal(d.b, 0)) {
    if (A.x < -d.c / d.a) return 'gauche'
    else return 'droite'
  } else {
    if (d.a * A.x + d.b * A.y + d.c < 0) return 'dessous'
    else return 'dessus'
  }
}

/**
 *
 * @param {droite} d
 * @param {number} param1 les bordures de la fenêtre
 * @return {Point} le point qui servira à placer le label.
 */
export function positionLabelDroite (d, { xmin = 0, ymin = 0, xmax = 10, ymax = 10 }) {
  let xLab, yLab
  let fXmax, fYmax, fXmin, fYmin
  if (d.b === 0) { // Si la droite est verticale son équation est x = -d.c/d.a on choisit un label au Nord.
    xLab = -d.b / d.c - 0.5
    yLab = ymax - 0.5
  } else { // la droite n'étant pas verticale, on peut chercher ses intersections avec les différents bords.
    const f = x => (-d.c - d.a * x) / d.b
    fXmax = f(xmax)
    if (fXmax <= ymax && fXmax >= ymin) { // la droite coupe le bord Est entre ymin+1 et ymax-1
      xLab = xmax - 0.8
      yLab = f(xLab)
    } else {
      fXmin = f(xmin)
      if (fXmin <= ymax && fXmin >= ymin) {
        xLab = xmin + 0.8
        yLab = f(xLab)
      } else { // la droite ne coupe ni la bordue Est ni la bordure Ouest elle coupe donc les bordures Nord et Sud
        const g = y => (-d.c - d.b * y) / d.a
        fYmax = g(ymax)
        if (fYmax <= xmax && fYmax >= xmin) {
          yLab = ymax - 0.8
          xLab = g(yLab)
        } else {
          fYmin = g(ymin)
          if (fYmin <= xmax && fYmin >= xmin) {
            yLab = ymin + 0.8
            xLab = g(yLab)
          } else { // La droite ne passe pas dans la fenêtre on retourne un objet vide
            return vide2d()
          }
        }
      }
    }
  }
  const position = translation(point(xLab, yLab), homothetie(vecteur(d.a, d.b), point(0, 0), 0.5 / norme(vecteur(d.a, d.b))))
  return position
}

/**  Trace la droite passant par le point A et de vecteur directeur v
 * @param {Point} A Point de la droite
 * @param {Vecteur} v Vecteur directeur de la droite
 * @param {string} [nom = ''] Nom affiché de la droite
 * @param {string} [color = 'black'] Couleur de la droite : du type 'blue' ou du type '#f15929'
 * @example droiteParPointEtVecteur(M, v1) // Trace la droite passant par le point M et de vecteur directeur v1
 * @example droiteParPointEtVecteur(M, v1, 'd1', 'red') // Trace, en rouge, la droite d1 passant par le point M et de vecteur directeur v1
 * @author Jean-Claude Lhote
 * @return {Droite}
 */
// JSDOC Validee par EE Aout 2022
export function droiteParPointEtVecteur (A, v, nom = '', color = 'black') {
  const B = point(A.x + v.x, A.y + v.y)
  return new Droite(A, B, nom, color)
}

/**  Trace la droite parallèle à d passant par le point A
 * @param {Point} A Point de la droite
 * @param {Droite} d Droite
 * @param {string} [nom = ''] Nom affiché de la droite
 * @param {string} [color = 'black'] Couleur de la droite : du type 'blue' ou du type '#f15929'
 * @example droiteParPointEtParallele(M, d2) // Trace la droite parallèle à d2 passant par le point M
 * @example droiteParPointEtParallele(M, d2, 'd1', 'red') // Trace, en rouge, la droite d1 parallèle à d2 passant par le point M
 * @author Jean-Claude Lhote
 * @return {droiteParPointEtVecteur}
 */
// JSDOC Validee par EE Aout 2022
export function droiteParPointEtParallele (A, d, nom = '', color = 'black') {
  return droiteParPointEtVecteur(A, d.directeur, nom, color)
}

/**  Trace la droite perpendiculaire à d passant par le point A
 * @param {Point} A Point de la droite
 * @param {Droite} d Droite
 * @param {string} [nom = ''] Nom affiché de la droite
 * @param {string} [color = 'black'] Couleur de la droite : du type 'blue' ou du type '#f15929'
 * @example droiteParPointEtPerpendiculaire(M, d2) // Trace la droite perpendiculaire à d2 passant par le point M
 * @example droiteParPointEtPerpendiculaire(M, d2, 'd1', 'red') // Trace, en rouge, la droite d1 perpendiculaire à d2 passant par le point M
 * @author Jean-Claude Lhote
 * @return {droiteParPointEtVecteur}
 */
// JSDOC Validee par EE Aout 2022
export function droiteParPointEtPerpendiculaire (A, d, nom = '', color = 'black') {
  return droiteParPointEtVecteur(A, d.normal, nom, color)
}

/**  Trace la droite horizontale passant par le point A
 * @param {Point} A Point de la droite
 * @param {string} [nom = ''] Nom affiché de la droite
 * @param {string} [color = 'black'] Couleur de la droite : du type 'blue' ou du type '#f15929'
 * @example droiteHorizontaleParPoint(M) // Trace la droite horizontale passant par le point M
 * @example droiteHorizontaleParPoint(M, 'd1', 'red') // Trace, en rouge, la droite horizontale d1 passant par le point M
 * @author Jean-Claude Lhote
 * @return {droiteParPointEtPente}
 */
// JSDOC Validee par EE Aout 2022
export function droiteHorizontaleParPoint (A, nom = '', color = 'black') {
  return droiteParPointEtPente(A, 0, nom, color)
}

/**  Trace la droite verticale passant par le point A
 * @param {Point} A Point de la droite
 * @param {string} [nom = ''] Nom affiché de la droite
 * @param {string} [color = 'black'] Couleur de la droite : du type 'blue' ou du type '#f15929'
 * @example droiteVerticaleParPoint(M) // Trace la droite verticale passant par le point M
 * @example droiteVerticaleParPoint(M, 'd1', 'red') // Trace, en rouge, la droite verticale d1 passant par le point M
 * @author Jean-Claude Lhote
 * @return {droiteParPointEtVecteur}
 */
// JSDOC Validee par EE Aout 2022
export function droiteVerticaleParPoint (A, nom = '', color = 'black') {
  return droiteParPointEtVecteur(A, vecteur(0, 1), nom, color)
}

/**  Trace la droite passant par le point A et de pente k
 * @param {Point} A Point de la droite
 * @param {number} k Pente de la droite
 * @param {string} [nom = ''] Nom affiché de la droite
 * @param {string} [color = 'black'] Couleur de la droite : du type 'blue' ou du type '#f15929'
 * @example droiteParPointEtPente(M, p) // Trace la droite passant par le point M et de pente p
 * @example droiteParPointEtPente(M, p, 'd1', 'red') // Trace, en rouge, la droite d1 passant par le point M et de pente p
 * @author Jean-Claude Lhote
 * @return {Droite}
 */
// JSDOC Validee par EE Aout 2022
export function droiteParPointEtPente (A, k, nom = '', color = 'black') {
  const B = point(A.x + 1, A.y + k)
  return new Droite(A, B, nom, color)
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%% LES DROITES REMARQUABLES %%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/**
 * Code le milieu d'un segment
 * @param {Point} A Première extrémité du segment
 * @param {Point} B Seconde extrémité du segment
 * @param {string} [color='black'] Couleur du codage : du type 'blue' ou du type '#f15929'.
 * @param {string} [mark='x'] Symbole posé sur les deux parties du segment
 * @param {boolean} [mil=true] Trace ou nom le point du milieu.
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} color Couleur du codage. À associer obligatoirement à colorToLatexOrHTML().
 * @author Jean-Claude Lhote
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function CodageMilieu (A, B, color = 'black', mark = '×', mil = true) {
  if (longueur(A, B) < 0.1) window.notify('CodageMilieu : Points trop rapprochés pour créer ce codage', { A, B })
  ObjetMathalea2D.call(this, {})
  this.color = color
  const O = milieu(A, B)
  const d = droite(A, B)
  const M = tracePointSurDroite(O, d, this.color)
  const v = codageSegments(mark, this.color, A, O, O, B)
  let code = ''
  this.svg = function (coeff) {
    if (mil) code = M.svg(coeff) + '\n' + v.svg(coeff)
    else code = v.svg(coeff)
    code = `<g id="${this.id}">${code}</g>`
    return code
  }
  this.tikz = function () {
    if (mil) return M.tikz() + '\n' + v.tikz()
    else return v.tikz()
  }
}

/**
 * Code le milieu d'un segment
 * @param {Point} A Première extrémité du segment
 * @param {Point} B Seconde extrémité du segment
 * @param {string} [color = 'black'] Couleur du codage : du type 'blue' ou du type '#f15929'.
 * @param {string} [mark = 'x'] Symbole posé de part et d'autre du milieu du segment
 * @param {boolean} [mil = true] Trace ou nom le point du milieu.
 * @example codageMilieu(M,N) // Code, en noir, le milieu du segment[MN] avec les marques 'x', en plaçant le milieu
 * @example codageMilieu(M,N,'red','oo',false) // Code, en rouge, le milieu du segment[MN] avec les marques 'oo', sans placer le milieu.
 * @author Jean-Claude Lhote
 * @return {CodageMilieu}
 */
// JSDOC Validee par EE Juin 2022
export function codageMilieu (A, B, color = 'black', mark = '×', mil = true) {
  return new CodageMilieu(A, B, color, mark, mil)
}

/**
 * Trace la médiatrice d'un segment, en laissant éventuellement apparents les traits de construction au compas
 * @param {Point} A Première extrémité du segment
 * @param {Point} B Seconde extrémité du segment
 * @param {string} [nom = ''] Nom affiché de la droite
 * @param {string} [couleurMediatrice = 'red'] Couleur de la médiatrice : du type 'blue' ou du type '#f15929'
 * @param {string} [color='blue'] Couleur du codage : du type 'blue' ou du type '#f15929'.
 * @param {string} [couleurConstruction = 'black'] Couleur des traits de construction : du type 'blue' ou du type '#f15929'.
 * @param {boolean} [construction = false] Si construction est true, alors on affiche le codage et aussi les coups de compas utiles à la construction.
 * @param {boolean} [detail = false] Si detail est true, alors on affiche aussi en pointillés les rayons utiles à la construction.
 * @param {string} [markmilieu = 'x'] Symbole posé sur les deux parties du segment
 * @param {string} [markrayons = '||'] Symbole posé sur les quatre rayons (si détail est true)
 * @param {number} [epaisseurMediatrice = 1] Epaisseur de la médiatrice
 * @param {number} [opaciteMediatrice = 1] Taux d'opacité de la médiatrice
 * @param {number} [pointillesMediatrice = 0] Si cette valeur est entre 1 et 5, la médiatrice est en pointillés
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} svgml Sortie, à main levée, au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} tikzml Sortie, à main levée, au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} color Couleur du codage. À associer obligatoirement à colorToLatexOrHTML().
 * @property {string} couleurMediatrice Couleur de la médiatrice : du type 'blue' ou du type '#f15929'
 * @property {number} epaisseurMediatrice Epaisseur de la médiatrice
 * @property {number} opaciteMediatrice Taux d'opacité de la médiatrice
 * @property {number} pointillesMediatrice Si cette valeur est entre 1 et 5, la médiatrice est en pointillés
 * @property {string} couleurConstruction Couleur des traits de construction : du type 'blue' ou du type '#f15929'.
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function Mediatrice (
  A,
  B,
  nom = '',
  couleurMediatrice = 'red',
  color = 'blue',
  couleurConstruction = 'black',
  construction = false,
  detail = false,
  markmilieu = '×',
  markrayons = '||',
  epaisseurMediatrice = 1,
  opaciteMediatrice = 1,
  pointillesMediatrice = 0
) {
  if (longueur(A, B) < 0.1) {
    window.notify('ConstructionMediatrice : Points trop rapprochés pour créer cet objet', {
      A,
      B
    })
  }
  ObjetMathalea2D.call(this, {})
  this.color = color
  this.couleurMediatrice = couleurMediatrice
  this.epaisseurMediatrice = epaisseurMediatrice
  this.opaciteMediatrice = opaciteMediatrice
  this.pointillesMediatrice = pointillesMediatrice
  this.couleurConstruction = couleurConstruction
  const O = milieu(A, B)
  const m = rotation(A, O, 90)
  const n = rotation(A, O, -90)
  const M = pointSurSegment(O, m, longueur(A, B) * 0.785)
  const N = pointSurSegment(O, n, longueur(A, B) * 0.785)
  const d = droite(M, N, nom, this.couleurMediatrice)
  if (arguments.length < 5) {
    return d
  } else {
    d.isVisible = false
    d.epaisseur = this.epaisseurMediatrice
    d.opacite = this.opaciteMediatrice
    d.pointilles = this.pointillesMediatrice
    const objets = [d]
    if (construction) {
      const arcm1 = traceCompas(A, M, 20, this.couleurConstruction)
      const arcm2 = traceCompas(B, M, 20, this.couleurConstruction)
      const arcn1 = traceCompas(A, N, 20, this.couleurConstruction)
      const arcn2 = traceCompas(B, N, 20, this.couleurConstruction)
      arcm1.isVisible = false
      arcm2.isVisible = false
      arcn1.isVisible = false
      arcn2.isVisible = false
      const codage = codageMediatrice(A, B, this.color, markmilieu)
      codage.isVisible = false
      objets.push(arcm1, arcm2, arcn1, arcn2, d, codage)
    }
    if (detail) {
      const sAM = segment(A, M, this.couleurConstruction)
      sAM.pointilles = 5
      const sBM = segment(B, M, this.couleurConstruction)
      sBM.pointilles = 5
      const sAN = segment(A, N, this.couleurConstruction)
      sAN.pointilles = 5
      const sBN = segment(B, N, this.couleurConstruction)
      sBN.pointilles = 5
      const codes = codageSegments(markrayons, this.color, A, M, B, M, A, N, B, N)
      objets.push(sAM, sBM, sAN, sBN, codes)
    }
    this.svg = function (coeff) {
      let code = ''
      for (const objet of objets) {
        code += '\n\t' + objet.svg(coeff)
      }
      code = `<g id="${this.id}">${code}</g>`
      return code
    }
    this.tikz = function () {
      let code = ''
      for (const objet of objets) {
        code += '\n\t' + objet.tikz()
      }
      return code
    }
    this.svgml = function (coeff, amp) {
      let code = ''
      for (const objet of objets) {
        if (typeof (objet.svgml) === 'undefined') code += '\n\t' + objet.svg(coeff)
        else code += '\n\t' + objet.svgml(coeff, amp)
      }
      return code
    }
    this.tikzml = function (amp) {
      let code = ''
      for (const objet of objets) {
        if (typeof (objet.tikzml) === 'undefined') code += '\n\t' + objet.tikz()
        else code += '\n\t' + objet.tikzml(amp)
      }
      return code
    }
  }
}

/**
 * Trace la médiatrice d'un segment, en laissant éventuellement apparents les traits de construction au compas
 * @param {Point} A Première extrémité du segment
 * @param {Point} B Seconde extrémité du segment
 * @param {string} [nom=''] Nom affiché de la droite
 * @param {string} [couleurMediatrice = 'red'] Couleur de la médiatrice : du type 'blue' ou du type '#f15929'
 * @param {string} [color='blue'] Couleur du codage : du type 'blue' ou du type '#f15929'.
 * @param {string} [couleurConstruction='black'] Couleur des traits de construction : du type 'blue' ou du type '#f15929'.
 * @param {boolean} [construction=false] Si construction est true, alors on affiche le codage et aussi les coups de compas utiles à la construction.
 * @param {boolean} [detail=false] Si detail est true, alors on affiche aussi en pointillés les rayons utiles à la construction.
 * @param {string} [markmilieu='x'] Symbole posé sur les deux parties du segment
 * @param {string} [markrayons='||'] Symbole posé sur les quatre rayons (si détail est true)
 * @param {number} [epaisseurMediatrice = 1] Epaisseur de la médiatrice
 * @param {number} [opaciteMediatrice = 1] Taux d'opacité de la médiatrice
 * @param {number} [pointillesMediatrice = 0] Si cette valeur est entre 1 et 5, la médiatrice est en pointillés
 * @example mediatrice(M,N)
 * // Trace, en rouge, la médiatrice du segment[MN], d'épaisseur 1, avec une opacité de 100 % sans autre option
 * @example mediatrice(M,N,'d','blue')
 * // Trace, en bleu, la médiatrice du segment[MN], d'épaisseur 1, avec une opacité de 100 % et qui s'appelle 'd'
 * @example mediatrice(M,N,'','blue','red','green',true,true,'OO','XX',2,0.5,3)
 * // Trace, en bleu, la médiatrice du segment[MN], d'épaisseur 2, avec une opacité de 50 % sans nom
 * // Les traits de construction sont dessinés en vert avec la marque 'OO' pour le segment initial et la marque 'XX' pour les rayons, toutes ces marques étant rouge.
 * @author Rémi Angot {amendée par Eric Elter en juin 2022}
 * @return {Mediatrice}
 */
// JSDOC Validee par EE Juin 2022
export function mediatrice (A, B, nom = '', couleurMediatrice = 'red', color = 'blue', couleurConstruction = 'black', construction = false, detail = false, markmilieu = '×', markrayons = '||', epaisseurMediatrice = 1, opaciteMediatrice = 1, pointillesMediatrice = 0) {
  if (arguments.length < 5) return new Mediatrice(A, B, nom, couleurMediatrice)
  else return new Mediatrice(A, B, nom, couleurMediatrice, color, couleurConstruction, construction, detail, markmilieu, markrayons, epaisseurMediatrice, opaciteMediatrice, pointillesMediatrice)
}

/**
 * Code la médiatrice d'un segment
 * @param {Point} A Première extrémité du segment
 * @param {Point} B Seconde extrémité du segment
 * @param {string} [color='black'] Couleur du codage : du type 'blue' ou du type '#f15929'.
 * @param {string} [mark='x'] Symbole posé sur les deux parties du segment
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} svgml Sortie, à main levée, au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} tikzml Sortie, à main levée, au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} color Couleur du codage. À associer obligatoirement à colorToLatexOrHTML().
 * @author  Rémi Angot
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function CodageMediatrice (A, B, color = 'black', mark = '×') {
  if (longueur(A, B) < 0.1) window.notify('CodageMediatrice : Points trop rapprochés pour créer ce codage', { A, B })
  ObjetMathalea2D.call(this, {})
  this.color = color
  const O = milieu(A, B)
  const M = rotation(A, O, 90)
  const c = codageAngleDroit(M, O, B, this.color)
  const v = codageSegments(mark, this.color, A, O, O, B)
  c.isVisible = false
  v.isVisible = false
  this.svg = function (coeff) {
    const code = `<g id="${this.id}">${c.svg(coeff) + '\n' + v.svg(coeff)}</g>`
    return code
  }
  this.tikz = function () {
    return c.tikz() + '\n' + v.tikz()
  }
  this.svgml = function (coeff, amp) {
    return c.svgml(coeff, amp) + '\n' + v.svg(coeff)
  }
  this.tikzml = function (amp) {
    return c.tikzml(amp) + '\n' + v.tikz()
  }
}

/**
 * Code la médiatrice d'un segment
 * @param {Point} A Première extrémité du segment
 * @param {Point} B Seconde extrémité du segment
 * @param {string} [color='black'] Couleur du codage : du type 'blue' ou du type '#f15929'.
 * @param {string} [mark='x'] Symbole posé sur les deux parties du segment
 * @example codageMediatrice(M,N) // Code, en noir, la médiatrice du segment[MN] avec les marques 'x'
 * @example codageMediatrice(M,N,'red','oo') // Code, en rouge, la médiatrice du segment[MN] avec les marques 'oo'
 * @author  Rémi Angot
 * @return {CodageMediatrice}
 */
// JSDOC Validee par EE Juin 2022
export function codageMediatrice (A, B, color = 'black', mark = '×') {
  return new CodageMediatrice(A, B, color, mark)
}

/**
 * Trace la bissectrice d'un angle, en laissant éventuellement apparents les traits de construction au compas
 * @param {Point} A Point sur un côté de l'angle
 * @param {Point} O Sommet de l'angle
 * @param {Point} B Point sur l'autre côté de l'angle
 * @param {string} [couleurBissectrice = 'red'] Couleur de la médiatrice : du type 'blue' ou du type '#f15929'. Si 'none' ou '', pas de hachures.
 * @param {string} [color='blue'] Couleur du codage : du type 'blue' ou du type '#f15929'.
 * @param {string} [couleurConstruction = 'black'] Couleur de la médiatrice : du type 'blue' ou du type '#f15929'. Si 'none' ou '', pas de hachures.
 * @param {boolean} [construction=false] Si construction est true, alors on affiche le codage et aussi les coups de compas utiles à la construction.
 * @param {boolean} [detail=false] Si detail est true, alors on affiche aussi en pointillés les rayons utiles à la construction.
 * @param {string} [mark='×'] Symbole posé sur les arcs
 * @param {number} [tailleLosange = 5] Longueur d'un côté du losange de construction
 * @param {number} [epaisseurBissectrice = 1] Epaisseur de la bissectrice
 * @param {number} [opaciteBissectrice = 1] Taux d'opacité de la bissectrice
 * @param {number} [pointillesBissectrice = 0] Si cette valeur est entre 1 et 5, la bissectrice est en pointillés
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} couleurBissectrice Couleur de la médiatrice : du type 'blue' ou du type '#f15929'. Si 'none' ou '', pas de hachures.
 * @property {string} color Couleur du codage. À associer obligatoirement à colorToLatexOrHTML().
 * @property {string} couleurConstruction Couleur de la médiatrice. À associer obligatoirement à colorToLatexOrHTML(). Si 'none' ou '', pas de hachures.
 * @property {string} mark Symbole posé sur les arcs
 * @property {number} tailleLosange Longueur d'un côté du losange de construction
 * @property {number} epaisseurBissectrice Epaisseur de la bissectrice
 * @property {number} opaciteBissectrice Taux d'opacité de la bissectrice
 * @property {number} pointillesBissectrice Si cette valeur est entre 1 et 5, la bissectrice est en pointillés
 * @author Rémi Angot (amendée par Eric Elter en juin 2022)
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function Bissectrice (
  A,
  O,
  B,
  couleurBissectrice = 'red',
  color = 'blue',
  couleurConstruction = 'black',
  construction = false,
  detail = false,
  mark = '×',
  tailleLosange = 5,
  epaisseurBissectrice = 1,
  opaciteBissectrice = 1,
  pointillesBissectrice = ''
) {
  ObjetMathalea2D.call(this, {})
  this.color = color
  this.tailleLosange = tailleLosange
  this.mark = mark
  this.couleurBissectrice = couleurBissectrice
  this.epaisseurBissectrice = epaisseurBissectrice
  this.couleurConstruction = couleurConstruction
  this.opaciteBissectrice = opaciteBissectrice
  this.pointillesBissectrice = pointillesBissectrice
  if (longueur(A, O) < 0.001 || longueur(O, B) < 0.001) window.notify('Bissectrice : points confondus', { A, O, B })
  // Construction de la bissectrice
  const demiangle = angleOriente(A, O, B) / 2
  const m = pointSurSegment(O, A, 3)
  const X = rotation(m, O, demiangle)
  const d = demiDroite(O, X, this.couleurBissectrice)
  // Fin de construction de la bissectrice
  if (arguments.length < 5) {
    return d
  } else {
    d.epaisseur = this.epaisseurBissectrice
    d.opacite = this.opaciteBissectrice
    d.pointilles = this.pointillesBissectrice
    const objets = [d]
    const M = pointSurSegment(O, A, this.tailleLosange)
    const N = pointSurSegment(O, B, this.tailleLosange)
    const dMN = droite(M, N)
    dMN.isVisible = false
    const P = symetrieAxiale(O, dMN)
    if (construction || detail) {
      if (!M.estSur(segment(O, A))) {
        const sOM = segment(O, M, this.couleurConstruction)
        objets.push(sOM)
      }
      if (!N.estSur(segment(O, B))) {
        const sON = segment(O, N, this.couleurConstruction)
        objets.push(sON)
      }
      if (construction) {
        const codage = codageBissectrice(A, O, B, this.color, mark)
        const tNP = traceCompas(N, P, 20, this.couleurConstruction)
        const tMP = traceCompas(M, P, 20, this.couleurConstruction)
        const tOM = traceCompas(O, M, 20, this.couleurConstruction)
        const tON = traceCompas(O, N, 20, this.couleurConstruction)
        objets.push(codage, tNP, tMP, tOM, tON)
      }
      if (detail) {
        const sMP = segment(M, P, this.couleurConstruction)
        const sNP = segment(N, P, this.couleurConstruction)
        sMP.pointilles = 5
        sNP.pointilles = 5
        const codes = codageSegments(this.mark, this.color, O, M, M, P, O, N, N, P)
        objets.push(sMP, sNP, codes)
      }
    }

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
}

/**
 * Trace la bissectrice d'un angle, en laissant éventuellement apparents les traits de construction au compas
 * @param {Point} A Point sur un côté de l'angle
 * @param {Point} O Sommet de l'angle
 * @param {Point} B Point sur l'autre côté de l'angle
 * @param {string} [couleurBissectrice = 'red'] Couleur de la médiatrice : du type 'blue' ou du type '#f15929' Si 'none' ou '', pas de hachures.
 * @param {string} [color='blue'] Couleur du codage : du type 'blue' ou du type '#f15929'.
 * @param {string} [couleurConstruction = 'black'] Couleur de la médiatrice : du type 'blue' ou du type '#f15929' Si 'none' ou '', pas de hachures.
 * @param {boolean} [construction=false] Si construction est true, alors on affiche le codage et aussi les coups de compas utiles à la construction.
 * @param {boolean} [detail=false] Si detail est true, alors on affiche aussi en pointillés les rayons utiles à la construction.
 * @param {string} [mark='×'] Symbole posé sur les arcs
 * @param {number} [tailleLosange = 5] Longueur d'un côté du losange de construction
 * @param {number} [epaisseurBissectrice = 1] Epaisseur de la bissectrice
 * @param {number} [opaciteBissectrice = 1] Taux d'opacité de la bissectrice
 * @param {number} [pointillesBissectrice = 0] Si cette valeur est entre 1 et 5, la bissectrice est en pointillés
 * @example bissectrice(N,R,J)
 * // Trace, en rouge, la bissectrice de l'angle NRJ, d'épaisseur 1 et d'opacité 100 %, sans autre option
 * @example bissectrice(N,R,J,'blue')
 * // Trace, en bleu, la bissectrice de l'angle NRJ, d'épaisseur 1 et d'opacité 100 %, sans autre option
 * @example bissectrice(N,R,J,'blue','red','green',true,true,'||',6,2,0.5,3)
 * // Trace, en rouge, la bissectrice de l'angle NRJ, d'épaisseur 1 et d'opacité 100 %. Les traits de construction sont dessinés en vert avec les marques '||' en rouge.
 * @author Rémi Angot (amendée par Eric Elter en juin 2022)
 * @return {Bissectrice}
 */
// JSDOC Validee par EE Juin 2022
export function bissectrice (A, O, B, couleurBissectrice = 'red', color = 'blue', couleurConstruction = 'black', construction = false, detail = false, mark = '×', tailleLosange = 5, epaisseurBissectrice = 1, opaciteBissectrice = 1, pointillesBissectrice = '') {
  return new Bissectrice(A, O, B, couleurBissectrice, color, couleurConstruction, construction, detail, mark, tailleLosange, epaisseurBissectrice, opaciteBissectrice, pointillesBissectrice)
}

/**
 * Code la bissectrice d'un angle
 * @param {Point} A Point sur un côté de l'angle
 * @param {Point} O Sommet de l'angle
 * @param {Point} B Point sur l'autre côté de l'angle
 * @param {string} [color = 'black'] Couleur de la bissectrice : du type 'blue' ou du type '#f15929'
 * @param {string} [mark = 'x'] Symbole posé sur les arcs
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} color Couleur de la bissectrice. À associer obligatoirement à colorToLatexOrHTML().
 * @property {string} mark Symbole posé sur les arcs
 * @property {Point} centre Sommet de l'angle
 * @property {Point} depart Point sur un côté de l'angle (équivalent au point A)
 * @author Jean-Claude Lhote
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function CodageBissectrice (A, O, B, color = 'black', mark = 'x') {
  ObjetMathalea2D.call(this, {})
  this.color = color
  this.mark = mark
  this.centre = O
  this.depart = pointSurSegment(O, A, 1.5)
  const demiangle = angleOriente(A, O, B) / 2
  const lieu = rotation(this.depart, O, demiangle)

  this.svg = function (coeff) {
    const a1 = codageAngle(pointSurSegment(this.centre, this.depart, 30 / coeff), O, demiangle, 30 / coeff, this.mark, this.color, 1, 1)
    const a2 = codageAngle(pointSurSegment(this.centre, lieu, 30 / coeff), O, demiangle, 30 / coeff, this.mark, this.color, 1, 1)
    return (
      a1.svg(coeff) +
      '\n' +
      a2.svg(coeff) +
      '\n'
    )
  }
  this.tikz = function () {
    const a1 = codageAngle(pointSurSegment(this.centre, this.depart, 1.5 / context.scale), O, demiangle, 1.5 / context.scale, this.mark, this.color, 1, 1)
    const a2 = codageAngle(pointSurSegment(this.centre, lieu, 1.5 / context.scale), O, demiangle, 1.5 / context.scale, this.mark, this.color, 1, 1)
    return a1.tikz() + '\n' + a2.tikz() + '\n'
  }
}

/**
 * Code la bissectrice d'un angle
 * @param {Point} A Point sur un côté de l'angle
 * @param {Point} O Sommet de l'angle
 * @param {Point} B Point sur l'autre côté de l'angle
 * @param {string} [color = 'black'] Couleur de la bissectrice : du type 'blue' ou du type '#f15929'
 * @param {string} [mark='x'] Symbole posé sur les arcs
 * @example codagebissectrice(M,N,P) // Code, en noir, la bissectrice de l'angle MNP avec les marques 'x'
 * @example codagebissectrice(M,N,P,'red','oo') // Code, en rouge, la bissectrice de l'angle MNP avec les marques 'oo'
 * @author Jean-Claude Lhote
 * @return {CodageBissectrice}
 */
// JSDOC Validee par EE Juin 2022
export function codageBissectrice (A, O, B, color = 'black', mark = 'x') {
  return new CodageBissectrice(A, O, B, color, mark)
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%% LES LIGNES BRISÉES %%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

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
  if (points.length < 15) {
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

/**
 * v = vecteur('V') // son nom
 * v = vecteur(x,y) // ses composantes
 * v = vecteur(A,B) // son origine et son extrémité (deux Points)
 * v = vecteur(x,y,'v') // son nom et ses composantes.
 * v.representant(E,'blue') // Dessine le vecteur v issu de E, en bleu.
 * Commenter toutes les méthodes possibles
 * @author Jean-Claude Lhote et Rémi Angot
 */
export function Vecteur (arg1, arg2, nom = '') {
  ObjetMathalea2D.call(this, {})
  if (arguments.length === 1) {
    this.nom = arg1
  } else {
    if (typeof arg1 === 'number') {
      this.x = arg1
      this.y = arg2
    } else {
      this.x = arg2.x - arg1.x
      this.y = arg2.y - arg1.y
    }
    this.nom = nom
  }
  this.norme = function () {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }
  this.oppose = function () {
    this.x = -this.x
    this.y = -this.y
  }
  this.xSVG = function (coeff) {
    return this.x * coeff
  }
  this.ySVG = function (coeff) {
    return -this.y * coeff
  }
  this.representant = function (A, color = 'black') {
    const B = point(A.x + this.x, A.y + this.y)
    const s = segment(A, B, color, '|->')
    return s
  }
  this.representantNomme = function (A, nom, taille = 1, color = 'black') {
    let s, angle, v
    const B = point(A.x + this.x, A.y + this.y)
    const M = milieu(A, B)
    s = segment(A, B, color)
    angle = s.angleAvecHorizontale
    v = similitude(this, A, 90, 0.5 / this.norme())
    if (Math.abs(angle) > 90) {
      s = segment(B, A, color)
      angle = s.angleAvecHorizontale
      v = similitude(this, A, -90, 0.5 / this.norme())
    }
    const N = translation(M, v)
    return nomVecteurParPosition(nom, N.x, N.y, taille, 0, color)
  }
}

/**
 * @example v = vecteur('V') // son nom
 * @example v = vecteur(x,y) // ses composantes
 * @example v = vecteur(A,B) // son origine et son extrémité (deux Points)
 * @example v = vecteur(x,y,'v') // son nom et ses composantes.
 * @author Jean-Claude Lhote et Rémi Angot
 */
export function vecteur (arg1, arg2, nom = '') {
  return new Vecteur(arg1, arg2, nom)
}

/**
 * @author Jean-Claude Lhote le 31/01/2021
 * crée un nom de vecteur avec sa petite flèche
 * l'angle formé par avec l'horizontale est à donner comme argument, par défaut c'est 0
 * la taille impactera le nom et la flèche en proportion.
 * (x,y) sont les coordonnées du centre du nom.
 */
export function NomVecteurParPosition (nom, x, y, taille = 1, angle = 0, color = 'black') {
  ObjetMathalea2D.call(this, {})
  this.nom = nom
  this.x = x
  this.y = y
  this.color = color
  this.angle = angle
  this.taille = taille
  const objets = []
  const t = texteParPosition(this.nom, this.x, this.y, -this.angle, this.color, this.taille, 'middle', true)
  const M = point(this.x, this.y)
  const P = point(M.x + 0.25 * this.nom.length, M.y)
  const M0 = similitude(P, M, 90 + this.angle, 2 / this.nom.length)
  const M1 = rotation(translation(M0, vecteur(P, M)), M0, this.angle)
  const M2 = rotation(M1, M0, 180)
  const s = segment(M1, M2, this.color)
  s.styleExtremites = '->'
  s.tailleExtremites = 2
  objets.push(t, s)
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

export function nomVecteurParPosition (nom, x, y, taille = 1, angle = 0, color = 'black') {
  return new NomVecteurParPosition(nom, x, y, taille, angle, color)
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%% LES SEGMENTS %%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/**
 * s = segment(A, B) //Segment d'extrémités A et B
 * s = segment(A,B,'blue') //Segment d'extrémités A et B et de couleur bleue
 * s = segment(x1,y1,x2,y2) //Segment défini par les coordonnées des deux extrémités
 * s = segment(x1,y1,x2,y2,'blue') //Segment défini par les coordonnées des deux extrémités et de couleur bleue
 * @class
 * @author Rémi Angot
 */
export function Segment (arg1, arg2, arg3, arg4, color, styleExtremites = '') {
  ObjetMathalea2D.call(this, {})

  /**
   * Teste si un segment coupe un cercle, une droite, une demi-cercle ou un autre segment
   * @memberof Segment
   * @param {Segment | Droite | DemiDroite | Cercle} objet Objet géométrique dont on veut tester l'intersection avec le segment
   * @example s1.estSecant(d1) // Renvoie true si s1 est sécant avec d1, false sinon
   * @author Jean-Claude Lhote
   * @return {boolean}
   */
  // JSDOC Validee par EE Aout 2022
  this.estSecant = function (objet) {
    const ab = droite(this.extremite1, this.extremite2)
    ab.isVisible = false
    if (objet instanceof Cercle) {
      const P1 = pointIntersectionLC(ab, objet, '', 1)
      const P2 = pointIntersectionLC(ab, objet, '', 2)
      return ((P1 instanceof Point && P1.estSur(this)) || (P2 instanceof Point && P2.estSur(this)))
    }
    let I
    if (objet instanceof Droite) {
      I = pointIntersectionDD(ab, objet)
    } else {
      const cd = droite(objet.extremite1, objet.extremite2)
      cd.isVisible = false
      I = pointIntersectionDD(ab, cd)
    }
    if (!I) return false
    else return I.estSur(objet) && I.estSur(this)
  }

  this.typeObjet = 'segment'
  this.styleExtremites = styleExtremites
  this.tailleExtremites = 4
  if (arguments.length === 2) {
    if (isNaN(arg1.x) || isNaN(arg1.y) || isNaN(arg2.x) || isNaN(arg2.y)) {
      window.notify('Segment : (attendus : A et B) les arguments de sont pas des points valides', {
        arg1,
        arg2
      })
    }
    this.x1 = arg1.x
    this.y1 = arg1.y
    this.x2 = arg2.x
    this.y2 = arg2.y
  } else if (arguments.length === 3) {
    if (isNaN(arg1.x) || isNaN(arg1.y) || isNaN(arg2.x) || isNaN(arg2.y)) {
      window.notify('Segment : (attendus : A, B et "couleur") les arguments de sont pas des points valides', {
        arg1,
        arg2
      })
    }
    this.x1 = arg1.x
    this.y1 = arg1.y
    this.x2 = arg2.x
    this.y2 = arg2.y
    this.color = colorToLatexOrHTML(arg3)
  } else if (arguments.length === 4) {
    if (isNaN(arg3)) {
      this.x1 = arg1.x
      this.y1 = arg1.y
      this.x2 = arg2.x
      this.y2 = arg2.y
      this.color = colorToLatexOrHTML(arg3)
      this.styleExtremites = arg4
    } else {
      if (isNaN(arg1) || isNaN(arg2) || isNaN(arg3) || isNaN(arg4)) {
        window.notify('Segment : (attendus : x1, y1, x2 et y2) les arguments de sont pas des nombres valides', {
          arg1,
          arg2
        })
      }
      this.x1 = arg1
      this.y1 = arg2
      this.x2 = arg3
      this.y2 = arg4
    }
  } else {
    // Au moins 5 arguments
    if (isNaN(arg1) || isNaN(arg2) || isNaN(arg3) || isNaN(arg4)) {
      window.notify('Segment : (attendus : x1, y1, x2, y2 et "couleur") les arguments de sont pas des nombres valides', {
        arg1,
        arg2
      })
    }
    this.x1 = arg1
    this.y1 = arg2
    this.x2 = arg3
    this.y2 = arg4
    this.color = colorToLatexOrHTML(color)
    this.styleExtremites = styleExtremites
  }
  this.bordures = [Math.min(this.x1, this.x2) - 0.2, Math.min(this.y1, this.y2) - 0.2, Math.max(this.x1, this.x2) + 0.2, Math.max(this.y1, this.y2) + 0.2]
  this.extremite1 = point(this.x1, this.y1)
  this.extremite2 = point(this.x2, this.y2)
  this.longueur = Math.sqrt((this.x2 - this.x1) ** 2 + (this.y2 - this.y1) ** 2)
  this.angleAvecHorizontale = angleOriente(
    point(this.x1 + 1, this.y1),
    this.extremite1,
    this.extremite2
  )

  this.codeExtremitesSVG = function (coeff) {
    let code = ''
    const A = point(this.x1, this.y1)
    const B = point(this.x2, this.y2)
    const h = this.tailleExtremites
    if (this.styleExtremites.length > 1) {
      const fin = this.styleExtremites.slice(-1)
      if (fin === '|') {
        // si ça termine par | on le rajoute en B
        const M = pointSurSegment(B, A, h / context.pixelsParCm)
        const B1 = similitude(M, B, 90, 0.7)
        const B2 = similitude(M, B, -90, 0.7)
        code += `<line x1="${B1.xSVG(coeff)}" y1="${B1.ySVG(
          coeff
        )}" x2="${B2.xSVG(coeff)}" y2="${B2.ySVG(coeff)}" stroke="${this.color[0]
        }" stroke-width="${this.epaisseur}" />`
      }
      if (fin === '>') {
        // si ça termine par > on rajoute une flèche en B
        const M = pointSurSegment(B, A, h / context.pixelsParCm)
        const B1 = similitude(B, M, 90, 0.7)
        const B1EE = pointSurSegment(B, rotation(B, M, 90), -0.5 / context.pixelsParCm)
        const B2 = similitude(B, M, -90, 0.7)
        const B2EE = pointSurSegment(B, rotation(B, M, -90), 0.5 / context.pixelsParCm)
        code += `<line x1="${B1EE.xSVG(coeff)}" y1="${B1EE.ySVG(
          coeff
        )}" x2="${B1.xSVG(coeff)}" y2="${B1.ySVG(coeff)}" stroke="${this.color[0]
        }" stroke-width="${this.epaisseur}" />`
        code += `\n\t<line x1="${B2EE.xSVG(coeff)}" y1="${B2EE.ySVG(
          coeff
        )}" x2="${B2.xSVG(coeff)}" y2="${B2.ySVG(coeff)}" stroke="${this.color[0]}" stroke-width="${this.epaisseur}" />`
      }
      if (fin === '<') {
        // si ça termine par < on rajoute une flèche inversée en B
        const M = pointSurSegment(B, A, -h / context.pixelsParCm)
        const B1 = similitude(B, M, 90, 0.7)
        const B2 = similitude(B, M, -90, 0.7)
        code += `<line x1="${B.xSVG(coeff)}" y1="${B.ySVG(
          coeff
        )}" x2="${B1.xSVG(coeff)}" y2="${B1.ySVG(coeff)}" stroke="${this.color[0]
        }" stroke-width="${this.epaisseur}" />`
        code += `\n\t<line x1="${B.xSVG(coeff)}" y1="${B.ySVG(
          coeff
        )}" x2="${B2.xSVG(coeff)}" y2="${B2.ySVG(coeff)}" stroke="${this.color[0]
        }" stroke-width="${this.epaisseur}" />`
      }
      const debut = this.styleExtremites[0]
      if (debut === '<') {
        // si ça commence par < on rajoute une flèche en A
        const M = pointSurSegment(A, B, h / context.pixelsParCm)
        const A1 = rotation(A, M, 90)
        const A1EE = pointSurSegment(A, rotation(A, M, 90), -0.5 / context.pixelsParCm)
        const A2 = rotation(A, M, -90)
        const A2EE = pointSurSegment(A, rotation(A, M, -90), 0.5 / context.pixelsParCm)
        code += `<line x1="${A1EE.xSVG(coeff)}" y1="${A1EE.ySVG(
          coeff
        )}" x2="${A1.xSVG(coeff)}" y2="${A1.ySVG(coeff)}" stroke="${this.color[0]
        }" stroke-width="${this.epaisseur}" />`
        code += `\n\t<line x1="${A2EE.xSVG(coeff)}" y1="${A2EE.ySVG(
          coeff
        )}" x2="${A2.xSVG(coeff)}" y2="${A2.ySVG(coeff)}" stroke="${this.color[0]
        }" stroke-width="${this.epaisseur}" />`
      }
      if (debut === '>') {
        // si ça commence par > on rajoute une flèche inversée en A
        const M = pointSurSegment(A, B, -h / context.pixelsParCm)
        const A1 = rotation(A, M, 90)
        const A2 = rotation(A, M, -90)
        code += `<line x1="${A.xSVG(coeff)}" y1="${A.ySVG(
          coeff
        )}" x2="${A1.xSVG(coeff)}" y2="${A1.ySVG(coeff)}" stroke="${this.color[0]
        }" stroke-width="${this.epaisseur}" />`
        code += `\n\t<line x1="${A.xSVG(coeff)}" y1="${A.ySVG(
          coeff
        )}" x2="${A2.xSVG(coeff)}" y2="${A2.ySVG(coeff)}" stroke="${this.color[0]
        }" stroke-width="${this.epaisseur}" />`
      }
      if (debut === '|') {
        // si ça commence par | on le rajoute en A
        const N = pointSurSegment(A, B, h / context.pixelsParCm)
        const A1 = rotation(N, A, 90)
        const A2 = rotation(N, A, -90)
        code += `<line x1="${A1.xSVG(coeff)}" y1="${A1.ySVG(
          coeff
        )}" x2="${A2.xSVG(coeff)}" y2="${A2.ySVG(coeff)}" stroke="${this.color[0]
        }" stroke-width="${this.epaisseur}" />`
      }
    }
    return code
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
    let code = this.codeExtremitesSVG(coeff)
    const A = point(this.x1, this.y1)
    const B = point(this.x2, this.y2)

    code += `\n\t<line x1="${A.xSVG(coeff)}" y1="${A.ySVG(coeff)}" x2="${B.xSVG(
      coeff
    )}" y2="${B.ySVG(coeff)}" stroke="${this.color[0]}" ${this.style} />`

    if (this.styleExtremites.length > 0) {
      code = `<g id="${this.id}">${code}</g>`
    } else {
      code = code.replace('/>', `id="${this.id}" />`)
    }

    return code
  }

  this.tikz = function () {
    let optionsDraw = []
    const tableauOptions = []
    if (this.color[1].length > 1 && this.color[1] !== 'black') {
      tableauOptions.push(`color =${this.color[1]}`)
    }
    if (this.epaisseur !== 1) {
      tableauOptions.push(`line width = ${this.epaisseur}`)
    }
    if (this.opacite !== 1) {
      tableauOptions.push(`opacity = ${this.opacite}`)
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

    if (this.styleExtremites.length > 1) {
      tableauOptions.push(this.styleExtremites)
    }
    if (tableauOptions.length > 0) {
      optionsDraw = '[' + tableauOptions.join(',') + ']'
    }
    return `\\draw${optionsDraw} (${arrondi(this.x1)},${arrondi(this.y1)})--(${arrondi(this.x2)},${arrondi(this.y2)});`
  }
  this.svgml = function (coeff, amp) {
    this.style = 'fill="none"'
    if (this.epaisseur !== 1) {
      this.style += ` stroke-width="${this.epaisseur}" `
    }
    if (this.opacite !== 1) {
      this.style += ` stroke-opacity="${this.opacite}" `
    }

    const A = point(this.x1, this.y1)
    const B = point(this.x2, this.y2)
    const l = longueur(A, B)
    const dx = (B.xSVG(coeff) - A.xSVG(coeff)) / l / 2
    const dy = (B.ySVG(coeff) - A.ySVG(coeff)) / l / 2
    let code = `<path d="M ${A.xSVG(coeff)}, ${A.ySVG(coeff)} Q ${Math.round(A.xSVG(coeff), 0)}, ${A.ySVG(coeff)} `
    let p = 1
    for (let k = 0; k < 2 * l + 0.25; k += 0.5) {
      p++
      code += `${Math.round(A.xSVG(coeff) + k * dx + randint(-2, 2, 0) * amp)}, ${Math.round(A.ySVG(coeff) + k * dy + randint(-2, 2, 0) * amp)} `
    }
    if (p % 2 === 1) code += ` ${Math.round(B.xSVG(coeff), 0)}, ${B.ySVG(coeff)}" stroke="${this.color[0]}" ${this.style}/>`
    else code += ` ${Math.round(B.xSVG(coeff), 0)}, ${B.ySVG(coeff)} ${B.xSVG(coeff)}, ${B.ySVG(coeff)}" stroke="${this.color[0]}" ${this.style}/>`
    code += this.codeExtremitesSVG(coeff)
    return code
  }
  this.tikzml = function (amp) {
    const A = point(this.x1, this.y1)
    const B = point(this.x2, this.y2)
    let optionsDraw = []
    const tableauOptions = []
    if (this.color[1].length > 1 && this.color[1] !== 'black') {
      tableauOptions.push(`color =${this.color[1]}`)
    }
    if (this.epaisseur !== 1) {
      tableauOptions.push(`line width = ${this.epaisseur}`)
    }

    if (this.opacite !== 1) {
      tableauOptions.push(`opacity = ${this.opacite}`)
    }
    if (this.styleExtremites.length > 1) {
      tableauOptions.push(this.styleExtremites)
    }
    tableauOptions.push(`decorate,decoration={random steps , amplitude = ${amp}pt}`)
    optionsDraw = '[' + tableauOptions.join(',') + ']'

    const code = `\\draw${optionsDraw} (${arrondi(A.x)},${arrondi(A.y)})--(${arrondi(B.x)},${arrondi(B.y)});`
    return code
  }
}

/**
 * @param {...args} args Points ou coordonnées + couleur facultative en dernier
 * @example segment(A,B,'blue') // Segment [AB] de couleur bleu
 * @example segment(x1,y1,x2,y2,'#f15929') // Segment dont les extrémités sont respectivement (x1,y1) et (x2,y2), de couleur orange (#f15929)
 * @author Rémi Angot
 */

export function segment (...args) {
  return new Segment(...args)
}

/**
 * @param {...args} args Points ou coordonnées
 * @param {string} color Facultatif
 * @example segmentAvecExtremites(A,B,'blue')
 * @example segmentAvecExtremites(x1,y1,x2,y2,'#f15929')
 * @author Rémi Angot
 */
export function segmentAvecExtremites (...args) {
  const s = segment(...args)
  s.styleExtremites = '|-|'
  return s
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%% LES DEMI-DROITES %%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/**  Trace la demi-droite d'origine A passant par B
 * @param {Point} A Origine de la droite
 * @param {Point} B Point de la demi-droite, autre que l'origine
 * @param {string} [color = 'black'] Couleur de la demi-droite : du type 'blue' ou du type '#f15929'
 * @param {boolean} [extremites = false] Trace (ou pas) l'origine de la demi-droite
 * @property {string} color Couleur de la demi-droite. À associer obligatoirement à colorToLatexOrHTML().
 * @author Rémi Angot
 * @class
 */
// JSDOC Validee par EE Aout 2022
export function DemiDroite (A, B, color = 'black', extremites = false) {
  ObjetMathalea2D.call(this, {})
  const B1 = pointSurSegment(B, A, -10)
  this.color = color
  if (extremites) return new Segment(A, B1, this.color, '|-')
  else return new Segment(A, B1, this.color)
}

/**  Trace la demi-droite d'origine A passant par B
 * @param {Point} A
 * @param {Point} B
 * @param {string} [color='black'] Facultatif, 'black' par défaut
 * @param {boolean} [extremites = false] Trace (ou pas) l'origine de la demi-droite
 * @example demiDroite(M, N) // Trace la demi-droite d'origine M passant par N et de couleur noire
 * @example demiDroite(M, N, 'blue', true) // Trace la demi-droite d'origine M passant par N et de couleur bleue, en traçant le trait signifiant l'origine de la demi-droite
 * @author Rémi Angot
 * @return {DemiDroite}
 */
// JSDOC Validee par EE Aout 2022
export function demiDroite (A, B, color = 'black', extremites = false) {
  return new DemiDroite(A, B, color, extremites)
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
  this.opaciteDeRemplissage = 1
  this.epaisseurDesHachures = 1
  this.distanceDesHachures = 10
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
    this.nom = this.listePoints.join()
  } else {
    if (typeof points[points.length - 1] === 'string') {
      this.color = points[points.length - 1]
      points.splice(points.length - 1, 1)
    }
    this.listePoints = points
    this.nom = this.listePoints.join()
    this.couleurDeRemplissage = colorToLatexOrHTML('none')
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
        couleurDesHachures: this.couleurDesHachures[0],
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
        couleurDesHachures: this.couleurDesHachures[1],
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
 * Code un carré
 * @param {Polygone} c Carré à coder
 * @param {string} [color = 'black'] Couleur des codages : du type 'blue' ou du type '#f15929'
 * @param {string} [mark='x'] Symbole posé sur les côtés
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function CodageCarre (c, color = 'black', mark = '×') {
  const objets = []
  objets.push(codageSegments(mark, color, c.listePoints))
  objets.push(
    codageAngleDroit(
      c.listePoints[0],
      c.listePoints[1],
      c.listePoints[2],
      color
    )
  )
  objets.push(
    codageAngleDroit(
      c.listePoints[1],
      c.listePoints[2],
      c.listePoints[3],
      color
    )
  )
  objets.push(
    codageAngleDroit(
      c.listePoints[2],
      c.listePoints[3],
      c.listePoints[0],
      color
    )
  )
  objets.push(
    codageAngleDroit(
      c.listePoints[3],
      c.listePoints[0],
      c.listePoints[1],
      color
    )
  )

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

/**
 * Met un codage complet sur un carré
 * @param {Polygone} c Carré à coder
 * @param {string} [color = 'black'] Couleur des codages : du type 'blue' ou du type '#f15929'
 * @param {string} [mark='x'] Symbole posé sur les côtés
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @example codageCarre(carre) // Code, en noir, le carré carre.
 * @example codageCarre(carre,'red','||') // Code, en rouge, le carré carre avec la marque || sur les côtés
 * @return {CodageCarre}
 */
// JSDOC Validee par EE Juin 2022
export function codageCarre (c, color = 'black', mark = '×') {
  return new CodageCarre(c, color, mark)
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
 * Objet composé d'un rectangle horizontal et d'un texte optionnel à l'intérieur
 * Les paramètres sont les suivants :
 * Xmin, Ymin : coordonnées du sommet en bas à gauche
 * Xmax,Ymax : coordonnées du sommet en haut à droite
 * color : la couleur de la bordure
 * colorFill : 'none' sinon, la couleur de remplissage (exemple : 'orange') Code couleur HTML accepté
 * opaciteDeRemplissage : valeur de 0 (transparent) à 1 (opaque)
 * texteIn : texte à mettre à l'intérieur
 * tailleTexte : comme son nom l'indique la taille du texte (1 par défaut)
 * texteColor : sa couleur
 * textMath : un booléen qui détermine la police (true -> Book Antiqua Italic)
 * echelleFigure : pour passer la valeur de scale de tikzPicture (valeur scale de la commande mathalea) afin d'adapter la taille du texte dans la boite à la résolution
 * @class
 * @author Jean-Claude Lhote
 */
export class Boite {
  constructor ({
    Xmin = 0,
    Ymin = 0,
    Xmax = 1,
    Ymax = 1,
    color = 'black',
    colorFill = 'none',
    opaciteDeRemplissage = 0.7,
    texteIn = '',
    tailleTexte = 1,
    texteColor = 'black',
    texteOpacite = 0.7,
    texteMath = false,
    echelleFigure = 1
  } = {}) {
    ObjetMathalea2D.call(this, {})
    this.forme = polygone([point(Xmin, Ymin), point(Xmax, Ymin), point(Xmax, Ymax), point(Xmin, Ymax)], color)
    this.bordures = this.forme.bordures
    if (colorFill !== 'none') {
      this.forme.couleurDeRemplissage = colorToLatexOrHTML(colorFill)
      this.forme.opaciteDeRemplissage = opaciteDeRemplissage
    }
    if (texteIn !== '') {
      if (texteIn.charAt(0) === '$') {
        this.texte = latexParCoordonnees(texteIn.replaceAll('$', ''), (Xmin + Xmax) / 2, (Ymin + Ymax) / 2, texteColor)
      } else {
        this.texte = texteParPositionEchelle(texteIn, (Xmin + Xmax) / 2, (Ymin + Ymax) / 2, 'milieu', texteColor, tailleTexte, 'middle', texteMath, echelleFigure)
        this.texte.opacite = texteOpacite
      }
    } else {
      this.texte = false
    }
    this.svg = function (coeff) {
      return this.texte ? this.forme.svg(coeff) + this.texte.svg(coeff) : this.forme.svg(coeff)
    }
    this.tikz = function () {
      return this.texte ? this.forme.tikz() + this.texte.tikz() : this.forme.tikz()
    }
  }
}

/**
 * Crée un rectangle positionné horizontal/vertical avec possibilité d'écrire du texte dedans
 * @param {number} [Xmin = 0] abscisse du sommet en bas à gauche
 * @param {number} [Ymin = 0] ordonnée du sommet en bas à gauche
 * @param {number} [Xmax = 1] abscisse du sommet en haut à droite
 * @param {number} [Ymax = 1] ordonnée du sommet en haut à droite
 * @param {string} [color = 'black'] couleur du cadre
 * @param {string} [colorFill = 'none'] couleur de remplissage
 * @param {number} [opaciteDeRemplissage = 0.7] comme son nom l'indique utilisé si colorFill !== 'none'
 * @param {string} texteIn Texte à afficher (On peut passer du latex si texteIn commence et finit par $)
 * @param {number} [tailleTexte = 1] permet de modifier la taille du texteIn
 * @param {string} [texteColor = 'black'] permet de choisir la couleur du texteIn
 * @param {number} [texteOpacite = 0.7] indice d'opacité du texte de 0 à 1
 * @param {boolean} [texteMa = false] Si le texte n'est pas du latex, change la police pour mettre un style mathématique si true
 * @param {number} [echelleFigure = 1] permet de passer le scale utilisé dans la fonction mathalea2d afin d'adapter la taille du texte en latex
 * @return {Boite}
 * @author Rémi Angot et Frédéric Piou
 */
export function boite ({
  Xmin = 0,
  Ymin = 0,
  Xmax = 1,
  Ymax = 1,
  color = 'black',
  colorFill = 'none',
  opaciteDeRemplissage = 0.7,
  texteIn = '',
  tailleTexte = 1,
  texteColor = 'black',
  texteOpacite = 0.7,
  texteMath = false,
  echelleFigure = 1
} = {}) {
  return new Boite({
    Xmin,
    Ymin,
    Xmax,
    Ymax,
    color,
    colorFill,
    opaciteDeRemplissage,
    texteIn,
    tailleTexte,
    texteColor,
    texteOpacite,
    texteMath,
    echelleFigure
  })
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
/** ***************Triangles ******************/

/*********************************************/

/**
 * retourne un objet contenant le triangle ABC et le pied de la hauteur H
 * @param {point} A première extrémité de la base
 * @param {point} B deuxième extrémité de la base
 * @param {number} h hauteur du triangle en cm
 * @param {number} d valeur algébrique de AH où H est le pied de la hauteur
 * @param {*} n = 1 ou 2 permet de choisir le côté pour C.
 * @author Jean-Claude Lhote
 * @return {objet} {triangle, pied}
 */
export function triangle2points1hauteur (A, B, h, d, n = 1, color = 'black') {
  if (d === undefined) {
    d = randint(0, floor(longueur(A, B)))
  }
  const H = pointSurSegment(A, B, d)
  const C = similitude(A, H, 90 * (3 - n * 2), h / longueur(A, H))
  return { triangle: polygone([A, B, C], color), pied: H }
}

/**
 * @param {Point} A
 * @param {Point} B
 * @param {number} l1
 * @param {number} l2
 * @param {number} [n=1] Si n = 1 (défaut), C a la plus grande ordonnée possible, si n = 2, C a la plus petite ordonnée possible
 * @return {Polygone} objet Polygone ABC
 * @example t = triangle2points2longueurs(A,B,4,7,2) // Récupère t le triangle ABC tel que AC = 4 cm et BC = 7 cm avec C qui a l'ordonnée la plus petite possible
 * @example C = t.listePoints[2] // Récupère le 3e sommet dans la variable C
 * @author Rémi Angot
 */
export function triangle2points2longueurs (A, B, l1, l2, n = 1, color = 'black') {
  const c1 = cercle(A, l1)
  const c2 = cercle(B, l2)
  let C
  if (n === 1) {
    C = pointIntersectionCC(c1, c2)
  } else {
    C = pointIntersectionCC(c1, c2, '', 2)
  }
  c1.isVisible = false
  c2.isVisible = false
  return polygone([A, B, C], color)
}

/**
 * t = triangle2points2angles(A,B,40,60) // Trace le triangle ABC tel que CAB = +40° et CBA = -60°
 * C = t.listePoints[2] // Récupère le 3e sommet dans la variable C
 * t = triangle2points2angles(A,B,40,60,2) // Trace le triangle ABC tel que CAB = -40° et CBA = 60°
 * @author Rémi Angot
 */
export function triangle2points2angles (A, B, a1, a2, n = 1, color = 'black') {
  if (n === 1) {
    a2 *= -1
  } else {
    a1 *= -1
  }
  const a = pointSurSegment(A, B, 1)
  const c1 = rotation(a, A, a1)
  const b = pointSurSegment(B, A, 1)
  const c2 = rotation(b, B, a2)
  const dAc1 = droite(A, c1)
  const dBc2 = droite(B, c2)
  dAc1.isVisible = false
  dBc2.isVisible = false
  const C = pointIntersectionDD(dAc1, dBc2, 'C')
  return polygone([A, B, C], color)
}

/**
 *
 * @param {Point} A Le sommet pour l'angle donné = première extrémité du segment de base du triangle
 * @param {Point} B L'autre extrémité du segment de base
 * @param {number} a l'angle au sommet A (angle compris entre 0 et 180 sinon il y est contraint)
 * @param {number} l la longueur du deuxième côté de l'angle
 * @param {number} n n=1 l'angle a est pris dans le sens direct, n différent de 1, l'angle a est pris dans le sens indirect.
 * t = triangle2points1angle1longueur(A,B,40,6) // Trace le triangle ABC tel que CAB = 40° et AC=6
 * @author Jean-Claude Lhote
 */
export function triangle2points1angle1longueur (A, B, a, l, n = 1, color = 'black') {
  if (n === 1) {
    a = Math.abs(a) % 180
  } else {
    a = -(Math.abs(a) % 180)
  }
  const P = pointSurSegment(A, B, l)
  const Q = rotation(P, A, a)
  return polygone([A, B, Q], color)
}

/**
 * @param {Point} A Le sommet pour l'angle donné = première extrémité du segment de base du triangle
 * @param {Point} B L'autre extrémité du segment de base
 * @param {number} a l'angle au sommet A (angle compris entre 0 et 180 sinon il y est contraint)
 * @param {number} l la longueur du côté opposé à l'angle
 * @param {number} n n=1 l'angle a est pris dans le sens direct et le point est le plus près de A
 * n=2 l'angle est pris dans le sens indirect et le point est le plus près de A
 * n=3 l'angle a est pris dans le sens direct et le point est le plus loin de A
 * n=4 l'angle est pris dans le sens indirect et le point est le plus loin de A
 * t = triangle2points1angle1longueurOppose(A,B,40,6) // Trace le triangle ABC tel que CAB = 40° et BC=6 Le point C est celui des deux points possible le plus près de A
 * @author Jean-Claude Lhote
 */
export function triangle2points1angle1longueurOppose (A, B, a, l, n = 1, color = 'black') {
  let M
  if (n % 2 === 1) {
    a = Math.abs(a) % 180
  } else {
    a = -(Math.abs(a) % 180)
  }
  const d = droite(A, B)
  const e = rotation(d, A, a)
  const c = cercle(B, l)
  d.isVisible = false
  e.isVisible = false
  c.isVisible = false
  if ((n + 1) >> 1 === 1) M = pointIntersectionLC(e, c, '', 1)
  else M = pointIntersectionLC(e, c, '', 2)
  return polygone([A, B, M], color)
}

/*********************************************/
/** ************* Parallélogrammes ***********/

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
  const D = translation(H, homothetie(vecteur(A, B), A, randint(-4, 4, 0) / 10), NOM[3])
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
  this.svg = function (coeff) {
    let code = ''
    let P
    const p = this.poly
    const d = this.dist
    const G = barycentre(p)
    for (let i = 0; i < p.listePoints.length; i++) {
      P = pointSurSegment(G, p.listePoints[i], longueur(G, p.listePoints[i]) + d * 20 / coeff)
      P.positionLabel = 'center'
      code += '\n\t' + texteParPoint(p.listePoints[i].nom, P, 'milieu', 'black', 1, 'middle', true).svg(coeff)
    }
    return code
  }
  this.tikz = function () {
    let code = ''
    let P
    const p = this.poly
    const d = this.dist
    const G = barycentre(p)
    for (let i = 0; i < p.listePoints.length; i++) {
      P = pointSurSegment(G, p.listePoints[i], longueur(G, p.listePoints[i]) + d / context.scale)
      code += '\n\t' + texteParPoint(`$${p.listePoints[i].nom}$`, P, 'milieu', color).tikz()
    }
    return code
  }
}

export function nommePolygone (...args) {
  return new NommePolygone(...args)
}

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

/**
 * Retourne l'aire du triangle si p est un triangle, false sinon.
 * @param {Polygone} p Triangle
 * @example aireTriangle(poygone(A,B,C)) // Retourne l'aire du triangle ABC
 * @example aireTriangle(poygone(A,B,C,D)) // Retourne false car le polygone n'est pas un triangle
 * @author Jean-Claude Lhote
 * @return {boolean|number}
 */
// JSDOC Validee par EE Juin 2022
export function aireTriangle (p) {
  if (p.listePoints.length !== 3) return false
  const A = p.listePoints[0]
  const B = p.listePoints[1]
  const C = p.listePoints[2]
  return (
    (1 / 2) * Math.abs((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y))
  )
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

/**
 * Médiane issue de A relative à [BC]
 * @author Jean-Claude Lhote
 * @param {Point} A
 * @param {Point} B
 * @param {Point} C
 * @param {string} color
 */
export function medianeTriangle (A, B, C, color = 'black') {
  const I = milieu(B, C)
  return droite(A, I, '', color)
}

/**
 * Crée le centre de gravité du triangle ABC
 * @param {Point} A Premier sommet du triangle
 * @param {Point} B Deuxième sommet du triangle
 * @param {Point} C Troisième sommet du triangle
 * @param {string} [nom=''] Nom du centre
 * @param {string} [positionLabel = 'above'] Position du nom par rapport au point
 * @example G = centreGraviteTriangle(F,C,N)
 * // Crée G, le centre de gravité du triangle FCN,sans être nommé.
 * @example G = centreGraviteTriangle(F,C,N,'G','below')
 * // Crée G, le centre de gravité du triangle FCN, en notant G sous le point, s'il est tracé et labellisé.
 * @return {Point}
 * @author Jean-Claude Lhote
 */
// JSDOC Validee par EE Juin 2022
export function centreGraviteTriangle (A, B, C, nom = '', positionLabel = 'above') {
  const d = medianeTriangle(B, A, C)
  const e = medianeTriangle(A, B, C)
  d.isVisible = false
  e.isVisible = false
  const p = pointIntersectionDD(d, e)
  const x = p.x
  const y = p.y
  return new Point(x, y, nom, positionLabel)
}

/**  Trace la hauteur issue de A relative à [BC]
 * @param {Point} A Point dont est issue la hauteur
 * @param {Point} B Première extrémité du segment dont est relative la hauteur
 * @param {Point} C Seconde extrémité du segment dont est relative la hauteur
 * @param {string} [color = 'black'] Couleur de cette hauteur : du type 'blue' ou du type '#f15929'
 * @example hauteurTriangle (M, N, P) // Trace, en noir, la hauteur issue de M relative à [NP]
 * @example hauteurTriangle (M, N, P, 'red') // Trace, en rouge, la hauteur issue de M relative à [NP]
 * @author Jean-Claude Lhote
 * @return {Droite}
 */
// JSDOC Validee par EE Aout 2022
export function hauteurTriangle (A, B, C, color = 'black') {
  const d = droite(B, C)
  d.isVisible = false
  const p = projectionOrtho(A, d)
  return new Droite(p, A, '', color)
}

/**
 * Code la hauteur d'un triangle
 * @param {Point} A Premier sommet d'un triangle
 * @param {Point} B Deuxième sommet d'un triangle
 * @param {Point} C Troisième sommet d'un triangle
 * @param {string} [color = 'black'] Couleur des codages : du type 'blue' ou du type '#f15929'
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} color Couleur des codages. À associer obligatoirement à colorToLatexOrHTML().
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function CodageHauteurTriangle (A, B, C, color = 'black') {
  ObjetMathalea2D.call(this, {})
  this.color = color
  const d = droite(B, C)
  const p = projectionOrtho(A, d)
  const q = rotation(A, p, -90)
  if (B.x < C.x) {
    if (p.x > C.x || p.x < B.x) {
      d.isVisible = true
      d.pointilles = 5
    } else d.isVisible = false
  } else if (C.x < B.x) {
    if (p.x < C.x || p.x > B.x) {
      d.isVisible = true
      d.pointilles = 5
    } else d.isVisible = false
  } else if (B.y < C.y) {
    if (p.y > C.y || p.y < B.y) {
      d.isVisible = true
      d.pointilles = 5
    } else d.isVisible = false
  } else if (C.y < B.y) {
    if (p.y < C.y || p.y > B.y) {
      d.isVisible = true
      d.pointilles = 5
    } else d.isVisible = false
  }
  const c = codageAngleDroit(A, p, q, this.color)
  this.svg = function (coeff) {
    if (d.isVisible) {
      return c.svg(coeff) + '\n\t' + d.svg(coeff)
    } else {
      return c.svg(coeff)
    }
  }
  this.tikz = function () {
    if (d.isVisible) {
      return c.tikz() + '\n\t' + d.tikz()
    } else {
      return c.tikz()
    }
  }
}

/**
 * Code la hauteur d'un triangle
 * @param {Point} A Premier sommet d'un triangle
 * @param {Point} B Deuxième sommet d'un triangle
 * @param {Point} C Troisième sommet d'un triangle
 * @param {string} [color = 'black'] Couleur des codages : du type 'blue' ou du type '#f15929'
 * @example codageHauteurTriangle(M,N,P) // Code, en noir, la hauteur du triangle MNP.
 * @example codageHauteurTriangle(M,N,P,'red') // Code, en rouge, la hauteur du triangle MNP.
 * @return {CodageHauteurTriangle}
 */
// JSDOC Validee par EE Juin 2022
export function codageHauteurTriangle (A, B, C, color = 'black') {
  return new CodageHauteurTriangle(A, B, C, color)
}

/**
 * Code la médiane d'un triangle
 * @param {Point} B Première extrémité du segment dont la médiane est relative
 * @param {Point} C Seconde extrémité du segment dont la médiane est relative
 * @param {string} [color = 'black'] Couleur des codages : du type 'blue' ou du type '#f15929'
 * @param {string} [mark = '//'] Symbole posé de part et d'autre du milieu du segment
 * @param {boolean} [mil = false] Trace ou nom le point du milieu.
 * @example codageMedianeTriangle(M,N) // Code, en noir, la médiane d'un triangle relative au côté [MN], avec les symboles //
 * @example codageMedianeTriangle(M,N,P,'red','oo') // Code, en rouge, la médiane d'un triangle relative au côté [MN], avec les symboles oo
 * @return {CodageSegments}
 */
// JSDOC Validee par EE Juin 2022
export function codageMedianeTriangle (A, B, color = 'black', mark = '×', mil = false) {
  return new CodageMilieu(A, B, color, mark, mil)
}

/**
 * Orthocentre du triangle ABC
 * @author Jean-Claude Lhote
 * @param {Point} A
 * @param {Point} B
 * @param {Point} C
 * @param {string} nom
 */
export function orthoCentre (A, B, C, nom = '', positionLabel = 'above') {
  const d = hauteurTriangle(B, A, C)
  const e = hauteurTriangle(A, B, C)
  d.isVisible = false
  e.isVisible = false
  const p = pointIntersectionDD(d, e)
  const x = p.x
  const y = p.y
  return point(x, y, nom, positionLabel)
}

/**
 * Crée le centre du cercle circonscrit au triangle ABC
 * @param {Point} A Premier sommet du triangle
 * @param {Point} B Deuxième sommet du triangle
 * @param {Point} C Troisième sommet du triangle
 * @param {string} [nom=''] Nom du centre
 * @param {string} [positionLabel = 'above'] Position du nom par rapport au point
 * @example G = centreCercleCirconscrit(F,C,N)
 * // Crée G, le centre du cercle circonscrit au triangle FCN,sans être nommé.
 * @example G = centreCercleCirconscrit(F,C,N,'G','below')
 * // Crée G, le centre du cercle circonscrit au triangle FCN, en notant G sous le point, s'il est tracé et labellisé.
 * @return {Point}
 * @author Rémi Angot
 */
// JSDOC Validee par EE Juin 2022
export function centreCercleCirconscrit (A, B, C, nom = '', positionLabel = 'above') {
  const d = mediatrice(A, B)
  const e = mediatrice(B, C)
  d.isVisible = false
  e.isVisible = false
  const p = pointIntersectionDD(d, e)
  const x = p.x
  const y = p.y
  return new Point(x, y, nom, positionLabel)
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%% LES CODAGES %%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/**
 * Affiche la longueur de [AB] au dessus si A est le point le plus à gauche sinon au dessous.
 * @param  {Point} A Première extrémité du segment
 * @param  {Point} B Seconde extrémité du segment
 * @param  {string} [color='black'] Couleur de la longueur affichée : du type 'blue' ou du type '#f15929'.
 * @param  {number} [d=0.5] Distance entre l'affichage de la longueur et le segment.
 * @param  {string} [unite='cm'] Affiche cette unité après la valeur numérique de la longueur.
 * @param  {boolean} [horizontal=false] Si true, alors le texte est horizontal, sinon le texte est parallèle au segment.
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} color Couleur de la longueur affichée. À associer obligatoirement à colorToLatexOrHTML().
 * @author Rémi Angot
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function AfficheLongueurSegment (A, B, color = 'black', d = 0.5, unite = 'cm', horizontal = false, precision = 1) {
  ObjetMathalea2D.call(this, {})
  this.color = color
  const O = milieu(A, B)
  const M = rotation(A, O, -90)
  const s = segment(A, B)
  let angle
  s.isVisible = false
  const l = stringNombre(s.longueur, precision)
  const longueurSeg = `${l}${unite !== '' ? ' ' + unite : ''}`
  this.distance = horizontal ? (d - 0.1 + longueurSeg.length / 10) : d
  if (horizontal) {
    angle = 0
  } else if (B.x > A.x) {
    angle = -s.angleAvecHorizontale
  } else {
    angle = 180 - s.angleAvecHorizontale
  }
  this.svg = function (coeff) {
    const N = pointSurSegment(O, M, (this.distance * 20) / coeff)
    return texteParPoint(longueurSeg, N, angle, this.color, 1, 'middle', false).svg(coeff)
  }
  this.tikz = function () {
    const N = pointSurSegment(O, M, this.distance / context.scale)
    return texteParPoint(longueurSeg, N, angle, this.color, 1, 'middle', false).tikz()
  }
}

/**
 * Affiche la longueur de [AB] au dessus si A est le point le plus à gauche sinon au dessous.
 * @param  {Point} A Première extrémité du segment
 * @param  {Point} B Seconde extrémité du segment
 * @param  {string} [color='black'] Couleur affichée de la longueur affichée : du type 'blue' ou du type '#f15929'.
 * @param  {number} [d=0.5] Distance entre l'affichage de la longueur et le segment.
 * @param  {string} [unite='cm'] Affiche cette unité après la valeur numérique de la longueur.
 * @param  {boolean} [horizontal=false] Si true, alors le texte est horizontal, sinon le texte est parallèle au segment.
 * @example  afficheLongueurSegment(A,B)
 * // Affiche la longueur du segment [AB] (en noir, à 0,5 "cm" du segment, complétée par l'unité cm et parallèlement au segment).
 * @example  afficheLongueurSegment(A,B,'blue',1,'mm',true)
 * // Affiche la longueur du segment [AB], en bleu, à 1 "cm" du segment, complétée par l'unité mm et horizontalement.
 * @return {AfficheLongueurSegment}
 * @author Rémi Angot
 */
// JSDOC Validee par EE Juin 2022
export function afficheLongueurSegment (A, B, color = 'black', d = 0.5, unite = 'cm', horizontal = false, precision = 1) {
  return new AfficheLongueurSegment(A, B, color, d, unite, horizontal, precision)
}

/**
 * texteSurSegment('mon texte',A,B) // Écrit un texte au milieu de [AB] au dessus si A est le point le plus à gauche sinon en dessous, ou alors horizontalement
 *
 * @author Rémi Angot
 */
export function TexteSurSegment (texte, A, B, color = 'black', d = 0.5, horizontal = false) {
  ObjetMathalea2D.call(this, {})
  if (longueur(A, B) < 0.1) window.notify('TexteSurSegment : Points trop proches pour cette fonction', { A, B })
  this.color = color
  this.extremite1 = A
  this.extremite2 = B
  this.texte = texte
  this.scale = 1
  this.mathOn = true
  this.distance = horizontal ? (d - 0.1 + (isNumeric(this.texte) ? nombreDeChiffresDe(this.texte) : this.texte.length) / 10) : d
  const O = milieu(this.extremite1, this.extremite2)
  const M = rotation(this.extremite1, O, -90)
  const s = segment(this.extremite1, this.extremite2)
  let angle
  const pos = pointSurSegment(O, M, this.distance)
  const space = 0.2 * this.texte.length
  this.bordures = [pos.x - space, pos.y - space, pos.x + space, pos.y + space]
  if (horizontal) {
    angle = 0
  } else if (this.extremite2.x > this.extremite1.x) {
    angle = -s.angleAvecHorizontale
    angle = -s.angleAvecHorizontale
  } else {
    angle = 180 - s.angleAvecHorizontale
    angle = 180 - s.angleAvecHorizontale
  }
  this.svg = function (coeff) {
    const N = pointSurSegment(O, M, this.distance * 20 / coeff)
    return texteParPoint(this.texte, N, angle, this.color, this.scale, 'middle', this.mathOn).svg(coeff)
  }
  this.tikz = function () {
    const N = pointSurSegment(O, M, this.distance / context.scale)
    return texteParPoint(this.texte, N, angle, this.color, this.scale, 'middle', this.mathOn).tikz()
  }
}

/**
 * Écrit un texte au milieu de [AB] au dessus si A est le point le plus à gauche sinon au dessous ou bien horizontal
 * @param {string} texte
 * @param {Point} A
 * @param {Point} B
 * @param {string} [color='black'] Code couleur HTML accepté
 * @param {number} [d=0.5] Distance à la droite.
 * @param {boolean} [horizontal=false] Si true, alors le texte est horizontal, sinon le texte est parallèle au segment
 * @return {object} LatexParCoordonnees si le premier caractère est '$', TexteParPoint sinon
 * @author Rémi Angot
 */
export function texteSurSegment (...args) {
  return new TexteSurSegment(...args)
}

/**
 * texteSurArc(texte, A, B, angle) // Écrit un texte au milieu de l'arc AB, au dessus si A est le point le plus à gauche sinon au dessous
 *
 * @author Rémi Angot et Frédéric Piou
 */
export function TexteSurArc (texte, A, B, angle, color = 'black', d = 0.5, horizontal = false) {
  ObjetMathalea2D.call(this, {})
  this.color = color
  this.extremite1 = A
  this.extremite2 = B
  this.distance = -d
  this.texte = texte
  let anglerot
  if (angle < 0) anglerot = (angle + 180) / 2
  else anglerot = (angle - 180) / 2
  const d1 = mediatrice(A, B)
  d1.isVisible = false
  const e = droite(A, B)
  e.isVisible = false
  const f = rotation(e, B, anglerot)
  f.isVisible = false
  const determinant = d1.a * f.b - f.a * d1.b
  const Omegax = (d1.b * f.c - f.b * d1.c) / determinant
  const Omegay = (f.a * d1.c - d1.a * f.c) / determinant
  const Omega = point(Omegax, Omegay)
  const s = segment(this.extremite1, this.extremite2)
  s.isVisible = false
  const p = rotation(A, Omega, angle / 2)
  const pos = pointSurSegment(p, Omega, this.distance)
  const space = 0.2 * texte.length
  this.bordures = [pos.x - space, pos.y - space, pos.x + space, pos.y + space]
  this.svg = function (coeff) {
    const N = pointSurSegment(p, Omega, this.distance * 20 / coeff)
    if (this.extremite2.x > this.extremite1.x) {
      angle = -s.angleAvecHorizontale
    } else {
      angle = 180 - s.angleAvecHorizontale
    }
    if (this.texte.charAt(0) === '$') {
      return latexParPoint(this.texte.substr(1, this.texte.length - 2), N, this.color, this.texte * 8, 12, '').svg(coeff)
    } else {
      return texteParPoint(this.texte, N, horizontal ? 0 : angle, this.color).svg(coeff)
    }
  }
  this.tikz = function () {
    const N = pointSurSegment(p, Omega, this.distance / context.scale)
    if (this.extremite2.x > this.extremite1.x) {
      angle = -s.angleAvecHorizontale
    } else {
      angle = 180 - s.angleAvecHorizontale
    }
    return texteParPoint(this.texte, N, angle, this.color).tikz()
  }
}

/**
 * Écrit un texte au "milieu" de l'arc AB au dessus si A est le point le plus à gauche sinon en dessous
 * @param {string} texte Texte à afficher (éviter les $$ pour les affichages diaporama)
 * @param {Point} A Extrémité de l'arc
 * @param {Point} B Extrémité de l'arc
 * @param {number} angle Angle au centre
 * @param {string} [color='black'] Code couleur HTML accepté
 * @param {number} [d=0.5] Distance à la droite.
 * @param {boolean} [horizontal = false] Décide si le texte est horizontal ou pas, quelle que soit la valeur de angle.
 * @return {object} LatexParCoordonnees si le premier caractère est '$', TexteParPoint sinon
 * @author Rémi Angot et Frédéric Piou
 */
export function texteSurArc (texte, A, B, angle, color = 'black', d = 0.5, horizontal = false) {
  return new TexteSurArc(texte, A, B, angle, color, d, horizontal)
}

/**
 * Affiche la mesure de l'angle ABC arrondie au degré près
 * @param {Point} A Point sur un côté de l'angle
 * @param {Point} B Sommet de l'angle
 * @param {Point} C Point sur l'autre côté de l'angle
 * @param {string} [color='black'] Couleur de la mesure de l'angle : du type 'blue' ou du type '#f15929'.
 * @param {number} [distance=1.5] Taille de l'angle
 * @param {string} [label=''] Si vide, alors affiche la mesure de l'angle sinon affiche ce label.
 * @param {Object} parametres À saisir entre accolades
 * @param {number} [parametres.ecart=0.5] Distance entre l'arc et sa mesure
 * @param {boolean} [parametres.saillant=true] True si on veut l'angle saillant, false si on veut l'angle rentrant.
 * @param {string} [parametres.colorArc='black']  Couleur de l'arc  : du type 'blue' ou du type '#f15929'.
 * @param {boolean} [parametres.rayon=false] True pour fermer l'angle, par deux rayons (en vue de colorier l'intérieur).
 * @param {string} [parametres.couleurDeRemplissage='none'] 'none' si on ne veut pas de remplissage, sinon une couleur du type 'blue' ou du type '#f15929'.
 * @param {number} [parametres.opaciteDeRemplissage=0.5] Taux d'opacité du remplissage entre 0 et 1
 * @param {number} [parametres.arcEpaisseur=1] Epaisseur de l'arc
 * @param {boolean} [parametres.mesureEnGras=false] True pour mettre en gras la mesure affichée
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {Point} depart Point sur un côté de l'angle
 * @property {Point} sommet Sommet de l'angle
 * @property {Point} arrivee Point sur l'autre côté de l'angle
 * @property {number} distance Taille de l'angle
 * @property {number} ecart Distance entre l'arc et sa mesure
 * @property {boolean} saillant True si on veut l'angle saillant, false si on veut l'angle rentrant.
 * @property {number} epaisseur Epaisseur de l'arc
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function AfficheMesureAngle (A, B, C, color = 'black', distance = 1.5, label = '', {
  ecart = 0.5,
  mesureEnGras = false,
  saillant = true,
  colorArc = 'black',
  rayon = false,
  couleurDeRemplissage = 'none',
  opaciteDeRemplissage = 0.5,
  arcEpaisseur = 1
} = {}) {
  ObjetMathalea2D.call(this, {})
  this.depart = A
  this.arrivee = C
  this.sommet = B
  this.distance = distance
  const mesureAngle = saillant ? angleOriente(this.depart, this.sommet, this.arrivee) : angleOriente(this.depart, this.sommet, this.arrivee) > 0 ? angleOriente(this.depart, this.sommet, this.arrivee) - 360 : 360 + angleOriente(this.depart, this.sommet, this.arrivee)
  this.ecart = ecart
  this.saillant = saillant
  this.epaisseur = arcEpaisseur
  this.svg = function (coeff) {
    const M = pointSurSegment(this.sommet, this.depart, this.distance)
    const N = rotation(pointSurSegment(this.sommet, M, this.distance + this.ecart * 20 / coeff), this.sommet, mesureAngle / 2, '', 'center')
    let mesureAngleString
    if (label !== '') {
      mesureAngleString = label
    } else {
      mesureAngleString = Math.round(Math.abs(mesureAngle)).toString() + '°'
    }
    const mesure = texteParPoint(mesureAngleString, N, 'milieu', color, 1, 'middle', true)
    const marque = arc(M, B, mesureAngle, rayon, couleurDeRemplissage, colorArc, opaciteDeRemplissage)
    mesure.contour = mesureEnGras
    mesure.couleurDeRemplissage = colorToLatexOrHTML(color)
    marque.epaisseur = this.epaisseur
    return '\n' + mesure.svg(coeff) + '\n' + marque.svg(coeff)
  }
  this.tikz = function () {
    const M = pointSurSegment(this.sommet, this.depart, this.distance)
    const N = rotation(pointSurSegment(this.sommet, M, this.distance + this.ecart), this.sommet, mesureAngle / 2, '', 'center')
    let mesureAngleString
    if (label !== '') {
      mesureAngleString = label
    } else {
      mesureAngleString = Math.round(Math.abs(mesureAngle)).toString() + '\\degree'
    }
    const mesure = texteParPoint(mesureAngleString, N, 'milieu', color, 1, 'middle', true)
    const marque = arc(M, B, mesureAngle, rayon, couleurDeRemplissage, colorArc, opaciteDeRemplissage)
    mesure.contour = mesureEnGras
    mesure.couleurDeRemplissage = colorToLatexOrHTML(color)
    marque.epaisseur = this.epaisseur
    return '\n' + mesure.tikz() + '\n' + marque.tikz()
  }
}

/**
 * Affiche la mesure de l'angle ABC arrondie au degré près
 * @param {Point} A Point sur un côté de l'angle
 * @param {Point} B Sommet de l'angle
 * @param {Point} C Point sur l'autre côté de l'angle
 * @param {string} [color='black'] Couleur de la mesure de l'angle : du type 'blue' ou du type '#f15929'.
 * @param {number} [distance=1.5] Rayon de l'arc de cercle.
 * @param {string} [label=''] Si vide, alors affiche la mesure de l'angle sinon affiche ce label.
 * @param {Object} parametres À saisir entre accolades
 * @param {number} [parametres.ecart=0.5] Distance entre l'arc et sa mesure
 * @param {boolean} [parametres.saillant=true] True si on veut l'angle saillant, false si on veut l'angle rentrant.
 * @param {string} [parametres.colorArc='black']  Couleur de l'arc  : du type 'blue' ou du type '#f15929'.
 * @param {boolean} [parametres.rayon=false] True pour fermer l'angle, par deux rayons (en vue de colorier l'intérieur).
 * @param {string} [parametres.couleurDeRemplissage='none'] 'none' si on ne veut pas de remplissage, sinon une couleur du type 'blue' ou du type '#f15929'.
 * @param {number} [parametres.opaciteDeRemplissage=0.5] Taux d'opacité du remplissage entre 0 et 1
 * @param {number} [parametres.arcEpaisseur=1] Epaisseur de l'arc
 * @param {boolean} [parametres.mesureEnGras=false] True pour mettre en gras la mesure affichée
 * @example afficheMesureAngle(M,N,O)
 * // Affiche la mesure de l'angle MNO (en noir, avec un arc de rayon 1,5 "cm").
 * @example afficheMesureAngle(M,N,O,'red',2,'pop',{ecart:1,saillant:false,colorArc:'blue',rayon:true,couleurDeRemplissage:'#f15929',opaciteDeRemplissage:0.8,arcEpaisseur:2,mesureEnGras:true})
 * // Affiche le label pop en gras et rouge, sur l'angle rentrant MNO, avec un arc bleu, epais de 2 et de rayon 2 "cm", à 1 "cm" de l'arc rempli en orange avec une opacité de 80%, cerné par ses rayons.
 * @return {AfficheMesureAngle}
 */
// JSDOC Validee par EE Juin 2022
export function afficheMesureAngle (A, B, C, color = 'black', distance = 1.5, label = '', {
  ecart = 0.5,
  mesureEnGras = false,
  saillant = true,
  colorArc = 'black',
  rayon = false,
  couleurDeRemplissage = 'none',
  opaciteDeRemplissage = 0.5,
  arcEpaisseur = 1
} = {}) {
  return new AfficheMesureAngle(A, B, C, color, distance, label, {
    ecart,
    mesureEnGras,
    saillant,
    colorArc,
    rayon,
    couleurDeRemplissage,
    opaciteDeRemplissage,
    arcEpaisseur
  })
}

/**
 * Affiche la côte d'un segment sous la forme d'une flèche à double sens et d'une valeur associée.
 * @param {Segment} s Segment pour lequel on affiche la côte
 * @param {string} [Cote=''] Si '', alors la longueur en cm est affichée, sinon c'est cette valeur qui s'affiche (et cela peut être une variable).
 * @param {number} [positionCote = 0.5] Position de la flèche par rapport au segment. Valeur négative ou positive selon la position voulue.
 * @param {string} [couleurCote='black'] Couleur de la flèche  : du type 'blue' ou du type '#f15929'.
 * @param {number} [epaisseurCote=1] Epaisseur de la flèche.
 * @param {number} [positionValeur=0.5] Position de la valeur par rapport à la flèche. Valeur négative ou positive selon la position voulue.
 * @param {string} [couleurValeur='black']  Couleur de la valeur indiquée : du type 'blue' ou du type '#f15929'.
 * @param {boolean} [horizontal=false]  Si true, alors le texte est horizontal, sinon le texte est parallèle au segment.
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @author Jean-Claude Lhote
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function AfficheCoteSegment (
  s,
  Cote = '',
  positionCote = 0.5,
  couleurCote = 'black',
  epaisseurCote = 1,
  positionValeur = 0.5,
  couleurValeur = 'black',
  horizontal = false
) {
  ObjetMathalea2D.call(this, {})
  const positionCoteSVG = positionCote * 20 / context.pixelsParCm
  const positionCoteTIKZ = positionCote / context.scale

  this.svg = function (coeff) {
    let valeur
    const A = s.extremite1
    const B = s.extremite2
    const v = similitude(vecteur(A, B), A, 90, positionCoteSVG / s.longueur)
    const cote = segment(translation(A, v), translation(B, v), couleurCote)
    if (longueur(A, B) > 1) cote.styleExtremites = '<->'
    else cote.styleExtremites = '>-<'
    cote.epaisseur = epaisseurCote
    if (Cote === '') {
      valeur = afficheLongueurSegment(
        cote.extremite1,
        cote.extremite2,
        couleurValeur,
        positionValeur,
        'cm',
        horizontal
      )
    } else {
      valeur = texteSurSegment(
        Cote,
        cote.extremite1,
        cote.extremite2,
        couleurValeur,
        positionValeur,
        horizontal
      )
    }
    return '\n\t' + cote.svg(coeff) + '\n\t' + valeur.svg(coeff)
  }

  this.tikz = function () {
    let valeur
    const A = s.extremite1
    const B = s.extremite2
    const v = similitude(vecteur(A, B), A, 90, positionCoteTIKZ / s.longueur)
    const cote = segment(translation(A, v), translation(B, v), couleurCote)
    if (longueur(A, B) > 1) cote.styleExtremites = '<->'
    else cote.styleExtremites = '>-<'
    cote.epaisseur = epaisseurCote
    if (Cote === '') {
      valeur = afficheLongueurSegment(
        cote.extremite1,
        cote.extremite2,
        couleurValeur,
        positionValeur
      )
    } else {
      valeur = texteSurSegment(
        Cote,
        cote.extremite1,
        cote.extremite2,
        couleurValeur,
        positionValeur
      )
    }
    return '\n\t' + cote.tikz() + '\n\t' + valeur.tikz()
  }
}

/**
 * Affiche la côte d'un segment sous la forme d'une flèche à double sens et d'une valeur associée.
 * @param {Segment} s Segment pour lequel on affiche la côte
 * @param {string} [Cote=''] Si '', alors la longueur en cm est affichée, sinon c'est cette valeur qui s'affiche (et cela peut être une variable).
 * @param {number} [positionCote = 0.5] Position de la flèche par rapport au segment. Valeur négative ou positive selon la position voulue.
 * @param {string} [couleurCote='black'] Couleur de la flèche  : du type 'blue' ou du type '#f15929'.
 * @param {number} [epaisseurCote=1] Epaisseur de la flèche.
 * @param {number} [positionValeur=0.5] Position de la valeur par rapport à la flèche. Valeur négative ou positive selon la position voulue.
 * @param {string} [couleurValeur='black']  Couleur de la valeur indiquée : du type 'blue' ou du type '#f15929'.
 * @param {boolean} [horizontal=false]  Si true, alors le texte est horizontal, sinon le texte est parallèle au segment.
 * @example afficheCoteSegment(s)
 * // Affiche la côte du segment s (avec une flèche noire d\'épaisseur 1 "cm", placée 0.5 "cm" sous le segment, avec la longueur du segment, en cm, écrite en noir, 0,5 "cm" au-dessus, et parallèle au segment.
 * @example afficheCoteSegment(s,'x',-1,'red',2,1,'blue',true)
 * // Affiche la côte du segment s, avec une flèche rouge d\'épaisseur 2 "cm", placée 1 "cm" sous le segment, avec le texte 'x' écrit en bleu, 1 "cm" au-dessus, et horizontalement.
 * @return {AfficheCoteSegment}
 * @author Jean-Claude Lhote
 */
// JSDOC Validee par EE Juin 2022

export function afficheCoteSegment (s, Cote = '', positionCote = 0.5, couleurCote = 'black', epaisseurCote = 1, positionValeur = 0.5, couleurValeur = 'black', horizontal = false) {
  return new AfficheCoteSegment(s, Cote, positionCote, couleurCote, epaisseurCote, positionValeur, couleurValeur, horizontal)
}

/**
 * Code un segment
 * @param {Point} A Première extrémité du segment
 * @param {Point} B Seconde extrémité du segment
 * @param {string} [mark='||'] Symbole posé sur le segment
 * @param {string} [color='black'] Couleur du symbole : du type 'blue' ou du type '#f15929'
 * @example codageSegment(H,K) // Code le segment [HK] avec la marque noire '||'
 * @example codageAngle(H,K,'x','green') // Code le segment [HK] avec la marque verte 'x'
 * @author Rémi Angot
 * @return {TexteParPoint}
 */
// JSDOC Validee par EE Juin 2022
export function codageSegment (A, B, mark = '||', color = 'black') {
  const O = milieu(A, B)
  const s = segment(A, B)
  s.isVisible = false
  let angle
  if (B.x > A.x) {
    angle = -parseInt(s.angleAvecHorizontale)
  } else {
    angle = -parseInt(s.angleAvecHorizontale) + 180
  }
  return new TexteParPoint(mark, O, angle, color)
}

/**
 * Code plusieurs segments de la même façon
 * @param {string} [mark = '||'] Symbole posé sur le segment
 * @param {string} [color = 'black'] Couleur du symbole : : du type 'blue' ou du type '#f15929'
 * @param  {Point|Point[]|Segment} args Les segments différement codés.
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @author Rémi Angot
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function CodageSegments (mark = '||', color = 'black', ...args) {
  ObjetMathalea2D.call(this, {})
  this.svg = function (coeff) {
    let code = ''
    if (Array.isArray(args[0])) {
      // Si on donne une liste de points
      for (let i = 0; i < args[0].length - 1; i++) {
        const codage = codageSegment(args[0][i], args[0][i + 1], mark, color)
        codage.isVisible = false
        code += codage.svg(coeff)
        code += '\n'
      }
      const codage = codageSegment(args[0][args[0].length - 1], args[0][0], mark, color)
      codage.isVisible = false
      code += codage.svg(coeff)
      code += '\n'
    } else if (args[0].constructor === Segment) {
      for (let i = 0; i < args.length; i++) {
        const codage = codageSegment(args[i].extremite1, args[i].extremite2, mark, color)
        codage.isVisible = false
        code += codage.svg(coeff)
        code += '\n'
      }
    } else {
      for (let i = 0; i < args.length; i += 2) {
        const codage = codageSegment(args[i], args[i + 1], mark, color)
        codage.isVisible = false
        code += codage.svg(coeff)
        code += '\n'
      }
    }
    code = `<g id="${this.id}">${code}</g>`
    return code
  }
  this.tikz = function () {
    let code = ''
    if (Array.isArray(args[0])) {
      // Si on donne une liste de points
      for (let i = 0; i < args[0].length - 1; i++) {
        code += codageSegment(args[0][i], args[0][i + 1], mark, color).tikz()
        code += '\n'
      }
      code += codageSegment(
        args[0][args[0].length - 1],
        args[0][0],
        mark,
        color
      ).tikz()
      code += '\n'
    } else if (args[0].constructor === Segment) {
      for (let i = 0; i < args.length; i++) {
        code += codageSegment(
          args[i].extremite1,
          args[i].extremite2,
          mark,
          color
        ).tikz()
        code += '\n'
      }
    } else {
      for (let i = 0; i < args.length; i += 2) {
        code += codageSegment(args[i], args[i + 1], mark, color).tikz()
        code += '\n'
      }
    }
    return code
  }
}

/**
 * Code plusieurs segments de la même façon
 * @param {string} [mark = '||'] Symbole posé sur le segment
 * @param {string} [color = 'black'] Couleur du symbole : : du type 'blue' ou du type '#f15929'
 * @param  {Points|Point[]|Segments} args Les segments différement codés. Voir exemples.
 * @example codageSegments('×','blue',A,B, B,C, C,D) // Code les segments [AB], [BC] et [CD] avec une croix bleue
 * @example codageSegments('×','blue',[A,B,C,D]) // Code les segments [AB], [BC], [CD] et [DA] (attention, chemin fermé, pratique pour des polygones pas pour des lignes brisées)
 * @example codageSegments('×','blue',s1,s2,s3) // Code les segments s1, s2 et s3 avec une croix bleue
 * @example codageSegments('×','blue',p.listePoints) // Code tous les segments du polygone avec une croix bleue
 * @author Rémi Angot
 * @return {CodageSegments}
 */
// JSDOC Validee par EE Juin 2022
export function codageSegments (mark = '||', color = 'black', ...args) {
  return new CodageSegments(mark, color, ...args)
}

/**
 * Code un angle
 * @param {Point} A Point sur un côté de l'angle
 * @param {Point} O Sommet de l'angle
 * @param {number|Point} angle Mesure de l'angle ou nom d'un point sur l'autre côté de l'angle
 * @param {number} [taille=0.8] Taille de l'angle
 * @param {string} [mark=''] Marque sur l'angle
 * @param {string} [color='black'] Couleur de l'angle : du type 'blue' ou du type '#f15929'
 * @param {number} [epaisseur=1] Epaisseur du tracé de l'angle
 * @param {number} [opacite=1] Opacité de la couleur du tracé de l'angle
 * @param {string} [couleurDeRemplissage='none'] 'none' si on ne veut pas de remplissage, sinon une couleur du type 'blue' ou du type '#f15929'
 * @param {number} [opaciteDeRemplissage=0.2] Opacité de la couleur de remplissage de l'angle
 * @param {boolean} [mesureOn=false] Affichage de la mesure de l'angle
 * @param {boolean} [noAngleDroit=false] Pour choisir si on veut que l'angle droit soit marqué par un carré ou pas
 * @param {string} [texteACote=''] Pour mettre un texte à côté de l'angle à la place de la mesure de l'angle
 * @param {number} [tailleTexte=1] Pour choisir la taille du texte à côté de l'angle
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} svgml Sortie, à main levée, au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} tikzml Sortie, à main levée, au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {Point} debut Point sur un côté de l'angle
 * @property {Point} centre Sommet de l'angle
 * @property {number|Point} angle Mesure de l'angle ou nom d'un point sur l'autre côté de l'angle
 * @property {number} taille Taille de l'angle
 * @property {string} mark Marque sur l'angle
 * @property {string} color Couleur de l'angle. À associer obligatoirement à colorToLatexOrHTML().
 * @property {number} epaisseur Epaisseur du tracé de l'angle
 * @property {number} opacite Opacité de la couleur du tracé de l'angle
 * @property {string} couleurDeRemplissage À associer obligatoirement à colorToLatexOrHTML(). 'none' si on ne veut pas de remplissage.
 * @property {number} opaciteDeRemplissage Opacité de la couleur de remplissage de l'angle
 * @author Jean-Claude Lhote
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function CodageAngle (debut, centre, angle, taille = 0.8, mark = '', color = 'black', epaisseur = 1, opacite = 1, couleurDeRemplissage = 'none', opaciteDeRemplissage = 0.2, mesureOn = false, texteACote = '', tailleTexte = 1) {
  ObjetMathalea2D.call(this, {})
  this.color = color
  this.debut = debut
  this.centre = centre
  this.taille = taille
  this.mark = mark
  this.epaisseur = epaisseur
  this.opacite = opacite
  this.couleurDeRemplissage = couleurDeRemplissage
  this.opaciteDeRemplissage = opaciteDeRemplissage
  this.angle = angle
  this.svg = function (coeff) {
    let code = ''
    const objets = []
    const depart = pointSurSegment(this.centre, this.debut, this.taille * 20 / context.pixelsParCm)
    const P = rotation(depart, this.centre, this.angle / 2)
    const M = pointSurSegment(this.centre, P, this.taille + 0.6 * 20 / coeff)
    const d = droite(this.centre, P)
    d.isVisible = false
    const mesure = Math.round(Math.abs(angle)) + '°'
    const arcangle = arc(depart, this.centre, this.angle, this.couleurDeRemplissage !== 'none', this.couleurDeRemplissage, this.color)
    arcangle.isVisible = false
    arcangle.opacite = this.opacite
    arcangle.epaisseur = this.epaisseur
    arcangle.opaciteDeRemplissage = this.opaciteDeRemplissage
    objets.push(arcangle)
    if (this.mark !== '') {
      const t = texteParPoint(mark, P, 90 - d.angleAvecHorizontale, this.color)
      t.isVisible = false
      objets.push(t)
    }
    if (mesureOn && texteACote === '') {
      const t = texteParPoint(mesure, M, 'milieu', this.color)
      t.isVisible = false
      objets.push(t)
    }
    if (texteACote !== '') {
      const texteACOTE = texteParPoint(texteACote, M, 'milieu', this.color, tailleTexte)
      objets.push(texteACOTE)
    }
    for (const objet of objets) {
      code += '\n\t' + objet.svg(coeff)
    }
    if (objets.length > 1) {
      code = `<g id="${this.id}">${code}</g>`
    } else {
      this.id = arcangle.id // Dans le cas où il n'y a pas de groupe, on récupère l'id
    }
    return code
  }

  this.svgml = function (coeff, amp) {
    let code = ''
    const depart = pointSurSegment(this.centre, this.debut, this.taille * 20 / context.pixelsParCm)
    const P = rotation(depart, this.centre, this.angle / 2)
    const M = pointSurSegment(this.centre, P, taille + 0.6 * 20 / coeff)
    const mesure = Math.round(Math.abs(angle)) + '°'
    const d = droite(this.centre, P)
    d.isVisible = false
    const arcangle = arc(depart, this.centre, this.angle, false, this.couleurDeRemplissage, this.color)
    arcangle.opacite = this.opacite
    arcangle.epaisseur = this.epaisseur
    arcangle.opaciteDeRemplissage = this.opaciteDeRemplissage
    if (this.mark !== '') code += texteParPoint(mark, P, 90 - d.angleAvecHorizontale, this.color).svg(coeff) + '\n'
    if (mesureOn && texteACote === '') code += texteParPoint(mesure, M, 'milieu', this.color).svg(coeff) + '\n'
    if (texteACote !== '') code += texteParPoint(texteACote, M, 'milieu', this.color, tailleTexte).svg(coeff) + '\n'
    code += arcangle.svgml(coeff, amp)
    return code
  }
  this.tikz = function () {
    let code = ''
    const depart = pointSurSegment(this.centre, this.debut, this.taille / context.scale)
    const P = rotation(depart, this.centre, this.angle / 2)
    const M = pointSurSegment(this.centre, P, taille + 0.6 / context.scale)
    const mesure = Math.round(Math.abs(angle)) + '°'
    const d = droite(this.centre, P)
    d.isVisible = false
    const arcangle = arc(depart, this.centre, this.angle, this.couleurDeRemplissage !== 'none', this.couleurDeRemplissage, this.color)
    arcangle.opacite = this.opacite
    arcangle.epaisseur = this.epaisseur
    arcangle.opaciteDeRemplissage = this.opaciteDeRemplissage
    if (this.mark !== '') code += texteParPoint(mark, P, 90 - d.angleAvecHorizontale, this.color).tikz() + '\n'
    if (mesureOn && texteACote === '') code += texteParPoint(mesure, M, 'milieu', this.color).tikz() + '\n'
    if (texteACote !== '') code += texteParPoint(texteACote, M, 'milieu', this.color, tailleTexte).tikz() + '\n'
    code += arcangle.tikz()
    return code
  }
  this.tikzml = function (amp) {
    let code = ''
    const depart = pointSurSegment(this.centre, this.debut, this.taille / context.scale)
    const M = rotation(depart, this.centre, this.angle / 2)
    const mesure = Math.round(Math.abs(angle)) + '°'
    const d = droite(this.centre, M)
    d.isVisible = false
    const arcangle = arc(depart, this.centre, this.angle, false, this.couleurDeRemplissage, this.color)
    arcangle.opacite = this.opacite
    arcangle.epaisseur = this.epaisseur
    arcangle.opaciteDeRemplissage = this.opaciteDeRemplissage
    if (this.mark !== '') code += texteParPoint(mark, M, 90 - d.angleAvecHorizontale, this.color).tikz() + '\n'
    if (mesureOn && texteACote === '') code += texteParPoint(mesure, M, 'milieu', this.color).tikz() + '\n'
    if (texteACote !== '') code += texteParPoint(texteACote, M, 'milieu', this.color, tailleTexte).tikz() + '\n'
    code += arcangle.tikzml(amp)
    return code
  }
}

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

/**
 * Renvoie la distance de A à B
 * @param {Point} A
 * @param {Point} B
 * @param {integer} [arrondi=2] Nombre de chiffres après la virgule. Facultatif, 2 par défaut.
 * @author Rémi Angot
 */
export function longueur (A, B, arrondi) {
  if (arrondi === undefined) {
    return Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2)
  } else {
    return calcul(Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2), arrondi)
  }
}

/**
 * norme(V) renvoie la norme du vecteur
 *
 * @author Rémi Angot
 */
export function norme (v) {
  return Math.sqrt(v.x ** 2 + v.y ** 2)
}

/**
 * Renvoie la mesure d'angle en degré
 * @param {Point} A Point sur un côté de l'angle
 * @param {Point} O Sommet de l'angle
 * @param {Point} B Point sur l'autre côté de l'angle
 * @param {integer} [precision = 2] Nombre maximal de décimales de la valeur arrondie de la mesure de l'angle
 * @example x = angle(H,E,T)
 * // x contient la mesure en degré de l'angle HET, arrondi au centième
 * @example x = angle(H,E,T,0)
 * // x contient la mesure en degré de l'angle HET, arrondi à l'unité
 * @return {number}
 * @author Rémi Angot
 */
// JSDOC Validee par EE Juin 2022
export function angle (A, O, B, precision = 2) {
  const OA = longueur(O, A)
  const OB = longueur(O, B)
  const AB = longueur(A, B)
  const v = vecteur(O, A)
  const w = vecteur(O, B)
  if (egal(v.x * w.y - v.y * w.x, 0)) { // vecteurs colinéaires à epsilon près pour éviter les effets de bords dus aux flottants.
    if (v.x * w.x > 0) return 0
    else if (v.x * w.x < 0) return 180
    else if (v.y * w.y > 0) return 0
    else return 180
  } else {
    return arrondi((Math.acos(arrondi((AB ** 2 - OA ** 2 - OB ** 2) / (-2 * OA * OB), 12)) * 180) / Math.PI, precision)
  }
}

/**
 * Convertit un nombre de degrés quelconque en une mesure comprise entre -180 et 180
 * @param {number} a Valeur en degrés dont on cherche la valeur entre -180 et 180
 * @example x = angleModulo(170)
 * // x contient 170
 * @example x = angleModulo(190)
 * // x contient -170
 * @example x = angleModulo(3690)
 * // x contient 90
 * @example x = angleModulo(180)
 * // x contient 180
 * @example x = angleModulo(-180)
 * // x contient 180
 * @return {number}
 */
// JSDOC Validee par EE Juin 2022
export function angleModulo (a) {
  while (a <= -180) a = a + 360
  while (a > 180) a = a - 360
  return a
}

/**
 * Retourne la valeur signée de la mesure d'un angle en degré
 * @param {Point} A Point sur un côté de l'angle
 * @param {Point} O Sommet de l'angle
 * @param {Point} B Point sur l'autre côté de l'angle
 * @param {integer} [precision = 2] Nombre maximal de décimales de la valeur arrondie de la mesure de l'angle orienté
 * @example x = angleOriente(H,E,T)
 * // x contient la valeur de la mesure de l'angle orienté HET, arrondie au centième
 * @example x = angleOriente(H,E,T,0)
 * // x contient la valeur de la mesure de l'angle orienté HET, arrondie à l'unité
 * @return {number}
 * @author Jean-Claude Lhote
 */
// JSDOC Validee par EE Juin 2022
export function angleOriente (A, O, B, precision = 2) {
  const A2 = rotation(A, O, 90)
  const v = vecteur(O, B)
  const u = vecteur(O, A2)
  return arrondi(unSiPositifMoinsUnSinon(arrondi(v.x * u.x + v.y * u.y, 10)) * angle(A, O, B), precision)
}

/**
 * Retourne la valeur la mesure d'un angle en radian
 * @param {Point} A Point sur un côté de l'angle
 * @param {Point} O Sommet de l'angle
 * @param {Point} B Point sur l'autre côté de l'angle
 * @param {integer} [precision = 2] Nombre maximal de décimales de la valeur arrondie de la mesure de l'angle orienté
 * @example x = angleradian(H,E,T)
 * // x contient la valeur de la mesure de l'angle HET en radians, arrondie au centième
 * @example x = angleradian(H,E,T,0)
 * // x contient la valeur de la mesure de l'angle HET en radians, arrondie à l'unité
 * @return {number}
 * @author Rémi Angot
 */
// JSDOC Validee par EE Juin 2022
export function angleradian (A, O, B, precision = 2) {
  const OA = longueur(O, A)
  const OB = longueur(O, B)
  const AB = longueur(A, B)
  return calcul(Math.acos(arrondi((AB ** 2 - OA ** 2 - OB ** 2) / (-2 * OA * OB), 12)), precision)
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
function pattern ({
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

