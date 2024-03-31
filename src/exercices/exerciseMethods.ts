import FractionEtendue from '../modules/FractionEtendue'
import type Exercice from './Exercice'

export function exportedNouvelleVersionWrapper (this: Exercice, numeroExercice?: number): void {
  this.reinit()
  this.nouvelleVersion(numeroExercice)
}

export function exportedReinit (this: Exercice) {
  this.listeQuestions = [] // Liste de questions
  this.listeCorrections = [] // Liste de questions corrigées
  this.listeArguments = []
  this.autoCorrection = []
}

export function exportedApplyNewSeed (this: Exercice) {
  const seed = generateSeed({
    includeUpperCase: true,
    includeNumbers: true,
    length: 4,
    startsWithLowerCase: false
  })
  this.seed = seed
}

/**
 * Compare chaque nouvelle version d'un exercice aux précédentes pour s'assurer de ne pas avoir deux exercices identiques
 * @param {int} i indice de la question
 * @param  {...any} args toutes les variables pertinentes qui "résumeraient" la question
 * @returns {boolean} true si la question n'a jamais été posée
 */
export function exportedQuestionJamaisPosee (this: Exercice, i: number, ...args:(string|number|FractionEtendue)[]) {
  if (i === 0) this.listeArguments = []
  let argsConcatenes = ''
  for (const arg of args) {
    if (arg !== undefined) argsConcatenes += (arg instanceof FractionEtendue ? arg.texFraction : arg.toString())
  }
  if (this.listeArguments != null && this.listeArguments.indexOf(argsConcatenes) > -1) {
    return false
  } else if (this.listeArguments != null) {
    this.listeArguments.push(argsConcatenes)
    return true
  }
}

function generateSeed ({ includeUpperCase = true, includeNumbers = true, length = 4, startsWithLowerCase = false }: { includeUpperCase?: boolean, includeNumbers?: boolean, length?: number, startsWithLowerCase?: boolean } = {}) {
  let a = 10
  const b = 'abcdefghijklmnopqrstuvwxyz'
  let c = ''
  let d = 0
  let e = '' + b
  if (startsWithLowerCase) {
    c = b[Math.floor(Math.random() * b.length)]
    d = 1
  }
  if (length) {
    a = length
  }
  if (includeUpperCase) {
    e += b.toUpperCase()
  }
  if (includeNumbers) {
    e += '1234567890'
  }

  for (; d < a; d++) {
    c += e[Math.floor(Math.random() * e.length)]
  }
  return c
}
