import { calculCompare } from './comparisonFunctions'

export function toutPourUnPoint (listePoints) {
  return [Math.min(...listePoints), 1]
}

/**
 * fonction générale de vérification qui utilise le contenu de exercice.autoCorrection pour comparer la saisie utilisateur avec la réponse attendue
 * @param {Exercice} exercice
 * @param {number} i
 * @param {boolean} writeResult // inutilisé ! toujours true ! @fixme à quoi sert cette variable ??? JCL le 5/03/2024
 * @returns {{feedback: string, score: {nbBonnesReponses: (number|number), nbReponses: (number|number)}, isOk: string}|{feedback: string, score: {nbBonnesReponses: number, nbReponses: number}, resultat: string}|{feedback: string, score: {nbBonnesReponses: number, nbReponses: number}, isOk: string}|*|{feedback: string, score: {nbBonnesReponses: (number), nbReponses: number}, resultat: string}}
 */
export function verifQuestionMathLive (exercice, i, writeResult = true) {
  console.log(i)
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
  const formatInteractif = exercice.autoCorrection[i].reponse.param.formatInteractif ?? 'mathlive'
  const spanReponseLigne = document.querySelector(`#resultatCheckEx${exercice.numeroExercice}Q${i}`)
  // On compare le texte avec la réponse attendue en supprimant les espaces pour les deux
  let champTexte
  let reponses = exercice.autoCorrection[i].reponse.valeur
  const bareme = reponses.bareme ?? toutPourUnPoint
  const callback = reponses.callback
  try {
    const variables = Object.entries(reponses).filter(([key]) => key !== 'callback' && key !== 'bareme' && key !== 'feedback')
    // console.log(`reponses entrie 0 : ${variables[0]} et variables[0][0] : ${variables[0][0]}`)
    if (callback != null && typeof callback === 'function') { // Là c'est une correction custom ! Celui qui passe une callback doit savoir ce qu'il fait !
      return callback(exercice, i, variables, reponses.bareme)
    }
    if (variables.length > 1 || variables[0][0] !== 'reponse') {
      if (variables[0][0].match(/L\dC\d/)) {
        // Je traîte le cas des tableaux à part : une question pour de multiples inputs mathlive !
        // on pourra faire d'autres formats interactifs sur le même modèle
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
          const spanFedback = table.querySelector(`span#resultatCheckEx${exercice.numeroExercice}Q${i}${key}`)
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
      } else {
        if (variables[0][0].match(/champ\d/) || formatInteractif === 'fillInTheBlank') { // on n'aurait plus besoin de formatInteractif si on respecte la convention de nommage champ1, champ2...
          // Le format fillInTheBlank requiert un "objetReponse" avec le format objet.
          // cet objet contient des propriétés (autant que de blancs, et ont le même nom que les blancs créés avec la fonction remplisLesBlanc())
          // chaque propriété a une valeur : de la forme {value: string, compare: ComparaisonFonction} c'est la valeur attendue et sa méthode de comparaison facultatitve
          // La reponse pourrait contenir aussi une propriété callback facultative (non implémenté pour l'instant car pas de besoin)
          // c'est une fonction qui serait utilisée à la place de la procédure normale de traitement ci-dessous
          // en fait ce serait la fonction de correctionInteractive 'custom' qui se trouverait avant dans l'exo et qui permet, par exemple, de réaliser des traitements spéciaux
          const mfe = document.querySelector(`math-field#champTexteEx${exercice.numeroExercice}Q${i}`)
          if (mfe == null) {
            throw Error('verifQuestionMathlive: type fillInTheBlank ne trouve pas le mathfieldElement dans le dom : ' + JSON.stringify({ selecteur: `math-field#champTexteEx${exercice.numeroExercice}Q${i}` }))
          }
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
              mfe.setPromptState(key, 'incorrect', true)
            }
            mfe.classList.add('corrected')
            if (result.feedback != null) feedback += result.feedback
          }
          if (typeof reponses.feedback === 'function') {
            feedback += reponses.feedback(saisies)
            const spanFeedback = document.querySelector(`#feedbackEx${exercice.numeroExercice}Q${i}`)
            if (feedback != null && spanFeedback != null && feedback.length > 0) {
              spanFeedback.innerHTML = '💡 ' + feedback
              spanFeedback.classList.add('py-2', 'italic', 'text-coopmaths-warn-darkest', 'dark:text-coopmathsdark-warn-darkest')
            }
          }
          const [nbBonnesReponses, nbReponses] = bareme(points)
          if (mfe.getValue().length > 0 && typeof exercice.answers === 'object') {
            /*    const prompts = mfe.getPrompts()
            const answers = []
            for (const prompt of prompts) {
              answers.push([prompt, mfe.getPromptValue(prompt)])
            }
            exercice.answers[`Ex${exercice.numeroExercice}Q${i}`] = Object.assign({}, Object.fromEntries(answers))
         */
            exercice.answers[`Ex${exercice.numeroExercice}Q${i}`] = mfe.getValue()
          }
          if (spanReponseLigne != null) {
            spanReponseLigne.innerHTML = nbBonnesReponses === nbReponses ? '😎' : '☹️'
          }
          // le feedback est déjà assuré par la fonction feedback(), donc on le met à ''
          return { isOk: nbBonnesReponses === nbReponses, feedback, score: { nbBonnesReponses, nbReponses } }
        }
      }
    }
    // ici, il n'y a qu'un seul input une seule saisie (même si la réponse peut contenir des variantes qui seront toutes comparées à la saisie
    champTexte = document.getElementById(`champTexteEx${exercice.numeroExercice}Q${i}`)
    if (champTexte == null) {
      throw Error(`verifQuestionMathlive: type ${formatInteractif} ne trouve pas le champ de saisie dans le dom ${JSON.stringify({ selecteur: 'champTexteEx' + String(exercice.numeroExercice) + 'Q' + String(i) })}`)
    }
    if (champTexte.value.length > 0 && typeof exercice.answers === 'object') {
      exercice.answers[`Ex${exercice.numeroExercice}Q${i}`] = champTexte.value
    }
    const saisie = champTexte.value
    let isOk = false
    let ii = 0
    let reponse, feedback
    reponses = reponses.reponse
    const compare = reponses.compare ?? calculCompare
    if (Array.isArray(reponses.value)) {
      while ((!isOk) && (ii < reponses.value.length)) {
        reponse = reponses.value[ii]
        const check = compare(saisie, reponse)
        if (check.isOk) {
          isOk = true
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
        isOk = true
        feedback = check.feedback ?? ''
      } else if (check.feedback) {
        feedback = check.feedback
      }
    }
    spanReponseLigne.innerHTML = ''
    if (isOk) {
      spanReponseLigne.innerHTML = '😎'
      spanReponseLigne.style.fontSize = 'large'
      champTexte.readOnly = true
      return { isOk, feedback, score: { nbBonnesReponses: 1, nbReponses: 1 } }
    }
    /** // ce code n'a jamais été utilisé. Peut-être un jour si le moteur permet un deuxième essai
    if (feedback.includes('essaieEncore')) {
      if (feedback === 'essaieEncoreAvecUneSeuleUnite') {
        feedback = '<em>Il faut saisir une valeur numérique et une seule unité (' +
                    (reponse.uniteDeReference.indexOf('^') > 0
                      ? reponse.uniteDeReference.split('^')[0] + texteExposant(reponse.uniteDeReference.split('^')[1])
                      : reponse.uniteDeReference) +
                    ' par exemple).</em>'
      }
      if (feedback === 'essaieEncorePuissance') {
        feedback = '<em>Attention, la réponse est mathématiquement correcte mais n\'a pas le format demandé.</em>'
      }
      return { isOk, feedback, score: { nbBonnesReponses: 0, nbReponses: 1 } }
    }
      */
    if (writeResult) {
      spanReponseLigne.innerHTML = '☹️'
      spanReponseLigne.style.fontSize = 'large'
      champTexte.readOnly = true
      return { isOk, feedback, score: { nbBonnesReponses: 0, nbReponses: 1 } }
    }
    return { isOk, feedback, score: { nbBonnesReponses: isOk ? 1 : 0, nbReponses: 1 } } // ce code n'est jamais exécuté vu que writeResult est toujours true
  } catch (error) {
    window.notify(`Erreur dans verif QuestionMathLive : ${error}\n Avec les métadonnées : `, {
      champTexteValue: champTexte?._slotValue ?? null,
      exercice: exercice.id,
      i,
      autoCorrection: exercice.autoCorrection[i],
      formatInteractif,
      spanReponseLigne
    })
    return { isOk: false, feedback: 'erreur dans le programme', score: { nbBonnesReponses: 0, nbReponses: 1 } }
  }
}

// # sourceMappingURL=mathLive.js.map
