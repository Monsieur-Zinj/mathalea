import { addElement, get, setStyles } from '../html/dom'
import { verifQuestionMathLive } from './mathLive.js'
import { verifQuestionQcm } from './qcm'
import { verifQuestionListeDeroulante } from './questionListeDeroulante'
import FractionEtendue from '../../modules/FractionEtendue.js'
import Grandeur from '../../modules/Grandeur'

/**
 *
 * @param {Exercice} exercice
 * @param {HTMLDivElement} divScore
 * @param {HTMLButtonElement} buttonScore
 * @returns {{numberOfPoints: number, numberOfQuestions: number}}
 */
export function exerciceInteractif (exercice /** Exercice */, divScore /** HTMLDivElement */, buttonScore /** HTMLButtonElement */) {
  exercice.answers = {}
  if (exercice.interactifType === 'mathLive') return verifExerciceMathLive(exercice, divScore, buttonScore)
  if (exercice.interactifType === 'qcm') return verifExerciceQcm(exercice, divScore, buttonScore)
  if (exercice.interactifType === 'listeDeroulante') return verifExerciceListeDeroulante(exercice, divScore, buttonScore)
  if (exercice.interactifType === 'cliqueFigure') return verifExerciceCliqueFigure(exercice, divScore, buttonScore)
  // Pour les exercices de type custom, on appelle la méthode correctionInteractive() définie dans l'exercice
  if (exercice.interactifType === 'custom') return verifExerciceCustom(exercice, divScore, buttonScore)
  //  if (exercice.interactifType === undefined) exerciceNonInteractif(exercice)
  // Il faudra gérer ces exercices non interactifs qui pourraient apparaitre dans une évaluation
  if (exercice.interactifType === 'qcm_mathLive') return verifExerciceQcmMathLive(exercice, divScore, buttonScore)
}

function verifExerciceQcmMathLive (exercice /** Exercice */, divScore /** HTMLDivElement */, divButton /** HTMLButtonElement */) {
  // On vérifie le type si jamais il a été changé après la création du listenner (voir 5R20)
  let nbQuestionsValidees = 0
  let nbQuestionsNonValidees = 0
  exercice.answers = {}
  for (let i = 0; i < exercice.autoCorrection.length; i++) {
    if (exercice?.autoCorrection[i]?.propositions === undefined) {
      // mathlive
      const resultat = verifQuestionMathLive(exercice, i)
      nbQuestionsValidees += resultat.score.nbBonnesReponses
      nbQuestionsNonValidees += resultat.score.nbReponses - resultat.score.nbBonnesReponses
    } else {
      // qcm
      const resultat = verifQuestionQcm(exercice, i)
      resultat === 'OK' ? nbQuestionsValidees++ : nbQuestionsNonValidees++
    }
  }
  const uichecks = document.querySelectorAll(`.ui.checkbox.ex${exercice.numeroExercice}`)
  uichecks.forEach(function (uicheck) {
    uicheck.classList.add('read-only')
  })
  return afficheScore(exercice, nbQuestionsValidees, nbQuestionsNonValidees, divScore, divButton)
}

function verifExerciceMathLive (exercice /** Exercice */, divScore /** HTMLDivElement */, divButton /** HTMLButtonElement */) {
  let nbBonnesReponses = 0
  let nbMauvaisesReponses = 0
  const besoinDe2eEssai = false
  let resultat
  for (const i in exercice.autoCorrection) {
    resultat = verifQuestionMathLive(exercice, i)
    nbBonnesReponses += resultat.score.nbBonnesReponses
    nbMauvaisesReponses += resultat.score.nbReponses - resultat.score.nbBonnesReponses // Il reste à gérer le 2e essai
  }
  if (!besoinDe2eEssai) {
    return afficheScore(exercice, nbBonnesReponses, nbMauvaisesReponses, divScore, divButton)
  }
}

function verifExerciceQcm (exercice /** Exercice */, divScore /** HTMLDivElement */, divButton /** HTMLButtonElement */) {
  // On vérifie le type si jamais il a été changé après la création du listenner (voir 5R20)
  let nbQuestionsValidees = 0
  let nbQuestionsNonValidees = 0
  exercice.answers = {}
  for (let i = 0; i < exercice.autoCorrection.length; i++) {
    const resultat = verifQuestionQcm(exercice, i)
    resultat === 'OK' ? nbQuestionsValidees++ : nbQuestionsNonValidees++
  }
  const uichecks = document.querySelectorAll(`.ui.checkbox.ex${exercice.numeroExercice}`)
  uichecks.forEach(function (uicheck) {
    uicheck.classList.add('read-only')
  })
  return afficheScore(exercice, nbQuestionsValidees, nbQuestionsNonValidees, divScore, divButton)
}

