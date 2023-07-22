import { point } from '../lib/2d/points.js'
import { longueur, segment } from '../lib/2d/segmentsVecteurs.js'
import { projectionOrtho } from '../lib/2d/transformations.js'
import { colorToLatexOrHTML, ObjetMathalea2D } from './2dGeneralites.js'
import { context } from './context.js'

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%% LES POINTS %%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

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

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%% LES CERCLES ET ARCS %%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%% LES FONCTIONS - CALCULS %%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

