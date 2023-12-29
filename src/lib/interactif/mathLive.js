import { ComputeEngine } from '@cortex-js/compute-engine'
import Grandeur from '../../modules/Grandeur'
import { number } from 'mathjs'
import FractionEtendue from '../../modules/FractionEtendue.js'
import Hms from '../../modules/Hms'
import { texteExposant } from '../outils/ecritures.js'

const engine = new ComputeEngine()
/**
 * Un exemple de fonction de comparaison (celle-ci correspond à 'calcul'
 * retourne true si a === b au sens isSame (canonical) de compute-engine
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export const calculCompare = (a, b) => engine.parse(a).isSame(engine.parse(b))
export const numberCompare = (a, b) => engine.parse(a).isEqual(engine.parse(b))
export const fractionCompare = (a, b) => engine.parse(a).isSame(engine.parse(b))

/**
 * Fonction qui nettoie la saisie de ce qu'il ne devrait pas y avoir.
 * @param {string} saisie normalement une string, mais pour parer aux undefined on cast en string à l'entrée.
 * @returns {string}
 */
function cleanInput (saisie) {
  return String(saisie).replaceAll('\\,', '')
    .replaceAll('{,}', '.')
    .replaceAll(',', '.')
    .replaceAll('²', '^2')
    .replaceAll('^{}', '')
    .replace(/\((\+?-?\d+)\)/, '$1') // Pour les nombres négatifs, supprime les parenthèses
    .replace(/\\left\((\+?-?\d+)\\right\)/, '$1') // Pour les nombres négatifs, supprime les parenthèses
    .replace(/\\lparen(\+?-?\d+)\\rparen/, '$1') // Pour les nombres négatifs, supprime les parenthèses
    .replace(/\\lparen(\+?\+?\d+)\\rparen/, '$1') // Pour les nombres positifs, supprime les parenthèses
    .replaceAll('\\dfrac', '\\frac')
}