function verifExerciceListeDeroulante (exercice /** Exercice */, divScore /** HTMLDivElement */, divButton /** HTMLButtonElement */) {
  let nbQuestionsValidees = 0
  let nbQuestionsNonValidees = 0
  const selects = document.querySelectorAll(`select[id^="ex${exercice.numeroExercice}"]`)
  selects.forEach(function (select) {
    select.disabled = true
  })
  for (let i = 0; i < exercice.autoCorrection.length; i++) {
    const resultat = verifQuestionListeDeroulante(exercice, i)
    resultat === 'OK' ? nbQuestionsValidees++ : nbQuestionsNonValidees++
  }
  return afficheScore(exercice, nbQuestionsValidees, nbQuestionsNonValidees, divScore, divButton)
}

function verifExerciceCustom (exercice /** Exercice */, divScore /** HTMLDivElement */, buttonScore /** HTMLButtonElement */) {
  let nbBonnesReponses = 0
  let nbMauvaisesReponses = 0
  // Le get est non strict car on sait que l'élément n'existe pas à la première itération de l'exercice
  let eltFeedback = get(`feedbackEx${exercice.numeroExercice}`, false)
  // On ajoute le div pour le feedback
  if (!eltFeedback) {
    const eltExercice = get(`exercice${exercice.numeroExercice}`)
    eltFeedback = addElement(eltExercice, 'div', { id: `feedbackEx${exercice.numeroExercice}` })
  }
  setStyles(eltFeedback, 'marginBottom: 20px')
  if (eltFeedback) eltFeedback.innerHTML = ''
  // On utilise la correction définie dans l'exercice
  if (exercice.exoCustomResultat) {
    for (let i = 0; i < exercice.nbQuestions; i++) {
      const correction = exercice.correctionInteractive(i)
      if (Array.isArray(correction)) {
        for (const result of correction) {
          if (result === 'OK') nbBonnesReponses++
          else nbMauvaisesReponses++
        }
      } else {
        correction === 'OK' ? nbBonnesReponses++ : nbMauvaisesReponses++
      }
    }
  } else {
    for (let i = 0; i < exercice.nbQuestions; i++) {
      exercice.correctionInteractive(i) === 'OK' ? nbBonnesReponses++ : nbMauvaisesReponses++
    }
  }
  return afficheScore(exercice, nbBonnesReponses, nbMauvaisesReponses, divScore, buttonScore)
}

export function prepareExerciceCliqueFigure (exercice /** Exercice */) {
  // Dès que l'exercice est affiché, on rajoute des listenners sur chaque éléments de this.figures.
  for (let i = 0; i < exercice.nbQuestions; i++) {
    for (const objetFigure of exercice.figures[i]) {
      const figSvg = document.getElementById(objetFigure.id)
      if (figSvg) {
        if (!figSvg.hasMathaleaListener) {
          figSvg.addEventListener('mouseover', mouseOverSvgEffect)
          figSvg.addEventListener('mouseout', mouseOutSvgEffect)
          figSvg.addEventListener('click', mouseSvgClick)
          figSvg.etat = false
          figSvg.style.margin = '10px'
          figSvg.hasMathaleaListener = true
          // On enregistre que l'élément a déjà un listenner pour ne pas lui remettre le même à l'appui sur "Nouvelles Données"
        }
      }
    }
  }
}

function verifExerciceCliqueFigure (exercice /** Exercice */, divScore /** HTMLDivElement */, buttonScore /** HTMLButtonElement */) {
  // Gestion de la correction
  let nbBonnesReponses = 0
  let nbMauvaisesReponses = 0
  for (let i = 0; i < exercice.nbQuestions; i++) {
    verifQuestionCliqueFigure(exercice, i) === 'OK' ? nbBonnesReponses++ : nbMauvaisesReponses++
  }
  return afficheScore(exercice, nbBonnesReponses, nbMauvaisesReponses, divScore, buttonScore)
}

function verifQuestionCliqueFigure (exercice, i) {
  // Le get est non strict car on sait que l'élément n'existe pas à la première itération de l'exercice
  let eltFeedback = get(`resultatCheckEx${exercice.numeroExercice}Q${i}`, false)
  // On ajoute le div pour le feedback
  if (!eltFeedback) {
    const eltExercice = get(`exercice${exercice.numeroExercice}`)
    eltFeedback = addElement(eltExercice, 'div', { id: `resultatCheckEx${exercice.numeroExercice}Q${i}` })
  }
  setStyles(eltFeedback, 'marginBottom: 20px')
  if (eltFeedback) eltFeedback.innerHTML = ''
  const figures = []
  let erreur = false // Aucune erreur détectée
  let nbFiguresCliquees = 0
  for (const objetFigure of exercice.figures[i]) {
    const eltFigure = document.getElementById(objetFigure.id)
    figures.push(eltFigure)
    eltFigure.removeEventListener('mouseover', mouseOverSvgEffect)
    eltFigure.removeEventListener('mouseout', mouseOutSvgEffect)
    eltFigure.removeEventListener('click', mouseSvgClick)
    eltFigure.hasMathaleaListener = false
    if (eltFigure.etat) nbFiguresCliquees++
    if (eltFigure.etat !== objetFigure.solution) erreur = true
  }
  if (nbFiguresCliquees > 0 && !erreur) {
    eltFeedback.innerHTML = '😎'
    return 'OK'
  } else {
    eltFeedback.innerHTML = '☹️'
    return 'KO'
  }
}

