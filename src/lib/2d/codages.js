import { isNumber, isNumeric } from 'mathjs'
import { colorToLatexOrHTML, fixeBordures, ObjetMathalea2D } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { arrondi, nombreDeChiffresDe } from '../outils/nombres'
import { stringNombre } from '../outils/texNombre'
import { angleOriente, codageAngle, codageAngleDroit } from './angles.js'
import { arc } from './cercle.js'
import { droite, mediatrice } from './droites.js'
import { milieu, Point, point, pointSurSegment, tracePointSurDroite } from './points.js'
import { longueur, Segment, segment, vecteur } from './segmentsVecteurs.js'
import { latexParCoordonnees, latexParPoint, TexteParPoint, texteParPoint } from './textes.ts'
import { rotation, similitude, translation } from './transformations.js'

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
  // Pour les bordures, on prends celles de [AB], vu qu'on code le milieu de [AB]
  this.bordures = [Math.min(A.bordures[0], B.bordures[0]), Math.min(A.bordures[1], B.bordures[1]), Math.max(A.bordures[2], B.bordures[2]), Math.max(A.bordures[3], B.bordures[3])]
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
 * Code la bissectrice d'un angle
 * @param {Point} A Point sur un côté de l'angle
 * @param {Point} O Sommet de l'angle
 * @param {Point} B Point sur l'autre côté de l'angle
 * @param {string} [color = 'black'] Couleur de la bissectrice : du type 'blue' ou du type '#f15929'
 * @param {string} [mark = 'x'] Symbole posé sur les arcs
 * @property {string} color Couleur de la bissectrice. À associer obligatoirement à colorToLatexOrHTML().
 * @property {string} mark Symbole posé sur les arcs
 * @property {Point} centre Sommet de l'angle
 * @property {Point} depart Point sur un côté de l'angle (équivalent au point A)
 * @author Jean-Claude Lhote
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function CodageBissectrice (A, O, B, color = 'black', mark = 'X') {
  ObjetMathalea2D.call(this, {})
  this.color = color
  this.mark = mark
  this.centre = O
  this.depart = pointSurSegment(O, A, 1.5)
  const demiangle = angleOriente(A, O, B) / 2
  const lieu = rotation(this.depart, O, demiangle)
  const a1 = codageAngle(pointSurSegment(this.centre, this.depart), O, demiangle, 1, this.mark, this.color, 1, 1)
  const a2 = codageAngle(pointSurSegment(this.centre, lieu), O, demiangle, 1, this.mark, this.color, 1, 1)
  return [a1, a2]
  /*
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
  } */
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
export function codageBissectrice (A, O, B, color = 'black', mark = 'X') {
  return new CodageBissectrice(A, O, B, color, mark)
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
 * Affiche la longueur de [AB] au dessus si A est le point le plus à gauche sinon au dessous.
 * @param  {Point} A Première extrémité du segment
 * @param  {Point} B Seconde extrémité du segment
 * @param  {string} [color='black'] Couleur de la longueur affichée : du type 'blue' ou du type '#f15929'.
 * @param  {number} [d=0.5] Distance entre l'affichage de la longueur et le segment.
 * @param  {string} [unite='cm'] Affiche cette unité après la valeur numérique de la longueur.
 * @param  {boolean} [horizontal=false] Si true, alors le texte est horizontal, sinon le texte est parallèle au segment.
 * @param  {boolean} [precision=1]
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
  this.bordures = [O.x - 0.5, O.y - 0.5, O.x + 0.5, O.y + 0.5] // C'est n'importe quoi, mais de toute façon, le segment a ses bordures, lui !
  this.svg = function (coeff) {
    const N = pointSurSegment(O, M, (this.distance * 20) / coeff)
    return texteParPoint(longueurSeg, N, angle, this.color, 1, 'milieu', false).svg(coeff)
  }
  this.tikz = function () {
    const N = pointSurSegment(O, M, this.distance / context.scale)
    return texteParPoint(longueurSeg, N, angle, this.color, 1, 'milieu', false).tikz()
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
 * @param  {boolean} [precision=1]
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
  this.texte = String(texte)
  this.scale = 1
  this.mathOn = true
  this.distance = horizontal ? (d - 0.1 + (isNumeric(this.texte) ? nombreDeChiffresDe(this.texte) : this.texte.length) / 10) : d
  const O = milieu(this.extremite1, this.extremite2)
  const M = rotation(this.extremite1, O, -90)
  const s = segment(this.extremite1, this.extremite2)
  let angle
  const pos = pointSurSegment(O, M, this.distance)
  const space = 0.2 * (this.texte.length ?? 2)
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
    return texteParPoint(this.texte, N, angle, this.color, this.scale, 'milieu', this.mathOn).svg(coeff)
  }
  this.tikz = function () {
    const N = pointSurSegment(O, M, this.distance / context.scale)
    return texteParPoint(this.texte, N, angle, this.color, this.scale, 'milieu', this.mathOn).tikz()
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
export function texteSurSegment (texte = '', A, B, color = 'black', d, horizontal) {
  return new TexteSurSegment(texte, A, B, color, d, horizontal)
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
  this.distance = texte[0] === '$' ? -3 * d : -d
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
    return texteParPoint(this.texte, N, horizontal ? 0 : angle, this.color).svg(coeff)
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
  const M = pointSurSegment(this.sommet, this.depart, this.distance)
  const N = rotation(pointSurSegment(this.sommet, M, this.distance + this.ecart * 20 / context.pixelsParCm), this.sommet, mesureAngle / 2)
  let mesureAngleString
  if (label !== '') {
    mesureAngleString = label
  } else {
    mesureAngleString = Math.round(Math.abs(mesureAngle)).toString() + '^\\circ'
  }
  const mesure = latexParCoordonnees(mesureAngleString, N.x, N.y, color, 0, 0, '', 8)
  const marque = arc(M, B, mesureAngle, rayon, couleurDeRemplissage, colorArc, opaciteDeRemplissage)
  mesure.contour = mesureEnGras
  mesure.couleurDeRemplissage = colorToLatexOrHTML(color)
  marque.epaisseur = this.epaisseur
  this.bordures = [Math.min(N.x, M.x) - 0.5, Math.min(N.y, M.y) - 0.5, Math.max(N.x, M.x) + 0.5, Math.max(N.y, M.y) + 0.5]
  return [mesure, marque]

  /*  this.svg = function (coeff) {
    const M = pointSurSegment(this.sommet, this.depart, this.distance)
    const N = rotation(pointSurSegment(this.sommet, M, this.distance + this.ecart * 20 / coeff), this.sommet, mesureAngle / 2, '', 'center')
    let mesureAngleString
    if (label !== '') {
      mesureAngleString = label
    } else {
      mesureAngleString = Math.round(Math.abs(mesureAngle)).toString() + '°'
    }
    const mesure = latexParPoint(mesureAngleString, N, color, 0, 0, '', 8)
    const marque = arc(M, B, mesureAngle, rayon, couleurDeRemplissage, colorArc, opaciteDeRemplissage)
    mesure.contour = mesureEnGras
    mesure.couleurDeRemplissage = colorToLatexOrHTML(color)
    marque.epaisseur = this.epaisseur
    return [mesure, marque]
  }
  this.tikz = function () {
    const M = pointSurSegment(this.sommet, this.depart, this.distance)
    const N = rotation(pointSurSegment(this.sommet, M, this.distance + this.ecart), this.sommet, mesureAngle / 2, '', 'center')
    let mesureAngleString
    if (label !== '') {
      mesureAngleString = label
    } else {
      mesureAngleString = Math.round(Math.abs(mesureAngle)).toString() + '^\\circ'
    }
    const mesure = latexParPoint(mesureAngleString, N, color, 0, 0, '', 8)
    const marque = arc(M, B, mesureAngle, rayon, couleurDeRemplissage, colorArc, opaciteDeRemplissage)
    mesure.contour = mesureEnGras
    mesure.couleurDeRemplissage = colorToLatexOrHTML(color)
    marque.epaisseur = this.epaisseur
    return '\n' + mesure.tikz() + '\n' + marque.tikz()
  } */
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
  let valeur
  const A = s.extremite1
  const B = s.extremite2
  const v = similitude(vecteur(A, B), A, 90, positionCote / s.longueur)
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
  const { xmin, xmax, ymin, ymax } = fixeBordures([cote, valeur])
  this.bordures = [xmin, ymin, xmax, ymax]
  this.svg = function (coeff) {
    return '\n\t' + cote.svg(coeff) + '\n\t' + valeur.svg(coeff)
  }

  this.tikz = function () {
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
 * @param {number} [echelle=1] Taille relative du symbole
 * @example codageSegment(H,K) // Code le segment [HK] avec la marque noire '||'
 * @example codageAngle(H,K,'x','green') // Code le segment [HK] avec la marque verte 'x'
 * @example codageAngle(H,K,'x','green',{echelle : 3}) // Code le segment [HK] avec la marque verte 'x' et de taille 3.
 * @author Rémi Angot
 * @return {TexteParPoint}
 */
// JSDOC Validee par EE Juin 2022
export function codageSegment (A, B, mark = '||', color = 'black', echelle = 1) {
  const O = milieu(A, B)
  const s = segment(A, B)
  s.isVisible = false
  let angle
  if (B.x > A.x) {
    angle = -parseInt(s.angleAvecHorizontale)
  } else {
    angle = -parseInt(s.angleAvecHorizontale) + 180
  }
  return new TexteParPoint(mark, O, angle, color, echelle)
}

/**
 * Code plusieurs segments de la même façon
 * @param {string} [mark = '||'] Symbole posé sur le segment
 * @param {string} [color = 'black'] Couleur du symbole : : du type 'blue' ou du type '#f15929'
 * @param  {Point|Point[]|Segment|number} args Les segments différement codés + Taille relative du codage
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @author Rémi Angot
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function CodageSegments (mark = '||', color = 'black', ...args) {
  ObjetMathalea2D.call(this, {})
  const isEchelle = isNumber(args[args.length - 1])
  const echelle = isEchelle ? args[args.length - 1] : 1
  const trouveExtrem = function (xmin, ymin, xmax, ymax, ...pointsOuSegment) {
    if (pointsOuSegment.length === 0) return [xmin, ymin, xmax, ymax]
    else {
      const premierElement = pointsOuSegment.shift()
      if (premierElement.constructor === Segment) {
        xmin = Math.min(xmin, premierElement.x1, premierElement.x2)
        xmax = Math.max(xmax, premierElement.x1, premierElement.x2)
        ymin = Math.min(ymin, premierElement.y1, premierElement.y2)
        ymax = Math.max(ymax, premierElement.y1, premierElement.y2)
        return trouveExtrem(xmin, ymin, xmax, ymax, ...pointsOuSegment)
      } else if (premierElement.constructor === Point) {
        xmin = Math.min(xmin, premierElement.x)
        xmax = Math.max(xmax, premierElement.x)
        ymin = Math.min(ymin, premierElement.y)
        ymax = Math.max(ymax, premierElement.y)
        return trouveExtrem(xmin, ymin, xmax, ymax, ...pointsOuSegment)
      } else {
        return trouveExtrem(xmin, ymin, xmax, ymax, ...pointsOuSegment)
      }
    }
  }
  this.bordures = trouveExtrem(1000, 1000, -1000, -1000, ...args)
  this.svg = function (coeff) {
    let code = ''
    if (Array.isArray(args[0])) {
      // Si on donne un tableau de points
      for (let i = 0; i < args[0].length - 1; i++) {
        const codage = codageSegment(args[0][i], args[0][i + 1], mark, color, echelle)
        codage.isVisible = false
        code += codage.svg(coeff)
        code += '\n'
      }
      const codage = codageSegment(args[0][args[0].length - 1], args[0][0], mark, color, echelle)
      codage.isVisible = false
      code += codage.svg(coeff)
      code += '\n'
    } else if (args[0].constructor === Segment) {
      for (let i = 0; i < (isEchelle ? args.length - 1 : args.length); i++) {
        const codage = codageSegment(args[i].extremite1, args[i].extremite2, mark, color, echelle)
        codage.isVisible = false
        code += codage.svg(coeff)
        code += '\n'
      }
    } else {
      for (let i = 0; i < (isEchelle ? args.length - 1 : args.length); i += 2) {
        const codage = codageSegment(args[i], args[i + 1], mark, color, echelle)
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
        code += codageSegment(args[0][i], args[0][i + 1], mark, color, echelle).tikz()
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
      const condition = isEchelle ? args.length - 1 : args.length
      for (let i = 0; i < condition; i++) {
        code += codageSegment(
          args[i].extremite1,
          args[i].extremite2,
          mark,
          color
        ).tikz()
        code += '\n'
      }
    } else {
      const condition = isEchelle ? args.length - 1 : args.length
      for (let i = 0; i < condition; i += 2) {
        code += codageSegment(args[i], args[i + 1], mark, color, echelle).tikz()
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
 * @param {Points|Point[]|Segments|number} args Les segments différement codés + Taille relative du codage. Voir exemples.
 * @example codageSegments('×','blue',A,B, B,C, C,D) // Code les segments [AB], [BC] et [CD] avec une croix bleue
 * @example codageSegments('×','blue',A,B, B,C, C,D, 1.2) // Code les segments [AB], [BC] et [CD] avec une croix bleue et une taille de 1.2
 * @example codageSegments('×','blue',[A,B,C,D]) // Code les segments [AB], [BC], [CD] et [DA] (attention, chemin fermé, pratique pour des polygones pas pour des lignes brisées)
 * @example codageSegments('×','blue',[A,B,C,D],1.5) // Code les segments [AB], [BC], [CD] et [DA] (attention, chemin fermé, pratique pour des polygones pas pour des lignes brisées) et une taille de la marque de 1.5
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
 * @param {Point} debut Point sur un côté de l'angle
 * @param {Point} centre Sommet de l'angle
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
 * @param {number} [echelleMark=1] Pour choisir la taille relative de la marque
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
 * @property {number} tailleTexte Pour choisir la taille du texte à côté de l'angle
 * @property {number} echelleMark Pour choisir la taille relative de la marque
 * @author Jean-Claude Lhote
 * @return {array} Liste d'objets MathAlea2D
 */
// JSDOC Validee par EE Juin 2022
export function CodageAngle (debut, centre, angle, taille = 0.8, mark = '', color = 'black', epaisseur = 1, opacite = 1, couleurDeRemplissage = 'none', opaciteDeRemplissage = 0.2, mesureOn = false, texteACote = '', tailleTexte = 1, { echelleMark = 1, angleArrondi = 0 } = {}) {
  this.color = color
  this.debut = debut
  this.centre = centre
  this.taille = taille
  this.mark = mark
  this.echelleMark = echelleMark
  this.epaisseur = epaisseur
  this.opacite = opacite
  this.couleurDeRemplissage = couleurDeRemplissage
  this.opaciteDeRemplissage = opaciteDeRemplissage
  this.angle = angle
  this.tailleTexte = tailleTexte
  this.angleArrondi = angleArrondi
  const objets = []

  const depart = pointSurSegment(this.centre, this.debut, this.taille * 20 / context.pixelsParCm)
  const P = rotation(depart, this.centre, this.angle / 2)
  const M = pointSurSegment(this.centre, P, this.taille + 0.6 * 20 / context.pixelsParCm)
  const d = droite(this.centre, P)
  d.isVisible = false
  const mesure = arrondi(Math.abs(angle), this.angleArrondi) + '°'
  const arcangle = arc(depart, this.centre, this.angle, this.couleurDeRemplissage !== 'none', this.couleurDeRemplissage, this.color)
  arcangle.isVisible = true
  arcangle.opacite = this.opacite
  arcangle.epaisseur = this.epaisseur
  arcangle.opaciteDeRemplissage = this.opaciteDeRemplissage
  objets.push(arcangle)
  if (this.mark !== '') {
    const t = texteParPoint(mark, P, 90 - d.angleAvecHorizontale, this.color, this.echelleMark)
    objets.push(t)
  }
  if (mesureOn && texteACote === '') {
    const t = texteParPoint(mesure, M, 0, this.color, this.tailleTexte)
    objets.push(t)
  } else if (texteACote !== '') {
    if (texteACote.includes('$')) {
      M.positionLabel = 'center'
      const label = latexParPoint(texteACote.substring(1, texteACote.length - 1), M, this.color)
      label.colorBackground = colorToLatexOrHTML('transparent') // transparent
      objets.push(label)
    } else objets.push(texteParPoint(texteACote, M, 0, this.color, this.tailleTexte))
  }
  return objets
}
