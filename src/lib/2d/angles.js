import { colorToLatexOrHTML, fixeBordures, mathalea2d, ObjetMathalea2D, vide2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { egal } from '../../modules/outils.js'
import { arrondi, unSiPositifMoinsUnSinon } from '../outils/nombres'
import { arc, cercle, cercleCentrePoint } from './cercle.js'
import { CodageAngle } from './codages.js'
import { point, pointSurCercle, pointSurSegment } from './points.js'
import { polygone, polyline } from './polygones.js'
import { longueur, segment, vecteur } from './segmentsVecteurs.js'
import { latexParPoint, texteParPoint, texteParPosition } from './textes.ts'
import { homothetie, rotation } from './transformations.js'

export function Rapporteur ({
  x = 0,
  y = 0,
  taille = 7,
  depart = 0,
  semi = false,
  avecNombre = 'deuxSens',
  precisionAuDegre = 1,
  stepGraduation = 10,
  rayonsVisibles = true,
  color = 'gray'
}) {
  ObjetMathalea2D.call(this, {})
  this.x = x
  this.y = y
  this.taille = taille
  this.opacite = 0.7
  this.color = color
  const objets = []
  let numero
  let azimut
  let rayon
  let nbDivisions
  let arcPlein
  if (semi) {
    arcPlein = 180
    nbDivisions = 18
  } else {
    arcPlein = 360
    nbDivisions = 36
  }

  const centre = point(this.x, this.y)
  azimut = rotation(point(this.x + 1, this.y), centre, depart)
  let azimut2 = pointSurSegment(centre, azimut, this.taille)
  const arc1 = arc(azimut, centre, arcPlein - 0.1, false, 'none', this.color)
  const arc2 = arc(azimut2, centre, arcPlein - 0.1, false, 'none', this.color)
  // objets.push(segment(centre, azimut2, this.color))
  objets.push(segment(azimut2, rotation(azimut2, centre, 180), this.color))
  rayon = segment(azimut, azimut2, this.color)
  if (rayonsVisibles) objets.push(arc1)
  // objets.push(arc2, rayon)
  objets.push(arc2)
  for (let i = 0; i < nbDivisions; i++) {
    if (avecNombre !== '') {
      if (avecNombre === 'deuxSens') {
        if (i === 0) {
          numero = texteParPoint(arcPlein, rotation(homothetie(azimut2, centre, 0.8), centre, 2), -depart, this.color)
          numero.contour = true
          objets.push(numero)
        }
        if (i === nbDivisions - 1) {
          numero = texteParPoint(arcPlein - (1 + i) * 10, rotation(homothetie(azimut2, centre, 0.8), centre, arcPlein / nbDivisions - 2), -depart, this.color)
          numero.contour = true
          objets.push(numero)
        } else if ((arcPlein - (1 + i) * 10) % stepGraduation === 0) {
          numero = texteParPoint(arcPlein - (1 + i) * 10, rotation(homothetie(azimut2, centre, 0.8), centre, arcPlein / nbDivisions), 90 - (1 + i) * 10 - depart, this.color)
          numero.contour = true
          objets.push(numero)
        }
      }
      if (i === 0) {
        numero = texteParPoint('0', rotation(homothetie(azimut2, centre, 0.9), centre, 2), -depart, this.color)
        numero.contour = true
        objets.push(numero)
      }
      if (i === nbDivisions - 1) {
        numero = texteParPoint((1 + i) * 10, rotation(homothetie(azimut2, centre, 0.9), centre, arcPlein / nbDivisions - 2), -depart, this.color)
        numero.contour = true
        objets.push(numero)
      } else if ((i + 1) * 10 % stepGraduation === 0) {
        numero = texteParPoint((1 + i) * 10, rotation(homothetie(azimut2, centre, 0.9), centre, arcPlein / nbDivisions), 90 - (1 + i) * 10 - depart, this.color)
        numero.contour = true
        objets.push(numero)
      }
    }
    for (let s = 1, r; s < 10; s++) {
      if (s === 5 && precisionAuDegre < 10) {
        r = segment(homothetie(rotation(azimut2, centre, s), centre, 0.92), homothetie(rotation(azimut2, centre, s), centre, 0.99), this.color)
        r.opacite = 0.6
        objets.push(r)
      } else if (precisionAuDegre === 1) {
        r = segment(homothetie(rotation(azimut2, centre, s), centre, 0.96), homothetie(rotation(azimut2, centre, s), centre, 0.99), this.color)
        r.opacite = 0.6
        objets.push(r)
      }
    }
    if ((i !== 0) && (i !== 36) && (i !== 18)) objets.push(rayon)
    azimut = rotation(azimut, centre, arcPlein / nbDivisions)
    azimut2 = rotation(azimut2, centre, arcPlein / nbDivisions)
    if (rayonsVisibles) rayon = segment(azimut, azimut2, this.color)
    else rayon = segment(homothetie(azimut2, centre, 0.9), azimut2, this.color)
    rayon.opacite = this.opacite
  }
  if (!semi) {
    rayon = segment(homothetie(rotation(azimut, centre, -90), centre, -0.2), homothetie(rotation(azimut, centre, -90), centre, 0.2), this.color)
    objets.push(rayon)
    rayon = segment(homothetie(azimut, centre, -0.2), homothetie(azimut, centre, 0.2), this.color)
  } else {
    rayon = segment(centre, homothetie(rotation(azimut, centre, -90), centre, 0.2), this.color)
  }
  objets.push(rayon)
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

/**
 * place un rapporteur centré en (x,y) avec le zéro orienté à depart degrés.
 * @param {boolean} semi si semi === false alors les graduations vont de 0 à 180° sinon de 0 à 360°
 * @param {string} avecNombre === "", il n'y a pas de graduations, si avecNombre === "deuxSens" il est gradué dans les deux directions
 * si avecNombre === "unSens" il est gradué dans le sens trigo.
 * @param {number} precisionAuDegre === 10 alors il n'y aura pas de graduations entre les multiples de 10°, les autres valeurs sont 5 et 1.
 * @param {number} stepGraduation est un multiple de 10 qui divise 180 (c'est mieux) donc 10 (par défaut), ou 20, ou 30, ou 60 ou 90.
 * @param {boolean} rayonsVisibles = false permet de supprimer les rayons et le cercle central
 * @param {object} param0 = {x: 'number', y: 'number', taille: 'number', semi: boolean, avecNombre: string}
 * @return {Rapporteur} // crée un instance de l'objet 2d Rapporteur
 */
export function rapporteur ({
  x = 0,
  y = 0,
  taille = 7,
  depart = 0,
  semi = false,
  avecNombre = 'deuxSens',
  precisionAuDegre = 1,
  stepGraduation = 10,
  rayonsVisibles = true,
  color = 'gray'
}) {
  return new Rapporteur({
    x,
    y,
    taille,
    depart,
    semi,
    avecNombre,
    precisionAuDegre,
    stepGraduation,
    rayonsVisibles,
    color
  })
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
  const OA = longueur(O, A, precision)
  const OB = longueur(O, B, precision)
  const AB = longueur(A, B, precision)
  if (OA > 0 && OB > 0) {
    const v = vecteur(O, A)
    const w = vecteur(O, B)
    if (egal(v.x * w.y - v.y * w.x, 0)) { // vecteurs colinéaires à epsilon près pour éviter les effets de bords dus aux flottants.
      if (v.x * w.x > 0) return 0
      else if (v.x * w.x < 0) return 180
      else if (v.y * w.y > 0) return 0
      else return 180
    } else {
      let cos = (AB ** 2 - OA ** 2 - OB ** 2) / (-2 * OA * OB)
      if (cos < -1) cos = -1
      if (cos > 1) cos = 1
      const alpha = Math.acos(cos)
      return arrondi(alpha * 180 / Math.PI, precision)
    }
  } else {
    // Ce n'est pas normal de demander la mesure d'un angle dont un côté a une longueur nulle.
    return 0
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
  const OA = longueur(O, A)
  const OB = longueur(O, B)
  if (OA < 1e-12 || OB < 1e-12) { // On considère qu'un côté de l'angle a une longueur nulle, et ce n'est pas normal !
    // window.notify('angleOriente() a reçu des points confondus pour déterminer l\'angle !', { OA, OB })
    return 0
  }
  const A2 = rotation(A, O, 90)
  const v = vecteur(O, B)
  const u = vecteur(O, A2)

  return arrondi(unSiPositifMoinsUnSinon(arrondi(v.x * u.x + v.y * u.y, 10)) * angle(A, O, B, precision), precision)
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
  return arrondi(Math.acos((AB ** 2 - OA ** 2 - OB ** 2) / (-2 * OA * OB)), precision)
}

/**
 * Code un angle droit
 * @param {Point} A Point sur un côté de l'angle droit
 * @param {Point} O Sommet de l'angle droit
 * @param {Point} B Point sur l'autre côté de l'angle droit
 * @param {string} [color='black'] Couleur du codage : du type 'blue' ou du type '#f15929'
 * @param {number} [d=0.4] Taille du codage de l'angle droit
 * @param {number} [epaisseur=0.5] Epaisseur du trait
 * @param {number} [opacite=1] Opacité du trait
 * @param {string} [couleurDeRemplissage='none'] 'none' si on ne veut pas de remplissage, sinon une couleur du type 'blue' ou du type '#f15929'
 * @param {number} [opaciteDeRemplissage=1] Taux d'opacité du remplissage entre 0 et 1
 * @property {string} svg Sortie au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} svgml Sortie, à main levée, au format vectoriel (SVG) que l’on peut afficher dans un navigateur
 * @property {string} tikz Sortie au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {string} tikzml Sortie, à main levée, au format TikZ que l’on peut utiliser dans un fichier LaTeX
 * @property {Point} depart Point sur un côté de l'angle droit
 * @property {Point} sommet Sommet de l'angle droit
 * @property {Point} arrivee Point sur l'autre côté de l'angle droit
 * @property {string} color Couleur du codage. À associer obligatoirement à colorToLatexOrHTML().
 * @property {number} taille Taille du codage de l'angle droit
 * @property {string} couleurDeRemplissage 'none' si on ne veut pas de remplissage. À associer obligatoirement à colorToLatexOrHTML().
 * @property {number} opaciteDeRemplissage Taux d'opacité du remplissage entre 0 et 1
 * @class
 */
// JSDOC Validee par EE Juin 2022
export function CodageAngleDroit (A, O, B, color = 'black', d = 0.4, epaisseur = 0.5, opacite = 1, couleurDeRemplissage = 'none', opaciteDeRemplissage = 1) {
  ObjetMathalea2D.call(this, {})
  this.sommet = O
  this.depart = A
  this.arrivee = B
  this.taille = d
  this.color = color
  this.couleurDeRemplissage = colorToLatexOrHTML(couleurDeRemplissage)
  this.opaciteDeRemplissage = opaciteDeRemplissage
  const a = pointSurSegment(this.sommet, this.depart, this.taille * 20 / context.pixelsParCm)
  const b = pointSurSegment(this.sommet, this.arrivee, this.taille * 20 / context.pixelsParCm)
  let o
  if (angleOriente(this.depart, this.sommet, this.arrivee) > 0) {
    o = rotation(this.sommet, a, -90)
  } else {
    o = rotation(this.sommet, a, 90)
  }
  const bordures = fixeBordures(a, b, o)
  this.bordures = [bordures.xmin, bordures.ymin, bordures.xmax, bordures.ymax]

  this.svg = function (coeff) {
    const a = pointSurSegment(this.sommet, this.depart, this.taille * 20 / coeff)
    const b = pointSurSegment(this.sommet, this.arrivee, this.taille * 20 / coeff)
    let o = {}
    let result = {}
    if (angleOriente(this.depart, this.sommet, this.arrivee) > 0) {
      o = rotation(this.sommet, a, -90)
    } else {
      o = rotation(this.sommet, a, 90)
    }
    if (this.couleurDeRemplissage[0] === 'none') result = polyline([a, o, b], this.color)
    else {
      result = polygone([this.sommet, a, o, b], this.color)
      result.couleurDeRemplissage = [this.couleurDeRemplissage[0], this.couleurDeRemplissage[1]]
      result.opaciteDeRemplissage = this.opaciteDeRemplissage
    }
    result.isVisible = false
    result.epaisseur = epaisseur
    result.opacite = opacite
    this.id = result.id
    return result.svg(coeff)
  }
  this.tikz = function () {
    const a = pointSurSegment(this.sommet, this.depart, this.taille / context.scale)
    const b = pointSurSegment(this.sommet, this.arrivee, this.taille / context.scale)
    let o = {}
    let result = {}
    if (angleOriente(this.depart, this.sommet, this.arrivee) > 0) {
      o = rotation(this.sommet, a, -90)
    } else {
      o = rotation(this.sommet, a, 90)
    }
    if (this.couleurDeRemplissage[1] === '') return polyline([a, o, b], this.color).tikz()
    else {
      result = polygone([this.sommet, a, o, b], this.color)
      result.couleurDeRemplissage = [this.couleurDeRemplissage[0], this.couleurDeRemplissage[1]]
      result.opaciteDeRemplissage = this.opaciteDeRemplissage
      result.isVisible = false
      result.epaisseur = epaisseur
      result.opacite = opacite
      return result.tikz()
    }
  }
  this.svgml = function (coeff, amp) {
    const a = pointSurSegment(this.sommet, this.depart, this.taille * 20 / coeff)
    const b = pointSurSegment(this.sommet, this.arrivee, this.taille * 20 / coeff)
    let o = {}
    if (angleOriente(A, this.sommet, B) > 0) {
      o = rotation(this.sommet, a, -90)
    } else {
      o = rotation(this.sommet, a, 90)
    }
    return polyline([a, o, b], this.color).svgml(coeff, amp)
  }
  this.tikzml = function (amp) {
    const a = pointSurSegment(this.sommet, this.depart, this.taille / context.scale)
    const b = pointSurSegment(this.sommet, this.arrivee, this.taille / context.scale)
    let o = {}
    if (angleOriente(A, this.sommet, B) > 0) {
      o = rotation(this.sommet, a, -90)
    } else {
      o = rotation(this.sommet, a, 90)
    }
    return polyline([a, o, b], this.color).tikzml(amp)
  }
}

/**
 * Code un angle droit
 * @param {Point} A Point sur un côté de l'angle droit
 * @param {Point} O Sommet de l'angle droit
 * @param {Point} B Point sur l'autre côté de l'angle droit
 * @param {string} [color='black'] Couleur du codage : du type 'blue' ou du type '#f15929'
 * @param {number} [d=0.4] Taille du codage de l'angle droit
 * @param {number} [epaisseur=0.5] Epaisseur du trait
 * @param {number} [opacite=1] Opacité du trait
 * @param {string} [couleurDeRemplissage='none'] 'none' si on ne veut pas de remplissage, sinon une couleur du type 'blue' ou du type '#f15929'
 * @param {number} [opaciteDeRemplissage=1] Taux d'opacité du remplissage
 * @example codageAngleDroit(A,J,T)
 * // Trace un codage d'angle droit pour l'angle direct AJT, de couleur noire, de taille 0,4, d'épaisseur 0,5 avec une opacité de 100 %, sans remplissage
 * @example codageAngleDroit(A,J,T,'pink',1,0.2,0.6,'blue',0.2)
 * // Trace un codage d'angle droit pour l'angle direct AJT, de couleur rose, de taille 1, d'épaisseur 0,2 avec une opacité de 60 %, rempli en bleu avec une opacité de 20%.
 * @return {CodageAngleDroit}
 * @author Rémi Angot
 */
// JSDOC Validee par EE Juin 2022
export function codageAngleDroit (A, O, B, color = 'black', d = 0.4, epaisseur = 0.5, opacite = 1, couleurDeRemplissage = 'none', opaciteDeRemplissage = 1) {
  return new CodageAngleDroit(A, O, B, color, d, epaisseur, opacite, couleurDeRemplissage, opaciteDeRemplissage)
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
 * @param {number} [echelleMark=1] Taille relative de la marque de l'angle
 * @example codageAngle(H,K,30)
 * // Code l'angle de centre K, avec H sur un côté de l'angle et avec 30° comme mesure d'angle orienté,
 * // en noir, avec une épaisseur de 1, une opacité de 100 %, un rayon d'arc de 0,8, sans autre option.
 * @example codageAngle(H,K,G)
 * // Code l'angle HKG, en noir, avec une épaisseur de 1, une opacité de 100 %, un rayon d'arc de 0,8, sans autre option.
 * @example codageAngle(H,K,G,2,'x','red',0.5,0.2,'blue',0.8,true,true)
 * // Code l'angle HKG, en rouge, avec une épaisseur de 0.5 et une opacité de 20 %, rempli en bleu avec une opacité de 80 %
 * // avec un arc de cercle de rayon 2, avec une marque 'x' sur l'angle, en affichant la mesure de l'angle et sans faire apparaître d'angle droit le cas échéant.
 * @example codageAngle(H,K,G,2,'x','red',0.5,0.2,'blue',0.8,true,true,'?',2)
 * // Code l'angle HKG, en rouge, avec une épaisseur de 0.5 et une opacité de 20 %, rempli en bleu avec une opacité de 80 %
 * // avec un arc de cercle de rayon 2, avec une marque 'x' sur l'angle, en affichant le texte '?' d'une taille de 2 et sans faire apparaître d'angle droit le cas échéant.
 * @author Jean-Claude Lhote
 * @return {CodageAngle|CodageAngleDroit}
 */
// JSDOC Validee par EE Juin 2022
export function codageAngle (A, O, angle, taille = 0.8, mark = '', color = 'black', epaisseur = 1, opacite = 1, couleurDeRemplissage = 'none', opaciteDeRemplissage = 0.2, mesureOn = false, noAngleDroit = false, texteACote = '', tailleTexte = 1, { echelleMark = 1, angleArrondi = 0 } = {}) {
  if (typeof (angle) !== 'number') {
    angle = angleOriente(A, O, angle)
  }
  if ((angle === 90 || angle === -90) && !noAngleDroit) {
    return new CodageAngleDroit(A, O, rotation(A, O, angle), color, taille, epaisseur, opacite, couleurDeRemplissage, opaciteDeRemplissage)
  } else return new CodageAngle(A, O, angle, taille, mark, color, epaisseur, opacite, couleurDeRemplissage, opaciteDeRemplissage, mesureOn, texteACote, tailleTexte, { echelleMark, angleArrondi })
}

export function NomAngleParPosition (nom, x, y, color, s) {
  ObjetMathalea2D.call(this, {})
  const objets = []
  objets.push(texteParPosition(nom, x, y, 0, color, 1, 'milieu', true))
  const s1 = segment(x - 0.6, y + 0.4 - s / 10, x + 0.1, y + 0.4 + s / 10, color)
  const s2 = segment(x + 0.1, y + 0.4 + s / 10, x + 0.8, y + 0.4 - s / 10, color)
  objets.push(s1, s2)
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

export function nomAngleSaillantParPosition (nom, x, y, color) {
  return new NomAngleParPosition(nom, x, y, color, 1)
}

export function nomAngleRentrantParPosition (nom, x, y, color) {
  return new NomAngleParPosition(nom, x, y, color, -1)
}

/**
 *
 * @param {Angle} angle
 * @param {string} cosOrSin
 * @returns string
 */
export function cercleTrigo (angle, cosOrSin = 'cos') {
  const monAngle = parseInt(angle.degres)
  const r = 5
  const tAngle = angle.radians
  const tCos = (Array.isArray(angle.cos)) ? angle.cos[0] : angle.cos
  const tSin = (Array.isArray(angle.sin)) ? angle.sin[0] : angle.sin
  const O = point(0, 0)
  const I = point(r, 0)
  const J = point(0, r)
  const I2 = point(-r, 0)
  const J2 = point(0, -r)
  const s1 = segment(I, I2)
  const s2 = segment(J, J2)
  const c = cercleCentrePoint(O, I)
  const c2 = cercle(O, 5.7)
  c2.isVisible = false
  const M = pointSurCercle(c, monAngle)
  const M2 = pointSurCercle(c2, monAngle)
  const sOM = segment(O, M, 'blue')
  const sOI = segment(O, I, 'blue')
  sOM.epaisseur = 3
  sOI.epaisseur = 3
  const x = point(M.x, 0)
  const y = point(0, M.y)
  const sMx = !egal(M.y, 0) ? segment(M, x) : vide2d()
  sMx.pointilles = 5
  const sMy = !egal(M.x, 0) ? segment(M, y) : vide2d()
  sMy.pointilles = 5
  const texteAngle = latexParPoint(tAngle, M2)
  const Rx = point(M.x, (M.y < 0) ? 1.5 : -1.5)
  const Ry = point((M.x < 0) ? 0.75 : -1.5, M.y)
  const texteCosinus = latexParPoint(tCos, Rx)
  const texteSinus = latexParPoint(tSin, Ry)
  const sCos = segment(O, point(M.x, 0))
  const sSin = segment(O, point(0, M.y))
  sCos.epaisseur = 3
  sSin.epaisseur = 3
  const marqueAngle = codageAngle(I, O, M)
  marqueAngle.color = colorToLatexOrHTML('blue')
  marqueAngle.epaisseur = 3
  const objetsTrigo = []
  if (cosOrSin === 'cos') {
    objetsTrigo.push(texteCosinus, sCos, sMx)
  } else {
    objetsTrigo.push(texteSinus, sSin, sMy)
  }
  return mathalea2d({
    xmin: -r - 3,
    xmax: r + 3,
    ymin: -r - 1.8,
    ymax: r + 1.8,
    scale: 0.5
  }, c, texteAngle, marqueAngle, s1, s2, ...objetsTrigo, sOM, sOI)
}
