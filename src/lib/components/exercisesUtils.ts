import Exercice from '../../exercices/Exercice'
import type TypeExercice from '../../exercices/Exercice'
import { globalOptions, exercicesParams } from '../stores/generalStore'
import referentielStaticFR from '../../json/referentielStaticFR.json'
import referentielStaticCH from '../../json/referentielStaticCH.json'
import { retrieveResourceFromUuid } from '../../lib/components/refUtils'
import { isStaticType, type JSONReferentielObject } from '../../lib/types/referentiels'
import {
  mathaleaFormatExercice,
  mathaleaHandleExerciceSimple,
  mathaleaHandleParamOfOneExercice,
  mathaleaLoadExerciceFromUuid
} from '../mathalea'
import seedrandom from 'seedrandom'
import { get } from 'svelte/store'

const allStaticReferentiels: JSONReferentielObject = {
  ...referentielStaticFR,
  ...referentielStaticCH
}

// on supprime les entrées par thème qui entraîne des doublons
delete allStaticReferentiels['Brevet des collèges par thème - APMEP']
delete allStaticReferentiels['BAC par thème - APMEP']
delete allStaticReferentiels['CRPE (2015-2019) par thème - COPIRELEM']
delete allStaticReferentiels['CRPE (2022-2023) par thème']
delete allStaticReferentiels['E3C par thème - APMEP']
delete allStaticReferentiels['EVACOM par thème']

/**
 * Construit la liste des exercices basée sur le contenu du store exercicesParams
 * @returns liste des exercices EN PROMESSE
 */
export const buildExercisesList = (filter: string[] = []): Promise<TypeExercice>[] => {
  const promiseExos: Promise<TypeExercice>[] = []
  const options = get(globalOptions)
  const exosParams = get(exercicesParams)
  for (const paramsExercice of exosParams) {
    if (filter.length > 0 && !filter.includes(paramsExercice.uuid)) {
      continue
    }
    if (isStatic(paramsExercice.uuid)) {
      const p = new Promise<TypeExercice>((resolve) => {
        // console.log('id' + paramsExercice.id)
        const exo = new Exercice()
        exo.titre = `Uuid ${paramsExercice.uuid}`
        exo.listeQuestions[0] = `Uuid ${paramsExercice.uuid}<br>`
        exo.listeCorrections[0] = `Uuid ${paramsExercice.uuid}<br>`
        exo.nbQuestions = 1
        const foundResource = retrieveResourceFromUuid(allStaticReferentiels, paramsExercice.uuid)
        if (isStaticType(foundResource)) {
          exo.listeQuestions[0] = exo.listeQuestions[0] + `<br>
          <img src="${foundResource.png || ''}" style="width: calc(100% * {zoomFactor}" alt="énoncé" />`
          exo.listeCorrections[0] = exo.listeCorrections[0] + `<br>
          <img src="${foundResource.pngCor || ''}" style="width: calc(100% * {zoomFactor}" alt="correction" />`
        }
        mathaleaHandleParamOfOneExercice(exo, paramsExercice)
        if (options.setInteractive === '1' && exo?.interactifReady) {
          exo.interactif = true
        }
        resolve(exo)
        // console.log('id resolu' + paramsExercice.id)
      })
      promiseExos.push(p)
    } else {
      const p = new Promise<TypeExercice>((resolve) => {
        // console.log('id' + paramsExercice.id)
        mathaleaLoadExerciceFromUuid(paramsExercice.uuid).then(exo => {
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
          resolve(exo)
        })
        // console.log('id resolu' + paramsExercice.id)
      })
      promiseExos.push(p)
    }
  }
  return promiseExos
}

/**
 * Détermine si l'uuid a un préfixe d'exercice statique
 * @param uuid
 * @returns boolean
 */
export function isStatic (uuid: string | undefined) {
  if (uuid === undefined) {
    return false
  }
  return uuid.startsWith('crpe-') ||
    uuid.startsWith('dnb_') ||
    uuid.startsWith('e3c_') ||
    uuid.startsWith('bac_') ||
    uuid.startsWith('evacom_') ||
    uuid.startsWith('2nd_')
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
    exercice.numeroExercice = k
    if (exercice.typeExercice === 'simple') {
      mathaleaHandleExerciceSimple(exercice, exercice.interactif, k)
    } else {
      if (exercice.nouvelleVersionWrapper !== undefined) {
        if (exercice.seed !== undefined) {
          seedrandom(exercice.seed, { global: true })
        }
        exercice.nouvelleVersionWrapper(k)
      }
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