export function verifQuestionMathLive (exercice, i, writeResult = true) {
  let saisieParsee, num, den, fSaisie, fReponse
  if (exercice.autoCorrection[i].reponse == null) {
    window.notify('verifQuestionMathlive appelé sur une question sans réponse', {
      exercice,
      question: i,
      autoCorrection: exercice.autoCorrection[i]
    })
  } else {
    if (exercice.autoCorrection[i].reponse.param == null) {
      window.notify('verifQuestionMathlive appelé sur une question sans param', {
        exercice,
        question: i,
        param: exercice.autoCorrection[i].reponse
      })
    } else {
      const formatInteractif = exercice.autoCorrection[i].reponse.param.formatInteractif ?? 'calcul'
      const precision = exercice.autoCorrection[i].reponse.param.precision ?? 0
      const spanReponseLigne = document.querySelector(`#resultatCheckEx${exercice.numeroExercice}Q${i}`)
      // On compare le texte avec la réponse attendue en supprimant les espaces pour les deux
      let reponse, saisie, nombreSaisi, grandeurSaisie, mantisseSaisie, expoSaisi, nombreAttendu, mantisseReponse,
        expoReponse
      let reponses
      let champTexte
      if (formatInteractif !== 'tableauMathlive' && formatInteractif !== 'fillInTheBlank') {
        if (!Array.isArray(exercice.autoCorrection[i].reponse.valeur)) {
          reponses = [exercice.autoCorrection[i].reponse.valeur]
        } else {
          reponses = [...exercice.autoCorrection[i].reponse.valeur]
        }
      } else {
        reponses = exercice.autoCorrection[i].reponse.valeur
      }
      try {
        // Je traîte le cas des tableaux à part : une question pour de multiples inputs mathlive !
        // on pourra faire d'autres formats interactifs sur le même modèle
        if (formatInteractif === 'tableauMathlive') {
          const variables = Object.entries(reponses).filter(([key]) => key !== 'callback' && key !== 'bareme')
          if (reponses.callback != null && typeof reponses.callback === 'function') {
            return reponses.callback(variables, reponses.bareme)
          }
          // Il n'y a pas de callback 'custom' donc on utilise la procédure standard
          const points = []
          let resultat = 'OK'
          let nbBonnesReponses, nbReponses
          const table = document.querySelector(`table#tabMathliveEx${exercice.numeroExercice}Q${i}`)
          if (table == null) {
            window.notify('verifQuestionMathlive: type tableauMathlive ne trouve pas le tableau dans le dom', { selecteur: `table#tabMathliveEx${exercice.numeroExercice}Q${i}` })
            return { resultat: 'KO', feedback: 'Un problème avec cette configuration', score: { nbBonnesReponses: 0, nbReponses: 1 } }
          }
          const cellules = Object.entries(reponses)
          for (let k = 0; k < cellules.length; k++) {
            const [key, reponse] = cellules[k]
            const compareFunction = reponse.compare ?? calculCompare

            const inputs = Array.from(table.querySelectorAll('math-field'))
            const input = inputs.find((el) => el.id === `champTexteEx${exercice.numeroExercice}Q${i}${key}`)
            const spanFedback = table.querySelector(`span#feedbackEx${exercice.numeroExercice}Q${i}${key}`)
            if (compareFunction(cleanInput(input.value), cleanInput(reponse.value))) {
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
          if (typeof reponses.bareme === 'function') {
            [nbBonnesReponses, nbReponses] = reponses.bareme(points)
          } else {
            nbReponses = points.length
            nbBonnesReponses = points.filter(el => el === 1).length
          }
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
            window.notify('verifQuestionMathlive: type fillInTheBlank ne trouve pas le mathfieldElement dans le dom', { selecteur: `math-field#champTexteEx${exercice.numeroExercice}Q${i}` })
            return { isOk: 'KO', feedback: 'Un problème avec cette configuration', score: { nbBonnesReponses: 0, nbReponses: 1 } }
          }
          const variables = Object.entries(reponses).filter(([key]) => key !== 'callback' && key !== 'bareme' && key !== 'feedback')
          if (reponses.callback != null && typeof reponses.callback === 'function') {
            return reponses.callback(variables, reponses.bareme)
          }
          // Il n'y a pas de callback 'custom' donc on utilise la procédure standard
          let resultat = 'OK'
          let nbBonnesReponses, nbReponses
          const points = []
          const saisies = {}
          for (let k = 0; k < variables.length; k++) {
            const [key, reponse] = variables[k]
            const saisie = mfe.getPromptValue(key)
            saisies[key] = cleanInput(saisie)
            const compareFunction = reponse.compare ?? calculCompare
            if (compareFunction(cleanInput(saisie), cleanInput(reponse.value))) {
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
          return { isOk: resultat, feedback: '', score: { nbBonnesReponses, nbReponses } }
        }
        // ici, il n'y a qu'un seul input une seule réponse
        // Ici on va s'occuper de ce champTexte qui pose tant de problèmes
        champTexte = document.getElementById(`champTexteEx${exercice.numeroExercice}Q${i}`)
        if (champTexte != null) {
          if (champTexte.value.length > 0 && typeof exercice.answers === 'object') {
            exercice.answers[`Ex${exercice.numeroExercice}Q${i}`] = champTexte.value
          }
          let resultat = 'KO'
          let feedbackSaisie
          let feedbackCorrection
          let ii = 0
          while ((resultat !== 'OK') && (ii < reponses.length)) {
            reponse = reponses[ii]
            switch (formatInteractif) {
              case 'Num':
                num = parseInt(champTexte.value.replace(',', '.'))
                if (isNaN(num) || num === undefined) num = 9999
                den = reponse.den
                fSaisie = new FractionEtendue(num, den)
                if (fSaisie.isEqual(reponse)) {
                  resultat = 'OK'
                }
                break
              case 'Den':
                den = parseInt(champTexte.value.replace(',', '.'))
                if (isNaN(den) || den === undefined) den = 9999
                num = reponse.num
                fSaisie = new FractionEtendue(num, den)
                if (fSaisie.isEqual(reponse)) {
                  resultat = 'OK'
                }
                break
              case 'calcul':
                // Le format par défaut
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
                } else {
                  if (engine.parse(reponse).isSame(engine.parse(saisie))) { // engine.parse() retourne du canonical par défaut.
                    resultat = 'OK'
                  }
                }
                break
              case 'hms':
                saisie = Hms.fromString(champTexte.value)
                if (saisie.isTheSame(reponse)) {
                  resultat = 'OK'
                }
                break
              case 'formeDeveloppee':
                saisie = champTexte.value.replaceAll(',', '.').replaceAll('^{}', '').replaceAll('²', '^2')
                reponse = reponse.toString().replaceAll(',', '.').replaceAll('dfrac', 'frac')
                saisie = saisie.replace(/\((\+?-?\d+)\)/, '$1') // Pour les nombres négatifs, supprime les parenthèses
                if (!saisie.includes('times') && engine.parse(reponse).canonical.isSame(engine.parse(saisie).canonical)) {
                  resultat = 'OK'
                }
                break
              case 'formeDeveloppeeParEE':
                {
                  saisie = champTexte.value.replaceAll(',', '.').replaceAll('^{}', '').replaceAll('²', '^2')
                  reponse = reponse.toString().replaceAll(',', '.').replaceAll('dfrac', 'frac')
                  saisie = saisie.replace(/\((\+?-?\d+)\)/, '$1') // Pour les nombres négatifs, supprime les parenthèses

                  const regleSuppressionInvisibleOperator = engine.rules([
                    [
                      ['InvisibleOperator', '_x', '_y'],
                      ['Multiply', '_x', '_y']
                    ]
                  ])
                  // EE : Pour mes tests.
                  // console.log('Result :', engine.box(['InvisibleOperator', 7, 'd'], { canonical: false }).replace(regleSuppressionInvisibleOperator).canonical.json)
                  let saisieNonCanonique = engine.box(['CanonicalOrder', engine.parse(saisie, { canonical: false })])
                  saisieNonCanonique = saisieNonCanonique.replace(regleSuppressionInvisibleOperator) ?? saisieNonCanonique
                  let reponseNonCanonique = engine.box(['CanonicalOrder', engine.parse(reponse, { canonical: false })])
                  reponseNonCanonique = reponseNonCanonique.replace(regleSuppressionInvisibleOperator) ?? reponseNonCanonique
                  if (saisieNonCanonique.isSame(reponseNonCanonique)) {
                    resultat = 'OK'
                  }
                }
                break
              case 'nombreDecimal':
                saisie = champTexte.value.replace(',', '.')
                // La réponse est ici arrondie en fonction de reponse.param.decimals
                reponse = Number(reponse.toString().replaceAll(',', '.')).toFixed(exercice.autoCorrection[i].reponse.param.decimals)
                saisie = saisie.replace(/\((\+?-?\d+)\)/, '$1') // Pour les nombres négatifs, supprime les parenthèses
                if (engine.parse(reponse).isSame(engine.parse(saisie))) {
                  resultat = 'OK'
                }
                break
              case 'ecritureScientifique': // Le résultat, pour être considéré correct, devra être saisi en notation scientifique
                saisie = champTexte.value.replace(',', '.')
                if (typeof reponse === 'string') {
                  reponse = reponse.replace(',', '.').replace('{.}', '.')
                }
                if (engine.parse(reponse).canonical.isSame(engine.parse(saisie).canonical)) {
                  saisie = saisie.split('\\times')
                  if (number(saisie[0]) >= 1 && number(saisie[0]) < 10) {
                    resultat = 'OK'
                  }
                }
                break
              case 'texte':
                saisie = champTexte.value
                // console.log({ saisie, reponse}) // EE : NE PAS SUPPRIMER CAR UTILE POUR LE DEBUGGAGE
                if (saisie === reponse) {
                  resultat = 'OK'
                } else if (saisie.replaceAll('\\,', '') === reponse.replaceAll('\\,', '')) {
                  feedbackCorrection = 'Attention aux espaces !'
                }
                break

              case 'texteAvecEspace': // Ici, ce format gère du texte (pas de LaTeX) en association avec le clavier alphanumericAvecEspace
                saisie = champTexte.value
                saisie = saisie.replaceAll('\\:', ' ') // Suppression des espaces LaTeX (présents quand on met des crochets pour les segments)
                saisie = saisie.replaceAll('\\left\\lbrack ', '[').replaceAll('\\right\\rbrack ', ']') // Suppression des crochets LaTeX (pour les segments)
                while (saisie.includes('  ')) saisie = saisie.replace('  ', ' ') // Pour enlever tous les doubles espaces
                saisie = saisie.replaceAll('\\text{', '').replaceAll('}', '').replaceAll('$', '') // Supprimer le \text{....} mis par MathLive
                if (saisie[0] === ' ') saisie = saisie.substring(1, saisie.length) // Supprimer l'eventuel espace en début de ligne
                if (saisie[saisie.length - 1] === ' ') saisie = saisie.substring(0, saisie.length - 1) // Supprimer l'éventuel espace en fin de ligne
                if ((saisie === reponse)) {
                  resultat = 'OK'
                }
                break
              case 'ignorerCasse':
                saisie = champTexte.value
                if (saisie.toLowerCase().replaceAll('\\lparen', '(').replaceAll('\\rparen', ')').replaceAll('\\left(', '(').replaceAll('\\right)', ')') === reponse.toLowerCase()) {
                  resultat = 'OK'
                  // Pour les exercices de simplifications de fraction
                }
                break
              case 'fractionPlusSimple':
                if (reponse instanceof FractionEtendue) {
                  saisie = champTexte.value.replace(',', '.')
                  fReponse = engine.parse(reponse.texFSD.replace('dfrac', 'frac').replaceAll('\\,', ''), { canonical: false })
                  saisieParsee = engine.parse(saisie, { canonical: true })
                  if (saisieParsee.json[0] === 'Rational') {
                    if (saisieParsee.canonical.isSame(fReponse.canonical) && saisieParsee.json[1] && saisieParsee.json[1] < fReponse.json[1] && Number.isInteger(saisieParsee.json[1])) resultat = 'OK'
                  }
                } else {
                  window.notify(`question mathlive de type 'fractionPlusSimple' avec une réponse qui n'est pas une FractionEtendue : ${reponse}`, {
                    exercice,
                    question: i,
                    reponse
                  })
                }
                break
              case 'fractionEgale': // Pour les exercices de calcul où on attend une fraction peu importe son écriture (3/4 ou 300/400 ou 30 000/40 000...)
                // Si l'utilisateur entre un nombre décimal n, on transforme en n/1
                if (reponse instanceof FractionEtendue) {
                  saisie = champTexte.value.replace(',', '.') // On remplace la virgule éventuelle par un point.
                  if (!isNaN(parseFloat(saisie))) {
                    const newFraction = new FractionEtendue(parseFloat(saisie))
                    saisieParsee = engine.parse(`${newFraction.toLatex().replace('dfrac', 'frac')}`).canonical
                  } else {
                    saisieParsee = engine.parse(saisie).canonical
                  }
                  fReponse = engine.parse(reponse.texFSD.replace('dfrac', 'frac').replaceAll('\\,', ''))
                  if (saisieParsee.canonical.isEqual(fReponse.canonical)) resultat = 'OK'
                } else {
                  window.notify(`question mathlive de type 'fractionEgale' avec une réponse qui n'est pas une FractionEtendue : ${reponse}`, {
                    exercice,
                    question: i,
                    reponse
                  })
                }
                break
              case 'fraction': // Pour les exercices où l'on attend un écriture donnée d'une fraction
                if (reponse instanceof FractionEtendue) {
                  saisie = champTexte.value.replaceAll(',', '.')
                  /* Ce code est peut-être joli, mais pédagogiquement c'est nul ! Ici, on veut que l'élève tape exactement la bonne réponse, pas qu'il mette des - inutiles.
                                      if (saisie.includes('-')) {
                                        const nbDeMoins = saisie.match(/-/gm).length
                                        if (nbDeMoins % 2 === 0) { // si l'élève saisi 2/(5-2), sa saisie se voit transformée en -2/52 !
                                          saisie = saisie.replaceAll('-', '')
                                        } else {
                                          saisie = saisie.replaceAll('-', '')
                                          saisie = '-' + saisie
                                        }
                                      }
                                       */
                  if (!saisie.includes('frac')) {
                    if (parseInt(saisie) === reponse.n * reponse.s && reponse.d === 1) resultat = 'OK'
                  } else {
                    saisieParsee = engine.parse(saisie, { canonical: false })
                    fReponse = engine.parse(reponse.texFSD.replace('dfrac', 'frac').replaceAll('\\,', ''), { canonical: false })
                    if (saisieParsee.isEqual(fReponse)) resultat = 'OK'
                  }
                } else {
                  window.notify(`question mathlive de type 'fraction' avec une réponse qui n'est pas une FractionEtendue : ${reponse}`, {
                    exercice,
                    question: i,
                    reponse
                  })
                }
                break
              case 'unites': // Pour les exercices où l'on attend une mesure avec une unité au choix
                saisie = champTexte.value.replace('²', '^2').replace('³', '^3')
                // console.log('saisie : ', saisie) // EE : NE PAS SUPPRIMER CAR UTILE POUR LE DEBUGGAGE
                // console.log('reponse : ', reponse) // EE : NE PAS SUPPRIMER CAR UTILE POUR LE DEBUGGAGE
                grandeurSaisie = saisieToGrandeur(saisie)
                if (grandeurSaisie) {
                  if (grandeurSaisie.estEgal(reponse)) resultat = 'OK'
                  else if (precision && grandeurSaisie.estUneApproximation(reponse, precision)) feedbackCorrection = 'Erreur d\'arrondi.'
                } else {
                  if ((saisie === '') || isNaN(parseFloat(saisie.replace(',', '.')))) {
                    resultat = 'KO'
                  } else {
                    resultat = 'essaieEncoreAvecUneSeuleUnite'
                  }
                }
                break
              case 'intervalleStrict':// Pour les exercice où la saisie doit être dans un intervalle
                saisie = champTexte.value.replace(',', '.')
                nombreSaisi = Number(saisie)
                if (saisie !== '' && nombreSaisi > exercice.autoCorrection[i].reponse.valeur[0] && nombreSaisi < exercice.autoCorrection[i].reponse.valeur[1]) resultat = 'OK'
                break
              case 'intervalle' :
                saisie = champTexte.value.replace(',', '.')
                nombreSaisi = Number(saisie)
                if (saisie !== '' && nombreSaisi >= exercice.autoCorrection[i].reponse.valeur[0] && nombreSaisi <= exercice.autoCorrection[i].reponse.valeur[1]) resultat = 'OK'
                break
              case 'puissance' : {
                saisie = champTexte.value.replace(',', '.')
                // formatOK et formatKO sont deux variables globales,
                // sinon dans le cas où reponses est un tableau, la valeur n'est pas conservée d'un tour de boucle sur l'autre
                // eslint-disable-next-line no-var
                let formatOK
                let formatKO
                if (saisie.indexOf('^') !== -1) {
                  nombreSaisi = saisie.split('^')
                  mantisseSaisie = nombreSaisi[0]
                  expoSaisi = nombreSaisi[1] ? nombreSaisi[1].replace(/[{}]/g, '') : ''
                  nombreAttendu = reponse.split('^')
                  mantisseReponse = nombreAttendu[0]
                  expoReponse = nombreAttendu[1] ? nombreAttendu[1].replace(/[{}]/g, '') : ''
                  if (mantisseReponse === mantisseSaisie && expoReponse === expoSaisi) {
                    formatOK = true
                  }
                  // gérer le cas mantisse négative a et exposant impair e, -a^e est correct mais pas du format attendu
                  // si la mantisse attendue est négative on nettoie la chaine des parenthèses
                  if (parseInt(mantisseReponse.replace(/[()]/g, '')) < 0 && parseInt(expoReponse) % 2 === 1) {
                    if ((saisie === `${mantisseReponse.replace(/[()]/g, '')}^{${expoReponse}}`) || (saisie === `${mantisseReponse.replace(/[()]/g, '')}^${expoReponse}`)) {
                      formatKO = true
                    }
                  }
                  // si l'exposant est négatif, il se peut qu'on ait une puissance au dénominateur
                  if (parseInt(expoReponse) < 0) {
                    // Si la mantisse est positive
                    if ((saisie === `\\frac{1}{${parseInt(mantisseReponse)}^{${-expoReponse}}`) || (saisie === `\\frac{1}{${parseInt(mantisseReponse)}^${-expoReponse}}`)) {
                      formatKO = true
                    }
                  }
                } else {
                  // Dans tous ces cas on est sûr que le format n'est pas bon
                  // Toutefois la valeur peut l'être donc on vérifie
                  nombreSaisi = saisie
                  nombreAttendu = reponse.split('^')
                  mantisseReponse = nombreAttendu[0]
                  expoReponse = nombreAttendu[1] ? nombreAttendu[1].replace(/[{}]/g, '') : ''
                  if (parseInt(expoReponse) < 0) {
                    // Si la mantisse est positive
                    if (nombreSaisi === `\\frac{1}{${mantisseReponse ** (-expoReponse)}}`) {
                      formatKO = true
                    }
                    // Si elle est négative, le signe - peut être devant la fraction ou au numérateur  ou au dénominateur
                    if (parseInt(mantisseReponse.replace(/[()]/g, '')) < 0 && ((parseInt(-expoReponse)) % 2 === 1)) {
                      if ((nombreSaisi === `-\\frac{1}{${((-1) * parseInt(mantisseReponse.replace(/[()]/g, ''))) ** (parseInt(-expoReponse))}}`) || (nombreSaisi === `\\frac{-1}{${((-1) * parseInt(mantisseReponse.replace(/[()]/g, ''))) ** (parseInt(-expoReponse))}}`) || (nombreSaisi === `\\frac{1}{-${((-1) * parseInt(mantisseReponse.replace(/[()]/g, ''))) ** (parseInt(-expoReponse))}}`)) {
                        formatKO = true
                      }
                    }
                  } else if (parseInt(expoReponse) > 0) {
                    if (nombreSaisi === `${mantisseReponse ** (parseInt(expoReponse))}`) {
                      if (expoReponse !== '1') formatKO = true
                      else formatOK = true // Au cas où l'exposant soit 1
                    }
                  }
                  if (parseInt(expoReponse) === 0) {
                    if (nombreSaisi === '1') {
                      formatKO = true
                    }
                  }
                }
                if (formatOK) {
                  resultat = 'OK'
                } else if (formatKO) {
                  resultat = 'essaieEncorePuissance'
                }
              }
                break
            }
            ii++
          }
          spanReponseLigne.innerHTML = ''
          if (resultat === 'OK' && writeResult) {
            spanReponseLigne.innerHTML = '😎'
            spanReponseLigne.style.fontSize = 'large'
            champTexte.readOnly = true
          } else if (resultat === 'essaieEncoreAvecUneSeuleUnite') {
            spanReponseLigne.innerHTML = '<em>Il faut saisir une valeur numérique et une seule unité (' +
                  (reponse.uniteDeReference.indexOf('^') > 0
                    ? reponse.uniteDeReference.split('^')[0] + texteExposant(reponse.uniteDeReference.split('^')[1])
                    : reponse.uniteDeReference) +
                  ' par exemple).</em>'
            spanReponseLigne.style.color = '#f15929'
            spanReponseLigne.style.fontWeight = 'bold'
            // statut = 'wait'
          } else if (resultat === 'essaieEncorePuissance') {
            spanReponseLigne.innerHTML = '<br><em>Attention, la réponse est mathématiquement correcte mais n\'a pas le format demandé.</em>'
            spanReponseLigne.style.color = '#f15929'
            spanReponseLigne.style.fontWeight = 'bold'
          } else if (writeResult) {
            spanReponseLigne.innerHTML = '☹️'
            spanReponseLigne.style.fontSize = 'large'
            champTexte.readOnly = true
          }
          if (feedbackSaisie) spanReponseLigne.innerHTML += `<span style="margin-left: 10px">${feedbackSaisie}</span>`
          if (feedbackCorrection && writeResult) spanReponseLigne.innerHTML += `<span style="margin-left: 10px">${feedbackCorrection}</span>`
          return { resultat, feedback: '', score: { nbBonnesReponses: resultat === 'OK' ? 1 : 0, nbReponses: 1 } }
        } else {
          window.notify(`l'exercice appelle verifQuestionMathlive, mais l'input mathlive champTexteEx${exercice.numeroExercice}Q${i} n'a pas été trouvé`, { exercice: JSON.stringify(exercice) })
          return { resultat: 'KO', feedback: 'contacter les auteurs pour signaler le problème', score: { nbBonnesReponses: 0, nbReponses: 0 } }
        }
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
  }
}
function saisieToGrandeur (saisie) {
  if (saisie.indexOf('°') > 0) {
    const split = saisie.split('°')
    return new Grandeur(parseFloat(split[0].replace(',', '.')), '°')
  }
  if (saisie.split('operatorname').length !== 2) {
    return false
  } else {
    const split = saisie.split('\\operatorname{')
    const mesure = parseFloat(split[0].replace(',', '.'))
    if (split[1]) {
      const split2 = split[1].split('}')
      const unite = split2[0] + split2[1]
      return new Grandeur(mesure, unite)
    } else {
      return false
    }
  }
}
// # sourceMappingURL=mathLive.js.map
