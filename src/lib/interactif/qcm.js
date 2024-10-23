import { context } from '../../modules/context.js'
import { shuffleJusqua } from '../outils/arrayOutils'
import { get } from '../html/dom.js'
import { messageFeedback } from '../../modules/messages.js'
import { gestionCan } from './gestionCan.js'
import { afficheScore } from './gestionInteractif.ts'

export function verifQuestionQcm (exercice, i) {
  let resultat
  // i est l'indice de la question
  let nbBonnesReponses = 0
  let nbMauvaisesReponses = 0
  let nbBonnesReponsesAttendues = 0
  // Compte le nombre de réponses justes attendues
  for (let k = 0; k < exercice.autoCorrection[i].propositions.length; k++) {
    if (exercice.autoCorrection[i].propositions[k].statut) {
      nbBonnesReponsesAttendues++
    }
  }
  const divReponseLigne = document.querySelector(
    `#resultatCheckEx${exercice.numeroExercice}Q${i}`
  )
  exercice.autoCorrection[i].propositions.forEach((proposition, indice) => {
    // La liste de question peut être plus courte que autoCorrection si on n'a pas réussi à générer suffisamment de questions différentes
    // if (exercice.listeQuestions[i] !== undefined) {
    // On a des exercices comme 6S10-1 où il y a 2 questions... mais 6 qcm !
    const label = document.querySelector(
      `#labelEx${exercice.numeroExercice}Q${i}R${indice}`
    )
    const check = document.querySelector(
      `#checkEx${exercice.numeroExercice}Q${i}R${indice}`
    )
    if (check != null) {
      if (check.checked) {
        // Sauvegarde pour les exports Moodle, Capytale...
        exercice.answers[`Ex${exercice.numeroExercice}Q${i}R${indice}`] = '1'
        // Gestion du feedback de toutes les cases cochées
        if (exercice.autoCorrection[i].propositions[indice].feedback) {
          messageFeedback({
            id: `feedbackEx${exercice.numeroExercice}Q${i}R${indice}`,
            message: exercice.autoCorrection[i].propositions[indice].feedback,
            type: proposition.statut ? 'positive' : 'error'
          })
        }
      } else {
        exercice.answers[`Ex${exercice.numeroExercice}Q${i}R${indice}`] = '0'
      }
      if (proposition.statut) {
        if (check.checked === true) {
          nbBonnesReponses++
          label.classList.add('bg-coopmaths-warn-100', 'rounded-lg', 'p-1')
        } else {
          // Bonnes réponses non cochées
          label.classList.add('bg-coopmaths-warn-100', 'rounded-lg', 'p-1')
        }
      } else if (check.checked === true) {
        label.classList.add('bg-coopmaths-action-200', 'rounded-lg', 'p-1')
        nbMauvaisesReponses++
      }
      check.disabled = true
    }
  })
  let typeFeedback = 'positive'
  if (
    nbMauvaisesReponses === 0 &&
    nbBonnesReponses === nbBonnesReponsesAttendues
  ) {
    if (divReponseLigne) divReponseLigne.innerHTML = '😎'
    resultat = 'OK'
  } else {
    if (divReponseLigne) divReponseLigne.innerHTML = '☹️'
    typeFeedback = 'error'
    resultat = 'KO'
  }
  // Gestion du feedback global de la question
  if (divReponseLigne) divReponseLigne.style.fontSize = 'large'
  const eltFeedback = get(`feedbackEx${exercice.numeroExercice}Q${i}`, false)
  let message = ''
  if (eltFeedback) {
    eltFeedback.innerHTML = ''
  }
  if (resultat === 'KO') {
    // Juste mais incomplet
    if (
      nbBonnesReponses > 0 &&
      nbMauvaisesReponses === 0 &&
      nbBonnesReponses < nbBonnesReponsesAttendues
    ) {
      message = `${nbBonnesReponses} bonne${nbBonnesReponses > 1 ? 's' : ''} réponse${nbBonnesReponses > 1 ? 's' : ''}`
    } else if (nbBonnesReponses > 0 && nbMauvaisesReponses > 0) {
      // Du juste et du faux
      message = `${nbMauvaisesReponses} erreur${nbMauvaisesReponses > 1 ? 's' : ''}`
    } else if (nbBonnesReponses === 0 && nbMauvaisesReponses > 0) {
      // Que du faux
      message = `${nbMauvaisesReponses} erreur${nbMauvaisesReponses > 1 ? 's' : ''}`
      /* } else { // Aucune réponse
              message = ''
            */
    }
  } else {
    message = ''
  }
  if (nbBonnesReponsesAttendues > nbBonnesReponses) {
    message += ` ${nbBonnesReponsesAttendues - nbBonnesReponses} bonne${nbBonnesReponsesAttendues - nbBonnesReponses > 1 ? 's' : ''} réponse${nbBonnesReponsesAttendues - nbBonnesReponses > 1 ? 's' : ''} manquante${nbBonnesReponsesAttendues - nbBonnesReponses > 1 ? 's' : ''}`
  }
  messageFeedback({
    id: `resultatCheckEx${exercice.numeroExercice}Q${i}`,
    message,
    type: typeFeedback
  })
  return resultat
}

