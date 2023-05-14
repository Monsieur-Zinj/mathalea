import type { Activity, InterfaceGlobalOptions, InterfaceParams, StudentAssignement } from 'src/lib/types.js'
import { exercicesParams, globalOptions, resultsByExercice } from '../components/store.js'
import { mathaleaHandleComponentChange } from './mathalea.js'
import { get } from 'svelte/store'

// Fichiers temporaires pour tester avant de récupérer les paramètres depuis Capytale
const testExercicesParams: InterfaceParams[] = [{ uuid: '5c1b3', nbQuestions: 1, interactif: '1' },
  { uuid: 'cfa6a', interactif: '0', nbQuestions: 2 }, { uuid: '5c1b3', nbQuestions: 2, interactif: '1' }, { uuid: '5c1b3', nbQuestions: 2, interactif: '1' }]

const testGlobalOptions: InterfaceGlobalOptions = { v: 'eleve', title: '', presMode: 'un_exo_par_page' }

// timer pour ne pas prévenir Capytale trop souvent
let timerId: ReturnType<typeof setTimeout>
let firstTime = true

/**
   * Fonction pour recevoir les paramètres des exercices depuis une plateforme extérieure comme Moodle
  */
async function toolGetActivityParams ({ mode, activity, studentAssignement }: { mode: 'create'|'assignement', activity: Activity, studentAssignement?: StudentAssignement}) {
  // On récupère les paramètres de l'activité
  const [newExercicesParams, newGlobalOptions] = [activity.exercicesParams, activity.globalOptions]
  // On met à jour les paramètres des exercices
  exercicesParams.update((l) => {
    Object.assign(l, newExercicesParams)
    return l
  })
  // On met à jour les paramètres globaux
  globalOptions.update((l) => {
    Object.assign(l, newGlobalOptions)
    return l
  })
  if (mode === 'create') {
    // console.log('create')
  } else if (mode === 'assignement') {
    mathaleaHandleComponentChange('', 'eleve')
  }
}

export default async function handleCapytale () {
  toolGetActivityParams({ mode: 'create', activity: { exercicesParams: testExercicesParams, globalOptions: testGlobalOptions } })
}

export async function sendToCapytaleMathaleaHasChanged () {
  if (firstTime) {
    // attendre 1 seconde
    await new Promise((resolve) => setTimeout(resolve, 1000))
    firstTime = false
    return
  }
  // On ne prévient Capytale qu'une fois toutes les demi-secondes
  if (timerId === undefined) {
    timerId = setTimeout(() => {
      // haschanged()
      console.log('haschanged')
      timerId = undefined
    }, 500)
  }
}

export function sendToCapytaleSaveStudentAssignement () {
  const results = get(resultsByExercice)
  let bilan = ''
  let i = 1
  for (const resultExercice of results) {
    if (resultExercice?.numberOfPoints !== undefined) {
      bilan += `Ex ${i} : ${resultExercice.numberOfPoints}/${resultExercice.numberOfQuestions}\n`
    }
    i++
  }
  console.log(bilan)
  // sendToCapytaleSaveStudentAssignement(get(resultsByExercice), bilan)
}
