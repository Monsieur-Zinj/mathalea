/* global $ */

import { context } from '../context.js'
import { afficheScore } from '../gestionInteractif.js'
import { addElement, get, setStyles } from '../dom.js'
import { gestionCan } from './gestionCan.js'

export function verifQuestionListeDeroulante (exercice, i) {
  // Le get est non strict car on sait que l'élément n'existe pas à la première itération de l'exercice
  let eltFeedback = get(`resultatCheckEx${exercice.numeroExercice}Q${i}`, false)
  // On ajoute le div pour le feedback
  if (!eltFeedback) {
    const eltExercice = document.querySelector(`#exercice${exercice.numeroExercice}Q${i}`)
    if (eltExercice) eltFeedback = addElement(eltExercice, 'div', { id: `resultatCheckEx${exercice.numeroExercice}Q${i}` })
  }
  setStyles(eltFeedback, 'marginBottom: 20px')
  if (eltFeedback) eltFeedback.innerHTML = ''
  let resultat
  const spanReponseLigne = document.querySelector(`#resultatCheckEx${exercice.numeroExercice}Q${i}`)
  const optionsChoisies = document.querySelectorAll(`#ex${exercice.numeroExercice}Q${i}`)
  let reponses = []
  if (!Array.isArray(exercice.autoCorrection[i].reponse.valeur)) {
    reponses = [exercice.autoCorrection[i].reponse.valeur]
  } else {
    reponses = exercice.autoCorrection[i].reponse.valeur
  }
  let saisie = []
  for (const option of optionsChoisies) {
    saisie.push(option.value)
  }
  saisie = saisie.join('-')
  for (const reponse of reponses) {
    // Pour les exercices où on associe plusieurs liste déroulantes, la réponse est un tableau (cf 6N43-4)
    // On concatène les saisies et les réponses pour les comparer
    if (Array.isArray(reponse)) {
      if (reponse.join('-') === saisie) {
        resultat = 'OK'
        spanReponseLigne.innerHTML = '😎'
      }
    } else {
      // Pour les exercices classiques, on compare directement
      if (reponse === saisie) {
        resultat = 'OK'
        spanReponseLigne.innerHTML = '😎'
      }
    }
  }
  if (resultat !== 'OK') {
    spanReponseLigne.innerHTML = '☹️'
    resultat = 'KO'
  }
  spanReponseLigne.style.fontSize = 'large'
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
export const choixDeroulant = (exercice, i, c, choix, type = 'nombre', style = '') => {
  if (!exercice.interactif || !context.isHtml) return ''
  if (style) style = `style="${style}"`
  let result = `<select class="ui fluid dropdown ex${exercice.numeroExercice}" id="ex${exercice.numeroExercice}Q${i}" ${style} data-choix="${c}">
      <option> Choisir ${type === 'nombre' ? 'un nombre' : type} </option>`
  for (const a of choix) {
    result += `<option>${a}</option>`
  }
  result += '</select>'
  return result
}

/**
 * Lorsque l'évènement 'exercicesAffiches' est lancé par mathalea.js
 * on vérifie la présence du bouton de validation d'id btnValidationEx{i} créé par listeQuestionsToContenu
 * et on y ajoute un listenner pour vérifier les réponses cochées
 * @param {object} exercice
 */
export function exerciceListeDeroulante (exercice) {
  document.addEventListener('exercicesAffiches', () => {
    // On active les checkbox
    $('select.dropdown').dropdown()
    // Couleur pour surligner les label avec une opacité de 50%
    if (context.vue === 'can') {
      gestionCan(exercice)
    }
    const button = document.querySelector(`#btnValidationEx${exercice.numeroExercice}-${exercice.id}`)
    if (button) {
      if (!button.hasMathaleaListener) {
        button.addEventListener('click', event => {
          let nbQuestionsValidees = 0
          let nbQuestionsNonValidees = 0
          const uiselects = document.querySelectorAll(`.ui.dropdown.ex${exercice.numeroExercice}`)
          uiselects.forEach(function (uiselect) {
            uiselect.classList.add('disabled')
          })
          button.classList.add('disabled')
          for (let i = 0; i < exercice.nbQuestions; i++) {
            const resultat = verifQuestionListeDeroulante(exercice, i)
            resultat === 'OK' ? nbQuestionsValidees++ : nbQuestionsNonValidees++
          }
          afficheScore(exercice, nbQuestionsValidees, nbQuestionsNonValidees)
        })
        button.hasMathaleaListener = true
      }
    }
  })
}
