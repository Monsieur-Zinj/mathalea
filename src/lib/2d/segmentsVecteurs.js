import { colorToLatexOrHTML, fixeBordures, ObjetMathalea2D } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { arrondi } from '../outils/nombres'
import { angleOriente } from './angles.js'
import { Cercle } from './cercle.js'
import { Droite, droite } from './droites.js'
import { milieu, Point, point, pointIntersectionDD, pointIntersectionLC, pointSurSegment } from './points.js'
import { latex2d, texteParPosition } from './textes.ts'
import { rotation, similitude, translation } from './transformations.js'
import MainLevee from './MainLevee'

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
    if (typeof arg1 === 'number' || arg1 instanceof FractionEtendue) {
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
    const s = segment(A, B, color, '->')
    s.tailleExtremites = 5
    return s
  }
  this.representantNomme = function (A, nom, taille = 1, color = 'black') {
    let s
    let v
    const B = point(A.x + this.x, A.y + this.y)
    const M = milieu(A, B)
    s = segment(A, B, color)
    const angle = s.angleAvecHorizontale
    v = similitude(this, A, 90, 0.5 / this.norme())
    if (Math.abs(angle) > 90) {
      s = segment(B, A, color)
      // angle = s.angleAvecHorizontale
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
  if (this.nom === 'i') return latex2d('\\vec \\imath', this.x, this.y, { color: this.color })
  if (this.nom === 'j') return latex2d('\\vec \\jmath', this.x, this.y, { color: this.color })
  const objets = []
  const t = texteParPosition(this.nom, this.x, this.y, -this.angle, this.color, this.taille, 'milieu', true)
  const M = point(this.x, this.y)
  const P = point(M.x + 0.25 * this.nom.length, M.y)
  const M0 = similitude(P, M, 90 + this.angle, 1.5)
  const M1 = rotation(translation(M0, vecteur(P, M)), M0, this.angle)
  const M2 = similitude(M1, M0, 180, 1.5)
  const s = segment(M1, M2, this.color)
  s.styleExtremites = '->'
  s.tailleExtremites = 3
  objets.push(t, s)
  const bordures = fixeBordures(objets)
  this.bordures = [bordures.xmin, bordures.ymin, bordures.xmax, bordures.ymax]
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
      if (typeof I === 'boolean') {
        I = objet.extremite1.estSur(this) || objet.extremite2.estSur(this) ||
        this.extremite1.estSur(segment(objet.extremite1, objet.extremite2)) ||
        this.extremite2.estSur(segment(objet.extremite1, objet.extremite2))
      }
    }
    if (typeof I === 'boolean') return (I)
    return I.estSur(objet) && I.estSur(this)
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
  this.epaisseur = 1
  this.opacite = 1
  this.pointilles = ''

  this.bordures = [Math.min(this.x1, this.x2), Math.min(this.y1, this.y2), Math.max(this.x1, this.x2), Math.max(this.y1, this.y2)]
  this.extremite1 = point(this.x1, this.y1)
  this.extremite2 = point(this.x2, this.y2)
  this.longueur = Math.sqrt((this.x2 - this.x1) ** 2 + (this.y2 - this.y1) ** 2)
  // utiliser les fonctions de calcul d'angle avec un segment de longueur nulle est une erreur ! Je blinde en retournant un angle nul
  this.angleAvecHorizontale = this.longueur < 1e-8
    ? 0
    : angleOriente(
      point(this.x1 + 1, this.y1),
      this.extremite1,
      this.extremite2,
      5
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
        const B1 = rotation(M, B, 90)
        const B2 = rotation(M, B, -90)
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
      if (fin === '[') {
        // si ça termine par | on le rajoute en B
        const M = pointSurSegment(B, A, h / context.pixelsParCm)
        const B1 = similitude(M, B, 90, 1)
        const B2 = similitude(M, B, -90, 1)
        const C1 = similitude(B, B1, -90, 0.3)
        const C2 = similitude(B, B2, 90, 0.3)
        code += `<polyline points="${C2.xSVG(coeff)},${C2.ySVG(coeff)} ${B2.xSVG(coeff)},${B2.ySVG(coeff)} ${B1.xSVG(coeff)},${B1.ySVG(coeff)} ${C1.xSVG(coeff)},${C1.ySVG(coeff)}" fill="none" stroke="${this.color[0]}" ${this.style} id="${this.id}" stroke-width="${this.epaisseur}" />`
      }
      if (fin === ']') {
        // si ça termine par | on le rajoute en B
        const M = pointSurSegment(B, A, h / context.pixelsParCm)
        const B1 = similitude(M, B, 90, 1)
        const B2 = similitude(M, B, -90, 1)
        const C1 = similitude(B, B1, 90, 0.3)
        const C2 = similitude(B, B2, -90, 0.3)
        code += `<polyline points="${C2.xSVG(coeff)},${C2.ySVG(coeff)} ${B2.xSVG(coeff)},${B2.ySVG(coeff)} ${B1.xSVG(coeff)},${B1.ySVG(coeff)} ${C1.xSVG(coeff)},${C1.ySVG(coeff)}" fill="none" stroke="${this.color[0]}" ${this.style} id="${this.id}" stroke-width="${this.epaisseur}" />`
      }
      const debut = this.styleExtremites[0]
      if (debut === '[') {
        // si ça termine par | on le rajoute en B
        const M = pointSurSegment(A, B, h / context.pixelsParCm)
        const B1 = similitude(M, A, 90, 1)
        const B2 = similitude(M, A, -90, 1)
        const C1 = similitude(A, B1, 90, 0.3)
        const C2 = similitude(A, B2, -90, 0.3)
        code += `<polyline points="${C2.xSVG(coeff)},${C2.ySVG(coeff)} ${B2.xSVG(coeff)},${B2.ySVG(coeff)} ${B1.xSVG(coeff)},${B1.ySVG(coeff)} ${C1.xSVG(coeff)},${C1.ySVG(coeff)}" fill="none" stroke="${this.color[0]}" ${this.style} id="${this.id}" stroke-width="${this.epaisseur}" />`
      }
      if (debut === ']') {
        // si ça termine par | on le rajoute en B
        const M = pointSurSegment(A, B, h / context.pixelsParCm)
        const B1 = similitude(M, A, 90, 1)
        const B2 = similitude(M, A, -90, 1)
        const C1 = similitude(A, B1, -90, 0.3)
        const C2 = similitude(A, B2, 90, 0.3)
        code += `<polyline points="${C2.xSVG(coeff)},${C2.ySVG(coeff)} ${B2.xSVG(coeff)},${B2.ySVG(coeff)} ${B1.xSVG(coeff)},${B1.ySVG(coeff)} ${C1.xSVG(coeff)},${C1.ySVG(coeff)}" fill="none" stroke="${this.color[0]}" ${this.style} id="${this.id}" stroke-width="${this.epaisseur}" />`
      }
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
      if (this.styleExtremites === '->') {
        tableauOptions.push('>=latex,->')
      } else {
        if (this.styleExtremites.includes('[') || this.styleExtremites.includes(']')) {
          tableauOptions.push('{' + this.styleExtremites + '}')
        } else {
          tableauOptions.push(this.styleExtremites)
        }
      }
    }
    if (tableauOptions.length > 0) {
      optionsDraw = '[' + tableauOptions.join(',') + ']'
    }
    return `\\draw${optionsDraw} (${this.x1},${this.y1})--(${this.x2},${this.y2});`
  }
  this.svgml = function (coeff) {
    const mainLevee = MainLevee.create() // mainLevee permet d'accéder aux méthodes pour créer les objets roughjs
    const A = point(this.x1, this.y1)
    const B = point(this.x2, this.y2)
    let code = this.codeExtremitesSVG(coeff)
    code += mainLevee.line(A.xSVG(coeff), A.ySVG(coeff), B.xSVG(coeff), B.ySVG(coeff), { color: this.color[0], epaisseur: this.epaisseur, opacite: this.opacite })
    if (this.styleExtremites.length > 0) {
      code = `<g id="${this.id}">${code}</g>`
    } else {
      code = code.replace('/>', `id="${this.id}" />`)
    }
    mainLevee.destroy() // ne pas oublier de faire ça, sinon, il va trainer un svg qui ne sert à rien dans le DOM
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
      if (this.styleExtremites.includes('[') || this.styleExtremites.includes(']')) {
        tableauOptions.push('{' + this.styleExtremites + '}')
      } else {
        tableauOptions.push(this.styleExtremites)
      }
    }
    tableauOptions.push(`decorate,decoration={random steps , amplitude = ${amp}pt}`)
    optionsDraw = '[' + tableauOptions.join(',') + ']'

    const code = `\\draw${optionsDraw} (${A.x},${A.y})--(${B.x},${B.y});`
    return code
  }
}

/**
 * @param {...any} args Points ou coordonnées + couleur facultative en dernier
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

/**
 * Renvoie la distance de A à B
 * @param {Point} A
 * @param {Point} B
 * @param {integer} [precision] Nombre de chiffres après la virgule.
 * (ne sert à rien car si le number correspondant à l'arrondi ne tombe pas sur un flottant convertible en bianire sans erreur, il y aura 18 chiffres significatifs dans le number retourné
 * C'est à la fonction d'affichage de limiter le nombre de chiffres
 * @author Rémi Angot
 */
export function longueur (A, B, precision) {
  return arrondi(Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2), precision ?? 6)
  // j chiffres après la virgule pour l'arrondi sachant que c'est à la fonction d'affichage de limiter le nombre de chiffres.
}

/**
 * norme(V) renvoie la norme du vecteur
 *
 * @author Rémi Angot
 */
export function norme (v) {
  return Math.sqrt(v.x ** 2 + v.y ** 2)
}
