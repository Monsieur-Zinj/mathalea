import FractionEtendue from '../../modules/FractionEtendue.js'
import { rienSi1, ecritureAlgebrique, ecritureAlgebriqueSauf1 } from './ecritures.js'
import { texNombre } from './texNombre.js'

export function eqToLatex (vect : Array<number| FractionEtendue>, nomVal : Array<string>, inSys : boolean) {
  let expr = ''
  let checkPreviousNull = true
  for (let i = 0; i < 3; i++) {
    if ((vect.slice(0, 3).every(item => item === 0)) && i === 0) {
      expr = expr + '0'
    } else if (!(vect[i] === 0) && checkPreviousNull) {
      if (nomVal[i] === '') {
        expr = expr + `${texNombre(vect[i], 0)}${nomVal[i]}`
      } else {
        expr = expr + `${rienSi1(vect[i])}${nomVal[i]}`
      }
      checkPreviousNull = false
    } else if (!(vect[i] === 0) && !checkPreviousNull) {
      if (nomVal[i] === '') {
        expr = expr + `${ecritureAlgebrique(vect[i])}${nomVal[i]}`
      } else {
        expr = expr + `${ecritureAlgebriqueSauf1(vect[i])}${nomVal[i]}`
      }
      checkPreviousNull = false
    }
  }
  if (inSys === true) {
    expr = expr + ' &='
  } else {
    expr = expr + '='
  }
  checkPreviousNull = true
  for (let i = 3; i < 6; i++) {
    if ((vect.slice(3).every(item => item === 0)) && i === 3) {
      expr = expr + '0'
    } else if (!(vect[i] === 0) && checkPreviousNull) {
      if (nomVal[i] === '') {
        expr = expr + `${texNombre(vect[i], 0)}${nomVal[i]}`
      } else {
        expr = expr + `${rienSi1(vect[i])}${nomVal[i]}`
      }
      checkPreviousNull = false
    } else if (!(vect[i] === 0) && !checkPreviousNull) {
      if (nomVal[i] === '') {
        expr = expr + `${ecritureAlgebrique(vect[i])}${nomVal[i]}`
      } else {
        expr = expr + `${ecritureAlgebriqueSauf1(vect[i])}${nomVal[i]}`
      }
      checkPreviousNull = false
    }
  }
  return expr
}
export function printSystem (eq1 : string, eq2 : string) {
  let expr = ''
  expr = expr + `\\begin{cases}\\begin{aligned}${eq1}\\\\${eq2}\\end{aligned}\\end{cases}`
  return expr
}

export function timesIfNotUn (valeur : number) {
  if (valeur === 1 || valeur === -1) {
    return ''
  } else {
    return '\\times'
  }
}

export function multCoeff (vect : Array<number>, coeff: number) {
  return vect.map(function (x: number) { return x * coeff })
}
export function addCombLin (vect1: Array<number | FractionEtendue>, vect2: Array<number | FractionEtendue>, coeff: number) {
  return vect1.map(function (x: number | FractionEtendue, i: number) {
    if (typeof x === 'number' && typeof vect2[i] === 'number') {
      return x + (vect2[i] as number) * coeff
    } else if (x instanceof FractionEtendue && typeof vect2[i] === 'number') {
      return x.ajouteEntier((vect2[i] as number) * coeff)
    } else if (typeof x === 'number' && vect2[i] instanceof FractionEtendue) {
      return (vect2[i] as FractionEtendue).multiplieEntier(coeff).ajouteEntier(x)
    } else if (x instanceof FractionEtendue && vect2[i] instanceof FractionEtendue) {
      return (vect2[i] as FractionEtendue).multiplieEntier(coeff).sommeFraction(x)
    } else {
      return 0
    }
  })
}
