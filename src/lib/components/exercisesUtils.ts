import type TypeExercice from '../../exercices/Exercice'
import { globalOptions, exercicesParams } from '../stores/generalStore'
import {
  mathaleaFormatExercice,
  mathaleaHandleExerciceSimple,
  mathaleaHandleParamOfOneExercice,
  mathaleaLoadExerciceFromUuid
} from '../mathalea'
import seedrandom from 'seedrandom'
import { get } from 'svelte/store'
/**
 * Construit la liste des exercices basée sur le contenu du store exercicesParams
 * @returns liste des exercices
 */
export const buildExercisesList = async (): Promise<TypeExercice[]> => {
  const exos: TypeExercice[] = []
  const options = get(globalOptions)
  const exosParams = get(exercicesParams)
  for (const paramsExercice of exosParams) {
    const exo: TypeExercice = await mathaleaLoadExerciceFromUuid(
      paramsExercice.uuid
    )
    if (typeof exo === 'undefined') {
      throw new Error(
        "L'exercice correspondant à l'uuid " +
          paramsExercice.uuid +
          " n'est pas défini..."
      )
    }
    mathaleaHandleParamOfOneExercice(exo, paramsExercice)
    if (options.setInteractive === '1' && exo?.interactifReady) {
      exo.interactif = true
    }
    exos.push(exo)
  }
  return exos
}

export const splitExercisesIntoQuestions = (
  exercices: TypeExercice[]
): {
  questions: string[]
  consignes: string[]
  corrections: string[]
  consignesCorrections: string[]
  isCorrectionVisible: boolean[]
  indiceExercice: number[]
  indiceQuestionInExercice: number[]
} => {
  let questions: string[] = []
  let consignes: string[] = []
  let corrections: string[] = []
  let consignesCorrections: string[] = []

  const isCorrectionVisible: boolean[] = []
  const indiceExercice: number[] = []
  const indiceQuestionInExercice: number[] = []

  for (const [k, exercice] of exercices.entries()) {
    exercice.score = 0
    if (exercice.typeExercice === 'simple') {
      mathaleaHandleExerciceSimple(exercice, exercice.interactif, k)
    }
    if (exercice.seed !== undefined) {
      seedrandom(exercice.seed, { global: true })
    }
    exercice.numeroExercice = k
    if (exercice.nouvelleVersion !== undefined) {
      exercice.nouvelleVersion(k)
    }
    isCorrectionVisible[k] = false
    const cumulConsignesCorrections = []
    if (exercice.listeQuestions === undefined) {
      exercice.listeQuestions = []
    }
    if (exercice.listeCorrections === undefined) {
      exercice.listeCorrections = []
    }
    for (let i = 0; i < exercice.listeQuestions.length; i++) {
      consignes.push(exercice?.consigne + exercice?.introduction)
      indiceExercice.push(k)
      indiceQuestionInExercice.push(i)
      if (exercice.consigneCorrection !== undefined) {
        cumulConsignesCorrections.push(exercice.consigneCorrection)
      }
    }
    questions = [...questions, ...exercice.listeQuestions]
    corrections = [...corrections, ...exercice.listeCorrections]
    consignesCorrections = [
      ...consignesCorrections,
      ...cumulConsignesCorrections
    ]
    questions = questions.map(mathaleaFormatExercice)
    corrections = corrections.map(mathaleaFormatExercice)
    consignesCorrections = consignesCorrections.map(mathaleaFormatExercice)
    consignes = consignes.map(mathaleaFormatExercice)
  }

  return {
    questions,
    consignes,
    corrections,
    consignesCorrections,
    isCorrectionVisible,
    indiceExercice,
    indiceQuestionInExercice
  }
}
