import { round } from 'mathjs'
import { ecritureAlgebrique } from '../../lib/outils/ecritures.js'
import FractionEtendue from '../FractionEtendue.js'
import { randint } from '../outils.js'

/**
 * retourne une FractionEtendue à partir de son écriture en latex (ne prend pas en compte des écritures complexes comme
 * \dfrac{4+\dfrac{4}{5}}{5-\dfrac{3}{5}}
 * @param {string} fractionLatex la fraction écrite en latex (avec des accolades) exemple : \frac{5}{7} ou \dfrac{5}{7}
 * @returns {FractionEtendue}
 */
export function fractionLatexToMathjs (fractionLatex) {
  const parts = fractionLatex.split('{')
  const num = Number(parts[1].slice(0, -1))
  const den = Number(parts[2].slice(0, -1))
  return new FractionEtendue(num, den)
}
/**
 * delta(true) retourne dans un tableau des valeurs de a, b, c telles que b*b-4*a*c >0
 * delta(false) retourne dans un tableau des valeurs de a, b, c telles que b*b-4*a*c <0
 * @author Jean-Claude Lhote
 */
export function choisiDelta (positif) {
  let d, a, b, c
  do {
    a = randint(-5, 5, 0)
    b = randint(-5, 5, 0)
    c = randint(-5, 5, 0)
    d = b * b - 4 * a * c
  } while (positif ? d <= 0 : d >= 0)
  return [a, b, c]
}
/**
 * fonction qui retourne un polynome du second degré correctement écrit.
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {string}
 */
export function expTrinome (a, b, c) {
  let expr = ''
  if (typeof a === 'number') {
    switch (a) {
      case 0:
        break
      case -1:
        expr += '-x^2'
        break
      case 1:
        expr += 'x^2'
        break
      default:
        expr += `${a}x^2`
        break
    }
  } else {
    expr += `${a}x^2`
  }
  if (typeof b === 'number') {
    switch (b) {
      case 0:
        break
      case -1:
        expr += '-x'
        break
      case 1:
        expr += '+x'
        break
      default:
        if (a === 0) {
          expr += `${b}`
        } else expr += `${ecritureAlgebrique(b)}x`
        break
    }
  } else {
    if (a === 0) {
      expr += `${b}x`
    } else {
      expr += `+${b}x`
    }
  }
  if (typeof c === 'number') {
    if (a === 0 && b === 0) {
      expr += `${c}`
    } else {
      if (c !== 0) {
        expr += `${ecritureAlgebrique(c)}`
      }
    }
  } else {
    expr += `+${c}`
  }
  return expr
}

/**
 * renvoie les solutions (intervalles) de f(x) < y (ou f(x)<=y ou f(x)>y ou f(x)>=y)
 * @param {function} fonction une fonction x=>f(x)
 * @param {number} y la valeur de y à atteindre
 * @param {number} xMin la borne gauche du domaine de définition
 * @param {number} xMax la borne droite du domaine de définition
 * @param {boolean} inferieur si true < si false >
 * @param {boolean} strict si true < ou > sinon <= ou >=
 * @param {Object} [options]
 * @param {number} options.step le pas de recherche en x.
 * @return {{borneG: {x: number, included: boolean, y: number}, borneD: {x: number, included: boolean, y: number}}[]} le ou les intervalles dans une liste
 */
export function inferieurSuperieur (fonction, y, xMin, xMax, inferieur = true, strict = false, { step = 0.001 } = {}) {
  const satisfy = function (image, y, inferieur, strict) {
    if (inferieur) {
      return strict ? y - image > 0 : y - image >= 0
    } else {
      return strict ? y - image < 0 : y - image <= 0
    }
  }
  const solutions = []
  let borneG = {}
  let borneD = {}
  for (let x = xMin; x <= xMax;) {
    const image = fonction(round(x, 3))
    if (borneG.x === undefined && satisfy(image, y, inferieur, strict)) { // c'est le premier x qui matche
      borneG = { x: round(x, 3), y: round(image, 3), included: !strict }
    } else if (satisfy(image, y, inferieur, strict)) { // les suivants qui matchent écrasent borneD
      borneD = { x: round(x, 3), y: round(image, 3), included: !strict }
    } else { // ça ne matche plus ou pas
      if (borneD.x !== undefined) { // il y a eu un intervalle, ça a matché et c'est terminé
        solutions.push({
          borneG: { x: borneG.x, y: borneG.y, included: borneG.included },
          borneD: { x: borneD.x, y: borneD.y, included: borneD.included }
        })
        borneG = {}
        borneD = {} // on réinitialise pour le prochain intervalle
      } else if (borneG.x !== undefined) { // On n'a pas de borneD, mais on a une borneG, cas particulier du singleton
        solutions.push({
          borneG: { x: borneG.x, y: borneG.y, included: borneG.included },
          borneD: { x: borneG.x, y: borneG.y, included: borneG.included }
        })
        borneG = {}
        borneD = {} // on réinitialise pour le prochain intervalle
      }
    }
    x += step // dans tous les cas, on avance
  }
  if (borneD.x !== undefined) { // le dernier intervalle n'a pas été mis dans les solutions car on est encore dedans
    solutions.push({
      borneG: { x: borneG.x, y: borneG.y, included: borneG.included },
      borneD: { x: borneD.x, y: borneD.y, included: borneD.included }
    })
  }
  return solutions
}