/**
 * @param {exercice}
 * @param {number} i indice de la question
 * @returns {{texte: string, texteCorr: string}} {texte, texteCorr} le texte à ajouter pour la question traitée
 */
export function propositionsQcm (exercice, i) {
  let texte = ''
  let texteCorr = ''
  let espace = ''
  let nbCols = 1
  let vertical = false
  if (exercice?.autoCorrection[i]?.propositions === undefined) {
    window.notify(
      'propositionsQcm a reçu une liste de propositions undefined',
      {
        autoCrorrection: exercice?.autoCorrection[i],
        propositions: exercice?.autoCorrection[i].propositions
      }
    )
    return { texte: '', texteCorr: '' }
  }
  if (context.isAmc) return { texte: '', texteCorr: '' }
  if (context.isHtml) {
    espace = '&emsp;'
    if (exercice?.autoCorrection[i].reponse == null) { exercice.autoCorrection[i].reponse = {} }
    if (exercice.autoCorrection[i].reponse.param == null) { exercice.autoCorrection[i].reponse.param = {} }
    exercice.autoCorrection[i].reponse.param.formatInteractif = 'qcm'
  } else {
    espace = '\\qquad '
  }
  // Mélange les propositions du QCM sauf celles à partir de lastchoice (inclus)
  if (exercice?.autoCorrection[i]?.options !== undefined) {
    vertical = exercice.autoCorrection[i].options.vertical // est-ce qu'on veut une présentation en colonnes ?
    nbCols =
      exercice.autoCorrection[i].options.nbCols > 1
        ? exercice.autoCorrection[i].options.nbCols
        : 1 // Nombre de colonnes avant de passer à la ligne
    if (!exercice.autoCorrection[i].options.ordered) {
      exercice.autoCorrection[i].propositions = shuffleJusqua(
        exercice.autoCorrection[i].propositions,
        exercice.autoCorrection[i].options.lastChoice
      )
    }
  } else {
    // Si les options ne sont pas définies, on mélange
    exercice.autoCorrection[i].propositions = shuffleJusqua(
      exercice.autoCorrection[i].propositions
    )
  }
  // On regarde si il n'y a pas de doublons dans les propositions de réponse. Si c'est le cas, on enlève les mauvaises réponses en double.
  elimineDoublons(exercice.autoCorrection[i].propositions)
  if (!context.isHtml) {
    texte += nbCols === 1 ? '\t' : `\n\n\\begin{multicols}{${nbCols}}\n\t`
    texteCorr += nbCols === 1 ? '\t' : `\n\n\\begin{multicols}{${nbCols}}\n\t`
    // texte += '\\\\\n\t'
    for (
      let rep = 0;
      rep < exercice.autoCorrection[i].propositions.length;
      rep++
    ) {
      texte += `$\\square\\;$ ${exercice.autoCorrection[i].propositions[rep].texte}`
      if (exercice.autoCorrection[i].propositions[rep].statut) {
        texteCorr += `$\\blacksquare\\;$ ${exercice.autoCorrection[i].propositions[rep].texte}`
      } else {
        texteCorr += `$\\square\\;$ ${exercice.autoCorrection[i].propositions[rep].texte}`
      }
      if (vertical) {
        texte += '\\\\\n\t'
        texteCorr += '\\\\\n\t'
      } else {
        texte += '\\qquad '
        texteCorr += '\\qquad '
      }
    }
    texte += nbCols === 1 ? '' : '\\end{multicols}'
    texteCorr += nbCols === 1 ? '' : '\\end{multicols}'
  }
  if (context.isHtml) {
    texte = '<div class="my-3">'
    texteCorr = '<div class="my-3">'
    for (
      let rep = 0;
      rep < exercice.autoCorrection[i].propositions.length;
      rep++
    ) {
      if (nbCols > 1 && rep % nbCols === 0) texte += '<br>'
      texte += `<div class="ex${exercice.numeroExercice} ${vertical ? '' : 'inline'} my-2">
      <input type="checkbox" 
        ${!exercice.interactif ? 'disabled' : ''} 
        tabindex="0"
        style="height: 1rem; width: 1rem;"
        class="disabled:cursor-default"  
        id="checkEx${exercice.numeroExercice}Q${i}R${rep}">
      <label id="labelEx${exercice.numeroExercice}Q${i}R${rep}" class="ml-2">${exercice.autoCorrection[i].propositions[rep].texte + espace}</label>
      <div id="feedbackEx${exercice.numeroExercice}Q${i}R${rep}" ${vertical ? '' : 'class="inline"'}></div></div>`
      texteCorr += `<div class="${vertical ? '' : 'inline'}">
      <input type="checkbox" 
        disabled ${exercice.autoCorrection[i].propositions[rep].statut ? 'checked' : ''} 
        tabindex="0"
        style="height: 1rem; width: 1rem;"
        class="disabled:cursor-default"  
      >
      <label id="labelEx${exercice.numeroExercice}Q${i}R${rep}" class="ml-2">${exercice.autoCorrection[i].propositions[rep].texte + espace}</label>
      </div>`
    }
    texte += `</div><div class="m-2" id="resultatCheckEx${exercice.numeroExercice}Q${i}"></div>`
    texteCorr += '</div><div class="m-2"></div>'
  }
  return { texte, texteCorr }
}

