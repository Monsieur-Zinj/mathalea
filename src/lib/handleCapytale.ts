import type { Activity, InterfaceGlobalOptions, InterfaceParams, StudentAssignement } from 'src/lib/types.js'
import { exercicesParams, globalOptions } from '../components/store.js'
import { mathaleaHandleComponentChange } from './mathalea.js'

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

const testExercicesParams: InterfaceParams[] = [{ uuid: 'cfa6a', nbQuestions: 1, interactif: '1' },
  { uuid: 'cfa6a', interactif: '0', nbQuestions: 2 }]

const testGlobalOptions: InterfaceGlobalOptions = { v: '', title: '', presMode: 'un_exo_par_page' }

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
