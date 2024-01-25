import { texteExposant } from '../outils/ecritures'
import { calculCompare } from './comparaisonFonctions'

export function toutPourUnPoint (listePoints) {
  return [Math.min(...listePoints), 1]
}

/**
 * fonction générale de vérification qui utilise le contenu de exercice.autoCorrection pour comparer la saisie utilisateur avec la réponse attendue
 * @param {Exercice} exercice
 * @param {number} i
 * @param {boolean} writeResult
 * @returns {{feedback: string, score: {nbBonnesReponses: (number|number), nbReponses: (number|number)}, isOk: string}|{feedback: string, score: {nbBonnesReponses: number, nbReponses: number}, resultat: string}|{feedback: string, score: {nbBonnesReponses: number, nbReponses: number}, isOk: string}|*|{feedback: string, score: {nbBonnesReponses: (number), nbReponses: number}, resultat: string}}
 */
export function verifQuestionMathLive (exercice, i, writeResult = true) {
  if (exercice.autoCorrection[i].reponse == null) {
    throw Error(`verifQuestionMathlive appelé sur une question sans réponse: ${JSON.stringify({
            exercice,
            question: i,
            autoCorrection: exercice.autoCorrection[i]
        })}`)
  } else if (exercice.autoCorrection[i].reponse.param == null) {
    throw Error(`verifQuestionMathlive appelé sur une question sans param : ${JSON.stringify({
            exercice,
            question: i,
            param: exercice.autoCorrection[i].reponse
        })}`)
  }
  const formatInteractif = exercice.autoCorrection[i].reponse.param.formatInteractif ?? 'calcul'
  const spanReponseLigne = document.querySelector(`#resultatCheckEx${exercice.numeroExercice}Q${i}`)
  // On compare le texte avec la réponse attendue en supprimant les espaces pour les deux
  let champTexte
  let reponses = exercice.autoCorrection[i].reponse.valeur
  const bareme = reponses.bareme ?? toutPourUnPoint
  const callback = reponses.callback
  try {
    const variables = Object.entries(reponses).filter(([key]) => key !== 'callback' && key !== 'bareme' && key !== 'feedback')
    if (callback != null && typeof callback === 'function') { // Là c'est une correction custom ! Celui qui passe une callback doit savoir ce qu'il fait !
      return callback(exercice, i, variables, reponses.bareme)
    }
    // Je traîte le cas des tableaux à part : une question pour de multiples inputs mathlive !
    // on pourra faire d'autres formats interactifs sur le même modèle
    if (formatInteractif === 'tableauMathlive') {
      const points = []
      let resultat = 'OK'
      const table = document.querySelector(`table#tabMathliveEx${exercice.numeroExercice}Q${i}`)
      if (table == null) {
        throw Error('verifQuestionMathlive: type tableauMathlive ne trouve pas le tableau dans le dom' + JSON.stringify({ selecteur: `table#tabMathliveEx${exercice.numeroExercice}Q${i}` }))
      }
      const cellules = Object.entries(reponses).filter(([key]) => key.match(/L\dC\d/) != null)
      for (let k = 0; k < cellules.length; k++) {
        const [key, reponse] = cellules[k]
        const compareFunction = reponse.compare ?? calculCompare
        const inputs = Array.from(table.querySelectorAll('math-field'))
        const input = inputs.find((el) => el.id === `champTexteEx${exercice.numeroExercice}Q${i}${key}`)
        const spanFedback = table.querySelector(`span#feedbackEx${exercice.numeroExercice}Q${i}${key}`)
        // On ne nettoie plus les input et les réponses, c'est la fonction de comparaison qui doit s'en charger !
        const result = compareFunction(input.value, reponse.value)
        if (result.isOk) {
          points.push(1)
          spanFedback.innerHTML = '😎'
        } else {
          points.push(0)
          resultat = 'KO'
          spanFedback.innerHTML = '☹️'
        }
        if (input.value.length > 0 && typeof exercice.answers === 'object') {
          exercice.answers[`Ex${exercice.numeroExercice}Q${i}${key}`] = input.value
        }
      }

      const [nbBonnesReponses, nbReponses] = bareme(points)
      return { isOk: resultat, feedback: '', score: { nbBonnesReponses, nbReponses } }
    }
    if (formatInteractif === 'fillInTheBlank') {
      // Le format fillInTheBlank requiert une "reponse" avec le format objet.
      // cet objet contient des propriétés (autant que de blancs, et ont le même nom que les blancs créés avec la fonction remplisLesBlanc())
      // chaque propriété a une valeur : de la forme {value: string, compare: ComparaisonFonction} c'est la valeur attendue et sa méthode de comparaison facultatitve
      // La reponse pourrait contenir aussi une propriété callback facultative (non implémenté pour l'instant car pas de besoin)
      // c'est une fonction qui serait utilisée à la place de la procédure normale de traitement ci-dessous
      // en fait ce serait la fonction de correctionInteractive 'custom' qui se trouverait avant dans l'exo et qui permet, par exemple, de réaliser des traitements spéciaux
      const mfe = document.querySelector(`math-field#champTexteEx${exercice.numeroExercice}Q${i}`)
      if (mfe == null) {
        throw Error('verifQuestionMathlive: type fillInTheBlank ne trouve pas le mathfieldElement dans le dom : ' + JSON.stringify({ selecteur: `math-field#champTexteEx${exercice.numeroExercice}Q${i}` }))
      }
      let resultat = 'OK'
      let nbBonnesReponses, nbReponses
      const points = []
      const saisies = {}
      let feedback = ''
      for (let k = 0; k < variables.length; k++) {
        const [key, reponse] = variables[k]
        if (key === 'feedback' || key === 'bareme') continue
        const saisie = mfe.getPromptValue(key)
        saisies[key] = saisie
        const compareFunction = reponse.compare ?? calculCompare
        // On ne nettoie plus les input et les réponses, c'est la fonction de comparaison qui doit s'en charger !
        const result = compareFunction(saisie, reponse.value)
        if (result.isOk) {
          points.push(1)
          mfe.setPromptState(key, 'correct', true)
        } else {
          points.push(0)
          resultat = 'KO'
          mfe.setPromptState(key, 'incorrect', true)
        }
        if (result.feedback != null) feedback += result.feedback
      }
      if (typeof reponses.feedback === 'function') {
        feedback += reponses.feedback(saisies)
        const spanFeedback = document.querySelector(`#feedbackEx${exercice.numeroExercice}Q${i}`)
        if (feedback != null && spanFeedback != null) {
          spanFeedback.innerHTML = '💡 ' + feedback
          spanFeedback.classList.add('py-2', 'italic', 'text-coopmaths-warn-darkest', 'dark:text-coopmathsdark-warn-darkest')
        }
      }
      if (typeof reponses.bareme === 'function') {
        [nbBonnesReponses, nbReponses] = reponses.bareme(points)
      } else {
        nbReponses = points.length
        nbBonnesReponses = points.filter(el => el === 1).length
      }
      if (mfe.getValue().length > 0 && typeof exercice.answers === 'object') {
        exercice.answers[`Ex${exercice.numeroExercice}Q${i}`] = mfe.getValue()
      }
      if (spanReponseLigne != null) {
        spanReponseLigne.innerHTML = nbBonnesReponses === nbReponses ? '😎' : '☹️'
      }
      // le feedback est déjà assuré par la fonction feedback(), donc on le met à ''
      return { isOk: resultat, feedback, score: { nbBonnesReponses, nbReponses } }
    }
    // ici, il n'y a qu'un seul input une seule saisie (même si la réponse peut contenir des variantes qui seront toutes comparées à la saisie
    champTexte = document.getElementById(`champTexteEx${exercice.numeroExercice}Q${i}`)
    if (champTexte == null) {
      throw Error('verifQuestionMathlive: type tableauMathlive ne trouve pas le champ de saisie dans le dom' + JSON.stringify({ selecteur: `table#tabMathliveEx${exercice.numeroExercice}Q${i}` }))
    }
    if (champTexte.value.length > 0 && typeof exercice.answers === 'object') {
      exercice.answers[`Ex${exercice.numeroExercice}Q${i}`] = champTexte.value
    }
    const saisie = champTexte.value
    let resultat = 'KO'
    let ii = 0
    let reponse, feedback
    reponses = reponses.reponse
    const compare = reponses.compare ?? calculCompare
    if (Array.isArray(reponses.value)) {
      while ((resultat !== 'OK') && (ii < reponses.value.length)) {
        reponse = reponses.value[ii]
        const check = compare(saisie, reponse)
        if (check.isOk) {
          resultat = 'OK'
          feedback = ''
          break
        } else if (check.feedback) {
          feedback = check.feedback
        }
        ii++
      }
    } else {
      reponse = reponses.value
      const check = compare(saisie, reponse)
      if (check.isOk) {
        resultat = 'OK'
        feedback = ''
      } else if (check.feedback) {
        feedback = check.feedback
      }
    }
    spanReponseLigne.innerHTML = ''
    if (resultat === 'OK' && writeResult) {
      spanReponseLigne.innerHTML = '😎'
      spanReponseLigne.style.fontSize = 'large'
      champTexte.readOnly = true
      return { resultat, feedback, score: { nbBonnesReponses: 1, nbReponses: 1 } }
    }
    if (resultat.includes('essaieEncore')) {
      if (resultat === 'essaieEncoreAvecUneSeuleUnite') {
        feedback = '<em>Il faut saisir une valeur numérique et une seule unité (' +
                    (reponse.uniteDeReference.indexOf('^') > 0
                      ? reponse.uniteDeReference.split('^')[0] + texteExposant(reponse.uniteDeReference.split('^')[1])
                      : reponse.uniteDeReference) +
                    ' par exemple).</em>'
      }
      if (resultat === 'essaieEncorePuissance') {
        feedback = '<em>Attention, la réponse est mathématiquement correcte mais n\'a pas le format demandé.</em>'
      }
      return { resultat, feedback, score: { nbBonnesReponses: 0, nbReponses: 1 } }
    }
    if (writeResult) {
      spanReponseLigne.innerHTML = '☹️'
      spanReponseLigne.style.fontSize = 'large'
      champTexte.readOnly = true
      return { resultat, feedback: '', score: { nbBonnesReponses: 0, nbReponses: 1 } }
    }
    return { resultat, feedback: '', score: { nbBonnesReponses: resultat === 'OK' ? 1 : 0, nbReponses: 1 } }
  } catch (error) {
    window.notify(`Erreur dans verif QuestionMathLive : ${error}\n Avec les métadonnées : `, {
      champTexteValue: champTexte?._slotValue ?? null,
      exercice: exercice.id,
      i,
      autoCorrection: exercice.autoCorrection[i],
      formatInteractif,
      spanReponseLigne
    })
    return { resultat: 'KO', feedback: 'erreur dans le programme', score: { nbBonnesReponses: 0, nbReponses: 1 } }
  }
}

// # sourceMappingURL=mathLive.js.map