/**
 * Lorsque l'évènement 'exercicesAffiches' est lancé par mathalea.js
 * on vérifie la présence du bouton de validation d'id btnValidationEx{i} créé par listeQuestionsToContenu
 * et on y ajoute un listenner pour vérifier les réponses cochées
 * @param {object} exercice
 */
export function exerciceQcm (exercice) {
  document.addEventListener('exercicesAffiches', () => {
    // On vérifie le type si jamais il a été changé après la création du listenner (voir 5R20)
    if (exercice.interactifType === 'qcm') {
      if (context.vue === 'can') {
        gestionCan(exercice)
      }
      const button = document.querySelector(
        `#btnValidationEx${exercice.numeroExercice}-${exercice.id}`
      )
      if (button) {
        if (!button.hasMathaleaListener) {
          button.addEventListener('click', () => {
            let nbQuestionsValidees = 0
            let nbQuestionsNonValidees = 0
            for (let i = 0; i < exercice.autoCorrection.length; i++) {
              const resultat = verifQuestionQcm(exercice, i)
              resultat === 'OK'
                ? nbQuestionsValidees++
                : nbQuestionsNonValidees++
            }
            const uichecks = document.querySelectorAll(
              `.ui.checkbox.ex${exercice.numeroExercice}`
            )
            uichecks.forEach((uicheck) => {
              uicheck.classList.add('read-only')
            })
            button.classList.add('disabled')
            afficheScore(exercice, nbQuestionsValidees, nbQuestionsNonValidees)
          })
          button.hasMathaleaListener = true
        }
      }
    }
  })
}

/**
 * prend un tableau de propositions [{texte: 'prop1', statut: true, feedback: 'Correct !'}, {texte: 'prop2', statut: false, ....}
 * élimine en cas de doublon la proposition fausse ou la deuxième proposition si elle sont toutes les deux fausses.
 * @author Jean-Claude Lhote
 */
export function elimineDoublons (propositions) {
  // fonction qui va éliminer les doublons si il y en a
  let doublonsTrouves = false
  for (let i = 0; i < propositions.length - 1; i++) {
    for (let j = i + 1; j < propositions.length;) {
      if (propositions[i].texte === propositions[j].texte) {
        // les réponses i et j sont les mêmes
        doublonsTrouves = true
        if (propositions[i].statut) {
          // si la réponse i est bonne, on vire la j
          propositions.splice(j, 1)
        } else if (propositions[j].statut) {
          // si la réponse i est mauvaise et la réponse j bonne,
          // comme ce sont les mêmes réponses, on vire la j mais on met la i bonne
          propositions.splice(j, 1)
          propositions[i].statut = true
        } else {
          // Les deux réponses sont mauvaises
          propositions.splice(j, 1)
        }
      } else {
        j++
      }
    }
  }
  return doublonsTrouves
}
