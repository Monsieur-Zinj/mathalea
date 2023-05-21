import { get } from '../../modules/dom'
import { messageFeedback } from '../../modules/messages'
export function verifQuestionQcm (exercice, i) {
  let resultat
  const monRouge = 'rgba(217, 30, 24, 0.5)'
  const monVert = 'rgba(123, 239, 178, 0.5)'
  // i est l'indice de la question
  let nbBonnesReponses = 0
  let nbMauvaisesReponses = 0
  let nbBonnesReponsesAttendues = 0
  // Compte le nombre de réponses justes attendues
  for (let k = 0; k < exercice.autoCorrection[i].propositions.length; k++) {
    if (exercice.autoCorrection[i].propositions[k].statut) { nbBonnesReponsesAttendues++ }
  }
  const spanReponseLigne = document.querySelector(`#resultatCheckEx${exercice.numeroExercice}Q${i}`)
  let aucuneMauvaiseReponseDonnee = true
  exercice.autoCorrection[i].propositions.forEach((proposition, indice) => {
    const label = document.querySelector(`#labelEx${exercice.numeroExercice}Q${i}R${indice}`)
    const check = document.querySelector(`#checkEx${exercice.numeroExercice}Q${i}R${indice}`)
    if (check.checked) {
      // Sauvegarde pour les exports Moodle, Capytale...
      if (exercice.answers === undefined) { exercice.answers = {} }
      exercice.answers[`Ex${exercice.numeroExercice}Q${i}R${indice}`] = 1
      // Gestion du feedback de toutes les cases cochées
      if (exercice.autoCorrection[i].propositions[indice].feedback) {
        messageFeedback({
          id: `feedbackEx${exercice.numeroExercice}Q${i}R${indice}`,
          message: exercice.autoCorrection[i].propositions[indice].feedback,
          type: proposition.statut ? 'positive' : 'error'
        })
      }
    }
    if (proposition.statut) {
      if (check.checked) {
        nbBonnesReponses++
        if (aucuneMauvaiseReponseDonnee) {
          label.style.backgroundColor = monVert
        }
      } else { // Bonnes réponses non cochées
        label.style.backgroundColor = monVert
      }
    } else if (check.checked === true) {
      label.style.backgroundColor = monRouge
      nbMauvaisesReponses++
      aucuneMauvaiseReponseDonnee = false
    }
  })
  let typeFeedback = 'positive'
  if (nbMauvaisesReponses === 0 && nbBonnesReponses === nbBonnesReponsesAttendues) {
    spanReponseLigne.innerHTML = '😎'
    resultat = 'OK'
  } else {
    spanReponseLigne.innerHTML = '☹️'
    typeFeedback = 'error'
    resultat = 'KO'
  }
  // Gestion du feedback global de la question
  spanReponseLigne.style.fontSize = 'large'
  const eltFeedback = get(`feedbackEx${exercice.numeroExercice}Q${i}`, false)
  let message = ''
  if (eltFeedback) { eltFeedback.innerHTML = '' }
  if (resultat === 'KO') {
    // Juste mais incomplet
    if (nbBonnesReponses > 0 && nbBonnesReponses < nbBonnesReponsesAttendues) {
      message = `${nbBonnesReponses} bonne${nbBonnesReponses > 1 ? 's' : ''} réponse${nbBonnesReponses > 1 ? 's' : ''} mais c'est incomplet.`
    } else if (nbBonnesReponses > 0 && nbMauvaisesReponses > 0) { // Du juste et du faux
      message = `${nbMauvaisesReponses} erreur${nbMauvaisesReponses > 1 ? 's' : ''}`
    } else if (nbBonnesReponses === 0 && nbMauvaisesReponses > 0) { // Que du faux
      message = `${nbMauvaisesReponses} erreur${nbMauvaisesReponses > 1 ? 's' : ''}`
    } else { // Aucune réponse
      message = 'Aucune réponse fournie'
    }
  } else {
    message = 'Bravo !'
  }
  messageFeedback({
    id: `resultatCheckEx${exercice.numeroExercice}Q${i}`,
    message,
    type: typeFeedback
  })
  return resultat
}