function mouseOverSvgEffect () {
  this.style.border = '1px solid #1DA962'
}

function mouseOutSvgEffect () {
  this.style.border = 'none'
}

function mouseSvgClick () {
  if (this.etat) {
    // Déja choisi, donc on le réinitialise
    this.style.border = 'none'
    this.addEventListener('mouseover', mouseOverSvgEffect)
    this.addEventListener('mouseout', mouseOutSvgEffect)
    this.addEventListener('click', mouseSvgClick)
    this.etat = false
  } else {
    // Passe à l'état choisi donc on désactive les listenners pour over et pour out
    this.removeEventListener('mouseover', mouseOverSvgEffect)
    this.removeEventListener('mouseout', mouseOutSvgEffect)
    this.style.border = '3px solid #f15929'
    this.etat = true
  }
}

export function afficheScore (exercice /** Exercice */, nbBonnesReponses /** number */, nbMauvaisesReponses /** number */, divScore /** HTMLDivElement */, divButton /** HTMLButtonElement */) {
  if (divButton != null) {
    divButton.classList.add('cursor-not-allowed', 'opacity-50', 'pointer-events-none')
  }
  if (divScore != null) {
    divScore.innerHTML = `${nbBonnesReponses} / ${nbBonnesReponses + nbMauvaisesReponses}`
    divScore.style.color = '#f15929'
    divScore.style.fontWeight = 'bold'
    divScore.style.fontSize = 'x-large'
    divScore.style.display = 'inline'
  }
  return { numberOfPoints: nbBonnesReponses, numberOfQuestions: nbBonnesReponses + nbMauvaisesReponses }
}

/**
 * Précise la réponse attendue
 * @param {Exercice} exercice = this
 * @param {number} i numéro de la question
 * @param {any} valeurs Attention à ce que vous mettez ici : ça doit être en accord avec le formatInteractif ! pas de texNombre ou de stringNombre !
 * @param {object} options
 */

