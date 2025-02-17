import { colorToLatexOrHTML, ObjetMathalea2D, xSVG, ySVG } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { inferieurouegal } from '../../modules/outils.js'
import { point, tracePoint } from './points.js'
import { motifs, polygone, polyline } from './polygones.js'
import { segment } from './segmentsVecteurs.js'
import { texteParPosition } from './textes.ts'
import { arc } from './cercle.js'

export function LectureImage (x, y, xscale = 1, yscale = 1, color = 'red', textAbs = '', textOrd = '') {
  ObjetMathalea2D.call(this, {})
  this.x = x
  this.y = y
  this.xscale = xscale
  this.yscale = yscale
  // if (textAbs === '') textAbs = x.toString()
  // if (textOrd === '') textOrd = y.toString()
  this.textAbs = textAbs
  this.textOrd = textOrd
  this.color = color

  this.svg = function (coeff) {
    const x0 = this.x / this.xscale
    const y0 = this.y / this.yscale
    const M = point(x0, y0)
    const X = point(x0, 0)
    const Y = point(0, y0)
    const Sx = segment(X, M, this.color)
    const Sy = segment(M, Y, this.color)
    Sx.styleExtremites = '->'
    Sy.styleExtremites = '->'
    Sx.pointilles = 5
    Sy.pointilles = 5
    return '\t\n' + Sx.svg(coeff) + '\t\n' + Sy.svg(coeff) + '\t\n' +
      (textAbs != null ? texteParPosition(this.textAbs, x0, -1 * 20 / coeff, 0, this.color).svg(coeff) : '') + '\t\n' +
      (textOrd != null ? texteParPosition(this.textOrd, -1 * 20 / coeff, y0, 0, this.color).svg(coeff) : '')
  }
  this.tikz = function () {
    const x0 = this.x / this.xscale
    const y0 = this.y / this.yscale
    const M = point(x0, y0)
    const X = point(x0, 0)
    const Y = point(0, y0)
    const Sx = segment(X, M, this.color)
    const Sy = segment(M, Y, this.color)
    Sx.styleExtremites = '->'
    Sy.styleExtremites = '->'
    Sx.pointilles = 5
    Sy.pointilles = 5
    return '\t\n' + Sx.tikz() + '\t\n' + Sy.tikz() + '\t\n' + texteParPosition(this.textAbs, x0, -1 / context.scale, 0, this.color).tikz() + '\t\n' + texteParPosition(this.textOrd, -1 / context.scale, y0, 0, this.color).tikz()
  }
  this.svgml = function (coeff, amp) {
    const x0 = this.x / this.xscale
    const y0 = this.y / this.yscale
    const M = point(x, y)
    const X = point(x0, 0)
    const Y = point(0, y0)
    const Sx = segment(X, M, this.color)
    const Sy = segment(M, Y, this.color)
    Sx.styleExtremites = '->'
    Sy.styleExtremites = '->'
    Sx.pointilles = 5
    Sy.pointilles = 5
    return '\t\n' + Sx.svgml(coeff, amp) + '\t\n' + Sy.svgml(coeff, amp) + '\t\n' + texteParPosition(this.textAbs, x0, -1 * 20 / coeff, 0, this.color).svg(coeff) + '\t\n' + texteParPosition(this.textOrd, -1 * 20 / coeff, y0, 0, this.color).svg(coeff)
  }
  this.tikzml = function (amp) {
    const x0 = this.x / this.xscale
    const y0 = this.y / this.yscale
    const M = point(x, y)
    const X = point(x0, 0)
    const Y = point(0, y0)
    const Sx = segment(X, M, this.color)
    const Sy = segment(M, Y, this.color)
    Sx.styleExtremites = '->'
    Sy.styleExtremites = '->'
    Sx.pointilles = 5
    Sy.pointilles = 5
    return '\t\n' + Sx.tikzml(amp) + '\t\n' + Sy.tikzml(amp) + '\t\n' + texteParPosition(this.textAbs, x0, -1 / context.scale, 0, this.color).tikz() + '\t\n' + texteParPosition(this.textOrd, -1 / context.scale, y0, 0, this.color).tikz()
  }
}

export function lectureImage (...args) {
  return new LectureImage(...args)
}

