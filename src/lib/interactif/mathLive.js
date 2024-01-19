import { texteExposant } from '../outils/ecritures.js'
import { calculCompare, cleanStringBeforeParse } from './comparaisonFonctions'

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
    throw Error(`verifQuestionMathlive appelé sur une question sans réponse: ${JSON.strignify({
            exercice,
            question: i,
            autoCorrection: exercice.autoCorrection[i]
        })}`)
  } else if (exercice.autoCorrection[i].reponse.param == null) {
    throw Error(`verifQuestionMathlive appelé sur une question sans param : ${JSON.strignify({
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
    const variables = Object.entries(reponses).filter(([key]) => key !== 'callback' && key !== 'bareme')
    if (callback != null && typeof callback === 'function') { // Là c'est une correction custom ! Celui qui passe une callback doit savoir ce qu'il fait !
      return callback(variables, reponses.bareme)
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
      const cellules = Object.entries(reponses)
      for (let k = 0; k < cellules.length; k++) {
        const [key, reponse] = cellules[k]
        const compareFunction = reponse.compare ?? calculCompare

        const inputs = Array.from(table.querySelectorAll('math-field'))
        const input = inputs.find((el) => el.id === `champTexteEx${exercice.numeroExercice}Q${i}${key}`)
        const spanFedback = table.querySelector(`span#feedbackEx${exercice.numeroExercice}Q${i}${key}`)
        if (compareFunction(cleanStringBeforeParse(input.value), cleanStringBeforeParse(reponse.value))) {
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
      // chaque propriété a une valeur : c'est la valeur attendue.
      // Pour l'instant, cette valeur est comparée sous sa forme canonique à la forme canonique de la saisie élève avec isEqual() donc garantissant un true pour des valeurs numériques égales
      // Il faudra réfléchir à une façon de choisir la fonction de comparaison...
      // La reponse peut contenir aussi une propriété callback facultative.
      // c'est une fonction qui sera utilisée à la place de la procédure normale de traitement
      // en fait c'est la fonction de correctionInteractive qui se trouvait avant dans l'exo et qui permet, par exemple, de pondérer les points.
      const mfe = document.querySelector(`math-field#champTexteEx${exercice.numeroExercice}Q${i}`)
      if (mfe == null) {
        throw Error('verifQuestionMathlive: type fillInTheBlank ne trouve pas le mathfieldElement dans le dom : ' + JSON.stringify({ selecteur: `math-field#champTexteEx${exercice.numeroExercice}Q${i}` }))
      }
      let resultat = 'OK'
      let nbBonnesReponses, nbReponses
      const points = []
      const saisies = {}
      for (let k = 0; k < variables.length; k++) {
        const [key, reponse] = variables[k]
        if (key === 'feedback' || key === 'bareme') continue
        const saisie = mfe.getPromptValue(key)
        saisies[key] = cleanStringBeforeParse(saisie)
        const compareFunction = reponse.compare ?? calculCompare
        if (compareFunction(cleanStringBeforeParse(saisie), cleanStringBeforeParse(reponse.value))) {
          points.push(1)
          mfe.setPromptState(key, 'correct', true)
        } else {
          points.push(0)
          resultat = 'KO'
          mfe.setPromptState(key, 'incorrect', true)
        }
      }
      if (typeof reponses.feedback === 'function') {
        const feedback = reponses.feedback(saisies)
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
      return { isOk: resultat, feedback: '', score: { nbBonnesReponses, nbReponses } }
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
/*
case 'canonicalAdd':
// Inventée pour 3L10, 3L10-1 et 3L11 en attendant handleAnswer
saisie = champTexte.value.replaceAll(',', '.') // EE : Le All est nécessaire pour l'usage du clavier spécial 6ème
// La réponse est transformée en chaine compatible avec engine.parse()
reponse = reponse.toString().replaceAll(',', '.').replaceAll('dfrac', 'frac')
saisie = saisie.replaceAll('²', '^2')
saisie = saisie.replaceAll('^{}', '')
saisie = saisie.replace(/\((\+?-?\d+)\)/, '$1') // Pour les nombres négatifs, supprime les parenthèses
saisie = saisie.replace(/\\left\((\+?-?\d+)\\right\)/, '$1') // Pour les nombres négatifs, supprime les parenthèses
saisie = saisie.replace(/\\lparen(\+?-?\d+)\\rparen/, '$1') // Pour les nombres négatifs, supprime les parenthèses
saisie = saisie.replace(/\\lparen(\+?\+?\d+)\\rparen/, '$1') // Pour les nombres positifs, supprime les parenthèses
if (!isNaN(reponse)) {
  if (saisie !== '' && Number(saisie) === Number(reponse)) {
    resultat = 'OK'
  }
} else if (saisie === '') {
  resultat = 'KO'
} else {
  if (engine.parse(reponse, { canonical: ['InvisibleOperator', 'Multiply', 'Number', 'Add', 'Flatten', 'Order'] }).isSame(engine.parse(saisie, { canonical: ['InvisibleOperator', 'Multiply', 'Number', 'Add', 'Flatten', 'Order'] }))) { // engine.parse() retourne du canonical par défaut.
    resultat = 'OK'
  }
}
 */
