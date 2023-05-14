import type { Activity, InterfaceGlobalOptions, InterfaceParams, StudentAssignement } from 'src/lib/types.js'
import { exercicesParams, globalOptions } from '../store.js'
import { mathaleaHandleComponentChange } from '../../lib/mathalea.js'

/**
   * Fonction pour recevoir les paramètres des exercices depuis une plateforme extérieure comme Moodle
  */
async function toolGetActivityParams ({ mode, activity, studentAssignement }: { mode: 'create'|'assignement', activity: Activity, studentAssignement?: StudentAssignement}) {
  // On récupère les paramètres de l'activité
  const [newExercicesParams, newGlobalOptions] = [activity.exercicesParams, activity.globalOptions]
  // On met à jour les paramètres des exercices
  exercicesParams.update(() => {
    return newExercicesParams
  })
  // On met à jour les paramètres globaux
  globalOptions.update(() => {
    return newGlobalOptions
  })
  if (mode === 'create') {
    console.log('create')
  } else if (mode === 'assignement') {
    mathaleaHandleComponentChange('', 'eleve')
  }
}

const testExercicesParams: InterfaceParams[] = [{ uuid: 'cfa6a', nbQuestions: 1, interactif: '1' },
  { uuid: 'cfa6a', interactif: '0', nbQuestions: 2 }]

const testGlobalOptions: InterfaceGlobalOptions = { v: '', title: '', presMode: 'un_exo_par_page' }

export default function handleCapytale () {
  toolGetActivityParams({ mode: 'create', activity: { exercicesParams: testExercicesParams, globalOptions: testGlobalOptions } })
}