export function LectureAntecedent (x, y, xscale, yscale, color = 'black', textOrd, textAbs) {
  //
  ObjetMathalea2D.call(this, {})
  this.x = x
  this.y = y
  this.xscale = xscale
  this.yscale = yscale
  // if (textAbs == null) textAbs = this.x.toString().replace('.', ',')
  // if (textOrd == null) textOrd = this.y.toString().replace('.', ',')
  this.textAbs = textAbs
  this.textOrd = textOrd
  this.color = color
  this.bordures = [-2, -1.5, x + 2, y > 0 ? y + 1 : 0]

  this.svg = function (coeff) {
    const x0 = this.x / this.xscale
    const y0 = this.y / this.yscale
    const M = point(x0, y0)
    const X = point(x0, 0)
    const Y = point(0, y0)
    const Sx = segment(M, X, this.color)
    const Sy = segment(Y, M, this.color)
    Sx.styleExtremites = '->'
    Sy.styleExtremites = '->'
    Sx.pointilles = 5
    Sy.pointilles = 5
    return '\t\n' + Sx.svg(coeff) + '\t\n' + Sy.svg(coeff) + '\t\n' + (textAbs != null ? texteParPosition(this.textAbs, x0, -1 * 20 / coeff, 0, this.color).svg(coeff) : '') +
      '\t\n' +
      (textOrd != null ? texteParPosition(this.textOrd, -1 * 20 / coeff, y0, 0, this.color).svg(coeff) : '')
  }
  this.tikz = function () {
    const x0 = this.x / this.xscale
    const y0 = this.y / this.yscale
    const M = point(x0, y0)
    const X = point(x0, 0)
    const Y = point(0, y0)
    const Sx = segment(M, X, this.color)
    const Sy = segment(Y, M, this.color)
    Sx.styleExtremites = '->'
    Sy.styleExtremites = '->'
    Sx.pointilles = 5
    Sy.pointilles = 5
    return '\t\n' + Sx.tikz() + '\t\n' + Sy.tikz() + '\t\n' + texteParPosition(this.textAbs, x0, -1 / context.scale, 0, this.color).tikz() + '\t\n' + texteParPosition(this.textOrd, -1 / context.scale, y0, 0, this.color).tikz()
  }
  this.svgml = function (coeff, amp) {
    const x0 = this.x / this.xscale
    const y0 = this.y / this.yscale
    const M = point(x0, y0)
    const X = point(x0, 0)
    const Y = point(0, y0)
    const Sx = segment(M, X, this.color)
    const Sy = segment(Y, M, this.color)
    Sx.styleExtremites = '->'
    Sy.styleExtremites = '->'
    Sx.pointilles = 5
    Sy.pointilles = 5
    return '\t\n' + Sx.svgml(coeff, amp) + '\t\n' + Sy.svgml(coeff, amp) + '\t\n' + texteParPosition(this.textAbs, x0, -1 * 20 / coeff, 0, this.color).svg(coeff) + '\t\n' + texteParPosition(this.textOrd, -1 * 20 / coeff, y0, 0, this.color).svg(coeff)
  }
  this.tikzml = function (amp) {
    const x0 = this.x / this.xscale
    const y0 = this.y / this.yscale
    const M = point(x0, y0)
    const X = point(x0, 0)
    const Y = point(0, y0)
    const Sx = segment(M, X, this.color)
    const Sy = segment(Y, M, this.color)
    Sx.styleExtremites = '->'
    Sy.styleExtremites = '->'
    Sx.pointilles = 5
    Sy.pointilles = 5
    return '\t\n' + Sx.tikzml(amp) + '\t\n' + Sy.tikzml(amp) + '\t\n' + texteParPosition(this.textAbs, x0, -1 / context.scale, 0, this.color).tikz() + '\t\n' + texteParPosition(this.textOrd, -1 / context.scale, y0, 0, this.color).tikz()
  }
}

export function lectureAntecedent (...args) {
  return new LectureAntecedent(...args)
}

/**
 * Trace la courbe d'une fonction dans un repère
 * @param {function} f fonction à tracer comme par exemple : const f = x => a * x ** 2 + b * x + c
 * @param {Object} parametres À saisir entre accolades
 * @param {Repere} [parametres.repere  = {}]  Repère dans lequel le tracé de la fonction se fait
 * @param {string} [parametres.color = 'black']  Couleur du tracé de la courbe : du type 'blue' ou du type '#f15929'
 * @param {number} [parametres.epaisseur = 2]  Epaisseur du tracé de la courbe
 * @param {number} [parametres.xMin = repere.xMin]  Abscisse minimale du tracé de la courbe
 * @param {number} [parametres.xMax = repere.xMax]  Abscisse maximale du tracé de la courbe
 * @param {number} [parametres.yMin = repere.yMin]  Ordonnée minimale du tracé de la courbe
 * @param {number} [parametres.yMax = repere.yMax]  Ordonnée maximale du tracé de la courbe
 * @param {boolean|number} [parametres.step = false] Si false, le pas entre deux abscisses du tracé de la fonction est 0.2/xUnite. Sinon, ce pas vaut la valeur indiquée.
 * @param {number} [parametres.xUnite = 1]  Abscisse minimale du tracé de la courbe
 * @param {number} [parametres.yUnite = 1]  Abscisse maximale du tracé de la courbe
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} svgml Sortie, à main levée, au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} tikzml Sortie, à main levée, au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} color Couleur du tracé de la courbe. À associer obligatoirement à colorToLatexOrHTML().
 * @author Rémi Angot
 * @class
 */
