import type { Activity, InterfaceResultExercice } from 'src/lib/types.js'
import { exercicesParams, globalOptions, resultsByExercice } from '../components/store.js'
import { mathaleaHandleComponentChange } from './mathalea.js'
import { get } from 'svelte/store'
import { RPC } from '@mixer/postmessage-rpc'
import type { MathfieldElement } from 'mathlive'

interface ActivityParams { mode: 'create' | 'assignment' | 'review' | 'view', activity: Activity, workflow: 'current' | 'finished' | 'corrected', studentAssignment: InterfaceResultExercice[] }

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
async function toolSetActivityParams ({ mode, activity, workflow, studentAssignment }: ActivityParams) {
  // mode : create (le prof créé sa séance), assignment (l'élève voit sa copie), review (le prof voit la copie d'un élève), view (le prof voit la séance d'un collègue dans la bibliothèque et pourra la cloner)
  // workflow : current (la copie n'a pas encore été rendue), finished (la copie a été rendue), corrected (la copie a été anotée par l'enseignant)
  // On récupère les paramètres de l'activité
  if (activity === null || activity === undefined) return
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
  // On charge l'aléa qui a pu être modifié par l'élève
  if (studentAssignment !== null && studentAssignment !== undefined) {
    for (const exercice of studentAssignment) {
      if (exercice.alea !== undefined && exercice.indice !== undefined) {
        exercicesParams.update((l) => {
          l[exercice.indice].alea = exercice.alea
          return l
        })
      }
    }
  }
  if (mode === 'create') {
    // Enseignant qui crée et paramètre sa séance
  } else {
    mathaleaHandleComponentChange('', 'eleve')
  }
  if (mode === 'assignment') {
    // Élève sur sa copie
    globalOptions.update((l) => {
      l.v = 'eleve'
      return l
    })
    // Si la copie a déjà été rendue, on ne peut plus modifier les réponses
    if (workflow !== 'current') {
      globalOptions.update((l) => {
        l.done = '1'
        return l
      })
    }
  } else if (mode === 'review') {
    // Mettre le done à true pour que l'on ne puisse plus modifier les réponses
    globalOptions.update((l) => {
      l.done = '1'
      l.v = 'eleve'
      return l
    })
  }
  // Attendre pour que les champs texte soient bien chargés
  await new Promise((resolve) => setTimeout(resolve, 500))
  for (const exercice of studentAssignment) {
    for (const answer in exercice.answers) {
      // La réponse correspond à un champs texte
      const field = document.querySelector(`#champTexte${answer}`) as MathfieldElement
      if (field !== null) {
        field.setValue(exercice.answers[answer])
      }
      // La réponse correspond à une case à cocher qui doit être cochée
      const checkBox = document.querySelector(`#check${answer}`) as HTMLInputElement
      // @ts-ignore
      if (checkBox !== null && exercice.answers[answer] === 1) {
        checkBox.checked = true
      }
      // La réponse correspond à une liste déroulante
      const select = document.querySelector(`select#${answer}`) as HTMLSelectElement
      select.value = exercice.answers[answer]
    }
    if (exercice.state === 'done') {
      // On attent que le bouton de correction soit chargé
      // const buttonScore = await waitForElementToExist(`#buttonScoreEx${exercice.indice}`) as HTMLButtonElement
      const buttonScore = document.querySelector(`#buttonScoreEx${exercice.indice}`) as HTMLButtonElement
      if (buttonScore !== null) {
        buttonScore.click()
      }
    }
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
  console.log('Envoi des résultats à Capytale', results, evaluation)
  rpc.call('saveStudentAssignment', { studentAssignment: results, evaluation })
}

function sendToCapytaleActivityParams () {
  return { exercicesParams: get(exercicesParams), globalOptions: get(globalOptions) }
}

export default async function handleCapytale () {
  console.log('Communication avec Capytale')
  rpc.expose('platformGetActivityParams', sendToCapytaleActivityParams)
  try {
    const activityParams = await rpc.call<ActivityParams>('toolGetActivityParams', {})
    toolSetActivityParams(activityParams)
  } catch (error) {
    console.log('Problème de communication avec Capytale', error)
  }
}