export function setReponse (exercice, i, valeurs, {
  digits = 0,
  decimals = 0,
  signe = false,
  exposantNbChiffres = 0,
  exposantSigne = false,
  approx = 0,
  aussiCorrect,
  digitsNum,
  digitsDen,
  basePuissance,
  exposantPuissance,
  baseNbChiffres,
  milieuIntervalle,
  formatInteractif = 'calcul',
  precision = null
} = {}) {
  let reponses = []
  const url = new URL(window.location.href)
  if (url.hostname === 'localhost' && url.searchParams.has('triche')) console.log(`Réponses de l'exercice ${exercice.numeroExercice + 1} - question ${i + 1} : `, valeurs)
  if (typeof valeurs === 'object' && (formatInteractif === 'tableauMathlive' || formatInteractif === 'fillInTheBlank')) {
    if (formatInteractif === 'tableauMathlive') {
      reponses = valeurs
    } else if (formatInteractif === 'fillInTheBlank') {
      reponses = valeurs
    }
  } else {
    if (Array.isArray(valeurs)) {
      reponses = [...valeurs] // reponses contient donc directement le tableau valeurs
      // si valeur est un tableau ou prend le signe de la première valeur
      if (valeurs[0].num === undefined) {
        signe = valeurs[0] < 0 ? true : signe // on teste si elle est négative, si oui, on force la case signe pour AMC
      } else {
        signe = valeurs[0].signe === -1 ? true : signe // si c'est une fraction, alors on regarde son signe (valeur -1, 0 ou 1)
      }
    } else {
      reponses = [valeurs] // ici, valeurs n'est pas un tableau mais on le met dans reponses sous forme de tableau
      if (valeurs.num === undefined) {
        signe = valeurs < 0 ? true : signe // on teste si elle est négative, si oui, on force la case signe pour AMC
      } else {
        signe = valeurs.signe === -1 ? true : signe // si c'est une fraction, alors on regarde son signe (valeur -1, 0 ou 1)
      }
    }
  }

  let laReponseDemandee

  switch (formatInteractif) {
    case 'tableauMathlive':
      //   if (reponses.filter((cellule) => Object.keys(cellule)[0].match(/L\dC\d/).length === 0).length !== 0) {
      //    window.notify('setReponse : type "tableauMathlive" les objets proposés n\'ont pas tous une clé de la forme L$C$', { reponses })
      //  }
      break
    case 'fillInTheBlank':
      break
    case 'Num':
      if (!(reponses[0] instanceof FractionEtendue)) window.notify('setReponse : type "Num" une fraction est attendue !', { reponses })
      else if (isNaN(reponses[0].num) || isNaN(reponses[0].den)) window.notify('setReponse : La fraction ne convient pas !', { reponses })
      break
    case 'Den':
      if (!(reponses[0] instanceof FractionEtendue)) window.notify('setReponse : type "Den" une fraction est attendue !', { reponses })
      break
    case 'calcul':
      laReponseDemandee = reponses[0]
      if (typeof laReponseDemandee === 'string') {
        laReponseDemandee = laReponseDemandee.replaceAll('dfrac', 'frac')
      }
      if (typeof laReponseDemandee === 'number' || typeof laReponseDemandee === 'string') {
        laReponseDemandee = laReponseDemandee.toString().replace(/\s/g, '').replace(',', '.')
      }
      // à quoi sert ce code ? de toute façon, si on ne fournit pas une réponse correcte à setReponse() on le verra bien en testant l'exo !
      /* try {
                     test = engine.parse(laReponseDemandee.toString()).canonical
                   } catch (error) {
                     window.notify('setReponse : type "calcul" la réponse n\'est pas un nombre valide', { reponses, test })
                   }
                   */
      break
    case 'nombreDecimal':
      if (isNaN(reponses[0].toString())) window.notify('setReponse : type "nombreDecimal" un nombre est attendu !', { reponses })
      break
    case 'ecritureScientifique':
      if (!(typeof reponses[0] === 'string')) window.notify('setReponse : type "ecritureScientifique" la réponse n\'est pas un string !', { reponses })
      // ToFix : vérifier que la chaine est au bon format
      break

    case 'texte':
      if (!(typeof reponses[0] === 'string')) window.notify('setReponse : type "texte" la réponse n\'est pas un string !', { reponses })
      break

    case 'ignorerCasse':
      if (!(typeof reponses[0] === 'string')) window.notify('setReponse : type "ignorerCasse" la réponse n\'est pas un string !', { reponses })
      break
    case 'fractionPlusSimple':
      if (!(reponses[0] instanceof FractionEtendue)) window.notify('setReponse : type "fractionPlusSimple" une fraction est attendue !', { reponses })
      else if (isNaN(reponses[0].num) || isNaN(reponses[0].den)) window.notify('setReponse : La fraction ne convient pas !', { reponses })
      break
    // case 'fractionEgale':
    //   if (!(reponses[0] instanceof FractionEtendue)) window.notify('setReponse : type "fractionEgale" une fraction est attendue !', { reponses })
    //   else if (isNaN(reponses[0].num) || isNaN(reponses[0].den)) window.notify('setReponse : La fraction ne convient pas !', { reponses })
    //   break
    case 'fraction':
      if (!(reponses[0] instanceof FractionEtendue)) window.notify('setReponse : type "fraction" une fraction est attendue !', { reponses })
      else if (isNaN(reponses[0].num) || isNaN(reponses[0].den)) window.notify('setReponse : La fraction ne convient pas !', { reponses })
      break
    case 'unites': // Pour les exercices où l'on attend une mesure avec une unité au choix
      if (!(reponses[0] instanceof Grandeur)) window.notify('setReponse : type "longueur" la réponse n\'est pas une instance de Grandeur !', { reponses })
      break
    case 'intervalleStrict':// Pour les exercice où la saisie doit être dans un intervalle
      // ToFix : vérifier que la réponse est bien un intervalle valide
      break
    case 'intervalle' :
      // ToFix : vérifier que la réponse est bien un intervalle valide
      break
    case 'puissance' :
      // ToFix : vérifier que la réponse est bien l'écriture d'une puissance ou en tout cas une réponse acceptable pour ce format
      break
  }

  if (exercice.autoCorrection[i] === undefined) {
    exercice.autoCorrection[i] = {}
  }
  if (exercice.autoCorrection[i].reponse === undefined) {
    exercice.autoCorrection[i].reponse = {}
  }
  exercice.autoCorrection[i].reponse.param = {
    digits,
    decimals,
    signe,
    exposantNbChiffres,
    exposantSigne,
    approx,
    aussiCorrect,
    digitsNum,
    digitsDen,
    basePuissance,
    exposantPuissance,
    milieuIntervalle,
    baseNbChiffres,
    formatInteractif,
    precision
  }
  exercice.autoCorrection[i].reponse.valeur = reponses
}