// JSDOC Validee par EE Aout 2022
export function Courbe (f, {
  repere = {},
  color = 'black',
  epaisseur = 2,
  step = false,
  xMin = repere.xMin,
  xMax = repere.xMax,
  yMin = repere.yMin,
  yMax = repere.yMax,
  xUnite = 1,
  yUnite = 1
} = {}) {
  ObjetMathalea2D.call(this, {})
  this.bordures = repere.bordures ?? [0, 0, 0, 0]

  this.color = color
  let xunite, yunite // Tout en minuscule pour les différencier des paramètres de la fonction
  xunite = repere.xUnite
  yunite = repere.yUnite

  if (isNaN(xunite)) {
    xunite = xUnite
  }

  if (isNaN(yunite)) {
    yunite = yUnite
  }

  const objets = []
  let points = []
  let pas
  let p
  if (!step) {
    pas = 0.2 / xUnite
  } else {
    pas = step
  }
  for (let x = xMin; inferieurouegal(x, xMax); x += pas
  ) {
    if (x > xMax) x = xMax // normalement x<xMax... mais inférieurouegal ne compare qu'à 0.0000001 près, on peut donc avoir xMax+epsilon qui sort de l'intervalle de déf
    const y = Number(f(x))
    if (isFinite(y)) {
      if (f(x) < yMax + 1 && f(x) > yMin - 1) {
        points.push(point(x * xunite, f(x) * yunite))
      } else {
        if (points.length > 1) {
          p = polyline([...points], this.color)
          p.epaisseur = epaisseur
          objets.push(p)
          points = []
        }
      }
    } else {
      x += 0.05
    }
  }
  if (points.length > 1) {
    p = polyline([...points], this.color)
    p.epaisseur = epaisseur
    objets.push(p)
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

/**
 * Trace la courbe d'une fonction dans un repère
 * @param {function} f Fonction à tracer comme par exemple : const f = x => a * x ** 2 + b * x + c
 * @param {Object} parametres À saisir entre accolades
 * @param {Repere} [parametres.repere = {}] Repère dans lequel le tracé de la fonction se fait
 * @param {string} [parametres.color = 'black']  Couleur du tracé de la courbe : du type 'blue' ou du type '#f15929'
 * @param {number} [parametres.epaisseur = 2]  Epaisseur du tracé de la courbe
 * @param {number} [parametres.xMin = repere.xMin]  Abscisse minimale du tracé de la courbe
 * @param {number} [parametres.xMax = repere.xMax]  Abscisse maximale du tracé de la courbe
 * @param {number} [parametres.yMin = repere.yMin]  Ordonnée minimale du tracé de la courbe
 * @param {number} [parametres.yMax = repere.yMax]  Ordonnée maximale du tracé de la courbe
 * @param {boolean|number} [parametres.step = false] Si false, le pas entre deux abscisses du tracé de la fonction est 0.2/xUnite. Sinon, ce pas vaut la valeur indiquée.
 * @param {number} [parametres.xUnite = 1]  Abscisse minimale du tracé de la courbe
 * @param {number} [parametres.yUnite = 1]  Abscisse maximale du tracé de la courbe
 * @example courbe(g, {repere: r})
 * // Trace, en noir avec une épaisseur de 2, la courbe g dans le repère r, tous deux précédemment définis.
 * @example courbe(g, {repere: r, epaisseur: 5, color: 'blue'})
 * // Trace la courbe g dans le repère r, tous deux précédemment définis, en bleu, avec une épaisseur de 5.
 * @author Rémi Angot
 * @return {Courbe}
 */
// JSDOC Validee par EE Aout 2022
export function courbe (f, {
  repere = {},
  color = 'black',
  epaisseur = 2,
  step = false,
  xMin,
  xMax,
  yMin,
  yMax,
  xUnite = 1,
  yUnite = 1
} = {}) {
  return new Courbe(f, { repere, color, epaisseur, step, xMin, xMax, yMin, yMax, xUnite, yUnite })
}

/**
 * Trace l'aire entre la courbe d'une fonction et l'axe des abscisses
 * @param {function} f fonction dont on veut tracer l'aire entre sa courbe et l'axe des abscisses comme par exemple : const f = x => a * x ** 2 + b * x + c
 * @param {Object} parametres À saisir entre accolades
 * @param {Repere} [parametres.repere  = {}]  Repère dans lequel le tracé de la fonction se fait
 * @param {string} [parametres.color = 'black']  Couleur du contour de l'aire : du type 'blue' ou du type '#f15929'
 * @param {number} [parametres.epaisseur = 2]  Epaisseur du contour de l'aire
 * @param {string} [parametres.couleurDeRemplissage = 'blue']  Couleur de l'intérieur de l'aire : du type 'blue' ou du type '#f15929'
 * @param {number} [parametres.opacite = 0.5] Taux d'opacité du remplissage entre 0 et 1
 * @param {number} [parametres.hachures = 0] Style des hachures dans cette aire (entier entre 0 et 10).
 * @param {boolean|number} [parametres.step = false] Si false, le pas entre deux abscisses pour tracer l'aire est 0.2/xUnite. Sinon, ce pas vaut la valeur indiquée.
 * @param {number} [parametres.a = 0]  Abscisse minimale du tracé de la courbe avec a < b
 * @param {number} [parametres.b = 1]  Abscisse maximale du tracé de la courbe avec a < b
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} svgml Sortie, à main levée, au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} tikzml Sortie, à main levée, au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} color Couleur du contour de l'aire. À associer obligatoirement à colorToLatexOrHTML().
 * @property {string} couleurDeRemplissage Couleur de l'intérieur de l'aire. À associer obligatoirement à colorToLatexOrHTML().
 * @property {number} xUnite Unité des abscisses du repère
 * @property {number} yUnite Unité des ordonnées du repère
 * @property {number} ymin Ordonnée minimale du repère
 * @property {number} ymax Ordonnée maximale du repère
 * @author Rémi Angot
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function Integrale (f, {
  repere = {},
  color = 'black',
  couleurDeRemplissage = 'blue',
  epaisseur = 2,
  step = false,
  a = 0,
  b = 1,
  opacite = 0.5,
  hachures = 0
} = {}) {
  ObjetMathalea2D.call(this, {})
  this.color = color
  this.couleurDeRemplissage = couleurDeRemplissage
  const ymin = repere.yMin
  const ymax = repere.yMax
  const xunite = repere.xUnite
  const yunite = repere.yUnite

  const objets = []
  const points = []
  let pas
  if (!step) {
    pas = 0.2 / xunite
  } else {
    pas = step
  }
  for (let x = a; inferieurouegal(x, b); x += pas
  ) {
    if (x > b) x = b // normalement x<xMax... mais inférieurouegal ne compare qu'à 0.0000001 près, on peut donc avoir xMax+epsilon qui sort de l'intervalle de déf
    if (isFinite(f(x))) {
      if (f(x) < ymax + 1 && f(x) > ymin - 1) {
        points.push(point(x * xunite, f(x) * yunite))
      } else {
        window.notify('Erreur dans Integrale : Il semble que la fonction ne soit pas continue sur l\'intervalle', {
          f,
          a,
          b
        })
      }
    } else {
      x += 0.05
    }
  }
  points.push(point(b * xunite, f(b) * yunite), point(b * xunite, 0), point(a * xunite, 0))
  const p = polygone([...points], this.color)
  p.epaisseur = epaisseur
  p.couleurDeRemplissage = colorToLatexOrHTML(this.couleurDeRemplissage)
  p.opaciteDeRemplissage = opacite
  p.hachures = hachures !== -1 ? motifs(hachures) : false
  objets.push(p)
  this.bordures = repere.bordures
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

/**
 * Trace l'aire entre la courbe d'une fonction et l'axe des abscisses
 * @param {function} f fonction dont on veut tracer l'aire entre sa courbe et l'axe des abscisses comme par exemple : const f = x => a * x ** 2 + b * x + c
 * @param {Object} parametres À saisir entre accolades
 * @param {Repere} [parametres.repere  = {}]  Repère dans lequel le tracé de la fonction se fait
 * @param {string} [parametres.color = 'black']  Couleur du contour de l'aire : du type 'blue' ou du type '#f15929'
 * @param {number} [parametres.epaisseur = 2]  Epaisseur du contour de l'aire
 * @param {string} [parametres.couleurDeRemplissage = 'blue']  Couleur de l'intérieur de l'aire : du type 'blue' ou du type '#f15929'
 * @param {number} [parametres.opacite = 0.5] Taux d'opacité du remplissage entre 0 et 1
 * @param {number} [parametres.hachures = 0] Style des hachures dans cette aire (entier entre 0 et 10).
 * @param {boolean|number} [parametres.step = false] Si false, le pas entre deux abscisses pour tracer l'aire est 0.2/xUnite. Sinon, ce pas vaut la valeur indiquée.
 * @param {number} [parametres.a = 0]  Abscisse minimale du tracé de la courbe avec a < b
 * @param {number} [parametres.b = 1]  Abscisse maximale du tracé de la courbe avec a < b
 * @example integrale(g, {repere: r})
 * // Trace avec une épaisseur de 2, l'aire entre la courbe de la fonction g et l'axe des abscisses dans le repère r, tous deux précédemment définis.
 * @example integrale(g,  {repere: r, epaisseur: 5, color: 'blue', couleurDeRemplissage: 'red'})
 * // Trace avec une épaisseur de 5, l'aire entre la courbe de la fonction g et l'axe des abscisses dans le repère r, tous deux précédemment définis. L'aire est entourée de bleu et remplie de rouge.
 * @author Rémi Angot
 * @return {Integrale}
 */
// JSDOC Validee par EE Juin 2022
export function integrale (f, {
  repere = {},
  color = 'black',
  couleurDeRemplissage = 'blue',
  epaisseur = 2,
  step = false,
  a = 0,
  b = 1,
  opacite = 0.5,
  hachures = 0
} = {}) {
  return new Integrale(f, { repere, color, couleurDeRemplissage, epaisseur, step, a, b, opacite, hachures })
}

export function BezierPath ({
  xStart = 0,
  yStart = 0,
  listeOfTriplets = [[[1, 1], [-1, -1], [1, 1]]],
  color = 'black',
  epaisseur = 2,
  opacite = 1
}) {
  ObjetMathalea2D.call(this, {})
  this.color = colorToLatexOrHTML(color)
  this.opacite = opacite
  this.epaisseur = epaisseur
  this.svg = function (coeff) { //
    let path = `<path fill="none" stroke="${this.color[0]}" stroke-width=${this.epaisseur} d="M${xSVG(xStart, coeff)},${ySVG(yStart, coeff)} c`
    for (const triplet of listeOfTriplets) {
      path += `${xSVG(triplet[0][0], coeff)},${ySVG(triplet[0][1], coeff)} ${xSVG(triplet[1][0], coeff)},${ySVG(triplet[1][1], coeff)} ${xSVG(triplet[2][0], coeff)},${ySVG(triplet[2][1], coeff)} `
    }
    path += '" />\n'
    return path
  }
  this.tikz = function () {
    let path = `\n\t\\draw[color = ${this.color[1]},line width = ${this.epaisseur}, opacity = ${this.opacite}](${xStart},${yStart})`
    // Pour tikz, les coordonnées du point initial et final doivent être en coordonnées absolues, seules les points de contrôles peuvent-être en relatif à leur noeud respectif
    let x0 = xStart
    let y0 = yStart
    for (const triplet of listeOfTriplets) {
      const x3 = x0 + triplet[2][0]
      const y3 = y0 + triplet[2][1]
      const dX2X3 = triplet[1][0] - triplet[2][0] // tikz prend comme origine le point final pour calculer les coordonnées relatives du point de contrôle 2 !
      const dY2Y3 = triplet[1][1] - triplet[2][1]
      path += ` .. controls +(${triplet[0][0].toFixed(2)},${triplet[0][1].toFixed(2)}) and +(${dX2X3.toFixed(2)},${dY2Y3.toFixed(2)})  .. (${x3.toFixed(2)},${y3.toFixed(2)})\n`
      x0 = x3 // Le nouveau point de départ est le point d'arrivée du tronçon précédent !
      y0 = y3
    }
    path += ';\n'
    return path
  }
}

/**
 * Trace la courbe d'une fonction, précédemment définie comme Spline, dans un repère
 * @param {function} f fonction à tracer défine, au préalable, avec splineCatmullRom()
 * @param {Object} parametres À saisir entre accolades
 * @param {Repere} [parametres.repere  = {}] Repère dans lequel le tracé de la fonction se fait
 * @param {string} [parametres.color = 'black']  Couleur du tracé de la courbe : du type 'blue' ou du type '#f15929'
 * @param {number} [parametres.epaisseur = 2]  Epaisseur du tracé de la courbe
 * @param {number} [parametres.xMin = repere.xMin]  Abscisse minimale du tracé de la courbe
 * @param {number} [parametres.xMax = repere.xMax]  Abscisse maximale du tracé de la courbe
 * @param {number} [parametres.yMin = repere.yMin]  Ordonnée minimale du tracé de la courbe
 * @param {number} [parametres.yMax = repere.yMax]  Ordonnée maximale du tracé de la courbe
 * @param {boolean|number} [parametres.step = false] Si false, le pas entre deux abscisses du tracé de la fonction est 0.2/xUnite. Sinon, ce pas vaut la valeur indiquée.
 * @param {number} [parametres.xUnite = 1]  Abscisse minimale du tracé de la courbe
 * @param {number} [parametres.yUnite = 1]  Abscisse maximale du tracé de la courbe
 * @param {boolean} [parametres.traceNoeuds = true]  Place (ou non) les points définis dans le paramètre f.
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} color Couleur du tracé de la courbe. À associer obligatoirement à colorToLatexOrHTML().
 * @author Jean-Claude Lhote
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function CourbeSpline (f, {
  repere = {},
  color = 'black',
  epaisseur = 2,
  step = false,
  xMin = repere.xMin,
  xMax = repere.xMax,
  yMin = repere.yMin,
  yMax = repere.yMax,
  xUnite = 1,
  yUnite = 1,
  traceNoeuds = true
} = {}) {
  ObjetMathalea2D.call(this, {})
  this.color = color
  const noeuds = []
  let points = []
  let xunite, yunite // Tout en minuscule pour les différencier des paramètres de la fonction
  xunite = repere.xUnite
  yunite = repere.yUnite

  if (isNaN(xunite)) {
    xunite = xUnite
  }

  if (isNaN(yunite)) {
    yunite = yUnite
  }

  const objets = []
  if (traceNoeuds) {
    for (let i = 0; i < f.x.length; i++) {
      noeuds[i] = tracePoint(point(f.x[i], f.y[i]), 'black')
      noeuds[i].taille = 3
      noeuds[i].style = '+'
      noeuds[i].epaisseur = 2
      noeuds.opacite = 0.5
      objets.push(noeuds[i])
    }
  }
  let pas
  let p, y
  if (!step) {
    pas = 0.2 / xUnite
  } else {
    pas = step
  }
  for (let x = xMin; inferieurouegal(x, xMax); x = x + pas) {
    if (x > xMax) x = xMax // normalement x<xMax... mais inférieurouegal ne compare qu'à 0.0000001 près, on peut donc avoir xMax+epsilon qui sort de l'intervalle de déf
    y = f.image(x)
    if (!isNaN(y)) {
      if (y < yMax + 1 && y > yMin - 1) {
        points.push(point(x * xunite, y * yunite))
      } else if (points.length > 0) {
        p = polyline([...points], this.color)
        p.epaisseur = epaisseur
        p.opacite = 0.7
        objets.push(p)
        points = []
      }
    } else {
      x += 0.05
    }
  }
  p = polyline([...points], this.color)
  p.epaisseur = epaisseur
  p.opacite = 0.7
  objets.push(p)
  this.bordures = repere.bordures
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
 * Trace la courbe d'une fonction, précédemment définie comme Spline, dans un repère
 * @param {function} f fonction à tracer défine, au préalable, avec splineCatmullRom()
 * @param {Object} parametres À saisir entre accolades
 * @param {Repere} [parametres.repere  = {}] Repère dans lequel le tracé de la fonction se fait
 * @param {string} [parametres.color = 'black']  Couleur du tracé de la courbe : du type 'blue' ou du type '#f15929'
 * @param {number} [parametres.epaisseur = 2]  Epaisseur du tracé de la courbe
 * @param {number} [parametres.xMin = repere.xMin]  Abscisse minimale du tracé de la courbe
 * @param {number} [parametres.xMax = repere.xMax]  Abscisse maximale du tracé de la courbe
 * @param {number} [parametres.yMin = repere.yMin]  Ordonnée minimale du tracé de la courbe
 * @param {number} [parametres.yMax = repere.yMax]  Ordonnée maximale du tracé de la courbe
 * @param {boolean|number} [parametres.step = false] Si false, le pas entre deux abscisses du tracé de la fonction est 0.2/xUnite. Sinon, ce pas vaut la valeur indiquée.
 * @param {number} [parametres.xUnite = 1]  Abscisse minimale du tracé de la courbe
 * @param {number} [parametres.yUnite = 1]  Abscisse maximale du tracé de la courbe
 * @param {boolean} [parametres.traceNoeuds = true]  Place (ou non) les points définis dans le paramètre f.
 * @example courbeSpline(g, {repere: r})
 * // Trace, en noir avec une épaisseur de 2, la courbe spline g dans le repère r, tous deux précédemment définis.
 * @example courbeSpline(g, {repere: r, epaisseur: 5, color: 'blue'})
 * // Trace la courbe spline g dans le repère r, tous deux précédemment définis, en bleu, avec une épaisseur de 5.
 * @author Jean-Claude Lhote
 * @return {CourbeSpline}
 */
// JSDOC Validee par EE Juin 2022
export function courbeSpline (f, {
  repere = {},
  color = 'black',
  epaisseur = 2,
  step = false,
  xMin = repere.xMin,
  xMax = repere.xMax,
  yMin = repere.yMin,
  yMax = repere.yMax,
  xUnite = 1,
  yUnite = 1,
  traceNoeuds = true
} = {}) {
  return new CourbeSpline(f, { repere, color, epaisseur, step, xMin, xMax, yMin, yMax, xUnite, yUnite, traceNoeuds })
}

/**
 * @see : https://gist.github.com/ericelliott/80905b159e1f3b28634ce0a690682957
 * @private
 */
// y1: start value
// y2: end value
// mu: the current frame of the interpolation,
//     in a linear range from 0-1.
const cosineInterpolate = (y1, y2, mu) => {
  const mu2 = (1 - Math.cos(mu * Math.PI)) / 2
  return y1 * (1 - mu2) + y2 * mu2
}

/**
 * Trace la courbe d'une fonction interpolée, linéaire par parties, dans un repère
 * @param {Array.number[]} tableau Ce tableau de tableaux contient les coordonnées des points à rejoindre comme par exemple : [[-5,2],[-1,-7],[2,5],[3,-1]]
 * @param {Object} parametres À saisir entre accolades
 * @param {Repere} [parametres.repere  = { xMin: -1, yMin: 1 }] Repère dans lequel le tracé de la fonction se fait
 * @param {string} [parametres.color = 'black']  Couleur du tracé de la courbe : du type 'blue' ou du type '#f15929'
 * @param {number} [parametres.epaisseur = 2]  Epaisseur du tracé de la courbe
 * @param {number} [parametres.xMin = repere.xMin]  Abscisse minimale du tracé de la courbe
 * @param {number} [parametres.xMax = repere.xMax]  Abscisse maximale du tracé de la courbe
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @author Rémi Angot
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function CourbeInterpolee (
  tableau,
  {
    color = 'black',
    epaisseur = 2,
    repere = { xMin: -1, yMin: 1 },
    xMin = repere.xMin,
    xMax = repere.xMax
  } = {}) {
  ObjetMathalea2D.call(this, {})
  const mesCourbes = []
  for (let i = 0; i < tableau.length - 1; i++) {
    const x0 = tableau[i][0]
    const y0 = tableau[i][1]
    const x1 = tableau[i + 1][0]
    const y1 = tableau[i + 1][1]
    const f = (x) => cosineInterpolate(y0, y1, (x - x0) / (x1 - x0))
    let depart, fin
    xMin > x0 ? (depart = xMin) : (depart = x0)
    xMax < x1 ? (fin = xMax) : (fin = x1)
    const c = courbe(f, { repere, xMin: depart, xMax: fin, color, epaisseur })
    mesCourbes.push(c)
  }
  const lesY = tableau.map(el => el[1])
  const lesX = tableau.map(el => el[0])
  this.bordures = [Math.min(...lesX), Math.min(...lesY), Math.max(...lesX), Math.max(...lesY)]
  this.svg = function (coeff) {
    let code = ''
    for (const objet of mesCourbes) {
      code += '\n\t' + objet.svg(coeff)
    }
    return code
  }
  this.tikz = function () {
    let code = ''
    for (const objet of mesCourbes) {
      code += '\n\t' + objet.tikz()
    }
    return code
  }
}

/**
 * Trace la courbe d'une fonction interpolée, linéaire par parties, dans un repère
 * @param {Array.number[]} tableau Ce tableau de tableaux contient les coordonnées des points à rejoindre comme par exemple : [[-5,2],[-1,-7],[2,5],[3,-1]]
 * @param {Object} parametres À saisir entre accolades
 * @param {Repere} [parametres.repere  = {}]  Repère dans lequel le tracé de la fonction se fait
 * @param {string} [parametres.color = 'black']  Couleur du tracé de la courbe : du type 'blue' ou du type '#f15929'
 * @param {number} [parametres.epaisseur = 2]  Epaisseur du tracé de la courbe
 * @param {number} [parametres.xMin = repere.xMin]  Abscisse minimale du tracé de la courbe
 * @param {number} [parametres.xMax = repere.xMax]  Abscisse maximale du tracé de la courbe
 * @example courbeInterpolee(tab, {repere: r})
 * // Trace, en noir avec une épaisseur de 2, la courbe de la fonction interpolée sur les intervalles définis dans tab, dans le repère r, tous deux précédemment définis.
 * @example courbeInterpolee(tab, {repere: r, epaisseur: 5, color: 'blue'})
 * // Trace la courbe de la fonction interpolée sur les intervalles définis dans tab, dans le repère r, tous deux précédemment définis, en bleu avec une épaisseur de 5.
 * @author Rémi Angot
 * @return {CourbeInterpolee}
 */
// JSDOC Validee par EE Juin 2022
export function courbeInterpolee (tableau, {
  color = 'black',
  epaisseur = 1,
  repere = {},
  xMin = -10,
  xMax = 10
} = {}) {
  return new CourbeInterpolee(tableau, { color, epaisseur, repere, xMin, xMax })
}

export function GraphiqueInterpole (
  tableau, {
    color = 'black',
    epaisseur = 1,
    repere = {}, // repère par défaut : le laisser...
    step = 0.2
  } = {}
) {
  ObjetMathalea2D.call(this, {})
  const mesCourbes = []
  for (let i = 0; i < tableau.length - 1; i++) {
    const x0 = tableau[i][0]
    const y0 = tableau[i][1]
    const x1 = tableau[i + 1][0]
    const y1 = tableau[i + 1][1]
    const f = (x) => cosineInterpolate(y0, y1, (x - x0) / (x1 - x0))
    let depart, fin
    repere.xMin > x0 ? (depart = repere.xMin) : (depart = x0)
    repere.xMax < x1 ? (fin = repere.xMax) : (fin = x1)
    const c = courbe(f, {
      repere,
      step,
      xMin: depart,
      xMax: fin,
      color,
      epaisseur,
      xUnite: repere.xUnite,
      yUnite: repere.yUnite,
      yMin: repere.yMin,
      yMax: repere.yMax
    })
    mesCourbes.push(c)
  }
  this.bordures = repere.bordures
  this.svg = function (coeff) {
    let code = ''
    for (const objet of mesCourbes) {
      code += '\n\t' + objet.svg(coeff)
    }
    return code
  }
  this.tikz = function () {
    let code = ''
    for (const objet of mesCourbes) {
      code += '\n\t' + objet.tikz()
    }
    return code
  }
}

/**
 *
 *
 * @author Rémi Angot
 */
export function graphiqueInterpole (...args) {
  return new GraphiqueInterpole(...args)
}

export function imageInterpolee (tableau, antecedent) {
  const x0 = tableau[0][0]
  const y0 = tableau[0][1]
  const x1 = tableau[1][0]
  const y1 = tableau[1][1]
  const f = (x) => cosineInterpolate(y0, y1, (x - x0) / (x1 - x0))
  return f(antecedent)
}

export function antecedentInterpole (tableau, image) {
  const x0 = tableau[0][0]
  const y0 = tableau[0][1]
  const x1 = tableau[1][0]
  const y1 = tableau[1][1]
  const f = (x) => cosineInterpolate(y0, y1, (x - x0) / (x1 - x0))
  return antecedentParDichotomie(x0, x1, f, image, 0.01)
}

export function antecedentParDichotomie (xmin, xmax, f, y, precision = 0.01) {
  // On arrondit à 1E-6 parce que sinon, on passe à côté de valeur qui devraient être nulle mais le sont pas à 1E-15 !
  const ymax = Number(Math.max(f(xmax), f(xmin)).toFixed(6))
  const ymin = Number(Math.min(f(xmax), f(xmin)).toFixed(6))
  if (y > ymax || y < ymin) return false // y n'est pas entre les deux extrêmes, la méthode ne fonctionne pas.
  let xmoy, ymoy
  if (xmin > xmax) {
    xmoy = xmin
    xmin = xmax
    xmax = xmoy
  }
  xmoy = (xmax + xmin) / 2
  ymoy = f(xmoy)
  let cpt = 0
  while (Math.abs(ymoy - y) > precision && cpt < 1000) {
    if (f(xmin) < f(xmax)) {
      if (ymoy > y) {
        xmax = xmoy
      } else {
        xmin = xmoy
      }
    } else if (ymoy > y) {
      xmin = xmoy
    } else {
      xmax = xmoy
    }
    xmoy = (xmin + xmax) / 2
    ymoy = f(xmoy)
    cpt++
  }
  if (cpt > 1000) return false
  return xmoy
}

/**
 * crée un petit demi-cercle en x,y pour marquer une courbe sur un intervalle ouvert
 * @param {number} x
 * @param {number} y
 * @param {'gauche'|'droite'} sens 'gauche' par défaut
 * @param {number} rayon
 * @param {string} couleur
 * @returns {Arc}
 */
export function croche (x, y, sens = 'gauche', rayon = 0.1, couleur = 'black') {
  const centre = point(x + (sens === 'gauche' ? -rayon : rayon), y)
  const dessous = point(x + (sens === 'gauche' ? -rayon : rayon), y - rayon)
  const dessus = point(x + (sens === 'gauche' ? -rayon : rayon), y + rayon)
  const croche = sens === 'gauche' ? arc(dessous, centre, dessus) : arc(dessus, centre, dessous)
  croche.color = colorToLatexOrHTML(couleur)
  return croche
}
