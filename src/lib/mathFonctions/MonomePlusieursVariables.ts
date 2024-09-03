import type Decimal from 'decimal.js'
import FractionEtendue, { rationnalise } from '../../modules/FractionEtendue'
import { randint } from '../../modules/outils'

type numberOrFraction = number | FractionEtendue | Decimal;

type partieLitterale = {
  variables: string[];
  exposants: number[];
};

class MonomePlusieursVariables {
  coefficient: FractionEtendue
  partieLitterale: partieLitterale
  degre: number

  constructor (coefficient: numberOrFraction, partieLitterale: partieLitterale) {
    this.coefficient = rationnalise(coefficient)
    this.partieLitterale = { ...partieLitterale } // Clone to avoid mutations
    this.degre = this.partieLitterale.exposants.reduce((acc, exposant) => acc + exposant, 0)
  }

  static genereCoefficients (typeofCoeff: string): FractionEtendue {
    let randomCoefficient: FractionEtendue
    let numerateur : number
    let denominateur : number
    if (typeofCoeff === 'entier') {
      denominateur = 1
    } else {
      denominateur = randint(-10, 10, [0, 1, -1])
    }
    do {
      numerateur = randint(-6, 6)
      randomCoefficient = new FractionEtendue(numerateur, denominateur)
    } while (numerateur === 0 || (randomCoefficient.estEntiere && typeofCoeff !== 'entier'))

    return rationnalise(randomCoefficient)
  }

  // Static method pour créer un monome à partir d'une partie littérale existante
  static createMonomeFromPartieLitterale (typeofCoeff: string, partieLitterale: partieLitterale): MonomePlusieursVariables {
    const coefficient = this.genereCoefficients(typeofCoeff)
    return new MonomePlusieursVariables(coefficient, partieLitterale)
  }

  // Static method to create a monome with random values
  static createRandomMonome (degree: number, typeofCoeff: string, variables: string[]): MonomePlusieursVariables {
    // Generate a random coefficient
    const randomPartieLitterale: partieLitterale = { variables: [], exposants: [] }
    let remainingDegree = degree
    const minExponents = Array(variables.length).fill(0)

    const n = Math.min(variables.length, degree)
    // Ensure that at least n-1 variables have non-zero degrees
    const requiredIndices = Array.from({ length: variables.length }, (_, i) => i)
    for (let i = 0; i < n - 1; i++) {
      const randomIndex = requiredIndices.splice(Math.floor(Math.random() * requiredIndices.length), 1)[0]
      minExponents[randomIndex] = 1
      remainingDegree -= 1
    }

    // Distribute the remaining degree randomly across all variables
    while (remainingDegree > 0) {
      const randomIndex = Math.floor(Math.random() * variables.length)
      minExponents[randomIndex] += 1
      remainingDegree -= 1
    }

    // Assign the computed exponents to the variables
    for (let i = 0; i < variables.length; i++) {
      randomPartieLitterale.variables.push(variables[i])
      randomPartieLitterale.exposants.push(minExponents[i])
    }
    return new MonomePlusieursVariables(this.genereCoefficients(typeofCoeff), randomPartieLitterale)
  }

  // Vérifie si deux monômes sont semblables (même partie littérale)
  estSemblable (m: MonomePlusieursVariables): boolean {
    const { variables, exposants } = this.partieLitterale
    const mVariables = m.partieLitterale.variables
    const mExposants = m.partieLitterale.exposants

    if (variables.length !== mVariables.length) return false

    for (let i = 0; i < variables.length; i++) {
      if (variables[i] !== mVariables[i] || exposants[i] !== mExposants[i]) {
        return false
      }
    }
    return true
  }

  // Additionne deux monômes semblables
  somme (m: MonomePlusieursVariables): MonomePlusieursVariables {
    if (this.estSemblable(m)) {
      const nouveauCoefficient = this.coefficient.sommeFractions(m.coefficient)
      return new MonomePlusieursVariables(nouveauCoefficient, this.partieLitterale)
    } else {
      throw new Error('Impossible d\'additionner deux monômes non semblables')
    }
  }

  // Multiplie deux monômes
  produit (m: MonomePlusieursVariables): MonomePlusieursVariables {
    const nouveauCoefficient = this.coefficient.produitFraction(m.coefficient)

    const nouvellePartieLitterale: partieLitterale = {
      variables: [...this.partieLitterale.variables],
      exposants: [...this.partieLitterale.exposants]
    }

    m.partieLitterale.variables.forEach((variable, index) => {
      const existingIndex = nouvellePartieLitterale.variables.indexOf(variable)

      if (existingIndex !== -1) {
        nouvellePartieLitterale.exposants[existingIndex] += m.partieLitterale.exposants[index]
      } else {
        nouvellePartieLitterale.variables.push(variable)
        nouvellePartieLitterale.exposants.push(m.partieLitterale.exposants[index])
      }
    })

    return new MonomePlusieursVariables(nouveauCoefficient, nouvellePartieLitterale)
  }

  // Convertit le monôme en une chaîne de caractères
  toString (): string {
    const partieLitteraleString = this.partieLitterale.variables
      .map((variable, index) => {
        const exposant = this.partieLitterale.exposants[index]
        // Only include the variable if its exponent is not 0
        if (exposant === 0) {
          return ''
        } else if (exposant === 1) {
          return `${variable}`
        } else {
          return `${variable}^${exposant}`
        }
      })
      .filter((part) => part !== '') // Exclude any empty strings from the result
      .join(' ')
    if (this.coefficient.num === 0) {
      return '0'
    } else if (this.coefficient.texFractionSimplifiee === '1') {
      if (partieLitteraleString === '') {
        return '1'
      } else {
        return partieLitteraleString
      }
    } else if (this.coefficient.texFractionSimplifiee === '-1') {
      if (partieLitteraleString === '') {
        return '-1'
      } else {
        return `-${partieLitteraleString}`
      }
    } else {
      return `${this.coefficient.texFractionSimplifiee} ${partieLitteraleString}`
    }
  }

  toStringAvecParentheses (): string {
    const partieLitteraleString = this.partieLitterale.variables
      .map((variable, index) => {
        const exposant = this.partieLitterale.exposants[index]
        // Only include the variable if its exponent is not 0
        if (exposant === 0) {
          return ''
        } else if (exposant === 1) {
          return `${variable}`
        } else {
          return `${variable}^${exposant}`
        }
      })
      .filter((part) => part !== '') // Exclude any empty strings from the result
      .join(' ')
    if (this.coefficient.num === 0) {
      return '0'
    } else if (this.coefficient.num === 1 && this.coefficient.den === 1) {
      if (partieLitteraleString === '') {
        return '1'
      } else { return partieLitteraleString }
    } else if (this.coefficient.texFractionSimplifiee === '-1') {
      return `\\left(-${partieLitteraleString}\\right)`
    } else if (this.coefficient.signe === -1) {
      return `\\left(${this.coefficient.texFractionSimplifiee} ${partieLitteraleString}\\right)`
    } else {
      return `${this.coefficient.texFractionSimplifiee} ${partieLitteraleString}`
    }
  }
}

export default MonomePlusieursVariables
