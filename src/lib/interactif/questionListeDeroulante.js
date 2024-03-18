// import { addElement, get, setStyles } from '../html/dom.js'
import { context } from '../../modules/context.js'

/**
 * Vérifie la réponse à une question à liste déroulante
 * @param {object} exercice l'exercice appelant pour pouvoir atteindre ses propriétés.
 * @param {number} i le numéro de la question
 * @param {number} c numéro de la liste
 * @returns {string} 'OK' si la réponse est correcte, 'KO' sinon
*/
export function verifQuestionListeDeroulante (exercice/** Exercice */, i/** number */) {
  /* // Le get est non strict car on sait que l'élément n'existe pas à la première itération de l'exercice
  const eltFeedback = document.querySelector(`resultatCheckEx${exercice.numeroExercice}Q${i}`)
  // On ajoute le div pour le feedback
  setStyles(eltFeedback, 'marginBottom: 20px')
  if (eltFeedback) eltFeedback.innerHTML = ''
   */
  const spanReponseLigne = document.querySelector(`#resultatCheckEx${exercice.numeroExercice}Q${i}`)
  if (spanReponseLigne == null) {
    window.notify('l\'exercice ayant appelé verifQuestionListeDeroulante() n\'a pas correctement défini le span pour le smiley', { exercice: JSON.stringify(exercice) })
  }
  const optionsChoisie = document.querySelector(`[id^=ex${exercice.numeroExercice}Q${i}]`)
  const reponse = exercice.autoCorrection[i].reponse.valeur.reponse.value
  let saisie = ''
  // Sauvegarde pour les exports Moodle, Capytale...
  if (exercice.answers === undefined) {
    exercice.answers = {}
  }
  saisie = optionsChoisie.value
  exercice.answers[optionsChoisie.id] = saisie
  const resultat = saisie === reponse ? 'OK' : 'KO'
  if (resultat === 'OK') {
    if (spanReponseLigne) {
      spanReponseLigne.innerHTML = '😎'
    }
  } else {
    if (spanReponseLigne) {
      spanReponseLigne.innerHTML = '☹️'
    }
  }
  if (spanReponseLigne) spanReponseLigne.style.fontSize = 'large'
  return resultat
}

/**
 *
 * @param {object} exercice l'exercice appelant pour pouvoir atteindre ses propriétés.
 * @param {number} i le numéro de la question
 * @param {number} c le numéro de la liste pour un exercice en comportant plusieurs afin de permettre des test d'association
 * @param {array} choix Les différentes propositions de la liste
 * @param {string} [type='nombre'] 'nombre' si les choix sont des nombres à choisir, sinon on demande ce qu'on veut
 * @author Rémi Angot
 * @returns {string} le code html de la liste
 */
export function choixDeroulant (exercice, i, choix, type = 'nombre', style = '') {
  if (!exercice.interactif || !context.isHtml) return ''
  if (style) style = `style="${style}"`
  if (context.isHtml && exercice?.autoCorrection[i]?.reponse?.param?.formatInteractif !== 'listeDeroulante') {
    if (exercice?.autoCorrection == null) exercice.autoCorrection = []
    if (exercice?.autoCorrection[i] == null) exercice.autoCorrection[i] = {}
    if (exercice?.autoCorrection[i].reponse == null) exercice.autoCorrection[i].reponse = {}
    if (exercice.autoCorrection[i].reponse.param == null) exercice.autoCorrection[i].reponse.param = {}
    exercice.autoCorrection[i].reponse.param.formatInteractif = 'listeDeroulante'
  }
  let result = `<select class="mx-2" id="ex${exercice.numeroExercice}Q${i}" ${style}>
      <option> Choisir ${type === 'nombre' ? 'un nombre' : type} </option>`

  for (const a of choix) {
    result += `<option>${a}</option>`
  }
  result += `</select><span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
  return result
}
