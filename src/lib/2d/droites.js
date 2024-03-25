import { colorToLatexOrHTML, ObjetMathalea2D, vide2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { egal } from '../../modules/outils.js'
import { angleOriente } from './angles.js'
import { traceCompas } from './cercle.js'
import { codageBissectrice, codageMediatrice, codageSegments } from './codages.js'
import { milieu, point, pointSurDroite, pointSurSegment } from './points.js'
import { demiDroite, longueur, norme, segment, vecteur } from './segmentsVecteurs.js'
import { latexParCoordonnees, texteParPosition } from './textes.ts'
import { homothetie, projectionOrtho, rotation, symetrieAxiale, translation } from './transformations.js'

/**
 * Afin de régler le problème des noms de droites en latex qui ne peuvent se fondre dans le svg, cette fonction retourne un Array de deux objets :
 * Le premier est la droite (avec toutes ses propriétés et méthodes)
 * Le deuxième est un objet latexParCoordonnees
 * @param {Droite} d
 * @param {string} nom
 * @param {string} color
 * @returns {[Droite, LatexParCoordonnees|Vide2d]}
 */
export function droiteAvecNomLatex (d, nom, color = 'black') { // nom est un latexParCoordonnees
  d.color = colorToLatexOrHTML(color ?? 'black')
  let absNom, ordNom
  if (egal(d.b, 0, 0.05)) { // ax+c=0 x=-c/a est l'équation de la droite
    absNom = -d.c / d.a + 0.8 // l'abscisse du label est décalé de 0.8
    ordNom = context.fenetreMathalea2d[1] + 1 // l'ordonnée du label est ymin +1
  } else if (egal(d.a, 0, 0.05)) { // by+c=0 y=-c/b est l'équation de la droite
    absNom = context.fenetreMathalea2d[0] + 0.8 // l'abscisse du label est xmin +1
    ordNom = -d.c / d.b + 0.8 // l'ordonnée du label est décalée de 0.8
  } else { // a et b sont différents de 0 ax+by+c=0 est l'équation
    // y=(-a.x-c)/b est l'aquation cartésienne et x=(-by-c)/a
    const y0 = (-d.a * (context.fenetreMathalea2d[0] + 1) - d.c) / d.b
    const y1 = (-d.a * (context.fenetreMathalea2d[2] - 1) - d.c) / d.b
    const x0 = (-d.b * (context.fenetreMathalea2d[1] + 1) - d.c) / d.a
    const x1 = (-d.b * (context.fenetreMathalea2d[3] - 1) - d.c) / d.a
    if (y0 > context.fenetreMathalea2d[1] && y0 < context.fenetreMathalea2d[3]) {
      absNom = context.fenetreMathalea2d[0] + 1
      ordNom = y0 + d.pente
    } else {
      if (y1 > context.fenetreMathalea2d[1] && y1 < context.fenetreMathalea2d[3]) {
        absNom = context.fenetreMathalea2d[2] - 1
        ordNom = y1 - d.pente
      } else {
        if (x0 > context.fenetreMathalea2d[0] && x0 < context.fenetreMathalea2d[2]) {
          absNom = x0
          ordNom = context.fenetreMathalea2d[1] + Math.abs(d.pente)
        } else {
          if (x1 > context.fenetreMathalea2d[0] && x1 < context.fenetreMathalea2d[2]) {
            absNom = x1
            ordNom = context.fenetreMathalea2d[3] + d.pente
          } else {
            absNom = (context.fenetreMathalea2d[0] + context.fenetreMathalea2d[2]) / 2
            ordNom = pointSurDroite(d, absNom).y
          }
        }
      }
    }
  }
  const leNom = latexParCoordonnees(nom, absNom, ordNom, d.color, 0, 0, '', 8, d.angleAvecHorizontale)
  return [d, leNom]
}

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
 * @property {number} epaisseur
 * @property {number} pointilles
 * @property {number} opacite
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
    this.pointilles = 0
    this.opacite = 1
    this.epaisseur = 1
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
  this.bordures = [Math.min(this.x1, this.x2), Math.min(this.y1, this.y2), Math.max(this.x1, this.x2), Math.max(this.y1, this.y2)]
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
    if (this.nom.includes('$')) {
      leNom = latexParCoordonnees(this.nom, absNom, ordNom, this.color, 0, 0, '', 8)
    } else {
      leNom = texteParPosition(this.nom, absNom, ordNom, 0, this.color, 1, 'milieu', true)
    }
  }

  if (this.nom.includes('$')) { // On a du Latex, donc on ne peut pas utiliser droite() tel quel.
    window.notify('Droite() appelé avec un nom contenant du Latex... utiliser droiteAvecNom() à la place !\nOn va retourner un array contenant la droite et un latexParCoordonnees dans un proche avenir !\nIl faut donc adapter l\'exo qui a provoqué ça.\n Pour l\'instant on retourne une droite sans nom.', { nom: this.nom })
    // On retourne une droite sans nom accompagnée de son nom Latex
    // return droiteAvecNomLAtex(new Droite(point(this.x1, this.y1), point(this.x2, this.y2)), leNom)
    // @fixme la ligne suivante sera à retirer lorsque les exos concernés auront été repérés. Et la précédente à utiliser.
    return new Droite(point(this.x1, this.y1), point(this.x2, this.y2)) // On retourne une droite sans nom en attendant que quelqu'un adapte l'exo et utilise droiteAvecNom() à la place de droite.
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
    return s.svgml(coeff, amp)
  }
  this.tikzml = function (amp) {
    const A = point(this.x1, this.y1)
    const B = point(this.x2, this.y2)
    const A1 = pointSurSegment(A, B, -50)
    const B1 = pointSurSegment(B, A, -50)
    const s = segment(A1, B1, this.color[1])
    s.isVisible = this.isVisible
    return s.tikzml(amp)
  }
}

/**  Trace une droite définie par 2 points OU BIEN par les coefficients de son équation
 * @property {number} epaisseur
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
 * @return {Droite}
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
 * @return {Droite}
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
 * @return {Droite}
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
