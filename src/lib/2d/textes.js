import Decimal from 'decimal.js'
import katex from 'katex'
import { colorToLatexOrHTML, ObjetMathalea2D, vide2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { arrondi } from '../outils/nombres'
import { stringNombre } from '../outils/texNombre'
import { point } from './points.js'

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
  // ObjetMathalea2D.call(this, {}) rectification due aux latexParCoordonnees() qui ne sont plus des ObjetsMathalea2d comme les autres
  // Jean-Claude Lhote 15/08/2023
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
  return objets
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

/**  Nomme les points passés en argument, le nombre d'arguments n'est pas limité.
 * @param  {Point[]} points Points mis à la suite
 * @param {string} [color = 'black'] Couleur des points : du type 'blue' ou du type '#f15929'
 * @property {string} color Couleur des points. À associer obligatoirement à colorToLatexOrHTML().
 * @property {number} taille Taille de la boite contenant le nom des points
 * @property {number} largeur Largeur de la boite contenant le nom des points
 * @property {number[]} bordures Coordonnées de la fenêtre d'affichage du genre [-2,-2,5,5]
 * @author Rémi Angot
 * @return object[]
 */
// JSDOC Validee par EE Septembre 2022
export function labelPoint (...points) {
  const taille = 1

  // ObjetMathalea2D.call(this, {})
  let color
  if (typeof points[points.length - 1] === 'string') {
    color = colorToLatexOrHTML(points[points.length - 1])
    points.length--
  } else {
    color = colorToLatexOrHTML('black')
  }
  const objets = []
  for (const unPoint of points) {
    let A
    if (unPoint.typeObjet === 'point3d') {
      A = unPoint.c2d
    } else {
      A = unPoint
    }

    let x, y
    if (A.nom !== undefined) {
      x = A.x
      y = A.y
      // if (this.positionLabel === '' && unPoint.typeObjet === 'point3d') A.positionLabel = this.positionLabel
      switch (A.positionLabel) {
        case 'left':
          objets.push(texteParPosition(A.nom, x - 10 / context.pixelsParCm, y, 'milieu', color[0], taille, 'middle', true))
          break
        case 'right':
          objets.push(texteParPosition(A.nom, x + 10 / context.pixelsParCm, y, 'milieu', color[0], taille, 'middle', true))
          break
        case 'below':
          objets.push(texteParPosition(A.nom, x, y - 10 / context.pixelsParCm, 'milieu', color[0], taille, 'middle', true))
          break
        case 'above':
          objets.push(texteParPosition(A.nom, x, y + 10 / context.pixelsParCm, 'milieu', color[0], taille, 'middle', true))
          break
        case 'above left':
          objets.push(texteParPosition(A.nom, x - 10 / context.pixelsParCm, y + 10 / context.pixelsParCm, 'milieu', color[0], taille, 'middle', true))
          break
        case 'above right':
          objets.push(texteParPosition(A.nom, x + 10 / context.pixelsParCm, y + 10 / context.pixelsParCm, 'milieu', color[0], taille, 'middle', true))
          break
        case 'below left':
          objets.push(texteParPosition(A.nom, x - 10 / context.pixelsParCm, y - 10 / context.pixelsParCm, 'milieu', color[0], taille, 'middle', true))
          break
        case 'below right':
          objets.push(texteParPosition(A.nom, x + 10 / context.pixelsParCm, y - 10 / context.pixelsParCm, 'milieu', color[0], taille, 'middle', true))
          break
        default:
          objets.push(texteParPosition(A.nom, x, y, 'milieu', color[0], taille, 'middle', true))
          break
      }
    }
  }
  return objets
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
  this.taille = 14 * scale
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
    if (!A.positionLabel) {
      A.positionLabel = 'above'
    }
    this.svg = function (coeff) {
      const latex = latexParPoint(texte.substring(1, texte.length - 1), A, this.color, texte.length * 8, 12, '', 8).svg(coeff)
      return latex
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
          default:
            code = `<text ${style} x="${A.xSVG(coeff)}" y="${A.ySVG(
                            coeff
                        )}" text-anchor="middle" dominant-baseline="central" fill="${this.couleurDeRemplissage[0]
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
        } else if (orientation === 'droite') {
          anchor = `node[anchor = west,scale=${scale}]`
        } else {
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
  if (texte[0] === '$') {
    return latexParCoordonnees(texte.substring(1, texte.length - 1), x, y, color, 50, 20, 'white', 8 * scale)
  } else {
    return new TexteParPoint(texte, point(x, y), orientation, color, scale, ancrageDeRotation, mathOn, opacite)
  }
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
  return latexParCoordonnees(texte, x, y, color, largeur, hauteur, colorBackground, tailleCaracteres)
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
export function LatexParCoordonnees (texte, x, y, color, largeur, hauteur, colorBackground = '', tailleCaracteres) {
  ObjetMathalea2D.call(this, {})
  if (typeof texte !== 'string') throw Error(`Vous n'avez pas passer un string à latexParCoordonnees() : ${texte}`)
  // texte doit être de type texte maintenant, sinon, tu revois ton code !
  if (texte === '') return vide2d(x, y) // ton texte est vide ? ben y a rien à afficher !
  if (texte[0] === '$' && texte[texte.length - 1] === '$') {
    // tu as mis des $ $ pour délimiter ton texte.
    // Or c'est prévu d'en ajouter parce que c'est l'idée qu'on se fait de latexParCoordonnees()
    // Si c'est pas pour du latex en mode math, on aurait utilisé texteParPosition-) !
    texte = texte.substring(1, texte.length - 2)// donc on les enlève, pour ne pas avoir des $$ !
  }
  this.x = x
  this.y = y
  this.largeur = largeur * Math.log10(2 * tailleCaracteres)
  this.hauteur = hauteur * Math.log10(tailleCaracteres)
  this.colorBackground = colorBackground
  this.color = colorToLatexOrHTML(color)
  this.texte = texte
  this.tailleCaracteres = tailleCaracteres
  this.bordures = [this.x - (this.texte.length ?? 0) * 0.2, this.y - 0.02 * this.hauteur, this.x + (this.texte.length ?? 0) * 0.2, this.y + 0.02 * this.hauteur]
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
  // taille = ''
  this.svg = function () {
    let divLatex
    if (this.colorBackground !== '') {
      divLatex = `<div class="divLatex" style="position: absolute; transform: translate(-50%,-50%); ">${katex.renderToString('\\colorbox{' + colorToLatexOrHTML(this.colorBackground)[0] + '}{ ' + taille + ' {\\color{' + this.color[0] + '}$' + this.texte + '$}}')}</div>`
    } else {
      divLatex = `<div class="divLatex" style="position: absolute; transform: translate(-50%,-50%); ">${katex.renderToString('\\color{' + this.color[0] + '}' + taille + ' ' + this.texte + '')}</div>`
    }
    /* const thisX = this.x
    const thisY = this.y
    return { divLatex, thisX, thisY } */
    return { divLatex, x, y }
  }

  this.tikz = function () {
    let code
    if (this.colorBackground !== '') {
      code = `\\draw (${x},${y}) node[anchor = center] {\\colorbox ${colorToLatexOrHTML(this.colorBackground)[1]}{${taille}  \\color${this.color[1]}{$${this.texte}$}}};`
    } else {
      code = `\\draw (${x},${y}) node[anchor = center] {${taille} \\color${this.color[1]}{$${this.texte}$}};`
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
export function LatexParCoordonneesBox (texte, x, y, color, largeur, hauteur, colorBackground, tailleCaracteres = 8, options) {
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
  this.taille = taille

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
      $${this.taille} \\color{${this.color[0]}}{${this.texte}}$
      </div></div></foreignObject>`
    // <circle cx="${this.x * coeff - demiLargeur}" cy="${-this.y * coeff - centrage - this.hauteur / 2}" r="1" fill="red" stroke="blue" stroke-width="2"  />
    // <circle cx="${this.x * coeff}" cy="${-this.y * coeff}" r="1" fill="red" stroke="blue" stroke-width="2"  />`
  }

  this.tikz = function () {
    let code
    if (this.colorBackground !== '') {
      code = `\\draw (${x},${y}) node[anchor = center] {\\colorbox ${this.colorBackground[1]}{${this.taille}  \\color${this.color[1]}{$${texte}$}}};`
    } else {
      code = `\\draw (${x},${y}) node[anchor = center] {${this.taille} \\color${this.color[1]}{$${texte}$}};`
    }
    return code
  }
}

export function latexParCoordonneesBox (texte, x, y, color = 'black', largeur = 50, hauteurLigne = 20, colorBackground = 'white', tailleCaracteres = 8, options = {}) {
  if (texte === '') return vide2d()
  else return new LatexParCoordonneesBox(texte, x, y, color, largeur, hauteurLigne, colorBackground, tailleCaracteres, options)
}
