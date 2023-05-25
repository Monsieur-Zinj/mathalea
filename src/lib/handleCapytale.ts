import type { Activity, StudentAssignment } from 'src/lib/types.js'
import { exercicesParams, globalOptions, resultsByExercice } from '../components/store.js'
import { mathaleaHandleComponentChange } from './mathalea.js'
import { get } from 'svelte/store'
import { RPC } from '@mixer/postmessage-rpc'

const serviceId = 'capytale-player'

// Gestion des postMessage avec Capytale
const rpc = new RPC({
  target: window.parent,
  serviceId,
  origin: '*'
})

// timer pour ne pas lancer hasChanged trop souvent
let timerId: ReturnType<typeof setTimeout>
let firstTime = true

/**
   * Fonction pour recevoir les paramètres des exercices depuis une plateforme extérieure comme Moodle
  */
async function toolSetActivityParams ({ mode, activity, workflow, studentAssignment }: { mode: 'create'|'assignment'|'review', workflow?: 'current'|'finished'|'corrected', activity: Activity, studentAssignment?: StudentAssignment}) {
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
    // Enseignant qui crée et paramètre sa séance
  } else if (mode === 'assignment') {
    // Élève sur sa copie
    mathaleaHandleComponentChange('', 'eleve')
    // Si la copie a déjà été rendue, on ne peut plus modifier les réponses
    if (workflow !== 'current') {
      globalOptions.update((l) => {
        l.done = '1'
        return l
      })
    }
  } else if (mode === 'review') {
    mathaleaHandleComponentChange('', 'eleve')
    // Mettre le done à true pour que l'on ne puisse plus modifier les réponses
    globalOptions.update((l) => {
      l.done = '1'
      return l
    })
    mathaleaHandleComponentChange('', 'eleve')
  }
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
      rpc.call('hasChanged', {})
      timerId = undefined
    }, 500)
  }
}

export function sendToCapytaleSaveStudentAssignment () {
  const results = get(resultsByExercice)
  let evaluation = ''
  let i = 1
  for (const resultExercice of results) {
    if (resultExercice?.numberOfPoints !== undefined) {
      evaluation += `Ex ${i} : ${resultExercice.numberOfPoints}/${resultExercice.numberOfQuestions}\n`
    }
    i++
  }
  rpc.call('saveStudentAssignment', { studentAssignment: results, evaluation })
}

function sendToCapytaleGetActivityParams () {
  return { exercicesParams: get(exercicesParams), globalOptions: get(globalOptions) }
}

export default async function handleCapytale () {
  rpc.expose('platformGetActivityParams', sendToCapytaleGetActivityParams)
  rpc.call<{ mode: 'create'|'assignment'|'review', activity: Activity, studentAssignment?: StudentAssignment}>('toolGetActivityParams', {}).then((result) => {
    toolSetActivityParams(result)
  })
}
