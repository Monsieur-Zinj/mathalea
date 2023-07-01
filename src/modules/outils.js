/* globals UI */
import Algebrite from 'algebrite'
import Decimal from 'decimal.js'
import { equal, evaluate, format, Fraction, gcd, isArray, isInteger, isPrime, round } from 'mathjs'
import { texteParPosition } from './2d.js'
import { context } from './context.js'
import FractionEtendue from './FractionEtendue.js'
import { fraction } from './fractions.js'
import { setReponse } from './gestionInteractif.js'
import { getVueFromUrl } from './gestionUrl.js'
import { matriceCarree } from './MatriceCarree.js'

export const tropDeChiffres = 'Trop de chiffres'
export const epsilon = 0.000001
const math = { format, evaluate }

/**
 * Fonctions diverses pour la création des exercices
 * @module
 */

export function interactivite (exercice) {
  if (context.isHtml) {
    if (exercice.interactif) return 'I-html'
    else return 'html'
  } else if (context.isAmc) return 'AMC'
  else if (exercice.interactif) return 'I-latex'
  else return 'latex'
}

/**
 * Affecte les propriétés contenu et contenuCorrection (d'après les autres propriétés de l'exercice)
 * @param {Exercice} exercice
 */
export function listeQuestionsToContenu (exercice) {
  if (context.isHtml) {
    exercice.contenu = htmlConsigne(exercice.consigne) + htmlParagraphe(exercice.introduction) + htmlEnumerate(exercice.listeQuestions, exercice.spacing, 'question', `exercice${exercice.numeroExercice}Q`, exercice.tailleDiaporama)
    if ((exercice.interactif && exercice.interactifReady) || getVueFromUrl() === 'eval') {
      exercice.contenu += `<button class="ui blue button checkReponses" type="submit" style="margin-bottom: 20px; margin-top: 20px" id="btnValidationEx${exercice.numeroExercice}-${exercice.id}">Vérifier les réponses</button>`
    }
    exercice.contenuCorrection = htmlParagraphe(exercice.consigneCorrection) + htmlEnumerate(exercice.listeCorrections, exercice.spacingCorr, 'correction', `correction${exercice.numeroExercice}Q`, exercice.tailleDiaporama)
  } else {
    let vspace = ''
    if (exercice.vspace) {
      vspace = `\\vspace{${exercice.vspace} cm}\n`
    }
    if (!context.isAmc) {
      if (document.getElementById('supprimer_reference') && document.getElementById('supprimer_reference').checked === true) {
        exercice.contenu = texConsigne(exercice.consigne) + vspace + texIntroduction(exercice.introduction) + texMulticols(texEnumerate(exercice.listeQuestions, exercice.spacing), exercice.nbCols)
      } else {
        exercice.contenu = texConsigne(exercice.consigne) + `\n\\marginpar{\\footnotesize ${exercice.id}}` + vspace + texIntroduction(exercice.introduction) + texMulticols(texEnumerate(exercice.listeQuestions, exercice.spacing), exercice.nbCols)
      }
    }
    exercice.contenuCorrection = texConsigne('') + texIntroduction(exercice.consigneCorrection) + texMulticols(texEnumerate(exercice.listeCorrections, exercice.spacingCorr), exercice.nbColsCorr)
    exercice.contenuCorrection = exercice.contenuCorrection.replace(/\\\\\n*/g, '\\\\\n')
    exercice.contenu = exercice.contenu.replace(/\\\\\n*/g, '\\\\\n')
  }
}

export function exerciceSimpleToContenu (exercice) {
  const listeQuestions = []
  const listeCorrections = []
  for (let i = 0, cpt = 0; i < exercice.nbQuestions & cpt < 50; cpt++) {
    if (exercice.questionJamaisPosee(i, exercice.question)) {
      if (context.isAmc) {
        listeQuestions.push(exercice.question + '<br>')
        listeCorrections.push(exercice.correction)
      } else {
        listeQuestions.push(exercice.question)
        listeCorrections.push(exercice.correction)
      }
      if (context.isAmc && exercice.amcType === 'AMCNum') {
        setReponse(exercice, i, exercice.reponse, {
          digits: nombreDeChiffresDe(exercice.reponse),
          decimals: nombreDeChiffresDansLaPartieDecimale(exercice.reponse),
          signe: exercice.reponse < 0,
          approx: 0
        })
      }
      exercice.nouvelleVersion()
      i++
    }
  }
  exercice.listeQuestions = listeQuestions
  exercice.listeCorrections = listeCorrections
  listeQuestionsToContenu(exercice)
}

/**
 * À documenter
 * @param {Exercice} exercice
 */
export function listeDeChosesAImprimer (exercice) {
  if (context.isHtml) {
    exercice.contenu = htmlLigne(exercice.listeQuestions, exercice.spacing)
    exercice.contenuCorrection = ''
  } else {
    // let vspace = ''
    // if (exercice.vspace) {
    //   vspace = `\\vspace{${exercice.vspace} cm}\n`
    // }
    if (document.getElementById('supprimer_reference').checked === true) {
      exercice.contenu = texMulticols(texParagraphe(exercice.listeQuestions, exercice.spacing), exercice.nbCols)
    } else {
      exercice.contenu = `\n\\marginpar{\\footnotesize ${exercice.id}}` + texMulticols(texParagraphe(exercice.listeQuestions, exercice.spacing), exercice.nbCols)
    }
    exercice.contenuCorrection = ''
  }
}

/**
 * Utilise liste_questions et liste_corrections pour remplir contenu et contenuCorrection
 * La liste des questions devient une liste HTML ou LaTeX avec html_ligne() ou tex_paragraphe()
 * @param {Exercice} exercice
 * @author Rémi Angot
 */
export function listeQuestionsToContenuSansNumero (exercice, retourCharriot = true) {
  // En vue diapCorr, les questions doivent toujours être numérotées car venant d'exercices différents
  if (context.vue === 'diapCorr') {
    listeQuestionsToContenu(exercice, retourCharriot = true)
  } else {
    if (context.isHtml) {
      exercice.contenu = htmlConsigne(exercice.consigne) + htmlParagraphe(exercice.introduction) + htmlEnumerate(exercice.listeQuestions, exercice.spacing, 'question', `exercice${exercice.numeroExercice}Q`, exercice.tailleDiaporama, 'sansNumero')
      if ((exercice.interactif && exercice.interactifReady) || getVueFromUrl() === 'eval') {
        exercice.contenu += `<button class="ui blue button checkReponses" type="submit" style="margin-bottom: 20px; margin-top: 20px" id="btnValidationEx${exercice.numeroExercice}-${exercice.id}">Vérifier les réponses</button>`
      }
      exercice.contenuCorrection = htmlParagraphe(exercice.consigneCorrection) + htmlEnumerate(exercice.listeCorrections, exercice.spacingCorr, 'correction', `correction${exercice.numeroExercice}Q`, exercice.tailleDiaporama, 'sansNumero')
    } else {
      if (document.getElementById('supprimer_reference') && document.getElementById('supprimer_reference').checked === true) {
        exercice.contenu = texConsigne(exercice.consigne) + texIntroduction(exercice.introduction) + texMulticols(texParagraphe(exercice.listeQuestions, exercice.spacing, retourCharriot), exercice.nbCols)
      } else {
        exercice.contenu = texConsigne(exercice.consigne) + `\n\\marginpar{\\footnotesize ${exercice.id}}` + texIntroduction(exercice.introduction) + texMulticols(texParagraphe(exercice.listeQuestions, exercice.spacing, retourCharriot), exercice.nbCols)
      }
      // exercice.contenuCorrection = texConsigne(exercice.consigneCorrection) + texMulticols(texEnumerateSansNumero(exercice.listeCorrections,exercice.spacingCorr),exercice.nbColsCorr)
      exercice.contenuCorrection = texConsigne(exercice.consigneCorrection) + texMulticols(texParagraphe(exercice.listeCorrections, exercice.spacingCorr, retourCharriot), exercice.nbColsCorr)
    }
  }
}

/**
 * Utilise liste_questions et liste_corrections pour remplir contenu et contenuCorrection
 *
 * Uniquement en version LaTeX
 * La liste des questions devient une liste HTML ou LaTeX avec html_ligne() ou tex_paragraphe()
 * @param {Exercice} exercice
 * @author Rémi Angot
 */
export function listeQuestionsToContenuSansNumeroEtSansConsigne (exercice) {
  if (document.getElementById('supprimer_reference').checked === true) {
    exercice.contenu = texMulticols(texParagraphe(exercice.listeQuestions, exercice.spacing), exercice.nbCols)
  } else {
    exercice.contenu = `\n\\marginpar{\\footnotesize ${exercice.id}` + texMulticols(texParagraphe(exercice.listeQuestions, exercice.spacing), exercice.nbCols)
  }
  // exercice.contenuCorrection = texConsigne(exercice.consigneCorrection) + texMulticols(texEnumerateSansNumero(exercice.listeCorrections,exercice.spacingCorr),exercice.nbColsCorr)
  exercice.contenuCorrection = texMulticols(texParagraphe(exercice.listeCorrections, exercice.spacingCorr), exercice.nbColsCorr)
}

/**
 * Renvoie le html ou le latex qui mets les 2 chaines de caractères fournies sur 2 colonnes différentes
 * @author Rémi Angot
 * @param {string} cont1 - Contenu de la première colonne
 * @param {string} cont2 - Contenu de la deuxième colonne
 * @param {number} [largeur1=50] Largeur de la première colonne
 * @return {string}
 */
export function deuxColonnes (cont1, cont2, largeur1 = 50) {
  if (context.isHtml) {
    return `
    <div>
    <div class="question" style="float:left;max-width: ${largeur1}%;margin-right: 30px">
    ${cont1}
   </div>
   <div style="float:left; max-width: ${90 - largeur1}%">
    ${cont2}
   </div>
   <div style="clear:both"></div>
   <div class="ui hidden divider"></div>
   </div>
`
  } else {
    return `\\begin{minipage}{${largeur1 / 100}\\linewidth}
    ${cont1.replaceAll('<br>', '\\\\\n')}
    \\end{minipage}
    \\begin{minipage}{${(100 - largeur1) / 100}\\linewidth}
    ${cont2.replaceAll('<br>', '\\\\\n')}
    \\end{minipage}
    `
  }
}

/**
 * Renvoie le html ou le latex qui mets les 2 chaines de caractères fournies sur 2 colonnes différentes
 * Si en sortie html, il n'y a pas assez de places alors on passe en momocolonne!
 * @author Mickael Guironnet
 * @param {string} cont1 - Contenu de la première colonne
 * @param {string} cont2 - Contenu de la deuxième colonne
 * @param {{eleId: string, largeur1: number, widthmincol1: number, widthmincol2: number}} options
 *          eleId : identifiant ID pour retrouver la colonne
 *          largeur1 : largeur de la première colonne en latex en pourcentage
 *          widthmincol1 : largeur de la première minimum en html en px
 *          widthmincol2 : largeur de la deuxième  minimum en html en px
 *  ex : deuxColonnesResp (enonce, correction, {eleId : '1_1', largeur1:50, widthmincol1: 400px, widthmincol2: 200px})
 * @return {string}
 */
export function deuxColonnesResp (cont1, cont2, options) {
  if (options === undefined) {
    options = { largeur1: 50 }
  } else if (typeof options === 'number') {
    options = { largeur1: options }
  }
  if (options.largeur1 === undefined) {
    options.largeur1 = 50
  }
  if (options.stylecol1 === undefined) {
    options.stylecol1 = ''
  }
  if (options.stylecol2 === undefined) {
    options.stylecol2 = ''
  }
  if (options.widthmincol1 === undefined) {
    options.widthmincol1 = '0px'
  }
  if (options.widthmincol2 === undefined) {
    options.widthmincol2 = '0px'
  }

  if (context.isHtml) {
    return `
    <style>
    .cols-responsive {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-gap: 1rem;
    }
    /* Screen larger than 900px? 2 column */
    @media (min-width: 900px) {
      .cols-responsive { grid-template-columns: repeat(2, 1fr); }
    }
    </style>
    <div class='cols-responsive'>
      <div id='cols-responsive1-${options.eleId}'style='min-width:${options.widthmincol1};${options.stylecol1}' >
      ${cont1}
      </div>
      <div id='cols-responsive2-${options.eleId}' style='min-width:${options.widthmincol2};${options.stylecol2}' >
      ${cont2}
      </div>
    </div>
`
  } else {
    return `\\begin{minipage}{${options.largeur1 / 100}\\linewidth}
    ${cont1.replaceAll('<br>', '\\\\\n')}
    \\end{minipage}
    \\begin{minipage}{${(100 - options.largeur1) / 100}\\linewidth}
    ${cont2.replaceAll('<br>', '\\\\\n')}
    \\end{minipage}
    `
  }
}

/**
 *
 * @param {string} texte
 * @returns le texte centré dans la page selon le contexte.
 * @author Jean-Claude Lhote
 */
export function centrage (texte) {
  return context.isHtml ? `<center>${texte}</center>` : `\\begin{center}\n\t${texte}\n\\end{center}\n`
}

/**
 * Contraint une valeur à rester dans un intervalle donné. Si elle est trop petite, elle prend la valeur min, si elle est trop grande elle prend la valeur max
 * @author Jean-Claude Lhote à partir du code de Eric Elter
 * @param {number|string} min borne inférieure
 * @param {number|string} max borne supérieure
 * @param {number|string} valeur la valeur à contraindre
 * @param {number|string} defaut valeur par défaut si non entier
 */
export function contraindreValeur (min, max, valeur, defaut) {
  // if (isNaN(min) || isNaN(max) || (defaut !== undefined && isNaN(defaut))) { // Rajout de Remi
  if (isNaN(min) || isNaN(max) || (isNaN(defaut))) {
    throw Error(`Erreur dans contraindreValeur : un des paramètres de contrainte est NaN : ${
      ['min : ' + String(min) + ' ', max, valeur, defaut].reduce((accu, value, index) => String(accu) + ['min', ',max', ',valeur', ',defaut'][index] + ' : ' + String(value) + ' ')
    }`)
  }
  return !isNaN(valeur) ? (Number(valeur) < Number(min) ? Number(min) : (Number(valeur) > Number(max) ? Number(max) : Number(valeur))) : Number(defaut)
}

/**
 *@param {string|number} saisie Ce qui vient du formulaireTexte donc une série de nombres séparés par des tirets ou un seul nombre (normalement en string) ou rien
 * @param {number} [min=1]
 * @param {number} max obligatoirement >min
 * @param {number} defaut obligatoirement compris entre min et max inclus ou alors égal à melange
 * @param {string[] | number[] | undefined} listeOfCase La liste des valeurs à mettre dans la liste en sortie. Si aucune liste n'est fournie, ce sont les nombres qui seront dans la liste
 * La première valeur de listeOfCase correspond à la saisie numérique min et listeOfCase doit contenir max-min+1 valeurs
 * @param {boolean} [shuffle=true] si true, alors on brasse la liste en sortie sinon on garde l'ordre
 * @param {number} nbQuestions obligatoire : c'est la taille de la liste en sortie. Si 999, alors le nbQuestions correspond à la longueur de saisie.
 * @param {number | undefined} melange la valeur utilisée pour l'option mélange
 * @param {boolean} [enleveDoublons=false]  si true alors la liste en sortie ne peut pas contenir deux fois la même valeur
 * @param {number[]} exclus liste de valeurs à exclure entre min et max
 */
export function gestionnaireFormulaireTexte ({
  saisie,
  min = 1,
  max,
  defaut,
  listeOfCase,
  shuffle = true,
  nbQuestions,
  melange,
  enleveDoublons = false,
  exclus
} = {}) {
  if (exclus) {
    exclus = exclus.filter((element) => element >= min && element <= max)
  }
  if (max == null || isNaN(max) || max < min) throw Error('La fonction gestionnaireFormulaireTexte réclame un paramètre max de type number')
  if (defaut == null || isNaN(defaut) || defaut < min || (defaut > max && defaut !== melange)) throw Error(`La fonction gestionnaireFormulaireTexte réclame un paramètre defaut (ici, ${defaut}) compris entre min (ici, ${min}) et max (ici, ${max})`)
  let listeIndex, listeIndexProvisoire
  listeIndex = []

  if (!saisie) { // Si aucune liste n'est saisie
    listeIndex = [defaut]
  } else {
    if (typeof (saisie) === 'number' || Number.isInteger(saisie)) { // Si c'est un nombre c'est que le nombre a été saisi dans la barre d'adresses
      listeIndex = [contraindreValeur(min, Math.max(max, melange ?? max), saisie, defaut)]
    } else {
      listeIndexProvisoire = saisie.split('-')// Sinon on créé un tableau à partir des valeurs séparées par des -
      for (let i = 0; i < listeIndexProvisoire.length; i++) { // on a un tableau avec des strings : ['1', '1', '2']
        if (!isNaN(parseInt(listeIndexProvisoire[i]))) { listeIndex.push(contraindreValeur(min, Math.max(max, melange ?? max), parseInt(listeIndexProvisoire[i]), defaut)) } // parseInt en fait un tableau d'entiers
      }
    }
  }
  if (melange != null && compteOccurences(listeIndex, melange)) {
    listeIndex = rangeMinMax(min, max)
  }
  if (exclus && exclus.length > 0) {
    listeIndex = listeIndex.filter((element) => !exclus.includes(element))
  }
  if (nbQuestions === 999) nbQuestions = listeIndex.length
  listeIndex = shuffle ? combinaisonListes(listeIndex, nbQuestions) : combinaisonListesSansChangerOrdre(listeIndex, nbQuestions)

  const Max = Math.max(...listeIndex)
  if (enleveDoublons) listeIndex = enleveDoublonNum(listeIndex)
  if (Array.isArray(listeOfCase)) { // si une listeOfCase est fournie, on retourne la liste des valeurs construites avec listeIndex
    if (listeOfCase.length < Max) throw Error('La liste de cas fournie ne contient pas assez de valeurs par rapport à max')
    return listeIndex.map((el) => listeOfCase[el - min]).slice(0, nbQuestions)
  }
  return listeIndex.slice(0, nbQuestions)
}

/** Retourne un nombre décimal entre a et b, sans être trop près de a et de b
 * @param {number} min borne inférieure
 * @param {number} max borne supérieure
 * @author Eric Elter
 * @returns {number}
 */
export function entreDeux (a, b) {
  if (a < b) return arrondi(a + (b - a) * randint(10, 90) / 100, 2)
  else return arrondi(b + (a - b) * randint(10, 90) / 100, 2)
}

/**
 * Compare deux nombres (pour les nombres en virgule flottante afin d'éviter les effets de la conversion en virgule flottante).
 * @author Jean-Claude Lhote
 * @param {number} a premier nombre
 * @param {number} b deuxième nombre
 * @param {number} [tolerance=0.000001] seuil positif en dessous duquel une valeur est considérée comme nulle
 * @return {boolean}
 */
export function egal (a, b, tolerance = epsilon) {
  tolerance = tolerance === 0 ? 1e-10 : tolerance
  return (Math.abs(a - b) < tolerance)
}

/**
 * Retourne true si a > b
 * @param {number} a premier nombre
 * @param {number} b deuxième nombre
 * @param {number} [tolerance=0.000001] seuil positif en dessous duquel une valeur est considérée comme nulle
 * @return {boolean}
 */
export function superieur (a, b, tolerance = epsilon) {
  return (a - b > tolerance)
}

/**
 * Retourne true si a < b
 * @param {number} a premier nombre
 * @param {number} b deuxième nombre
 * @param {number} [tolerance=0.000001] seuil positif en dessous duquel une valeur est considérée comme nulle
 * @return {boolean}
 */
export function inferieur (a, b, tolerance = epsilon) {
  return (b - a > tolerance)
}

/**
 * Retourne true si a ≥ b
 * @param {number} a premier nombre
 * @param {number} b deuxième nombre
 * @param {number} [tolerance=0.000001] seuil positif en dessous duquel une valeur est considérée comme nulle
 * @return {boolean}
 */
export function superieurouegal (a, b, tolerance = epsilon) {
  return (a - b > tolerance || egal(a, b, tolerance))
}

/**
 * Retourne true si a ≤ b
 * @param {number} a premier nombre
 * @param {number} b deuxième nombre
 * @param {number} [tolerance=0.000001] seuil positif en dessous duquel une valeur est considérée comme nulle
 * @return {boolean}
 */
export function inferieurouegal (a, b, tolerance = epsilon) {
  return (b - a > tolerance || egal(a, b, tolerance))
}

/**
 * Retourne true si a est entier ou "presque" entier
 * @param {number} a premier nombre
 * @param {number} [tolerance=0.000001] seuil positif en dessous duquel une valeur est considérée comme nulle
 * @return {boolean}
 */
export function estentier (a, tolerance = epsilon) {
  if (typeof a !== 'number') window.notify('Erreur dans estEntier()', { a })
  return (Math.abs(a - round(a)) < tolerance)
}

/**
 * Retourne le quotient entier (donc sans le reste) de a/b si a & b sont entiers, false sinon
 * @param {number} a
 * @param {number} b
 * @return {boolean|number}
 */
export function quotientier (a, b) {
  if (estentier(a) && estentier(b)) return Math.floor(a / b)
  return false
}

/**
 * Renvoie le PPCM de deux nombres
 * @author Rémi Angot
 */
export const ppcm = (a, b) => {
  return parseInt(Algebrite.run(`lcm(${a},${b})`))
}

/**
 * Retourne true si x est un carré parfait (à epsilon près)
 * @param {number} x
 * @return {boolean}
 */
export function carreParfait (x) {
  if (estentier(Math.sqrt(x))) return true
  else return false
}

// Petite fonction pour écrire des nombres avec Mathalea2d en vue de poser des opérations...
export function ecrireNombre2D (x, y, n) {
  const nString = nombreAvecEspace(n)
  const nombre2D = []
  for (let k = 0; k < nString.length; k++) {
    nombre2D.push(texteParPosition(nString[k], x + k * 0.8, y))
  }
  return nombre2D
}

/**
 * Créé tous les couples possibles avec un élément de E1 et un élément de E2.
 * L'ordre est pris en compte, donc on pourra avoir (3,4) et (4,3).
 * Si le nombre de couples possibles est inférieur à nombreDeCouplesMin alors
 * on concatène 2 fois la même liste mais avec des ordres différents.
 * @param {string[]} E1 - Liste
 * @param {string[]} E2 - Liste
 * @param {int} nombreDeCouplesMin=10 - Nombre de couples souhaités
 * @author Rémi Angot
 */
export function creerCouples (E1, E2, nombreDeCouplesMin = 10) {
  let result = []
  let temp = []
  for (const i of E1) {
    for (const j of E2) {
      result.push([i, j])
    }
  }

  temp = shuffle(result).slice(0) // créer un clone du tableau result mélangé
  result = temp.slice(0)
  while (result.length < nombreDeCouplesMin) {
    result = result.concat(shuffle(temp))
  }
  return result
}

// Fonctions mathématiques

/**
 * Choisit un nombre au hasard entre min et max sans appartenir à liste\_a\_eviter.
 * @param {int} min
 * @param {int} max
 * @param {int[]} liste - Tous les éléments que l'on souhaite supprimer
 * @return {int} Nombre au hasard entre min et max non compris dans la listeAEviter
 *
 * @example
 * // Renvoie 1, 2 ou 3
 * randint (1,3)
 * @example
 * // Renvoie -1 ou 1
 * randint(-1,1,[0])
 * @example
 * Renvoie 0 ou 1 ou 4 ou 6 ou 8 ou 9
 * randint(0,9, '2357') // même résultat avec randint(0,9, ['2','3','5','7']) ou randint(0,9, [2,3,5,7])
 * @author Rémi Angot
 * @Source https://gist.github.com/pc035860/6546661
 */
export function randint (min, max, listeAEviter = []) {
  // Source : https://gist.github.com/pc035860/6546661
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    window.notify('Les min et max de randint doivent être entiers', { min, max })
    min = Math.floor(min)
    max = Math.ceil(max)
    if (max - min < 1) max = min + 1
  }
  const range = max - min
  let rand = Math.floor(Math.random() * (range + 1))
  if (typeof listeAEviter === 'string') {
    listeAEviter = listeAEviter.split('')
  }
  if (typeof listeAEviter === 'number') {
    if (Number.isInteger(listeAEviter)) {
      listeAEviter = [listeAEviter]
    } else {
      window.notify('Le nombre fourni à randint en exclusion n\'est pas un entier', { listeAEviter })
      listeAEviter = [listeAEviter] // ce n'est pas grave de mettre un nombre non entier, randint ne choisit que des entiers
    }
  }
  if (Array.isArray(listeAEviter)) {
    listeAEviter = listeAEviter.map(Number).filter(el => Math.round(el) === el) // on filtre les non nombres et les non-entiers
  } else {
    window.notify('La liste d\'exclusion de randint n\'est pas d\'un type pris en compte', { listeAEviter })
    listeAEviter = []
  }
  if (listeAEviter.length > 0) {
    while (listeAEviter.includes(min + rand)) {
      rand = Math.floor(Math.random() * (range + 1))
    }
  }
  return min + rand
}

/**
 * Créé un string aléatoire
 *
 * strRandom({
 *  includeUpperCase: true,
 *  includeNumbers: true,
 *  length: 5,
 *  startsWithLowerCase: true
 * });
 *
 * // renvoie par exemple : "iL0v3"
 *
 * @Source https://www.equinode.com/blog/article/generer-une-chaine-de-caracteres-aleatoire-avec-javascript
 */
export function strRandom (o) {
  let a = 10
  const b = 'abcdefghijklmnopqrstuvwxyz'
  let c = ''
  let d = 0
  let e = '' + b
  if (o) {
    if (o.startsWithLowerCase) {
      c = b[Math.floor(Math.random() * b.length)]
      d = 1
    }
    if (o.length) {
      a = o.length
    }
    if (o.includeUpperCase) {
      e += b.toUpperCase()
    }
    if (o.includeNumbers) {
      e += '1234567890'
    }
  }
  for (; d < a; d++) {
    c += e[Math.floor(Math.random() * e.length)]
  }
  return c
}

/**
 * Enlève toutes les occurences d'un élément d'un tableau donné
 * @param liste
 * @param element
 *
 * @author Rémi Angot
 */
export function enleveElement (array, item) {
  //
  for (let i = array.length - 1; i >= 0; i--) {
    if (typeof item === 'number') {
      if (egal(array[i], item)) {
        array.splice(i, 1)
      }
    } else {
      if (array[i] === item) {
        array.splice(i, 1)
      }
    }
  }
}

/**
 *
 * Compte les occurences d'un item dans un tableau
 * @param {array} array
 * @param item
 * @Author Rémi Angot
 */
export function compteOccurences (array, value) {
  let cpt = 0
  array.forEach((v) => (v === value && cpt++))
  return cpt
}

/**
 * Enlève toutes les occurences d'un élément d'un tableau donné mais sans modifier le tableau en paramètre et renvoie le tableau modifié
 * @author Rémi Angot & Jean-Claude Lhote
 */

export function enleveElementBis (array, item = undefined) {
  const tableaucopie = []
  for (let i = 0; i < array.length; i++) {
    tableaucopie.push(array[i])
  }
  for (let i = tableaucopie.length - 1; i >= 0; i--) {
    if (tableaucopie[i] === item) {
      tableaucopie.splice(i, 1)
    }
  }
  return tableaucopie
}

/**
 * Enlève l'élément index d'un tableau
 * @author Jean-Claude Lhote
 */
export function enleveElementNo (array, index) {
  array.splice(index, 1)
}

/**
 * Enlève l'élément index d'un tableau sans modifier le tableau et retourne le résultat
 * @author Jean-Claude Lhote
 */
export function enleveElementNoBis (array, index) {
  const tableaucopie = []
  for (let i = 0; i < array.length; i++) {
    tableaucopie.push(array[i])
  }
  tableaucopie.splice(index, 1)
  return tableaucopie
}

/**
 * Retourne un élément au hasard de la liste sans appartenir à une liste donnée
 * @param {liste}
 * @param {listeAEviter}
 *
 * @example
 * // Renvoie 1, 2 ou 3
 * choice([1,2,3])
 * @example
 * // Renvoie Rémi ou Léa
 * choice(['Rémi','Léa'])
 *
 * @author Rémi Angot
 */
export function choice (liste, listeAEviter = []) {
  // copie la liste pour ne pas y toucher (ce n'est pas le but de choice)
  if (!Array.isArray(listeAEviter)) {
    listeAEviter = [listeAEviter]
  }
  const listebis = liste.slice()
  // Supprime les éléments de liste à éviter
  for (let i = 0; i < listeAEviter.length; i++) {
    enleveElement(listebis, listeAEviter[i])
  }
  const index = Math.floor(Math.random() * listebis.length)
  return listebis[index]
}

/**
 * Retourne une liste des entiers de 0 à max sans appartenir à une liste donnée
 * @param {max}
 * @param {listeAEviter}
 *
 * @example
 * // Renvoie [0,1,4,5,6,7,8,9,10]
 * range(10,[2,3])
 *
 * @author Rémi Angot
 */
export function range (max, listeAEviter = []) {
  // Créer un tableau avec toutes les valeurs de 0 à max sauf celle de la liste à éviter
  const nbMax = parseInt(max, 10)
  const liste = [...Array(nbMax + 1).keys()]
  for (let i = 0; i < listeAEviter.length; i++) {
    enleveElement(liste, listeAEviter[i])
  }
  return liste
}

/**
 * Retourne une liste entre 2 bornes sans appartenir à une liste donnée (par défaut des entiers mais on peut changer le pas)
 * @param {min}
 * @param {max}
 * @param {listeAEviter}
 *
 * @example
 * // Renvoie [6,7,10]
 * range(6,10,[8,9])
 *
 * @author Rémi Angot
 */
export function rangeMinMax (min, max, listeAEviter = [], step = 1) {
  // Créer un tableau avec toutes les valeurs de 0 à max sauf celle de la liste à éviter
  const liste = []
  for (let i = min; i <= max; i = i + step) {
    liste.push(i)
  }
  for (let i = 0; i < listeAEviter.length; i++) {
    enleveElement(liste, listeAEviter[i])
  }
  return liste
}

/**
 * Créé un tableau avec toutes les valeurs de 1 à max sauf celle de la liste à éviter
 *
 *
 * @param {int} max
 * @param {liste} liste valeurs à éviter
 * @author Rémi Angot
 */
export function range1 (max, listeAEviter = []) {
  const nbMax = parseInt(max, 10)
  const liste = []
  for (let i = 1; i <= nbMax; i++) {
    liste.push(i)
  }
  for (let i = 0; i < listeAEviter.length; i++) {
    enleveElement(liste, listeAEviter[i])
  }
  return liste
}

/**
 * Fonction de comparaison à utiliser avec tableau.sort(compareFractions)
 *
 * Le tableau doit être du type `[[num,den],[num2,den2]]`
 *
 * @author Rémi Angot
 */
export function compareFractions (a, b) {
  if ((a[0] / a[1]) > (b[0] / b[1])) {
    return 1
  }
  if ((a[0] / a[1]) < (b[0] / b[1])) {
    return -1
  }
  // Sinon il y a égalité
  return 0
}

/**
 * Fonction de comparaison à utiliser avec tableau.sort(compareNombres)
 *
 *
 * @author Rémi Angot
 */
export function compareNombres (a, b) {
  return a - b
}

/**
 *
 * Copié sur https://delicious-insights.com/fr/articles/le-piege-de-array-sort/
 */
export function numTrie (arr) {
  return arr.sort(function (a, b) {
    return a - b
  })
}

/**
 * retourne un tableau dans lequel les doublons ont été supprimés s'il y en a MAIS SANS TRI
 * @param {array} arr Tableau duquel ont veut supprimer les doublons numériques
 * @param {number} tolerance La différence minimale entre deux valeurs pour les considérer comme égales
 * @author Jean-Claude Lhote
 **/
export function enleveDoublonNum (arr, tolerance = epsilon) {
  let k = 0
  while (k < arr.length - 1) {
    let kk = k + 1
    while (kk <= arr.length - 1) {
      if (egal(arr[k], arr[kk], tolerance)) {
        arr[k] = (arr[k] + arr[kk]) / 2 // On remplace la valeur dont on a trouvé un double par la moyenne des deux valeurs
        arr.splice(kk, 1) // on supprime le doublon.
      } else {
        kk++
      }
    }
    k++
  }
  return arr
}

/**
 * fonction qui retourne une chaine construite en concaténant les arguments
 * Le rôle de cette fonction est de construire un identifiant unique de question
 * afin de contrôler que l'aléatoire ne produit pas deux questions identiques.
 * @author Jean-Claude Lhote
 */
export function checkSum (...args) {
  let checkString = ''
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === 'number') {
      checkString += Number(args[i]).toString()
    } else {
      checkString += args[0]
    }
  }
  return checkString
}

/**
 * Mélange les items d'un tableau, sans modifier le tableau passé en argument
 *
 * @Example
 * tableau_melange = shuffle (tableau_origine)
 * @Source https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
export function shuffle (array) {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  const arrayBis = [...array]
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = arrayBis[currentIndex]
    arrayBis[currentIndex] = arrayBis[randomIndex]
    arrayBis[randomIndex] = temporaryValue
  }

  return arrayBis
}

export function shuffleJusqua (array, indice) {
  if (indice > array.length || indice < 0 || indice === undefined) {
    return shuffle(array)
  } else {
    const tableau1 = array.slice(0, indice)
    const tableau2 = array.slice(indice)
    return [...shuffle(tableau1), ...tableau2]
  }
}

/**
 * Mélange les lettres d'un string
 *
 * @Example
 * motMelange = shuffleLettres (mot)
 * @Source https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
export function shuffleLettres (txt) {
  const array = txt.split('')
  return shuffle(array).join('')
}

/**
 * Mélange les items de deux tableaux de la même manière
 *
 *
 * @Source https://stackoverflow.com/questions/18194745/shuffle-multiple-javascript-arrays-in-the-same-way
 */
export function shuffle2tableaux (obj1, obj2) {
  let index = obj1.length
  let rnd, tmp1, tmp2

  while (index) {
    rnd = Math.floor(Math.random() * index)
    index -= 1
    tmp1 = obj1[index]
    tmp2 = obj2[index]
    obj1[index] = obj1[rnd]
    obj2[index] = obj2[rnd]
    obj1[rnd] = tmp1
    obj2[rnd] = tmp2
  }
}

/**
 * Trie un dictionnaire suivant ses clés
 *
 * @Example
 * dictionnaire_tri = tridictionnaire(dictionnaire)
 * @Source https://stackoverflow.com/questions/10946880/sort-a-dictionary-or-whatever-key-value-data-structure-in-js-on-word-number-ke
 */
export function tridictionnaire (dict) {
  const sorted = []
  for (const key in dict) {
    sorted[sorted.length] = key
  }
  sorted.sort()

  const tempDict = {}
  for (let i = 0; i < sorted.length; i++) {
    tempDict[sorted[i]] = dict[sorted[i]]
  }

  return tempDict
}

/**
 * Supprime les valeurs d'en array et renvoie l'array filtré
 * @param {any[]} valeurs à supprimer de l'array
 * @param {any[]} array à filtrer
 * @returns array filtré
 */
export function filtrer (valeurs, array) {
  return array.filter((valeur) => !valeurs.includes(valeur))
}

/**
 * Filtre un dictionnaire suivant les premiers caractères de ses clés
 *
 * @Example
 * filtreDictionnaire(dict,'6N') renvoie un dictionnaire où toutes les clés commencent par 6N
 * @author Rémi Angot
 */
export function filtreDictionnaire (dict, sub) {
  return Object.assign({}, ...Object.entries(dict).filter(([k]) => k.substring(0, sub.length) === sub).map(([k, v]) => ({ [k]: v }))
  )
}

/**
 * Polyfill Object.fromEntries
 *
 * @Source : https://gitlab.com/moongoal/js-polyfill-object.fromentries/
 */
if (!Object.fromEntries) {
  Object.defineProperty(Object, 'fromEntries', {
    value (entries) {
      if (!entries || !entries[Symbol.iterator]) {
        throw new Error('Object.fromEntries() requires a single iterable argument')
      }

      const o = {}

      Object.keys(entries).forEach((key) => {
        const [k, v] = entries[key]

        o[k] = v
      })

      return o
    }
  })
}

/**
 * Filtre un dictionnaire suivant la valeur d'une clé
 *
 * @Example
 * filtreDictionnaireValeurCle(dict,'annee',2020) renvoie un dictionnaire où toutes les clés annee seront égales à 2020
 * @author Rémi Angot
 */
export function filtreDictionnaireValeurCle (dict, key, val) {
  return Object.fromEntries(Object.entries(dict).filter(([k, v]) => v[key] === val))
}

/**
 * Filtre un dictionnaire si une valeur appartient à une clé de type tableau
 *
 * @Example
 * filtreDictionnaireValeurCle(dict,'annee',2020) renvoie un dictionnaire où toutes les clés annee seront égales à 2020
 * @author Rémi Angot
 */
export function filtreDictionnaireValeurTableauCle (dict, key, val) {
  return Object.fromEntries(Object.entries(dict).filter(([k, v]) => cleExisteEtContient(v[key], val)))
}

function cleExisteEtContient (v, val) {
  if (v !== undefined) {
    return v.includes(val)
  } else {
    return false
  }
}

/**
 * Concatène liste à elle-même en changeant l'ordre à chaque cycle
 *
 *
 * @Example
 * combinaisonListes([A,B,C],7)
 * // [B,C,A,C,B,A,A,B,C]
 *
 * @author Rémi Angot
 */
export function combinaisonListes (liste, tailleMinimale) {
  if (liste.length === 0) window.notify('erreur dans CombinaisonListes : la liste à combiner est vide', { liste })
  let l = shuffle(liste) // on ne modifie pas la liste passée en argument !
  while (l.length < tailleMinimale) {
    l = l.concat(shuffle(liste))
  }
  return l
}

/**
 * Concatène liste à elle-même en imposant à la nouvelle liste de contenir au moins tous les élements
 * de la liste initiale mais sans gestion de nombre de doublons au final.
 * @Example
 * combinaisonListes2([A,B,C],7)
 * // [B,C,B,B,C,A,B]
 * combinaisonListes2([A,B,C,D],6)
 * // [B,C,D,B,C,A,B]
 * @author Eric Elter
 */
export function combinaisonListes2 (liste, tailleMinimale) {
  if (liste.length === 0) window.notify('erreur dans CombinaisonListes : la liste à combiner est vide', { liste })
  let l = [...liste] // on ne modifie pas la liste passée en argument !
  while (l.length < tailleMinimale) {
    l = l.concat(choice(liste))
  }
  return shuffle(l)
}

export function combinaisonListesSansChangerOrdre (liste, tailleMinimale) {
  // Concatène liste à elle même en changeant
  if (liste.length === 0) window.notify('erreur dans CombinaisonListes : la liste à combiner est vide', { liste })
  let l = [...liste] // on ne modifie pas la liste passée en argument !
  while (l.length < tailleMinimale) {
    l = l.concat(liste)
  }
  return l
}

/** Renvoie une liste exhaustive de tableaux contenant les mêmes élèments que tab mais jamais dans le même ordre
 * Fonction fort utile quand reponse est une suite de nombres par exemple. Voir ligne 111 Exercice 3A10-6.
 * Gros défaut :  Si tab contient plus de 6 éléments, cette fonction est chronophage. A ne pas utiliser
 * @example reponse = diversesReponsesPossibles([3,4,5]) renvoie [[3,4,5],[3,5,4],[4,3,5],[4,5,3],[5,3,4],[5,4,3]]
 * et ensuite pour les tous les i : reponse[i]=reponse[i].join(';') et reponse contient alors toutes les réponses possibles
 * @author Eric Elter
 * Septembre 2022
 */
export function diversesReponsesPossibles (tab) {
  let tab2, tab3
  const rep = []
  if (tab.length === 1) return (tab)
  for (let ee = 0; ee < tab.length; ee++) {
    tab2 = tab.slice()
    tab2.splice(ee, 1)
    tab3 = diversesReponsesPossibles(tab2)
    for (let k = 0; k < tab3.length; k++) {
      rep.push([tab[ee]].concat(tab3[k]))
    }
  }
  return rep
}

/**
 * N'écrit pas un nombre s'il est égal à 1
 * @Example
 * //rienSi1(1)+'x' -> x
 * //rienSi1(-1)+'x' -> -x
 * @author Rémi Angot et Jean-Claude Lhote pour le support des fractions
 */
export function rienSi1 (a) {
  if (equal(a, 1)) return ''
  if (equal(a, -1)) return '-'
  if (a instanceof Fraction || a instanceof FractionEtendue) return a.toLatex()
  if (Number(a) || a === 0) return stringNombre(a) // on retourne 0 ce sera pas joli, mais Number(0) est false !!!
  window.notify('rienSi1 : type de valeur non prise en compte : ', { a })
}

/**
 * Gère l'écriture de l'exposant en mode text (ne doit pas s'utiliser entre $ $)
 * Pour le mode maths (entre $ $) on utilisera tout simplement ^3 pour mettre au cube ou ^{42} pour la puissance 42.
 * @Example
 * // 'dm'+texteExposant(3)
 * @author Rémi Angot
 */
export function texteExposant (texte) {
  if (context.isHtml) {
    return `<sup>${texte}</sup>`
  } else {
    return `\\up{${texte}}`
  }
}

/**
 * Gère l'écriture de l'indice en mode text (ne doit pas s'utiliser entre $ $)
 * Pour le mode maths (entre $ $) on utilisera tout _3 pour mettre un indice 3 ou _{42} pour l'indice 42.
 * @param {string} texte
 * @Example
 * // `(d${texteIndice(3)})`
 * @author Jean-Claude Lhote
 */
export function texteIndice (texte) {
  if (context.isHtml) {
    return `<sub>${texte}</sub>`
  } else {
    return `\\textsubscript{${texte}}`
  }
}

/**
 * Ajoute les parenthèses et le signe
 * @Example
 * //(+3) ou (-3)
 * @author Rémi Angot
 */
export function ecritureNombreRelatif (a) {
  let result = ''
  if (a > 0) {
    result = '(+' + a + ')'
  } else if (a < 0) {
    result = '(' + a + ')'
  } else { // ne pas mettre de parenthèses pour 0
    result = '0'
  }
  return result
}

/**
 * Idem ecritureNombreRelatif avec le code couleur : vert si positif, rouge si négatif, noir si nul
 * @param {number} a
 */
export function ecritureNombreRelatifc (a) {
  let result = ''
  if (a > 0) {
    result = miseEnEvidence('(+' + texNombre(a) + ')', 'blue')
  } else if (a < 0) {
    result = miseEnEvidence('(' + texNombre(a) + ')')
  } else { // ne pas mettre de parenthèses pour 0
    result = miseEnEvidence('0', 'black')
  }
  return result
}

/**
 * Ajoute le + devant les nombres positifs
 * @Example
 * //+3 ou -3
 * @author Rémi Angot et Jean-claude Lhote pour le support des fractions
 */
export function ecritureAlgebrique (a) {
  if (a instanceof Fraction || a instanceof FractionEtendue) return fraction(a).ecritureAlgebrique
  else if (typeof a === 'number') {
    if (a >= 0) {
      return '+' + stringNombre(a)
    } else {
      return stringNombre(a)
    }
  } else if (a instanceof Decimal) {
    if (a.isPos()) {
      return '+' + stringNombre(a)
    } else {
      return stringNombre(a)
    }
  } else window.notify('rienSi1 : type de valeur non prise en compte')
}

/**
 * Ajoute le + devant les nombres positifs, n'écrit rien si 1
 * @Example
 * //+3 ou -3
 * @author Rémi Angot et Jean-Claude Lhote pour le support des fractions
 */
export function ecritureAlgebriqueSauf1 (a) {
  if (equal(a, 1)) return '+'
  else if (equal(a, -1)) return '-'
  else if (a instanceof Fraction || a instanceof FractionEtendue) return fraction(a).ecritureAlgebrique
  else if (typeof a === 'number') return ecritureAlgebrique(a)
  else window.notify('rienSi1 : type de valeur non prise en compte')
}

/**
 * Idem ecritureAlgebrique mais retourne le nombre en couleur (vert si positif, rouge si négatif et noir si nul)
 * @param {number} a
 */
export function ecritureAlgebriquec (a) {
  let result = ''
  if (a > 0) {
    result = miseEnEvidence('+' + texNombre(a), 'blue')
  } else if (a < 0) {
    result = miseEnEvidence(texNombre(a))
  } else result = miseEnEvidence(texNombre(a), 'black')
  return result
}

/**
 * @param {number} r Un nombre relatif
 * @param {number} precision nombre de chiffres maximum après la virgule pour texNombre.
 * @returns {string} met en évidence le signe - si r < 0
 */

export function signeMoinsEnEvidence (r, precision = 0) {
  if (r < 0) return miseEnEvidence('-') + texNombre(Math.abs(r), precision)
  else return texNombre(Math.abs(r), precision)
}

/**
 * Ajoute des parenthèses aux nombres négatifs
 * @Example
 * // 3 ou (-3)
 * @author Rémi Angot
 */
export function ecritureParentheseSiNegatif (a) {
  let result = ''
  if (a instanceof Decimal) {
    if (a.gte(0)) return texNombre(a, 8) // On met 8 décimales, mais cette fonctions s'utilise presque exclusivement avec des entiers donc ça ne sert à rien
    else return `(${texNombre(a, 8)})`
  } else {
    if (a >= 0) {
      result = texNombre(a, 8) // j'ai passé a dans texNombre, car la fonction ne prenait pas en compte l'écriture décimale !
    } else {
      result = `(${texNombre(a, 8)})`
    }
    return result
  }
}

/**
 * Ajoute des parenthèses si une expression commence par un moins
 * @Example
 * // (-3x)
 * @author Rémi Angot
 */
export function ecritureParentheseSiMoins (expr) {
  if (expr[0] === '-') return `(${expr})`
  else return expr
}

/**
 *
 * @author Jean-claude Lhote
 * @param {numero} 1=A, 2=B ..
 * @param {etapes} tableau de chaines comportant les expressions à afficher dans le membre de droite.
 */

export function calculAligne (numero, etapes) {
  let script = `$\\begin{aligned}${miseEnEvidence(lettreDepuisChiffre(numero))}&=${etapes[0]}`
  for (let i = 1; i < etapes.length - 1; i++) {
    script += `\\\\&=${etapes[i]}`
  }
  script += `\\\\${miseEnEvidence(lettreDepuisChiffre(numero) + '&=' + etapes[etapes.length - 1])}$`
  return script
}

/**
 * Renvoie la valeur du chiffre (8->8, A->10, B->11...)
 *
 * @author Rémi Angot
 */
export function valeurBase (n) {
  switch (n) {
    case 'A':
      return 10
    case 'B':
      return 11
    case 'C':
      return 12
    case 'D':
      return 13
    case 'E':
      return 14
    case 'F':
      return 15
    default:
      return parseInt(n)
  }
}

export function baseValeur (n) {
  switch (n) {
    case 10:
      return 'A'
    case 11:
      return 'B'
    case 12:
      return 'C'
    case 13:
      return 'D'
    case 14:
      return 'E'
    case 15:
      return 'F'
    default:
      return Number(n).toString()
  }
}

/**
 * Convertit une chaine correspondant à un nombre écrit en base b en un nombre entier en base 10.
 * @param {} nombre
 * @param {number} b la base de départ
 */
export function baseNVersBase10 (stringNombre, b) {
  let result = 0
  if (typeof stringNombre === 'number') {
    stringNombre = stringNombre.toString()
  } else if (stringNombre instanceof Decimal) {
    stringNombre = stringNombre.toNumber().toString()
  }
  for (let i = 0; i < stringNombre.length; i++) {
    result += b ** i * valeurBase(stringNombre.charAt(stringNombre.length - 1 - i))
  }
  return result
}

export function base10VersBaseN (nombre, b) {
  // let puissanceMax = 0
  // let chiffre
  // let valeur
  // let code = ''
  // while (b ** (puissanceMax + 1) < nombre) {
  //   puissanceMax++
  // }
  // for (let i = puissanceMax; i >= 0; i--) {
  //   chiffre = 0
  //   do {
  //     valeur = chiffre * b ** i
  //     chiffre++
  //   } while (valeur + b ** i <= nombre)
  //   chiffre--
  //   code += baseValeur(chiffre)
  //   nombre -= chiffre * b ** i
  // }
  // return code
  if (nombre instanceof Decimal) return nombre.toNumber().toString(b).toUpperCase()
  else return nombre.toString(b).toUpperCase()
  // Il y avait un probleme avec 3 = (3)_3
}

/**
 *
 * @param {array} matrice M tableau 3x3 nombres
 * @param {array} vecteur A tableau 3 nombres
 * Fonction pouvant être utilisée en 2d avec des coordonnées homogènes
 * elle retourne le vecteur [x,y,z] résultat de M.A
 * @author Jean-Claude Lhote
 */

export function produitMatriceVecteur3x3 (matrice, vecteur) { // matrice est un tableau 3x3 sous la forme [[ligne 1],[ligne 2],[ligne 3]] et vecteur est un tableau de 3 nombres [x,y,z]
  const resultat = [0, 0, 0]
  for (let j = 0; j < 3; j++) { // Chaque ligne de la matrice
    for (let i = 0; i < 3; i++) { // On traite la ligne i de la matrice -> résultat = coordonnée i du vecteur résultat
      resultat[j] += matrice[j][i] * vecteur[i]
    }
  }
  return resultat
}

/**
 *
 * @param {array} matrice1 Matrice A
 * @param {array} matrice2 Matrice B
 * retourne la matrice A.B
 * @author Jean-Claude Lhote
 */

export function produitMatriceMatrice3x3 (matrice1, matrice2) { // les deux matrices sont des tableaux 3x3  [[ligne 1],[ligne 2],[ligne 3]] et le résultat est de la même nature.
  const resultat = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      for (let k = 0; k < 3; k++) {
        resultat[j][i] += matrice1[j][k] * matrice2[k][i]
      }
    }
  }
  return resultat
}

/**
 *
 * @param {array} point
 * calcule les coordonnées d'un point donné par ses coordonnées en repère orthonormal en repère (O,I,J) tel que IOJ=60°
 * @author Jean-Claude Lhote
 */
export function changementDeBaseOrthoTri (point) {
  if (point.length === 2) point.push(1)
  return produitMatriceVecteur3x3([[1, -Math.cos(Math.PI / 3) / Math.sin(Math.PI / 3), 0], [0, 1 / Math.sin(Math.PI / 3), 0], [0, 0, 1]], point)
}

/**
 *
 * @param {array} point
 * Changement de base inverse de la fonction précédente
 * @author Jean-CLaude Lhote
 */
export function changementDeBaseTriOrtho (point) {
  if (point.length === 2) point.push(1)
  return produitMatriceVecteur3x3([[1, Math.cos(Math.PI / 3), 0], [0, Math.sin(Math.PI / 3), 0], [0, 0, 1]], point)
}

/**
 *
 * @param {number} transformation Entier déterminant la transformation voulue
 ** 1=symétrie / passant par O
 **2=symétrie \ passant par O
 **3=symétrie _ passant par O
 **4=symétrie | passant par O
 **5= rotation 90° anti-horaire centre O
 **6= rotation 90° horaire centre O
 **7= symétrie centrale centre O
 **11= rotation 60° anti-horaire centre O
 **12= rotation 60° horaire centre O
 **13= rotation 120° anti-horaire centre O
 **14= rotation 120° horaire centre O
 **8= translation coordonnées de O = vecteur de translation
 **9= homothétie. centre O rapport k
 **10= homothétie. centre O rapport 1/k
 * @param {array} pointA Point dont on cherche l'image
 * @param {array} pointO Centre du repère local pour les symétries, centre pour les rotations et les homothéties
 * @param {array} vecteur Vecteur de la translation
 * @param {number} rapport rapport d'homothétie
 * @author Jean-Claude Lhote
 */
export function imagePointParTransformation (transformation, pointA, pointO, vecteur = [], rapport = 1) { // pointA,centre et pointO sont des tableaux de deux coordonnées
  // on les rends homogènes en ajoutant un 1 comme 3ème coordonnée)
  // nécessite d'être en repère orthonormal...
  // Point O sert pour les rotations et homothéties en tant que centre (il y a un changement d'origine du repère en O pour simplifier l'expression des matrices de transformations.)

  const matriceSymObl1 = matriceCarree([[0, 1, 0], [1, 0, 0], [0, 0, 1]]) // x'=y et y'=x
  const matriceSymxxprime = matriceCarree([[1, 0, 0], [0, -1, 0], [0, 0, 1]]) // x'=x et y'=-y
  const matriceSymYyPrime = matriceCarree([[-1, 0, 0], [0, 1, 0], [0, 0, 1]]) // x'=-x et y'=y
  const matriceSymObl2 = matriceCarree([[0, -1, 0], [-1, 0, 0], [0, 0, 1]]) // x'=-y et y'=-x
  const matriceQuartDeTourDirect = matriceCarree([[0, -1, 0], [1, 0, 0], [0, 0, 1]]) // x'=-y et y'=x
  const matriceQuartDeTourIndirect = matriceCarree([[0, 1, 0], [-1, 0, 0], [0, 0, 1]]) // x'=y et y'=-x
  const matriceSymCentrale = matriceCarree([[-1, 0, 0], [0, -1, 0], [0, 0, 1]]) // x'=-x et y'=-y
  const matriceRotation60Direct = matriceCarree([[0.5, -Math.sin(Math.PI / 3), 0], [Math.sin(Math.PI / 3), 0.5, 0], [0, 0, 1]])
  const matriceRotation60Indirect = matriceCarree([[0.5, Math.sin(Math.PI / 3), 0], [-Math.sin(Math.PI / 3), 0.5, 0], [0, 0, 1]])
  const matriceRotation120Direct = matriceCarree([[-0.5, -Math.sin(Math.PI / 3), 0], [Math.sin(Math.PI / 3), -0.5, 0], [0, 0, 1]])
  const matriceRotation120Indirect = matriceCarree([[-0.5, Math.sin(Math.PI / 3), 0], [-Math.sin(Math.PI / 3), -0.5, 0], [0, 0, 1]])

  let pointA1 = [0, 0, 0]
  let pointA2 = [0, 0, 0]

  if (pointA.length === 2) pointA.push(1)
  const x2 = pointO[0] // Point O' (origine du repère dans lequel les transformations sont simples (centre des rotations et point d'intersection des axes))
  const y2 = pointO[1]
  const u = vecteur[0] // (u,v) vecteur de translation.
  const v = vecteur[1]
  const k = rapport // rapport d'homothétie

  const matriceChangementDeRepere = matriceCarree([[1, 0, x2], [0, 1, y2], [0, 0, 1]])
  const matriceChangementDeRepereInv = matriceCarree([[1, 0, -x2], [0, 1, -y2], [0, 0, 1]])
  const matriceTranslation = matriceCarree([[1, 0, u], [0, 1, v], [0, 0, 1]])
  const matriceHomothetie = matriceCarree([[k, 0, 0], [0, k, 0], [0, 0, 1]])
  const matriceHomothetie2 = matriceCarree([[1 / k, 0, 0], [0, 1 / k, 0], [0, 0, 1]])

  let matrice

  switch (transformation) {
    case 1:
      matrice = matriceSymObl1.multiplieMatriceCarree(matriceChangementDeRepereInv)
      break
    case 2:
      matrice = matriceSymObl2.multiplieMatriceCarree(matriceChangementDeRepereInv)
      break
    case 3:
      matrice = matriceSymxxprime.multiplieMatriceCarree(matriceChangementDeRepereInv)
      break
    case 4:
      matrice = matriceSymYyPrime.multiplieMatriceCarree(matriceChangementDeRepereInv)
      break
    case 5:
      matrice = matriceQuartDeTourDirect.multiplieMatriceCarree(matriceChangementDeRepereInv)
      break
    case 6:
      matrice = matriceQuartDeTourIndirect.multiplieMatriceCarree(matriceChangementDeRepereInv)
      break
    case 7:
      matrice = matriceSymCentrale.multiplieMatriceCarree(matriceChangementDeRepereInv)
      break
    case 11:
      matrice = matriceRotation60Direct.multiplieMatriceCarree(matriceChangementDeRepereInv)
      break
    case 12:
      matrice = matriceRotation60Indirect.multiplieMatriceCarree(matriceChangementDeRepereInv)
      break
    case 13:
      matrice = matriceRotation120Direct.multiplieMatriceCarree(matriceChangementDeRepereInv)
      break
    case 14:
      matrice = matriceRotation120Indirect.multiplieMatriceCarree(matriceChangementDeRepereInv)
      break
    case 8:
      matrice = matriceTranslation.multiplieMatriceCarree(matriceChangementDeRepereInv)
      break
    case 9:
      matrice = matriceHomothetie.multiplieMatriceCarree(matriceChangementDeRepereInv)
      break
    case 10:
      matrice = matriceHomothetie2.multiplieMatriceCarree(matriceChangementDeRepereInv)
      break
  }
  pointA1 = matrice.multiplieVecteur(pointA)
  pointA2 = matriceChangementDeRepere.multiplieVecteur(pointA1)
  return pointA2
}

/**
 * Retourne le signe d'un nombre
 * @Example
 * // + ou -
 * @author Rémi Angot
 */
export function signe (a) { // + ou -
  let result = ''
  if (a > 0) {
    result = '+'
  } else {
    result = '-'
  }
  return result
}

/**
 *
 * @param {number} a
 * -1 si a est négatif, 1 sinon.
 * @author Jean-Claude Lhote
 */
export function unSiPositifMoinsUnSinon (a) {
  if (a < 0) return -1
  else return 1
}

/**
 * Retourne la somme des chiffres (ou d'un tableau de chiffres) d'un nombre en valeur et sous forme de String [valeur, String]
 * @Example
 * sommeDesChiffres(123)
 * // [ 6, '1+2+3']
 * @author Rémi Angot (Rajout Tableau par EE)
 */export function sommeDesChiffres (n) {
  let nString
  if (Array.isArray(n)) nString = n.join('').toString()
  else nString = n.toString()
  let somme = 0
  let sommeString = ''
  for (let i = 0; i < nString.length - 1; i++) {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(nString[i] !== -1)) {
      sommeString += nString[i] + '+'
      somme += Number(nString[i])
    }
  }
  if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(nString[nString.length - 1] !== -1)) {
    sommeString += nString[nString.length - 1]
    somme += Number(nString[nString.length - 1])
  }
  return [somme, sommeString]
}

/**
 * Retourne l'arrondi (par défaut au centième près)
 * @author Rémi Angot
 * @param {number} nombre
 * @param {number} precision
 * @return {number}
 */
export function arrondi (nombre, precision = 2) {
  if (isNaN(nombre)) {
    window.notify('Le nombre à arrondir n\'en est pas un, ça retourne NaN', { nombre, precision })
    return NaN
  } else {
    return round(nombre, precision)
  }
}

/**
 * Retourne la troncature signée de nombre.
 * @author Jean-Claude Lhote
 */
export function troncature (nombre, precision) {
  const tmp = Math.pow(10, precision)
  const absolu = new Decimal(nombre).abs()
  const tronc = absolu.mul(tmp).floor().div(tmp)
  if (nombre < 0) return tronc.mul(-1).toNumber()
  else return tronc.toNumber()
}

/**
 * Renvoie la valeur absolue
 * @author Rémi Angot + ajout du support des décimaux par Jean-Claude Lhote
 */
export function abs (a) {
  if (a instanceof Decimal) return a.abs()
  return Math.abs(a)
}

/**
 * Retourne un arrondi sous la forme d'un string avec une virgule comme séparateur décimal
 * @author Rémi Angot Fonction rendue inutile par Jean-Claude Lhote : lui substituer texNombre ou stringNombre selon le contexte.
 */
// export function arrondiVirgule (nombre, precision = 2) { //
// const tmp = Math.pow(10, precision)
//  return String(round(nombre, precision)).replace('.', ',')
// }

/**
 * Retourne égal si la valeur égal l'arrondi souhaité ou environ égal si ce n'est pas le cas
 * le nombre a est comparé à son arrondi à précision près. Si la différence est inférieure à epsilon, alors on retourne '=' sinon '\\approx'
 * fonctionne aussi si a est une fraction : permet de finir un calcul par la valeur décimale si on veut.
 * @author Jean-Claude Lhote
 */
export function egalOuApprox (a, precision) {
  if (typeof a === 'object' && ['Fraction', 'FractionEtendue'].indexOf(a.type) !== -1) {
    return egal(a.n / a.d, arrondi(a.n / a.d, precision)) ? '=' : '\\approx'
  } else if (a instanceof Decimal) {
    return a.eq(a.toDP(precision)) ? '=' : '\\approx'
  } else if (!isNaN(a) && !isNaN(precision)) return egal(a, round(a, precision), 10 ** (-precision - 2)) ? '=' : '\\approx'
  else {
    window.notify('egalOuApprox : l\'argument n\'est pas un nombre', { a, precision })
    return 'Mauvais argument (nombres attendus).'
  }
}

/**
 * Renvoie le PGCD de deux nombres
 * @author Rémi Angot
 */
export function pgcd (...args) {
  return gcd(...args)
}

/**
 * Retourne le numérateur et le dénominateur de la fraction passée en argument sous la forme (numérateur,dénominateur)réduite au maximum dans un tableau [numérateur,dénominateur]
 * * **ATTENTION Fonction clonée dans la classe FractionEtendue()**
 * @author Rémi Angot
 */
export function fractionSimplifiee (n, d) {
  const p = pgcd(n, d)
  let ns = n / p
  let ds = d / p
  if (ns < 0 && ds < 0) {
    [ns, ds] = [-ns, -ds]
  }
  if (ns > 0 && ds < 0) {
    [ns, ds] = [-ns, -ds]
  }
  return [ns, ds]
}

/**
 * Retourne le code LaTeX d'une fraction simplifiée ou d'un nombre entier
 * @author Rémi Angot
 */
export function texFractionReduite (n, d) {
  if (Math.abs(n) % Math.abs(d) === 0) {
    return n / d
  } else {
    return texFractionSigne(fractionSimplifiee(n, d)[0], fractionSimplifiee(n, d)[1])
  }
}

/**
 * produitDeDeuxFractions(num1,den1,num2,den2) retourne deux chaines :
 * la première est la fraction résultat, la deuxième est le calcul mis en forme Latex avec simplification éventuelle
 * Applique une simplification si le numérateur de l'une est égal au dénominateur de l'autre.
 */
export function produitDeDeuxFractions (num1, den1, num2, den2) {
  let num, den, texProduit
  if (num1 === den2) {
    texProduit = `\\dfrac{\\cancel{${num1}}\\times ${ecritureParentheseSiNegatif(num2)}}{${den1}\\times\\cancel{${ecritureParentheseSiNegatif(den2)}}}`
    num = num2
    num1 = 1
    den2 = 1
    den = den1
  } else if (num2 === den1) {
    texProduit = `\\dfrac{${num1}\\times \\cancel{${ecritureParentheseSiNegatif(num2)}}}{\\cancel{${den1}}\\times${ecritureParentheseSiNegatif(den2)}}`
    num = num1
    num2 = 1
    den1 = 1
    den = den2
  } else {
    num = num1 * num2
    den = den1 * den2
    texProduit = `\\dfrac{${num1}\\times ${ecritureParentheseSiNegatif(num2)}}{${den1}\\times${ecritureParentheseSiNegatif(den2)}}`
  }
  return [texFraction(num, den), texProduit, [num1, den1, num2, den2]]
}

/**
 *
 * Simplifie une fraction en montrant les étapes
 * Le résultat est un string qui doit être entouré de $ pour le mode mathématiques
 * @author Rémi Angot
 */
export function simplificationDeFractionAvecEtapes (num, den) {
  let result = '='
  if (num === 0) {
    return '=0'
  }
  const signe = num * den < 0 ? '-' : ''
  const numAbs = Math.abs(num)
  const denAbs = Math.abs(den)
  // Est-ce que le résultat est simplifiable ?
  const s = pgcd(numAbs, denAbs)
  if (s !== 1) {
    if (numAbs % denAbs === 0) { // si le résultat est entier
      result += `${num / den}`
    } else {
      result += `${signe}${texFraction(numAbs / s + miseEnEvidence('\\times' + s), denAbs / s + miseEnEvidence('\\times' + s))}=${texFractionSigne(num / s, den / s)}`
    }
  } else if (num < 0 || den < 0) {
    result += `${texFractionSigne(num, den)}`
  } else return ''
  return result
}

/**
 * Retourne l'égalité des produits en croix à partir d'un tableau contenant les deux fractions [[a,b],[c,d]] pour a/b=c/d retourne ad=bc
 * Le résultat est un string en mode maths inline
 * @author Jean-Claude Lhote
 */

export function produitsEnCroix ([[a, b], [c, d]]) { // écrit une chaine pour a*d=b*c
  let result = ''
  result += `$${a}\\times${d}=${b}\\times${c}$`
  return result
}

/**
 * Retourne la quatrième proportionnelle de 3 nombres en fonction d'une précision demandée
 * Le résultat est un string qui doit être entouré de $ pour le mode mathématiques
 * @author Jean-Claude Lhote
 */

export function quatriemeProportionnelle (a, b, c, precision) { // calcul de b*c/a
  let result = ''
  if ((typeof a) === 'number' && (typeof b) === 'number' && (typeof c) === 'number') {
    if (a === 0) {
      result = '=erreur : division par zéro'
      return result
    }
    const p4 = new Decimal(b).mul(c).div(a)
    result += `\\dfrac{${texNombre(b)}\\times${texNombre(c)}}{${texNombre(a)}}`
    if (p4.eq(p4.toDP(precision))) result += '='
    else result += '\\approx'
    result += `${texNombre(p4, precision)}`
    return result
  } else {
    return `\\dfrac{${b} \\times${c}}{${a}}`
  }
}

/**
 * renvoie une chaine correspondant à l'écriture réduite de ax+b selon les valeurs de a et b
 * La lettre par défaut utilisée est 'x' mais peut être tout autre chose.
 * @author Jean-Claude Lhote
 * @param {number} a
 * @param {number} b
 */
export function reduireAxPlusB (a, b) {
  if (!(a instanceof Decimal)) a = new Decimal(a)
  if (!(b instanceof Decimal)) b = new Decimal(b)
  let result = ''
  if (!a.isZero()) {
    if (a.eq(1)) result = 'x'
    else if (a.eq(-1)) result = '-x'
    else result = `${stringNombre(a)}x`
  }
  if (!b.isZero()) {
    if (!a.isZero()) result += `${ecritureAlgebrique(b)}`
    else result = stringNombre(b)
  } else if (a.isZero()) result = '0'
  return result
}

/**
 * renvoie une chaine correspondant à l'écriture réduite de ax^3+bx^2+cx+d selon les valeurs de a,b,c et d
 * @author Jean-Claude Lhote
 */
export function reduirePolynomeDegre3 (a, b, c, d, x = 'x') {
  let result = ''
  if (a !== 0) {
    switch (a) {
      case 1:
        result += `${x}^3`
        break
      case -1:
        result += `-${x}^3`
        break
      default:
        result += `${a}${x}^3`
        break
    }
    if (b !== 0) {
      switch (b) {
        case 1:
          result += `+${x}^2`
          break
        case -1:
          result += `-${x}^2`
          break
        default:
          result += `${ecritureAlgebrique(b)}${x}^2`
          break
      }
    }
    if (c !== 0) {
      switch (c) {
        case 1:
          result += `+${x}`
          break
        case -1:
          result += `-${x}`
          break
        default:
          result += `${ecritureAlgebrique(c)}${x}`
          break
      }
    }
    if (d !== 0) {
      result += `${ecritureAlgebrique(d)}`
    }
  } else { // degré 2 pas de degré 3
    if (b !== 0) {
      switch (b) {
        case 1:
          result += `${x}^2`
          break
        case -1:
          result += `-${x}^2`
          break
        default:
          result += `${b}${x}^2`
          break
      }
      if (c !== 0) {
        switch (c) {
          case 1:
            result += `+${x}`
            break
          case -1:
            result += `-${x}`
            break
          default:
            result += `${ecritureAlgebrique(c)}${x}`
            break
        }
      }
      if (d !== 0) {
        result += `${ecritureAlgebrique(d)}`
      }
    } else // degré 1 pas de degré 2 ni de degré 3
    if (c !== 0) {
      switch (c) {
        case 1:
          result += `${x}`
          break
        case -1:
          result += `-${x}`
          break
        default:
          result += `${c}${x}`
          break
      }
      if (d !== 0) {
        result += `${ecritureAlgebrique(d)}`
      }
    } else { // degré 0 a=0, b=0 et c=0
      result += `${d}`
    }
  }
  return result
}

/**
 * Donne la liste des facteurs premiers d'un nombre
 * @param { number } n - Nombre à décomposer
 * @returns {number[]} - Liste des facteurs premiers
 */
export function obtenirListeFacteursPremiers (n) {
  if (n === 1 || n === 0) return [] // 1 n'est pas premier, mais, sinon, ça retourne [NaN]
  const facteurs = []
  const signe = n < 0 ? -1 : 1
  for (let i = 2; i <= Math.abs(n); i++) {
    while (n % i === 0) {
      facteurs.push(i)
      n /= i
    }
  }
  facteurs[0] = signe * facteurs[0]
  return facteurs
}

/**
 *
 * @param {Entier} n
 * Retourne la factorisation d'un entier sous la forme [[a0,n0],[a1,n1],...] où a0,a1 sont les facteurs premiers et n0, n1 sont les exposants de ces facteurs.
 * @author Jean-Claude Lhote
 */

export function factorisation (n) {
  if (n === 1) return [1]
  const liste = obtenirListeFacteursPremiers(n)
  const facto = []
  let index = 0
  for (let i = 0; i < liste.length;) {
    if (liste[i] === 0) i++
    else {
      facto.push([liste[i], 1])
      index++
      for (let j = i + 1; j < liste.length; j++) {
        if (liste[j] === liste[i]) {
          facto[index - 1][1]++
          liste[j] = 0
        }
      }
      i++
    }
  }
  return facto
}

/**
 *
 * @param {number} n
 * @param {boolean} puissancesOn
 * @returns {string} texFacto
 */
export function texFactorisation (n, puissancesOn = true) {
  let texFacto = ''
  let facto = []
  if (puissancesOn) {
    facto = factorisation(n)
    for (let i = 0; i < facto.length - 1; i++) {
      texFacto += `${facto[i][0]}${facto[i][1] > 1 ? '^{' + facto[i][1] + '}\\times ' : '\\times '}`
    }
    texFacto += `${facto[facto.length - 1][0]}${facto[facto.length - 1][1] > 1 ? '^{' + facto[facto.length - 1][1] + '}' : ''}`
  } else {
    facto = obtenirListeFacteursPremiers(n)
    for (let i = 0; i < facto.length - 1; i++) {
      texFacto += `${facto[i][0]}\\times `
    }
    texFacto += `${facto[facto.length - 1][0]}`
  }
  return texFacto
}

/**
 *
 * @param {Entier} n
 * Extrait le plus grand nombre possible de la racine carrée de n
 * retourne le résulat [a,b] pour a²b=n
 * @author Jean-Claude Lhote
 */
export function extraireRacineCarree (n) {
  if (n === 1) return [[1], [1]]
  const facto = factorisation(n)
  let radical = 1
  let facteur = 1
  for (let i = 0; i < facto.length; i++) {
    if (facto[i][1] % 2 === 0) {
      facteur *= facto[i][0] ** (facto[i][1] >> 1)
    } else if (facto[i][1] > 1) {
      facteur *= facto[i][0] ** ((facto[i][1] - 1) >> 1)
      radical *= facto[i][0]
    } else radical *= facto[i][0]
  }
  return [facteur, radical]
}

/**
 *
 * @param {Entier} n
 * retourne le code Latex de la racine carrée de n "réduite"
 * @author Jean-CLaude Lhote
 */
export function texRacineCarree (n) {
  const result = extraireRacineCarree(n)
  if (result[1] === 1) return `${result[0]}`
  else if (result[0] === 1) return `\\sqrt{${result[1]}}`
  else return `${result[0]}\\sqrt{${result[1]}}`
}

/**
 *
 * @param {'string | array'} expression ou tableau d'expressions à évaluer avec XCas
 * @returns string
 * @author Rémi Angot
 */
export function xcas (expression) {
  const sortie = (txt) => UI.caseval(`latex(${txt})`).replaceAll('\\cdot ', '~').replaceAll('\\frac', '\\dfrac').replaceAll('"', '')
  if (typeof expression === 'string') return sortie(expression)
  else {
    const result = []
    for (const txt of expression) {
      result.push(sortie(txt))
    }
    return result
  }
}

/**
 * Utilise un arrondi au millionième pour éviter les flottants à rallonge (erreurs d'arrondis des flottants)
 * Le 2e argument facultatif permet de préciser l'arrondi souhaité : c'est le nombre max de chiffres après la virgule souhaités
 * @author Rémi Angot modifié par Jean-Claude Lhote
 */
export function calcul (x, arrondir = 6) {
  const sansPrecision = (arrondir === undefined)
  // if (sansPrecision) arrondir = 6
  if (typeof x === 'string') {
    window.notify('Calcul : Reçoit une chaine de caractère et pas un nombre', { x })
    x = parseFloat(evaluate(x))
  }
  if (sansPrecision && !egal(x, arrondi(x, arrondir), 10 ** (-arrondir - 1))) {
    window.notify('calcul : arrondir semble avoir tronqué des décimales sans avoir eu de paramètre de précision', {
      x,
      arrondir
    })
  }
  return parseFloat(x.toFixed(arrondir))
}

/**
 * Utilise Algebrite pour s'assurer qu'il n'y a pas d'erreur dans les calculs avec des décimaux
 * Le 2e argument facultatif permet de préciser l'arrondi souhaité
 * @author Rémi Angot
 */
export function nombreDecimal (expression, arrondir = false) {
  if (!arrondir) {
    return stringNombre(new Decimal(expression), 15)
  } else {
    return stringNombre(new Decimal(expression), arrondir)
  }
}

/**
 * Formattage pour une sortie LaTeX entre $$
 * formatFraction = false : si l'expression est un objet fraction du module mathjs alors elle peut donner l'écriture fractionnaire
 * Pour une fraction négative la sortie est -\dfrac{6}{7} au lieu de \dfrac{-6}{7}
 * @author Frédéric PIOU
 */

export function texNum (expression, formatFraction = false) {
  if (typeof expression === 'object') {
    const signe = expression.s === 1 ? '' : '-'
    if (formatFraction) {
      expression = expression.d !== 1 ? signe + texFraction(expression.n, expression.d) : signe + expression.n
      expression = expression.replace(',', '{,}').replace('{{,}}', '{,}')
    } else {
      expression = texNombre(evaluate(format(expression)))
    }
    //  expression = expression.replace(',', '{,}').replace('{{,}}', '{,}') // Supprimé par EE car non fonctionnel dans le else qui précède.
  } else {
    expression = texNombre(parseFloat(Algebrite.eval(expression)))
  }
  return expression
}

/**
 * renvoie le résultat de l'expression en couleur (vert=positif, rouge=négatif, noir=nul)
 * @param {string} expression l'expression à calculer
 */
export function texNombreCoul (nombre, positif = 'green', negatif = 'red', nul = 'black') {
  if (nombre > 0) return miseEnEvidence(texNombre(nombre), positif)
  else if (nombre < 0) return miseEnEvidence(texNombre(nombre), negatif)
  else return miseEnEvidence(texNombre(0), nul)
}

/**
 * prend une liste de nombres relatifs et la retourne avec les positifs au début et les négatifs à la fin.
 * @param {array} liste la liste de nombres à trier
 */
export function triePositifsNegatifs (liste) {
  const positifs = []
  const negatifs = []
  for (let i = 0; i < liste.length; i++) {
    if (liste[i] > 0) positifs.push(liste[i])
    else negatifs.push(liste[i])
  }
  return positifs.concat(negatifs)
}

/**
 * Renvoie un tableau (somme des termes positifs, somme des termes négatifs)
 * @author Rémi Angot
 */
export function sommeDesTermesParSigne (liste) {
  let sommeDesPositifs = 0
  let sommeDesNegatifs = 0
  for (let i = 0; i < liste.length; i++) {
    if (liste[i] > 0) {
      sommeDesPositifs += liste[i]
    } else {
      sommeDesNegatifs += liste[i]
    }
  }
  return [sommeDesPositifs, sommeDesNegatifs]
}

/**
 * Créé un string de nbsommets caractères dans l'ordre alphabétique et en majuscule qui ne soit pas dans la liste donnée en 2e argument
 * @param {integer} nbsommets
 * @param {string[]} listeAEviter
 * @author Rémi Angot
 * Ajout des while pour s'assurer de bien avoir des lettres majuscules le 08/05/2022 par Guillaume Valmont
 **/
export function creerNomDePolygone (nbsommets, listeAEviter = []) {
  let premiersommet = randint(65, 90 - nbsommets)
  let polygone = ''
  if (listeAEviter === undefined) listeAEviter = []
  for (let i = 0; i < nbsommets; i++) {
    let augmentation = i
    while (premiersommet + augmentation > 90) augmentation -= 26
    while (premiersommet + augmentation < 65) augmentation += 26
    polygone += String.fromCharCode(premiersommet + augmentation)
  }

  if (listeAEviter.length < 26 - nbsommets - 1) { // On évite la liste à éviter si elle n'est pas trop grosse sinon on n'en tient pas compte
    let cpt = 0
    while (possedeUnCaractereInterdit(polygone, listeAEviter) && cpt < 20) {
      polygone = ''
      premiersommet = randint(65, 90 - nbsommets)
      for (let i = 0; i < nbsommets; i++) {
        polygone += String.fromCharCode(premiersommet + i)
      }
      cpt++ // Au bout de 20 essais on laisse tomber la liste à éviter
    }
  } else {
    console.log('Trop de questions donc plusieurs polygones peuvent avoir le même nom')
  }
  return polygone
}

/**
 * Vérifie dans un texte si un de ses caractères appartient à une liste à éviter
 * @author Rémi Angot
 */
export function possedeUnCaractereInterdit (texte, listeAEviter) {
  let result = false
  for (const motAeviter of listeAEviter) {
    for (let i = 0; i < motAeviter.length; i++) {
      if (texte.indexOf(motAeviter[i]) > -1) {
        result = true
      }
    }
  }
  return result
}

/**
 * retourne une liste de combien de nombres compris entre m et n (inclus) en évitant les valeurs de listeAEviter
 * toutes la liste des nombres est retournée si combien est supérieur à l'effectif disponible
 * les valeurs sont dans un ordre aléatoire.
 * @author Jean-Claude Lhote
 *
 */
export function choisitNombresEntreMetN (m, n, combien, listeAEviter = []) {
  let t
  if (m > n) {
    t = m
    m = n
    n = t
  } else if (m === n) {
    return [n]
  }
  if (combien > n - m) combien = n - m
  let index = rangeMinMax(m, n, listeAEviter)
  index = shuffle(index)
  index = index.slice(0, combien)
  return index
}

/**
 * retourne une liste de lettres majuscules (ou minuscule si majuscule=false)
 * il y aura nombre lettres dans un ordre aléatoire
 * les lettres à éviter sont données dans une chaine par exemple : 'QXY'
 * @author Jean-Claude Lhote
 */
export function choisitLettresDifferentes (nombre, lettresAeviter = '', majuscule = true) {
  const listeAEviter = []
  const lettres = []
  for (const l of lettresAeviter) {
    listeAEviter.push(l.charCodeAt(0) - 64)
  }
  const index = choisitNombresEntreMetN(1, 26, nombre, listeAEviter)
  for (const n of index) {
    if (majuscule) lettres.push(lettreDepuisChiffre(n))
    else lettres.push(lettreMinusculeDepuisChiffre(n))
  }
  return lettres
}

export function cesar (word, decal) {
  let mot = ''
  let code = 65
  for (let x = 0; x < word.length; x++) {
    code = word.charCodeAt(x) % 65
    code = (code + decal) % 26 + 65
    mot += String.fromCharCode(code)
  }
  return mot
}

export function codeCesar (mots, decal) {
  const motsCodes = []
  for (let x = 0; x < mots.length; x++) {
    motsCodes.push(cesar(mots[x], decal))
  }
  return motsCodes
}

/**
 * Renvoie une lettre majuscule depuis un nombre compris entre 1 et 702
 * Le 2e paramètre est un booléen qui permet d'éviter la lettre D (et donc décale tout d'une lettre après le C) en vue du bug de MathLive
 * @author Rémi Angot
 *@Example
 * // 0 -> @ 1->A ; 2->B...
 * // 27->AA ; 28 ->AB ...
 */
export function lettreDepuisChiffre (i, saufD = false) {
  let result = ''
  if (i <= 26) {
    result = String.fromCharCode(64 + i)
    if (saufD && i >= 4) result = String.fromCharCode(64 + i + 1)
  } else {
    if (i % 26 === 0) {
      result = String.fromCharCode(64 + Math.floor(i / 26) - 1)
      result += String.fromCharCode(64 + 26)
    } else {
      result = String.fromCharCode(64 + Math.floor(i / 26))
      result += String.fromCharCode(64 + i % 26)
    }
  }
  return result
}

/**
 * Renvoie une lettre minuscule depuis un nombre compris entre 1 et 702
 * @author Rémi Angot
 *@Example
 * // 0 -> @ 1->a ; 2->b...
 * // 27->aa ; 28 ->ab ...
 */
export function lettreMinusculeDepuisChiffre (i) {
  return lettreDepuisChiffre(i).toLowerCase()
}

/**
 * Renvoie une lettre majuscule (éventuellement indicée) depuis un nombre compris entre 1 et... sans limite.
 * @author Eric Elter
 *@Example
 * // 0 -> @ 1->A ; 2->B...
 * // 27->A_1 ; 28 ->A_2 ...
 */
export function lettreIndiceeDepuisChiffre (i) {
  const indiceLettre = quotientier(i - 1, 26) === 0 ? '' : quotientier(i - 1, 26)
  return String.fromCharCode(64 + (i - 1) % 26 + 1) + (i > 26 ? `_{${indiceLettre}}` : '')
}

/**
 * Renvoie une lettre minuscule (éventuellement indicée) depuis un nombre compris entre 1 et... sans limite.
 * @author EricElter
 *@Example
 * // 0 -> @ 1->a ; 2->b...
 * // 27->a_1 ; 28 ->a_2 ...
 */
export function lettreIndiceeMinusculeDepuisChiffre (i) {
  return lettreIndiceeDepuisChiffre(i).toLowerCase()
}

/**
 * @author Rémi Angot
 * @Example
 * //0h24 est accepté
 */
export function minToHoraire (minutes) {
  let nbHour = parseInt(minutes / 60)
  if (nbHour > 23) {
    nbHour = nbHour - 24
  }
  const nbminuteRestante = (minutes % 60)
  if (nbminuteRestante > 9) {
    return (nbHour + sp() + 'h' + sp() + nbminuteRestante + sp() + 'min')
  } else {
    return (nbHour + sp() + 'h' + sp() + '0' + nbminuteRestante + sp() + 'min')
  }
}

/**
 * @author Rémi Angot
 * @Example
 * //on écrira 24 minutes plutôt que 0h24
 */
export function minToHour (minutes) {
  let nbHour = parseInt(minutes / 60)
  if (nbHour > 23) {
    nbHour = nbHour - 24
  }
  const nbminuteRestante = (minutes % 60)
  if (nbHour === 0) {
    return (nbminuteRestante + sp() + 'min')
  } else {
    if (nbminuteRestante > 9) {
      return (nbHour + sp() + 'h' + sp() + nbminuteRestante + sp() + 'min')
    } else {
      return (nbHour + sp() + 'h' + sp() + '0' + nbminuteRestante + sp() + 'min')
    }
  }
}

/**
 * Renvoie un tableau de deux valeurs : le nombre d'heures dans un paquet de minutes ainsi que le nombre de minutes restantes.
 * @author Eric Elter
 * @example minToHeuresMinutes (127) renvoie [2,7] car 127min = 2h7min
 * @example minToHeuresMinutes (300) renvoie [5,0] car 300min = 6h
 * @example minToHeuresMinutes (1456) renvoie [24,16] car 1456min = 24h16min
 *
 */
export function minToHeuresMinutes (minutes) {
  return [parseInt(minutes / 60), (minutes % 60)]
}

/**
 * Renvoie un prénom féminin au hasard
 * @author Rémi Angot
 */
export function prenomF (n = 1) {
  if (n === 1) {
    return choice(['Aude', 'Béatrice', 'Carine', 'Corinne', 'Dalila', 'Elsa', 'Farida', 'Julie', 'Karole', 'Léa', 'Lisa', 'Manon', 'Marina', 'Magalie', 'Nadia', 'Nawel', 'Teresa', 'Vanessa', 'Yasmine'])
  } else {
    return shuffle(['Aude', 'Béatrice', 'Carine', 'Corinne', 'Dalila', 'Elsa', 'Farida', 'Julie', 'Karole', 'Léa', 'Lisa', 'Manon', 'Marina', 'Magalie', 'Nadia', 'Nawel', 'Teresa', 'Vanessa', 'Yasmine']).slice(0, n)
  }
}

/**
 * Renvoie un prénom masculin au hasard
 * @author Rémi Angot
 */
export function prenomM (n = 1) {
  if (n === 1) {
    return choice(['Arthur', 'Benjamin', 'Bernard', 'Christophe', 'Cyril', 'David', 'Fernando', 'Guillaume', 'Jean-Claude', 'Joachim', 'José', 'Kamel', 'Karim', 'Laurent', 'Mehdi', 'Nacim', 'Pablo', 'Rémi', 'Victor', 'Yazid'])
  } else {
    return shuffle(['Arthur', 'Benjamin', 'Bernard', 'Christophe', 'Cyril', 'David', 'Fernando', 'Guillaume', 'Jean-Claude', 'Joachim', 'José', 'Kamel', 'Karim', 'Laurent', 'Mehdi', 'Nacim', 'Pablo', 'Rémi', 'Victor', 'Yazid']).slice(0, n)
  }
}

/**
 * Renvoie un prénom au hasard
 * @author Rémi Angot
 */
export function prenom (n = 1) {
  if (n === 1) {
    return choice([prenomF(), prenomM()])
  } else {
    return shuffle(['Aude', 'Béatrice', 'Carine', 'Corinne', 'Dalila', 'Elsa', 'Farida', 'Julie', 'Karole', 'Léa', 'Lisa', 'Manon', 'Marina', 'Magalie', 'Nadia', 'Nawel', 'Teresa', 'Vanessa', 'Yasmine', 'Arthur', 'Benjamin', 'Bernard', 'Christophe', 'Cyril', 'David', 'Fernando', 'Guillaume', 'Jean-Claude', 'Joachim', 'José', 'Kamel', 'Karim', 'Laurent', 'Mehdi', 'Nacim', 'Pablo', 'Rémi', 'Victor', 'Yazid']).slice(0, n)
  }
}

/**
 * Renvoie un petit objet féminin au hasard
 * @author Mireille Gain
 */
export function objetF () {
  return choice(['boîtes', 'bougies', 'cartes de vœux', 'gommes', 'photos', 'petites peluches'])
}

/**
 * Renvoie un petit objet masculin au hasard
 * @author Mireille Gain
 */
export function objetM () {
  return choice(['stickers', 'gâteaux', 'cahiers', 'livres', 'stylos', 'crayons'])
}

/**
 * Renvoie un petit objet au hasard
 * @author Mireille Gain
 */
export function objet () {
  return choice(['billes', 'bonbons', 'bougies', 'cartes de vœux', 'crayons', 'gâteaux', 'gommes', 'photos', 'stickers', 'cahiers'])
}

/**
 * Définit l'objet personne
 * @author Jean-Claude Lhote
 * le 14/03/2021
 */
class Personne {
  constructor ({ prenom = '', genre = '', pronom = '', Pronom = '' } = {}) {
    let choix
    this.prenom = ''
    this.genre = ''
    this.pronom = ''
    this.Pronom = ''
    if (prenom === '' || ((typeof prenom) === 'undefined')) { // On le/la baptise
      choix = prenomPronom()
      this.prenom = choix[0]
      this.pronom = choix[1]
    } else if (pronom === '') { // le pronom n'est pas précisé
      this.pronom = 'on'
      this.Pronom = 'On'
    }
    if (genre === '') {
      if (this.pronom === 'il') {
        this.Pronom = 'Il'
        this.genre = 'masculin'
      } else if (this.pronom === 'elle') {
        this.Pronom = 'Elle'
        this.genre = 'féminin'
      } else this.genre = 'neutre'
    }
  }
}

/**
 * crée une instance de la classe Personne
 * @author Jean-Claude Lhote
 * le 14/03/2021
 */
export function personne ({ prenom = '', genre = '', pronom = '' } = {}) {
  return new Personne({ prenom, genre, pronom })
}

/**
 * Crée un tableau de n objet de la classe Personne
 * @author Jean-Claude Lhote
 * le 14/03/2021
 */
export function personnes (n) {
  const liste = []
  let essai
  let trouve
  for (let i = 0; i < n;) {
    essai = personne()
    trouve = false
    for (let j = 0; j < liste.length; j++) {
      if (liste[j].prenom === essai.prenom) {
        trouve = true
        break
      }
    }
    if (trouve === false) {
      liste.push(essai)
      i++
    }
  }
  return liste
}

/**
 * Renvoie un couple [prénom,pronom] où pronom='il' ou 'elle'
 *  @author Jean-Claue Lhote
 */
export function prenomPronom () {
  if (choice([true, false])) {
    return [prenomM(1), 'il']
  } else {
    return [prenomF(1), 'elle']
  }
}

/**
 * Renvoie un tableau avec les résultats des tirages successifs
 * @param nombreTirages Combien de tirages ?
 * @param nombreFaces Pour spécifier le type de dés
 * @param nombreDes Combien de dés à chaque tirage ?
 * @author Jean-Claude Lhote
 */
export function tirerLesDes (nombreTirages, nombreFaces, nombreDes) {
  const tirages = []
  for (let i = 0; i <= (nombreFaces - 1) * nombreDes; i++) tirages.push([i + nombreDes, 0])
  for (let i = 0, resultat; i < nombreTirages; i++) {
    resultat = 0
    for (let j = 0; j < nombreDes; j++) resultat += randint(1, nombreFaces)
    tirages[resultat - nombreDes][1]++
  }
  return tirages
}

/**
 * Renvoie un tableau de nombres
 * @param nombreNotes
 * @param noteMin
 * @param noteMax
 * @param distincts Si distincts === true, les notes de la liste seront toutes distinctes
 * @author Jean-Claude Lhote et Guillaume Valmont
 */
export function listeDeNotes (nombreNotes, noteMin = 0, noteMax = 20, distincts = false) {
  const notes = []
  let candidat, present, limite // nombre candidat, est-ce qu'il est déjà présent, une limite d'itérations pour éviter les boucles infinies
  limite = 0
  for (let i = 0; i < nombreNotes;) {
    limite += 1
    if (distincts && limite < 100) { // Si les nombres doivent être tous distincts et que la limite d'itérations n'est pas encore atteinte,
      candidat = randint(noteMin, noteMax) // on tire au sort un nombre candidat,
      present = false
      for (let j = 0; j < notes.length; j++) { // on vérifie s'il est présent,
        if (candidat === notes[j]) {
          present = true
          break
        }
      }
      if (!present) { // s'il n'est pas présent, on le push.
        notes.push(candidat)
        i++
      }
    } else { // Si les nombres n'ont pas tous à être distincts, on push directement.
      notes.push(randint(noteMin, noteMax))
      i++
    }
  }
  return notes
}

/**
 * Renvoie le nombre de jour d'un mois donné
 * @param n quantième du mois (janvier=1...)
 * @author Jean-Claude Lhote
 */
export function joursParMois (n, annee = 2022) {
  const joursMois = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (n === 2) {
    if (((annee % 4 === 0) && (annee % 100 !== 0)) || (annee % 400 === 0)) return 29 // années bissextiles.
    else return 28
  } else return joursMois[n - 1]
}

/**
 * Renvoie un tableau de températures
 * @param base température médiane
 * @mois quantième du mois (janvier=1...)
 * @annee pour déterminer si elle est bissextile ou non
 * @author Jean-Claude Lhote
 */
export function unMoisDeTemperature (base, mois, annee) {
  const temperatures = []
  let nombreJours = joursParMois(mois)
  if (mois === 2) {
    if (((annee % 4 === 0) && (annee % 100 !== 0)) || (annee % 400 === 0)) nombreJours = 29 // années bissextiles.
    else nombreJours = 28
  }
  temperatures.push(randint(-3, 3) + base)
  for (let i = 1; i < nombreJours; i++) temperatures.push(temperatures[i - 1] + randint(-2, 2))
  return temperatures
}

/**
 * Renvoie le nom du mois
 * @param n quantième du mois
 * @author Jean-Claude Lhote
 */
export function nomDuMois (n) {
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  return mois[n - 1]
}

/**
 * Renvoie le nom du jour
 * @param n quantième du jour
 * @author Mireille Gain
 */
export function nomDuJour (n) {
  const jour = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
  return jour[n - 1]
}

/**
 * Renvoie le nom d'un jour au hasard
 * @param n quantième du jour
 * @author Mireille Gain
 */
export function jour () {
  return choice(['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'])
}

// Fonctions LaTeX

/**
 * * Retourne un environnement LaTeX enumerate à partir d'une liste.
 * * `<br>`est remplacé par un saut de paragraphe
 * * `<br><br>` est remplacé par un saut de paragraphe et un medskip
 * * L'espacement est généré avec spacing
 * @author Rémi Angot
 */
export function texEnumerate (liste, spacing) {
  let result = ''
  if (liste.length > 1) {
    result = '\\begin{enumerate}\n'
    if (spacing > 1) {
      result += `\\begin{spacing}{${spacing}}\n`
    }
    for (const i in liste) {
      result += '\t\\item ' + liste[i] + '\n'
    }
    if (spacing > 1) {
      result += '\\end{spacing}\n'
    }
    result += '\\end{enumerate}\n'
  } else {
    if (spacing > 1) {
      result += `\\begin{spacing}{${spacing}}\n`
    }
    result += liste[0] + '\n'
    if (spacing > 1) {
      result += '\\end{spacing}\n'
    }
  }
  return result.replace(/(<br *\/?>[\n\t ]*)+<br *\/?>/mig, '\n\n\\medskip\n').replace(/<br>/g, '\\\\\n').replace(/€/g, '\\euro{}')
}

/**
 * * Retourne un environnement LaTeX enumerate à partir d'une liste sans afficher les numéros.
 * * `<br>` est remplacé par un saut de paragraphe
 * * `<br><br>` est remplacé par un saut de paragraphe et un medskip
 * * L'espacement est généré avec spacing
 * @author Rémi Angot
 */
export function texEnumerateSansNumero (liste, spacing) {
  // return texEnumerate(liste,spacing).replace('\\begin{enumerate}[label={}]','\\begin{enumerate}[label={}]')
  return texEnumerate(liste, spacing).replace('\\begin{enumerate}', '\\begin{enumerate}[label={}]')
}

/**
 * * Concatène les éléments d'une liste avec un saut de ligne entre chaque élément
 * * `<br>` est remplacé par un saut de paragraphe
 * * `<br><br>` est remplacé par un saut de paragraphe et un medskip
 * @author Rémi Angot
 */
export function texParagraphe (liste, spacing = false, retourCharriot) {
  let result = ''
  if (spacing > 1) {
    result = `\\begin{spacing}{${spacing}}\n`
  }

  for (const i in liste) {
    if (retourCharriot) {
      result += `\t${liste[i]}\\\\\n`
    } else {
      result += `\t${liste[i]}\n`
    }
  }
  if (spacing > 1) {
    result += '\\end{spacing}'
  }
  // les <br> peuvent être 2 ou plus et peuvent être séparés par des sauts de ligne ou des espaces
  return result.replace(/(<br *\/?>[\n\t ]*)+<br *\/?>/mig, '\n\n\\medskip\n').replace(/<br>/g, '\\\\\n').replace(/€/g, '\\euro{}')
}

/**
 * * Recopie le texte.
 * * `<br>` est remplacé par un saut de paragraphe
 * * `<br><br>` est remplacé par un saut de paragraphe et un medskip
 * @author Rémi Angot
 */
export function texIntroduction (texte) {
  return texte.replace(/(<br *\/?>[\n\t ]*)+<br *\/?>/mig, '\n\n\\medskip\n').replace(/<br>/g, '\\\\\n')
}

/**
 *  Renvoie une liste HTML à partir d'une liste
 *
 * @param liste une liste de questions
 * @param spacing interligne (line-height en css)
 * @author Rémi Angot
 */
export function htmlEnumerate (liste, spacing, classe = 'question', id = '', tailleDiaporama = 1, classeOl) {
  let result = ''
  // Pour diapCorr, on numérote les questions même si un exercice n'en comporte qu'une
  if (liste.length > 1 || context.vue === 'diapCorr') {
    (spacing > 1) ? result = `<ol style="line-height: ${spacing};" ${classeOl ? `class = ${classeOl}` : ''}>` : result = `<ol ${classeOl ? `class = ${classeOl}` : ''}>`
    for (let i = 0; i < liste.length; i++) {
      result += `<li class="${classe}" ${id ? 'id="' + id + i + '"' : ''} ${dataTaille(tailleDiaporama)}>` + liste[i].replace(/\\dotfill/g, '..............................').replace(/\\not=/g, '≠').replace(/\\ldots/g, '....') + '</li>' // .replace(/~/g,' ') pour enlever les ~ mais je voulais les garder dans les formules LaTeX donc abandonné
    }
    result += '</ol>'
  } else if (liste.length === 1) {
    // Pour garder la même hiérarchie avec une ou plusieurs questions
    // On met ce div inutile comme ça le grand-père de la question est toujours l'exercice
    // Utile pour la vue can
    (spacing > 1) ? result = `<div><div class="${classe}" ${id ? 'id="' + id + '0"' : ''} style="line-height: ${spacing}; margin-bottom: 20px" ${dataTaille(tailleDiaporama)}>` : result = `<div><div class="${classe}" ${id ? 'id="' + id + '0"' : ''}>`
    result += liste[0].replace(/\\dotfill/g, '..............................').replace(/\\not=/g, '≠').replace(/\\ldots/g, '....') // .replace(/~/g,' ') pour enlever les ~ mais je voulais les garder dans les formules LaTeX donc abandonné
    result += '</div></div>'
  }
  return result
}

/**
 * Renvoie une liste HTML ou LaTeX suivant le contexte
 *
 * @param liste une liste de questions
 * @param spacing interligne (line-height en css)
 * @author Rémi Angot
 */
export function enumerate (liste, spacing) {
  if (context.isHtml) {
    return htmlEnumerate(liste, spacing)
  } else {
    return texEnumerate(liste, spacing)
  }
}

/**
 * Renvoie une liste sans puce ni numéro HTML ou LaTeX suivant le contexte
 *
 * @param liste une liste de questions
 * @param spacing interligne (line-height en css)
 * @author Sébastien Lozano
 */
export function enumerateSansPuceSansNumero (liste, spacing) {
  if (context.isHtml) {
    // return htmlEnumerate(liste,spacing)
    // for (let i=0; i<liste.length;i++) {
    // liste[i]='> '+liste[i];
    // }
    return htmlLigne(liste, spacing)
  } else {
    // return texEnumerate(liste,spacing)
    return texEnumerate(liste, spacing).replace('\\begin{enumerate}', '\\begin{enumerate}[label={}]')
  }
}

/**
 *  Renvoie un paragraphe HTML à partir d'un string
 *
 * @param string
 * @author Rémi Angot
 */
export function htmlParagraphe (texte, retourCharriot) {
  if (texte.length > 1) {
    if (retourCharriot) {
      return `\n<p>${texte}</p>\n\n`
    } else {
      return `\n${texte}\n\n`
    }
  } else {
    return ''
  }
}

/**
 *  Renvoie un div HTML à partir d'une liste découpée par des sauts de ligne
 *
 * @param liste une liste de questions
 * @param spacing interligne (line-height en css)
 * @author Rémi Angot
 */
export function htmlLigne (liste, spacing, classe = 'question') {
  let result = '<div>'
  const spacingTxt = (spacing > 1) ? `style="line-height: ${spacing};"` : ''
  // Pour garder la même hiérarchie avec listeDeQuestionsToContenu
  // On met ce div inutile comme ça le grand-père de la question est toujours l'exercice
  // Utile pour la vue can
  for (const i in liste) {
    result += '\t' + `<div ${spacingTxt}  class="${classe}">` + liste[i].replace(/\\dotfill/g, '...') + '</div>' // .replace(/~/g,' ') pour enlever les ~ mais je voulais les garder dans les formules LaTeX donc abandonné
    // .replace(/\\\\/g,'<br>') abandonné pour supporter les array
  }
  result += '</div></div>\n'

  return result
}

/**
 * Renvoie un environnent LaTeX multicolonnes
 * @author Rémi Angot
 */
export function texMulticols (texte, nbCols = 2) {
  let result
  if (nbCols > 1) {
    result = '\\begin{multicols}{' + nbCols + '}\n' +
      texte + '\n\\end{multicols}'
  } else {
    result = texte
  }
  return result
}

/**
 * Renvoie la consigne en titre 4
 * @author Rémi Angot
 */
export function htmlConsigne (consigne) {
  if (consigne) return '<h4>' + consigne + '</h4>\n\n'
  else return ''
}

/**
 * Renvoie \exo{consigne}
 * @author Rémi Angot
 */
export function texConsigne (consigne) {
  return '\\exo{' + consigne.replace(/<br>/g, '\\\\') + '}\n\n'
}

/**
 * @author Frédéric Piou
 * @param {number} nb
 * @returns retourne un nombre au format français sans espace après la virgule
 */
export function num (nb) {
  return Intl.NumberFormat('fr-FR', { maximumFractionDigits: 20 }).format(nb).toString().replace(/\s+/g, '\\thickspace ').replace(',', '{,}')
}

/**
 * @author Frédéric Piou
 * @param {number} nb
 * @returns retourne un nombre au format français
 */
export function numberFormat (nb) {
  return Intl.NumberFormat('fr-FR', { maximumFractionDigits: 20 }).format(nb).toString().replace(/\s+/g, '\\thickspace ')
}

/**
 * La chaîne de caractères en sortie doit être interprétée par KateX et doit donc être placée entre des $ $
 * Renvoie "Trop de chiffres" s'il y a plus de 15 chiffres significatifs (et donc un risque d'erreur d'approximation)
 * S'utilise indifféremment avec des nombres (nb) au format natif (entier, flottant) ou au format Decimal (nécessite la librairie decimal.js)
 * Avec comme avantage immédiat pour le format Decimal : precision est illimité.
 * Sinon, renvoie un nombre dans le format français (avec une virgule et des espaces pour séparer les classes dans la partie entière et la partie décimale)
 * @author Guillaume Valmont
 * @param {number} nb nombre qu'on veut afficher
 * @param {number} precision nombre de décimales demandé
 * @param {boolean} completerZeros si true, le nombre de décimale en precision est imposé (ajout de zéros inutiles éventuels)
 * @param {boolean} aussiCompleterEntiers si true ajoute des zéros inutiles aux entiers si compléterZeros est true aussi
 * @returns string avec le nombre dans le format français à mettre entre des $ $
 */
export function texNombre (nb, precision = 8, completerZeros = false, aussiCompleterEntiers = false) {
  const result = afficherNombre(nb, precision, 'texNombre', completerZeros, aussiCompleterEntiers)
  return result.replace(',', '{,}').replace(/\s+/g, '\\,')
}

/**
 * Renvoie un nombre dans le format français (séparateur de classes) pour la partie entière comme pour la partie décimale
 * @author Rémi Angot
 */
export function texNombre2 (nb) {
  let nombre = math.format(nb, { notation: 'auto', lowerExp: -12, upperExp: 12, precision: 12 }).replace('.', ',')
  const rangVirgule = nombre.indexOf(',')
  let partieEntiere = ''
  if (rangVirgule !== -1) {
    partieEntiere = nombre.substring(0, rangVirgule)
  } else {
    partieEntiere = nombre
  }
  let partieDecimale = ''
  if (rangVirgule !== -1) {
    partieDecimale = nombre.substring(rangVirgule + 1)
  }

  for (let i = partieEntiere.length - 3; i > 0; i -= 3) {
    partieEntiere = partieEntiere.substring(0, i) + '\\,' + partieEntiere.substring(i)
  }
  for (let i = 3; i < partieDecimale.length; i += 5) {
    partieDecimale = partieDecimale.substring(0, i) + '\\,' + partieDecimale.substring(i)
    i += 12
  }
  if (partieDecimale === '') {
    nombre = partieEntiere
  } else {
    nombre = partieEntiere + '{,}' + partieDecimale
  }
  return nombre
}

/**
 * Renvoie un nombre dans le format français (séparateur de classes) pour la partie entière comme pour la partie décimale
 * Avec espace géré par nbsp en HTML pour pouvoir l'inclure dans une phrase formatée en français et pas seulement un calcul.
 * Modif EE pour la gestion de l'espace dans un texte non mathématique
 * @author Eric Elter d'après la fonction de Rémi Angot
 * Rajout Octobre 2021 pour 6C14
 */
export function texNombre3 (nb) {
  let nombre = math.format(nb, { notation: 'auto', lowerExp: -12, upperExp: 12, precision: 12 }).replace('.', ',')
  const rangVirgule = nombre.indexOf(',')
  let partieEntiere = ''
  if (rangVirgule !== -1) {
    partieEntiere = nombre.substring(0, rangVirgule)
  } else {
    partieEntiere = nombre
  }
  let partieDecimale = ''
  if (rangVirgule !== -1) {
    partieDecimale = nombre.substring(rangVirgule + 1)
  }

  for (let i = partieEntiere.length - 3; i > 0; i -= 3) {
    partieEntiere = partieEntiere.substring(0, i) + sp() + partieEntiere.substring(i)
  }
  for (let i = 3; i <= partieDecimale.length; i += 3) {
    partieDecimale = partieDecimale.substring(0, i) + sp() + partieDecimale.substring(i)
    i += 12
  }
  if (partieDecimale === '') {
    nombre = partieEntiere
  } else {
    nombre = partieEntiere + ',' + partieDecimale
  }
  return nombre
}

/**
 * Renvoie un espace insécable pour le mode texte suivant la sortie html ou Latex.
 * @author Jean-Claude Lhote
 */
export function sp (nb = 1) {
  let s = ''
  for (let i = 0; i < nb; i++) {
    if (context.isHtml) s += '&nbsp;'
    else s += '\\,'
  }
  return s
}

/**
 * Renvoie un nombre dans le format français (séparateur de classes)
 * Fonctionne sans le mode maths contrairement à texNombre()
 * insereEspaceDansNombre fonctionne peut-être mieux
 * @author Rémi Angot
 */
export function nombreAvecEspace (nb) {
  if (isNaN(nb)) {
    window.notify('nombreAvecEspace : argument NaN ou undefined', { nb })
    return 'NaN'
  }
  // Ecrit \nombre{nb} pour tous les nombres supérieurs à 1 000 (pour la gestion des espaces)
  if (context.isHtml) {
    return Intl.NumberFormat('fr-FR', { maximumFractionDigits: 20 }).format(nb).toString().replace(/\s+/g, ' ')
  } else {
    let result
    if (nb > 999 || nombreDeChiffresDansLaPartieDecimale(nb) > 3) {
      result = '\\numprint{' + nb.toString().replace('.', ',') + '}'
    } else {
      result = Number(nb).toString().replace('.', '{,}')
    }
    return result
  }
}

/**
 *
 * @param {number} mantisse
 * @param {integer} exp
 * @returns {string} Écriture décimale avec espaces
 */
/* export const scientifiqueToDecimal = (mantisse, exp) => {
  mantisse = mantisse.toString()
  let indiceVirguleDepart = mantisse.indexOf('.')
  if (indiceVirguleDepart < 0) {
    indiceVirguleDepart = mantisse.length
  }
  const indiceVirguleArrivee = indiceVirguleDepart + exp
  let mantisseSansVirgule = mantisse.replace('.', '')
  const indiceMax = mantisseSansVirgule.length - 1
  // indiceMax est l'indice du chiffre des unités
  if (indiceVirguleArrivee > indiceMax) {
    // On ajoute des 0 à droite
    for (let i = indiceMax + 1; i < indiceVirguleArrivee; i++) {
      mantisseSansVirgule += '0'
    }
  } else if (indiceVirguleArrivee > 0 && indiceVirguleArrivee <= indiceMax) {
    // On insère la virgule
    mantisseSansVirgule = mantisseSansVirgule.substring(0, indiceVirguleArrivee) + ',' + mantisseSansVirgule.substring(indiceVirguleArrivee, mantisseSansVirgule.length)
  } else {
    // On ajoute des 0 à gauche
    let partiGauche = '0,'
    for (let i = 0; i < Math.abs(indiceVirguleArrivee); i++) {
      partiGauche += '0'
    }
    mantisseSansVirgule = partiGauche + mantisseSansVirgule
  }
  return insereEspaceDansNombre(mantisseSansVirgule)
}
*/
export const scientifiqueToDecimal = (mantisse, exp) => {
  if (exp < -6) Decimal.set({ toExpNeg: exp - 1 })
  else if (exp > 20) Decimal.set({ toExpPos: exp + 1 })
  return texNombre(new Decimal(mantisse).mul(Decimal.pow(10, exp)), 10)
}

/**
 *
 * @param {string |number} nb
 * @returns {string}
 */
export const insereEspaceDansNombre = nb => {
  if (!Number.isNaN(nb)) {
    nb = nb.toString().replace('.', ',')
  } else {
    window.notify('insereEspaceDansNombre : l\'argument n\'est pas un nombre', nb)
    return nb
  }
  let indiceVirgule = nb.indexOf(',')
  const indiceMax = nb.length - 1
  const tableauIndicesEspaces = []
  if (indiceVirgule < 0) {
    // S'il n'y a pas de virgule c'est qu'elle est après le dernier chiffre
    indiceVirgule = nb.length
  }
  for (let i = 0; i < indiceMax; i++) {
    if ((i - indiceVirgule) % 3 === 0 && (i - indiceVirgule) !== 0) {
      if (i < indiceVirgule) {
        tableauIndicesEspaces.push(i - 1) // Partie entière espace à gauche
      } else {
        tableauIndicesEspaces.push(i) // Partie décimale espace à droite
      }
    }
  }
  for (let i = tableauIndicesEspaces.length - 1; i >= 0; i--) {
    const indice = tableauIndicesEspaces[i] + 1
    if (indice !== 0) nb = insertCharInString(nb, indice, ' \\thickspace ')
  }
  return nb
}

export const insertCharInString = (string, index, char) => string.substring(0, index) + char + string.substring(index, string.length)

/**
 * Destinée à être utilisée hors des $ $
 * Signale une erreur en console s'il y a plus de 15 chiffres significatifs (et donc qu'il y a un risque d'erreur d'approximation)
 * Sinon, renvoie le nombre à afficher dans le format français (avec virgule et des espaces pour séparer les classes dans la partie entière et la partie décimale)
 * @author Jean-Claude Lhote
 * @author Guillaume Valmont
 * @param {number} nb nombre qu'on veut afficher
 * @param {number} precision nombre de décimales demandé
 * @param {boolean} completerZeros si true, le nombre de décimale en precision est imposé (ajout de zéros inutiles éventuels)
 * @param {boolean} aussiCompleterEntiers si true ajoute des zéros inutiles aux entiers si compléterZeros est true aussi
 * @returns string avec le nombre dans le format français à placer hors des $ $
 */
export function stringNombre (nb, precision = 8, completerZeros = false, aussiCompleterEntiers = false) {
  return afficherNombre(nb, precision, 'stringNombre', completerZeros, aussiCompleterEntiers)
}

/**
 * Fonction auxiliaire aux fonctions stringNombre et texNombre
 * Vérifie le nombre de chiffres significatifs en fonction du nombre de chiffres de la partie entière de nb et du nombre de décimales demandées par le paramètre precision
 * S'il y a plus de 15 chiffres significatifs, envoie un message à bugsnag et renvoie un nombre avec 15 chiffres significatifs
 * Sinon, renvoie un nombre avec le nombre de décimales demandé
 * @author Guillaume Valmont
 * @param {number} nb nombre qu'on veut afficher
 * @param {number} precision nombre de décimales demandé
 * @param {string} fonction nom de la fonction qui appelle afficherNombre (texNombre ou stringNombre) -> sert pour le message envoyé à bugsnag
 * @param {boolean} completerZeros si true, le nombre de décimale en precision est imposé (ajout de zéros inutiles éventuels)
 * @param {boolean} aussiCompleterEntiers true si on veut ajouter des zéros inutiles aux entiers
 */
function afficherNombre (nb, precision, fonction, completerZeros = false, aussiCompleterEntiers) {
  /**
   * Fonction auxiliaire de stringNombre pour une meilleure lisibilité
   * Elle renvoie un nombre dans le format français (avec virgule et des espaces pour séparer les classes dans la partie entière et la partie décimale)
   * @author Rémi Angot
   * @author Guillaume Valmont
   * @param {number} nb nombre à afficher
   * @param {number} precision nombre de décimales demandé
   * @returns string avec le nombre dans le format français
   */
  function insereEspacesNombre (nb, nbChiffresPartieEntiere, precision, fonction) {
    let signe
    let nombre
    const maximumSignificantDigits = nbChiffresPartieEntiere + precision
    if (nb instanceof Decimal) {
      signe = nb.isNeg()
      if (nb.abs().gte(1)) {
        if (completerZeros) {
          nombre = nb.toFixed(precision).replace('.', ',')
        } else {
          nombre = nb.toDP(precision).toString().replace('.', ',')
        }
      } else {
        if (completerZeros) {
          nombre = nb.toFixed(precision).replace('.', ',')
        } else {
          nombre = nb.toDP(precision).toString().replace('.', ',')
        }
      }
    } else { // nb est un number
      signe = nb < 0
      // let nombre = math.format(nb, { notation: 'fixed', lowerExp: -precision, upperExp: precision, precision: precision }).replace('.', ',')
      if (Math.abs(nb) < 1) { // si il est < 1, on n'a pas à se préoccuper de savoir si il est entier pour aussiCompleterEntiers
        if (completerZeros) {
          nombre = Intl.NumberFormat('fr-FR', {
            maximumFractionDigits: precision,
            minimumFractionDigits: precision
          }).format(nb)
        } else {
          nombre = Intl.NumberFormat('fr-FR', { maximumFractionDigits: precision }).format(nb)
        }
      } else {
        if (completerZeros && ((aussiCompleterEntiers && Number.isInteger(nb)) || (!Number.isInteger(nb)))) {
          nombre = Intl.NumberFormat('fr-FR', {
            maximumSignificantDigits,
            minimumSignificantDigits: maximumSignificantDigits
          }).format(nb)
        } else {
          nombre = Intl.NumberFormat('fr-FR', { maximumSignificantDigits }).format(nb)
        }
      }
    }
    const rangVirgule = nombre.indexOf(',')
    let partieEntiere = ''
    if (rangVirgule !== -1) {
      partieEntiere = nombre.substring(0, rangVirgule)
    } else {
      partieEntiere = nombre
    }
    let partieDecimale = ''
    if (rangVirgule !== -1) {
      partieDecimale = nombre.substring(rangVirgule + 1)
    }
    // La partie entière est déjà formatée par le Intl.NumberFormat('fr-FR', { maximumSignificantDigits }).format(nb)
    // Dans le cas d'un Number, mais pas d'un Decimal
    if (nb instanceof Decimal) {
      if (signe) partieEntiere = partieEntiere.substring(1)
      for (let i = partieEntiere.length - 3; i > 0; i -= 3) {
        partieEntiere = partieEntiere.substring(0, i) + ' ' + partieEntiere.substring(i)
      }
      if (signe) partieEntiere = '-' + partieEntiere
    }
    for (let i = 3; i < partieDecimale.length; i += (fonction === 'texNombre' ? 5 : 4)) { // des paquets de 3 nombres + 1 espace
      partieDecimale = partieDecimale.substring(0, i) + (fonction === 'texNombre' ? '\\,' : ' ') + partieDecimale.substring(i)
    }
    if (partieDecimale === '') {
      nombre = partieEntiere
    } else {
      nombre = partieEntiere + ',' + partieDecimale
    }
    return nombre
  } // fin insereEspacesNombre()

  // si nb n'est pas un nombre, on le retourne tel quel, on ne fait rien.
  if (isNaN(nb) && !(nb instanceof Decimal)) {
    window.notify("AfficherNombre : Le nombre n'en est pas un", { nb, precision, fonction })
    return ''
  }
  if (nb instanceof Decimal) {
    if (nb.isZero()) return '0'
  } else if (Number(nb) === 0) return '0'
  let nbChiffresPartieEntiere
  if (nb instanceof Decimal) {
    if (nb.abs().lt(1)) {
      nbChiffresPartieEntiere = 0
    } else {
      nbChiffresPartieEntiere = nb.abs().toFixed(0).length
    }
    if (nb.isInteger() && !aussiCompleterEntiers) precision = 0
    else if (typeof precision !== 'number') { // Si precision n'est pas un nombre, on le remplace par la valeur max acceptable
      precision = 15 - nbChiffresPartieEntiere
    } else if (precision < 0) {
      precision = 0
    }
  } else { // nb est un number
    if (Math.abs(nb) < 1) {
      nbChiffresPartieEntiere = 0
    } else {
      // attention 9.7 donner 10 avec Math.abs(9.7).toFixed(0)
      nbChiffresPartieEntiere = Math.floor(Math.abs(nb)).toFixed(0).length
    }
    if (Number.isInteger(nb) && !completerZeros) {
      precision = 0
    } else {
      if (typeof precision !== 'number') { // Si precision n'est pas un nombre, on le remplace par la valeur max acceptable
        precision = 15 - nbChiffresPartieEntiere
      } else if (precision < 0) {
        precision = 0
      }
    }
  }

  const maximumSignificantDigits = nbChiffresPartieEntiere + precision

  if ((maximumSignificantDigits > 15) && (!(nb instanceof Decimal))) { // au delà de 15 chiffres significatifs, on risque des erreurs d'arrondi
    window.notify(fonction + ` : ${tropDeChiffres}`, { nb, precision })
    return insereEspacesNombre(nb, nbChiffresPartieEntiere, precision, fonction)
  } else {
    return insereEspacesNombre(nb, nbChiffresPartieEntiere, precision, fonction)
  }
}

/**
 * Centre un texte
 *
 * @author Rémi Angot
 */
export function texteCentre (texte) {
  if (context.isHtml) {
    return `<p style="text-align: center">${texte}</p>`
  } else {
    return `\\begin{center}
${texte}
\\end{center}`
  }
}

/**
 * Met en couleur et en gras
 *
 * Met en couleur et gras un texte. JCL dit : "S'utilise entre $ car utilise des commandes qui fonctionnent en math inline"
 * @param {string} texte à mettre en couleur
 * @param {string} couleur en anglais ou code couleur hexadécimal par défaut c'est le orange de CoopMaths
 * @author Rémi Angot
 */
export function miseEnEvidence (texte, couleur = '#f15929') {
  if (isArray(couleur)) couleur = couleur[0]
  if (context.isHtml) {
    return `{\\color{${couleur}}\\boldsymbol{${texte}}}`
  } else {
    if (couleur[0] === '#') {
      return `{\\color[HTML]{${couleur.replace('#', '')}}\\boldsymbol{${texte}}}`
    } else {
      return `{\\color{${couleur.replace('#', '')}}\\boldsymbol{${texte}}}`
    }
  }
}

/**
 * Met en couleur
 * Met en couleur un texte. JCL dit : "S'utilise entre $ car utilise des commandes qui fonctionnent en math inline"
 * @param {string} texte à mettre en couleur
 * @param {string} couleur en anglais ou code couleur hexadécimal par défaut c'est le orange de CoopMaths
 * @author Guillaume Valmont d'après MiseEnEvidence() de Rémi Angot
 */
export function miseEnCouleur (texte, couleur = '#f15929') {
  if (isArray(couleur)) couleur = couleur[0]
  if (context.isHtml) {
    return `{\\color{${couleur}} ${texte}}`
  } else {
    if (couleur[0] === '#') {
      return `{\\color[HTML]{${couleur.replace('#', '')}} ${texte}}`
    } else {
      return `{\\color{${couleur.replace('#', '')}} ${texte}}`
    }
  }
}

/**
 * Met en couleur un texte
 * @param {string} texte à mettre en couleur
 * @param {string} couleur en anglais ou code couleur hexadécimal par défaut c'est le orange de CoopMaths
 * @author Rémi Angot
 */
export function texteEnCouleur (texte, couleur = '#f15929') {
  if (isArray(couleur)) couleur = couleur[0]
  if (context.isHtml) {
    return `<span style="color:${couleur};">${texte}</span>`
  } else {
    if (couleur[0] === '#') {
      return `{\\color[HTML]{${couleur.replace('#', '')}}${texte}}`
    } else {
      return `{\\color{${couleur.replace('#', '')}}${texte}}`
    }
  }
}

/**
 * Met en couleur et gras un texte. JCL dit : "Ne fonctionne qu'en dehors de $....$". Utiliser miseEnEvidence si $....$.
 * @param {string} texte à mettre en couleur
 * @param {string} couleur en anglais ou code couleur hexadécimal par défaut c'est le orange de CoopMaths
 * @author Rémi Angot
 */
export function texteEnCouleurEtGras (texte, couleur = '#f15929') {
  if (isArray(couleur)) couleur = couleur[0]
  if (context.isHtml) {
    return `<span style="color:${couleur};font-weight: bold;">${texte}</span>`
  } else {
    if (couleur[0] === '#') {
      return `{\\bfseries \\color[HTML]{${couleur.replace('#', '')}}${texte}}`
    } else {
      return `{\\bfseries \\color{${couleur.replace('#', '')}}${texte}}`
    }
  }
}

/**
 * couleurAleatoire() renvoie le code d'une couleur au hasard
 *
 * @author Rémi Angot
 */
export function couleurAleatoire () {
  return choice(['white', 'black', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow'])
}

/**
 * couleurTab() renvoie :
 * soit le code d'une couleur au hasard, ainsi que sa traduction française au masculin et au féminin,
 * soit le code d'une couleur imposée, ainsi que sa traduction française au masculin et au féminin.
 * @example couleurTab() peut renvoyer ['black','noir','noire'].
 * @example couleurTab(0) renverra de façon certaine ['black','noir','noire'].
 * @author Eric Elter
 */
export function couleurTab (choixCouleur = 999) {
  const panelCouleurs = [
    ['black', 'noir', 'noire'],
    ['red', 'rouge', 'rouge'],
    ['green', 'vert', 'verte'],
    ['blue', 'bleu', 'bleue'],
    ['HotPink', 'rose', 'rose'],
    ['Sienna', 'marron', 'marron'],
    ['darkgray', 'gris', 'grise'],
    ['DarkOrange', 'orange', 'orange']
  ]
  return (choixCouleur === 999 || choixCouleur >= panelCouleurs.length || !isInteger(choixCouleur)) ? choice(panelCouleurs) : panelCouleurs[choixCouleur]
}

export function arcenciel (i, fondblanc = true) {
  let couleurs
  if (fondblanc) couleurs = ['violet', 'purple', 'blue', 'green', 'lime', '#f15929', 'red']
  else couleurs = ['violet', 'indigo', 'blue', 'green', 'yellow', '#f15929', 'red']
  return couleurs[i % 7]
}

export function texcolors (i, fondblanc = true) {
  const couleurs = ['black', 'blue', 'GreenYellow', 'brown', 'LightSlateBlue', 'cyan', 'darkgray', 'HotPink', 'LightSteelBlue', 'Chocolate', 'gray', 'green', 'lightgray', 'lime', 'magenta', 'olive', 'DarkOrange', 'pink', 'purple', 'red', 'teal', 'violet', 'white', 'yellow']
  if (fondblanc && i % couleurs.length >= couleurs.length - 2) i += 2
  return couleurs[i % couleurs.length]
}

/**
 * Met gras un texte
 * @param {string} texte à mettre en gras
 * @author Rémi Angot
 */
export function texteGras (texte) {
  if (context.isHtml) {
    return `<b>${texte}</b>`
  } else {
    return `\\textbf{${texte}}`
  }
}

/**
 * Affiche un lien vers une URL
 * @param {string} texte à afficher
 * @param {string} URL
 * @author Rémi Angot
 */
export function href (texte, lien) {
  if (context.isHtml) {
    return `<a target="_blank" href=${lien}> ${texte} </a>`
  } else {
    return `\\href{${lien}}{${texte}}`
  }
}

/**
 * Pour bien afficher les centimes avec 2 chiffres après la virgule
 * @author Rémi Angot
 */
export function texPrix (nb) {
  if (nb instanceof Decimal) {
    if (nb.isInteger()) return texNombre(nb, 0)
    else return texNombre(nb, 2, true)
  }
  const nombre = Number(nb)
  if (nombre.toString() === nombre.toFixed(0)) {
    return texNombre(nb, 0)
  } else {
    return texNombre(nb, 2, true)
  }
}

/**
 * Pour afficher les masses avec 3 chiffres après la virgule
 * @author Mireille Gain
 */
export function texMasse (nb) {
  if (nb instanceof Decimal) {
    if (nb.isInteger()) return texNombre(nb, 0)
    else return texNombre(nb, 3, true)
  }
  const nombre = Number(nb)
  if (nombre.toString() === nombre.toFixed(0)) {
    return texNombre(nb, 0)
  } else {
    return texNombre(nb, 3, true)
  }
}

/**
 * Convertit en majuscule la première lettre
 * @author Rémi Angot
 */
export function premiereLettreEnMajuscule (text) {
  return (text + '').charAt(0).toUpperCase() + text.substr(1)
}

/**
 * Renvoie le nombre de chiffres de la partie décimale
 * @param nb : nombre décimal
 * @param except : chiffre à ne pas compter (0 par exemple) [Ajout EE]
 * @author Rémi Angot
 */
export function nombreDeChiffresDansLaPartieDecimale (nb, except = 'aucune') {
  let sauf = 0
  if (String(nb).indexOf('.') > 0) {
    if (!isNaN(except)) sauf = (String(nb).split('.')[1].split(String(except)).length - 1)
    return String(nb).split('.')[1].length - sauf
  } else {
    return 0
  }
}

/**
 * Renvoie le nombre de chiffres dans la partie entière
 * @author ?
 */
export function nombreDeChiffresDansLaPartieEntiere (nb, except = 'aucune') {
  let nombre
  let sauf = 0
  if (nb < 0) {
    nombre = -nb
  } else {
    nombre = nb
  }
  if (String(nombre).indexOf('.') > 0) {
    if (!isNaN(except)) sauf = (String(nombre).split('.')[0].split(String(except)).length - 1)
    return String(nombre).split('.')[0].length - sauf
  } else {
    if (!isNaN(except)) sauf = (String(nombre).split(String(except)).length - 1)
    return String(nombre).length
  }
}

/**
 * Renvoie le nombre de chiffres d'un nombre décimal
 * @param nb : nombre décimal
 * @param except : chiffre à ne pas compter (0 par exemple) [Ajout EE]
 * @author Jean-Claude Lhote
 */
export function nombreDeChiffresDe (nb, except) {
  return nombreDeChiffresDansLaPartieDecimale(nb, except) + nombreDeChiffresDansLaPartieEntiere(nb, except)
}

/**
 * Retourne la string LaTeX de la fraction
 * @param num
 * @param den
 * @return {string}
 * @author Jean-Claude Lhote
 */
export function texFractionSigne (num, den) {
  if (den === 1) return String(num)
  if (num * den > 0) {
    return `\\dfrac{${texNombre(Math.abs(num))}}{${texNombre(Math.abs(den))}}`
  }
  if (num * den < 0) {
    return `-\\dfrac{${texNombre(Math.abs(num))}}{${texNombre(Math.abs(den))}}`
  }
  return '0'
}

/**
 * Met de grandes parenthèses autour de la fraction a/b si besoin pour inclure une fraction dans une expresion en fonction du signe
 * @author Jean-Claude Lhote
 */
export function texFractionParentheses (a, b) {
  if (a * b > 0) {
    return texFractionSigne(a, b)
  } else {
    return '\\left(' + texFractionSigne(a, b) + '\\right)'
  }
}

/**
 * Retourne une liste de fractions irréductibles
 * @author Jean-Claude Lhote
 */
export function obtenirListeFractionsIrreductibles () { // sous forme de tableaux [numérateur,dénominateur]
  return [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5],
    [1, 6], [5, 6], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [1, 8], [3, 8], [5, 8], [7, 8],
    [1, 9], [2, 9], [4, 9], [5, 9], [7, 9], [8, 9], [1, 10], [3, 10], [7, 10], [9, 10]]
}

/**
 * Retourne une liste de fractions irréductibles de dénominateur égal à 2 3 5 7
 * @author Mireille Gain
 */
export function obtenirListeFractionsIrreductiblesFaciles () { // sous forme de tableaux [numérateur,dénominateur]
  return [[1, 2], [1, 3], [2, 3], [1, 5], [2, 5], [3, 5], [4, 5],
    [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]]
}

/**
 * Retourne la liste des nombres premiers inférieurs à 300
 * @author Rémi Angot
 */
export function obtenirListeNombresPremiers (n = 300) {
  const prems = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293]
  for (let i = 307; i <= n; i++) {
    if (isPrime(i)) prems.push(i)
  }
  return prems
}

/**
 * Retourne le code LaTeX de la décomposition en produit de facteurs premiers d'un nombre
 * @author Rémi Angot
 */
export function decompositionFacteursPremiers (n) {
  let decomposition = ''
  const liste = obtenirListeFacteursPremiers(n)
  for (const i in liste) {
    decomposition += ecritureParentheseSiNegatif(liste[i]) + '\\times'
  }
  decomposition = decomposition.substr(0, decomposition.length - 6)
  return decomposition
}

/**
 *
 * @param {number} n
 * @param {boolean} inférieur si true, commence la recherche à 2 en croissant sinon commence à n+1
 * @returns {number}
 */
export function premierAvec (n, listeAEviter = [], inférieur = true) {
  if (n < 2) throw Error(`Impossible de trouver un nombre premier avec ${n}`)
  let candidat = inferieur ? 2 : n + 1
  do {
    if (pgcd(n, candidat) === 1 && !listeAEviter.includes(candidat)) return candidat
    candidat++
  } while (true)
}

/**
 * Renvoie la décomposition en produit de facteurs premiers d'un nombre avec les facteursABarrer barrés
 * @author Guillaume Valmont
 * @param {number} nombre
 * @param {number[]} facteursABarrer
 * @returns texte en LateX
 */
export function decompositionFacteursPremiersBarres (nombreADecomposer, facteursABarrer) {
  const decomposition = decompositionFacteursPremiersArray(nombreADecomposer)
  const facteursBarres = []
  let str = ''
  for (const nombre of decomposition) {
    let unNombreAEteBarre = false
    for (let i = 0; i < facteursABarrer.length; i++) {
      const facteurABarrer = facteursABarrer[i]
      if (nombre === facteurABarrer && !facteursBarres.includes(i) && !unNombreAEteBarre) {
        str += ` \\cancel{${facteurABarrer}} \\times `
        facteursBarres.push(i)
        unNombreAEteBarre = true
      }
    }
    if (!unNombreAEteBarre) {
      str += nombre + ' \\times '
    }
  }
  return str.slice(0, -8)
}

/**
 * Retourne la liste des diviseurs d'un entier
 * @author Rémi Angot
 */
export function listeDesDiviseurs (n) {
  let k = 2
  const liste = [1]
  while (k <= n) {
    if (n % k === 0) {
      liste.push(k)
    }
    k++
  }

  return liste
}

/**
 * Retourne le code LaTeX d'une fraction a/b
 * @author Rémi Angot
 */
export function texFraction (a, b) {
  if (b !== 1) {
    return `\\dfrac{${typeof a === 'number' ? texNombre(a) : a}}{${typeof b === 'number' ? texNombre(b) : b}}`
  } else {
    return a
  }
}

/**
 * Retourne le code LateX correspondant à un symbole
 * @param {string} symbole
 * @returns {string} string
 * @author Guillaume Valmont
 * @example texSymbole('≤') retourne '\\leqslant'
 */
export function texSymbole (symbole) {
  switch (symbole) {
    case '<':
      return '<'
    case '>':
      return '>'
    case '≤':
      return '\\leqslant'
    case '≥':
      return '\\geqslant'
    case '\\':
      return '\\smallsetminus'
    default:
      return 'symbole non connu par texSymbole()'
  }
}

/**
 * Utilise printlatex et quote de Algebrite
 * @author Rémi Angot
 */

export function printlatex (e) {
  if (e === '0x') {
    return '0'
  } else {
    return Algebrite.run(`printlatex(quote(${e}))`)
  }
}

/**
 * Écrit du texte en mode mathématiques
 * @author Rémi Angot
 */
export function texTexte (texte) {
  return '~\\text{' + texte + '}'
}

/**
 * Retourne un environnement LaTeX itemize à partir d'une liste
 * @author Rémi Angot
 */
export function itemize (tableauDeTexte) {
  let texte = ''
  if (context.isHtml) {
    texte = '<div>'
    for (let i = 0; i < tableauDeTexte.length; i++) {
      texte += '<div> − ' + tableauDeTexte[i] + '</div>'
    }
    texte += '</div>'
  } else {
    texte = '\t\\begin{itemize}\n'
    for (let i = 0; i < tableauDeTexte.length; i++) {
      texte += '\t\t\\item ' + tableauDeTexte[i] + '\n'
    }
    texte += '\t\\end{itemize}'
  }
  return texte
}

// Fin de la classe MAtriceCarree

/**
 * Fonction qui retourne les coefficients a et b de f(x)=ax²+bx+c à partir des données de x1,x2,f(x1),f(x2) et c.
 *
 * @author Jean-Claude Lhote
 */
export function resolutionSystemeLineaire2x2 (x1, x2, fx1, fx2, c) {
  const matrice = matriceCarree([[x1 ** 2, x1], [x2 ** 2, x2]])
  const determinant = matrice.determinant()
  const [a, b] = matrice.cofacteurs().transposee().multiplieVecteur([fx1 - c, fx2 - c])
  if (Number.isInteger(a) && Number.isInteger(b) && Number.isInteger(determinant)) {
    const fa = fraction(a, determinant)
    const fb = fraction(b, determinant)
    return [[fa.numIrred, fa.denIrred], [fb.numIrred, fb.denIrred]]
  }
  return [[a / determinant, 1], [b / determinant, 1]]
}

/**
 * Fonction qui retourne les coefficients a, b et c de f(x)=ax^3 + bx² + cx + d à partir des données de x1,x2,x3,f(x1),f(x2),f(x3) et d (entiers !)
 * sous forme de fraction irréductible. Si pas de solution (déterminant nul) alors retourne [[0,0],[0,0],[0,0]]
 * @author Jean-Claude Lhote
 */
export function resolutionSystemeLineaire3x3 (x1, x2, x3, fx1, fx2, fx3, d) {
  const matrice = matriceCarree([[x1 ** 3, x1 ** 2, x1], [x2 ** 3, x2 ** 2, x2], [x3 ** 3, x3 ** 2, x3]])
  const y1 = fx1 - d
  const y2 = fx2 - d
  const y3 = fx3 - d
  const determinant = matrice.determinant()
  if (determinant === 0) {
    return [[0, 0], [0, 0], [0, 0]]
  }
  const [a, b, c] = matrice.cofacteurs().transposee().multiplieVecteur([y1, y2, y3])
  if (Number.isInteger(a) && Number.isInteger(b) && Number.isInteger(c) && Number.isInteger(determinant)) { // ici on retourne un tableau de couples [num,den] entiers !
    const fa = fraction(a, determinant)
    const fb = fraction(b, determinant)
    const fc = fraction(c, determinant)
    return [
      [fa.numIrred, fa.denIrred],
      [fb.numIrred, fb.denIrred],
      [fc.numIrred, fc.denIrred]
    ]
    // pour l'instant on ne manipule que des entiers, mais on peut imaginer que ce ne soit pas le cas... dans ce cas, la forme est numérateur = nombre & dénominateur=1
  }
  return [
    [a / determinant, 1],
    [b / determinant, 1],
    [b / determinant, 1]
  ]
}

/**
 * Fonction qui cherche une fonction polynomiale de degré 3 dont les coefficients a, b et c de f(x)=ax^3 + bx² + cx + d
 * sont des fractions dont le dénominateur est inférieur à 10 et pour laquelle l'image de 3 entiers compris entre -10 et 10
 * sont des entiers compris eux aussi entre -10 et 10
 * @author Jean-Claude Lhote
 */
export function criblePolynomeEntier () {
  let trouve = false
  let coefs = [[]]
  for (let i = 0, x1, x2, x3, fx1, fx2, fx3, d; ; i++) {
    x1 = randint(-10, 10)
    x2 = randint(-10, 10, [x1])
    x3 = randint(-10, 10, [x1, x2])
    fx1 = randint(-10, 10)
    fx2 = randint(-10, 10)
    fx3 = randint(-10, 10)
    d = randint(0, 10)
    coefs = resolutionSystemeLineaire3x3(x1, x2, x3, fx1, fx2, fx3, d)
    if (coefs[0][1] !== 0 && coefs[0][1] < 10 && coefs[1][1] < 10 && coefs[2][1] < 10) trouve = true
    if (trouve) {
      coefs.push([x1, fx1])
      coefs.push([x2, fx2])
      coefs.push([x3, fx3])
      coefs.push(d)
      break
    }
  }
  if (trouve) return coefs
}

/**
 * Fonction qui cherche les minimas et maximas d'une fonction polynomiale f(x)=ax^3 + bx² + cx + d
 * retourne [] si il n'y en a pas, sinon retourne [[x1,f(x1)],[x2,f(x2)] ne précise pas si il s'agit d'un minima ou d'un maxima.
 * @author Jean-Claude Lhote
 */
export function chercheMinMaxFonction ([a, b, c, d]) {
  const delta = 4 * b * b - 12 * a * c
  if (delta <= 0) return [[0, 10 ** 99], [0, 10 ** 99]]
  const x1 = (-2 * b - Math.sqrt(delta)) / (6 * a)
  const x2 = (-2 * b + Math.sqrt(delta)) / (6 * a)
  return [[x1, a * x1 ** 3 + b * x1 ** 2 + c * x1 + d], [x2, a * x2 ** 3 + b * x2 ** 2 + c * x2 + d]]
}

/**
 * retourne les coefficients d'un polynome de degré 3 dont la dérivée s'annule en  x1 et x2 et tel que f(x1)=y1 et f(x2)=y2.
 * @author Jean-Claude Lhote
 */
export function cherchePolynomeDegre3aExtremaFixes (x1, x2, y1, y2) {
  const M = matriceCarree([[x1 ** 3, x1 ** 2, x1, 1], [x2 ** 3, x2 ** 2, x2, 1], [3 * x1 ** 2, 2 * x1, 1, 0], [3 * x2 ** 2, 2 * x2, 1, 0]])
  const R = [y1, y2, 0, 0]
  if (!egal(M.determinant(), 0)) return M.inverse().multiplieVecteur(R)
  else return false
}

/**
 * Fonction pour simplifier l'ecriture lorsque l'exposant vaut 0 ou 1
 * retourne 1, la base ou rien
 * @param b base
 * @param e exposant
 * @author Sébastien Lozano
 */
export function simpExp (b, e) {
  switch (e) {
    case 1:
      return ` ${b}`
    case 0:
      return ' 1'
    default:
      return ' '
  }
}

/**
 * Fonction pour écrire des notations scientifique de la forme a * b ^ n
 * @param a {number} mantisse
 * @param b {number} base
 * @param n {number} exposant
 * @author Erwan Duplessy
 */
export function puissance (b, n) {
  switch (b) {
    case 0:
      return '0'
    case 1:
      return '1'
    case -1:
      if (b % 2 === 0) {
        return '1'
      } else {
        return '-1'
      }
    default:
      if (b < 0) {
        return `(${b})^{${n}}`
      } else {
        return `${b}^{${n}}`
      }
  }
}

export function ecriturePuissance (a, b, n) {
  switch (a) {
    case 0:
      return '$0$'
    case 1:
      return `$${puissance(b, n)}$`
    default:
      return `$${String(round(a, 3)).replace('.', '{,}')} \\times ${puissance(b, n)}$`.replace('.', '{,}')
  }
}

/**
 * Fonction pour simplifier les notations puissance dans certains cas
 * si la base vaut 1 ou -1 quelque soit l'exposant, retourne 1 ou -1,
 * si la base est négative on teste la parité de l'exposant pour alléger la notation sans le signe
 * si l'exposant vaut 0 ou 1 retourne 1, la base ou rien
 * @param b base
 * @param e exposant
 * @author Sébastien Lozano
 */
export function simpNotPuissance (b, e) {
  // on switch sur la base
  switch (b) {
    case -1: // si la base vaut -1 on teste la parité de l'exposant
      if (e % 2 === 0) {
        return ' 1'
        // break;
      } else {
        return ' -1'
        // break;
      }
    case 1: // si la base vaut 1 on renvoit toujours 1
      return ' 1'
    default: // sinon on switch sur l'exposant
      switch (e) {
        case 0: // si l'exposant vaut 0 on ranvoit toujours 1
          return '1'
        case 1: // si l'exposant vaut 1 on renvoit toujours la base
          return ` ${b}`
        default: // sinon on teste le signe de la base et la parité de l'exposant
          if (b < 0 && e % 2 === 0) { // si la base est négative et que l'exposant est pair, le signe est inutile
            return ` ${b * -1}^{${e}}`
            // break;
          } else {
            return ` ${b}^{${e}}`
            // return ` `;
            // break;
          }
      }
  }
}

/**
 * Fonction pour écrire en couleur la forme éclatée d'une puissance
 * @param b base
 * @param e exposant
 * @param couleur
 * @author Sébastien Lozano
 */
export function eclatePuissance (b, e, couleur) {
  let str
  switch (e) {
    case 0:
      return `\\mathbf{\\color{${couleur}}{1}}`
    case 1:
      return `\\mathbf{\\color{${couleur}}{${b}}}`
    default:
      str = `\\mathbf{\\color{${couleur}}{${b}}} `
      for (let i = 1; i < e; i++) {
        str = str + `\\times \\mathbf{\\color{${couleur}}{${b}}}`
      }
      return str
  }
}

/**
 * Fonction pour écrire la forme éclatée d'une puissance
 * @param b {number} base
 * @param e {integer} exposant
 * @author Rémi Angot
 * @return string
 */
export function puissanceEnProduit (b, e) {
  let str
  if (e === 0) {
    return '1'
  } else if (e === 1) {
    return `${b}`
  } else if (e > 1) {
    str = `${ecritureParentheseSiNegatif(b)}`
    for (let i = 1; i < e; i++) {
      str = str + `\\times ${ecritureParentheseSiNegatif(b)}`
    }
    return str
  } else if (e < 0) {
    return `\\dfrac{1}{${puissanceEnProduit(b, -e)}}`
  }
}

/**
 * Fonction qui renvoie un tableau contenant la mantisse et l'exposant de l'écriture scientique d'un nombre donné en paramètres sous sa forme décimale.
 * @param nbDecimal
 *
 * @example
 * // Renvoie [4.1276,1]
 * range(decimalToScientifique,[41.276])
 * // Renvoie [3.48,-2]
 * range(decimalToScientifique,[0.0348])
 * // Renvoie [-2.315,3]
 * range(decimalToScientifique,[-2315])
 *
 * @author Eric Elter
 */
export function decimalToScientifique (nbDecimal) {
  let exposant = 0
  let mantisseNb = new Decimal(nbDecimal)
  if (mantisseNb.abs().gte(10)) {
    while (exposant < 50 && mantisseNb.abs().gt(10)) {
      mantisseNb = mantisseNb.div(10)
      exposant++
    }
    return [mantisseNb.toNumber(), exposant]
  } else if (mantisseNb.abs().lt(1)) {
    while (exposant < 50 && mantisseNb.abs().lt(1)) {
      mantisseNb = mantisseNb.mul(10)
      exposant++
    }
    return [mantisseNb.toNumber(), -1 * exposant]
  } else return [nbDecimal, 0]
}

/**
 * Fonction pour écrire avec deux couleurs la forme éclatée d'un produit de puissances de même exposant
 * @param b1 base1
 * @param b2 base2
 * @param e exposant
 * @param couleur1
 * @param couleur2
 * @author Sébastien Lozano
 */
export function reorganiseProduitPuissance (b1, b2, e, couleur1, couleur2) {
  let str
  switch (e) {
    case 0:
      return '1'
    case 1:
      return `\\mathbf{\\color{${couleur1}}{${b1}}} \\times \\mathbf{\\color{${couleur2}}{${b2}}}`
    default:
      str = `\\mathbf{(\\color{${couleur1}}{${b1}}} \\times \\mathbf{\\color{${couleur2}}{${b2}}}) `
      for (let i = 1; i < e; i++) {
        str = str + `\\times (\\mathbf{\\color{${couleur1}}{${b1}}} \\times \\mathbf{\\color{${couleur2}}{${b2}}})`
      }
      return str
  }
}

/**
 *
 * x le nombre dont on cherche l'ordre de grandeur
 * type = 0 pour la puissance de 10 inférieure, 1 pour la puissance de 10 supérieur et 2 pour la plus proche
 */
export function ordreDeGrandeur (x, type) {
  let signe
  if (x < 0) signe = -1
  else signe = 1
  x = Math.abs(x)
  const P = 10 ** Math.floor(Math.log10(x))
  if (type === 0) return P * signe
  else if (type === 1) return P * 10 * signe
  else if (x - P < 10 * P - x) return P * signe
  else return P * 10 * signe
}

/**
 * Fonction créant le bouton d'aide utilisée par les différentes fonctions modal_ type de contenu
 * @param numeroExercice
 * @param contenu code HTML
 * @param icone
 * @author Rémi Angot
 */
export function creerModal (numeroExercice, contenu, labelBouton, icone) {
  if (context.isHtml) {
    let HTML = ''
    if (context.versionMathalea === 2) {
      HTML = `<button class="ui right floated mini compact button" onclick="$('#modal${numeroExercice}').modal('show');"><i class="large ${icone} icon"></i>${labelBouton}</button>
      <div class="ui modal" id="modal${numeroExercice}">
      ${contenu}
      </div>`
    } else if (context.versionMathalea > 2) {
      HTML = `<div id="aide-${numeroExercice}" class="group">
      <div id="aide-trigger-${numeroExercice}">?</div>
      <div id="aide-content-${numeroExercice}">
      ${contenu}
      </div>
      </div>`
    }
    return HTML
  } else {
    return ''
  }
}

/**
 * Fonction créant le bouton d'aide utilisée par les différentes fonctions modal_ type de contenu
 * @param numeroExercice
 * @param contenu code HTML
 * @param icone
 * @author Rémi Angot
 */
export function creerBoutonMathalea2d (numeroExercice, fonction, labelBouton = 'Aide', icone = 'info circle') {
  if (context.versionMathalea === 3) {
    return `<button class="inline-block px-6 py-2.5 mr-10 my-5 ml-6 bg-coopmaths text-white font-medium text-xs leading-tight uppercase rounded shadow-md transform hover:scale-110 hover:bg-coopmaths-dark hover:shadow-lg focus:bg-coopmaths-dark focus:shadow-lg focus:outline-none focus:ring-0 active:bg-coopmaths-dark active:shadow-lg transition duration-150 ease-in-out" id = "btnMathALEA2d_${numeroExercice}" onclick="${fonction}"><i class="large ${icone} icon"></i>${labelBouton}</button>`
  } else {
    return `<button class="ui toggle left floated mini compact button" id = "btnMathALEA2d_${numeroExercice}" onclick="${fonction}"><i class="large ${icone} icon"></i>${labelBouton}</button>`
  }
}

/**
 * Créé un bouton pour une aide modale avec un texte court
 * @param numeroExercice
 * @param texte Texte court qui sera affiché comme un titre
 * @param labelBouton Titre du bouton (par défaut Aide)
 * @param icone Nom de l'icone (par défaut c'est info circle icon), liste complète sur https://semantic-ui.com/elements/icon.html
 * @author Rémi Angot
 */
export function modalTexteCourt (numeroExercice, texte, labelBouton = 'Aide', icone = 'info circle') {
  const contenu = `<div class="header">${texte}</div>`
  return creerModal(numeroExercice, contenu, labelBouton, icone)
}

/**
 * Créé un bouton pour une aide modale avec un texte et une vidéo YouTube
 * @param numeroExercice
 * @param idYoutube
 * @param titre Texte court qui sera affiché comme un titre
 * @param labelBouton Titre du bouton (par défaut Aide)
 * @param icone Nom de l'icone (par défaut c'est youtube icon), liste complète sur https://semantic-ui.com/elements/icon.html
 * @author Rémi Angot
 */
export function modalYoutube (numeroExercice, idYoutube, titre, labelBouton = 'Aide - Vidéo', icone = 'youtube') {
  let contenu
  if (idYoutube.substr(0, 4) === 'http') {
    if (idYoutube.slice(-4) === '.pdf') {
      contenu = `<div class="header">${titre}</div><div class="content"><p align="center"><object type="application/pdf" data="${idYoutube}" width="560" height="315"> </object></p></div>`
    }
    if (idYoutube.substr(0, 17) === 'https://youtu.be/') {
      contenu = `<div class="header">${titre}</div><div class="content"><p align="center"><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${idYoutube.substring(17)}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p></div>`
    } else {
      contenu = `<div class="header">${titre}</div><div class="content"><p align="center"><iframe width="560" height="315" sandbox="allow-same-origin allow-scripts allow-popups" src="${idYoutube}" frameborder="0" allowfullscreen></iframe></p></div>`
    }
  } else if (idYoutube.substr(0, 4) === '<ifr') {
    contenu = `<div class="header">${titre}</div><div class="content"><p align="center">${idYoutube}</p></div>`
  } else {
    contenu = `<div class="header">${titre}</div><div class="content"><p align="center"><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${idYoutube}?rel=0&showinfo=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p></div>`
  }
  return creerModal(numeroExercice, contenu, labelBouton, icone)
}

/**
 * Créé un bouton pour une aide modale avec un titre et un texte
 * @param numeroExercice
 * @param titre
 * @param texte
 * @param labelBouton Titre du bouton (par défaut Aide)
 * @param icone Nom de l'icone (par défaut c'est info circle icon), liste complète sur https://semantic-ui.com/elements/icon.html
 * @author Rémi Angot
 */
export function modalTexteLong (numeroExercice, titre, texte, labelBouton = 'Aide', icone = 'info circle') {
  let contenu = ''
  if (context.versionMathalea === 2) {
    contenu = `<div class="header">${titre}</div>`
    contenu += `<div class="content">${texte}</div>`
  } else if (context.versionMathalea > 2) {
    contenu = `<div class="aide-header">${titre}</div>`
    contenu += `<div class="aide-content">${texte}</div>`
  }
  return creerModal(numeroExercice, contenu, labelBouton, icone)
}

/**
 * Créé un bouton pour une aide modale avec un titre et un texte
 * @param numeroExercice
 * @param url
 * @param labelBouton Titre du bouton (par défaut Aide)
 * @param icone Nom de l'icone (par défaut c'est info circle icon), liste complète sur https://semantic-ui.com/elements/icon.html
 * @author Rémi Angot
 */
export function modalUrl (numeroExercice, url, labelBouton = 'Aide', icone = 'info circle') {
  const contenu = `<iframe width="100%" height="600"  src="${url}" frameborder="0" ></iframe>`
  return creerModal(numeroExercice, contenu, labelBouton, icone)
}

/**
 * Créé un bouton pour une aide modale avec un texte et une vidéo YouTube
 * @param numeroExercice
 * @param urlPdf
 * @param titre Texte court qui sera affiché comme un titre
 * @param labelBouton Titre du bouton (par défaut Aide)
 * @param icone Nom de l'icone (par défaut c'est file pdf icon), liste complète sur https://semantic-ui.com/elements/icon.html
 * @author Rémi Angot
 */
export function modalPdf (numeroExercice, urlPdf, titre = 'Aide', labelBouton = 'Aide - PDF', icone = 'file pdf') {
  const contenu = `<div class="header">${titre}</div><div class="content"><p align="center"><embed src=${urlPdf} width=90% height=500 type='application/pdf'/></p></div>`
  return creerModal(numeroExercice, contenu, labelBouton, icone)
}

/**
 * Créé un bouton pour une aide modale avec une vidéo
 * @param numeroExercice désigne l'id du modal qui doit être unique
 * @param urlVideo
 * @param titre Texte court qui sera affiché comme un titre
 * @param labelBouton Titre du bouton (par défaut Vidéo)
 * @param icone Nom de l'icone (par défaut c'est file video outline icon), liste complète sur https://semantic-ui.com/elements/icon.html
 * @author Sébastien Lozano
 */
export function modalVideo (numeroExercice, urlVideo, titre, labelBouton = 'Vidéo', icone = 'file video outline') {
  // let contenu = `<div class="header">${titre}</div><div class="content"><p align="center"><iframe width="560" height="315" src="${urlVideo}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p></div>`
  const contenu = `
  <div class="header">${titre}</div>
  <div class="content">
    <div class="embed-responsive embed-responsive-16by9" align="center">
      <video width="560" height="315" controls  preload="none" style="max-width: 100%">
        <source src="` + urlVideo + `">
        Votre navigateur ne gère pas l'élément <code>video</code>.
      </video>
      </div>
  </div>`
  return creerModal(numeroExercice, contenu, labelBouton, icone)
}

/**
 *
 * @param {number} numeroExercice
 * @param {string} urlImage
 * @param {string} titre = ce qui est écrit en titre de l'image
 * @param {string} labelBouton = ce qui est écrit sur le bouton à côté de l'icône d'image.
 * @param {string} icone
 */
export function modalImage (numeroExercice, urlImage, titre, labelBouton = 'Illustration', icone = 'image') {
  const contenu = `<div class="header">${titre}</div><div class="image content"><img class="ui centered medium image" src="${urlImage}"></div>`
  return creerModal(numeroExercice, contenu, labelBouton, icone)
}

/**
 * Renvoie un tableau contenant les diviseurs d'un nombre entier, rangés dans l'ordre croissant
 * @param {integer} n
 * @author Sébastien Lozano
 */
export function listeDiviseurs (n) {
  let i = 2
  const diviseurs = [1]
  while (i <= n) {
    if (n % i === 0) {
      diviseurs.push(i)
    }
    i++
  }
  return diviseurs
}

//= ================================================
// fonctions de 3F1-act
//= ================================================

/**
 * Crée un popup html avec un icon info, éventuellement avec du contenu LaTeX
 * @param {string} texte
 * @param {string} titrePopup
 * @param {string} textePopup
 * @author Sébastien Lozano
 */
export function katexPopup (texte, titrePopup, textePopup) {
  let contenu = ''
  if (context.isHtml) {
    contenu = '<div class="mini ui right labeled icon button katexPopup"><i class="info circle icon"></i> ' + texte + '</div>'
    contenu += '<div class="ui special popup" >'
    if (titrePopup !== '') {
      contenu += '<div class="header">' + titrePopup + '</div>'
    }
    contenu += '<div>' + textePopup + '</div>'
    contenu += '</div>'
    return contenu
  } else {
    return `\\textbf{${texte}} \\footnote{\\textbf{${titrePopup}} ${textePopup}}`
  }
}

export function katexPopupTest (texte, titrePopup, textePopup) {
  let contenu = ''
  if (context.isHtml) {
    contenu = '<div class="ui right label katexPopup">' + texte + '</div>'
    contenu += '<div class="ui special popup" >'
    if (titrePopup !== '') {
      contenu += '<div class="header">' + titrePopup + '</div>'
    }
    contenu += '<div>' + textePopup + '</div>'
    contenu += '</div>'
    return contenu
  } else {
    return `\\textbf{${texte}} \\footnote{\\textbf{${titrePopup}} ${textePopup}}`
  }
}

/**
 * Ecrit un string sans accents
 * @param {string} str
 * @author Sébastien Lozano
 * @source --> http://www.finalclap.com/faq/257-javascript-supprimer-remplacer-accent
 */

/* export function sansAccent(str) {
  var accent = [
    /[\300-\306]/g, /[\340-\346]/g,
    /[\310-\313]/g, /[\350-\353]/g,
    /[\314-\317]/g, /[\354-\357]/g,
    /[\322-\330]/g, /[\362-\370]/g,
    /[\331-\334]/g, /[\371-\374]/g,
    /[\321]/g, /[\361]/g,
    /[\307]/g, /[\347]/g,
  ];
  var noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

  //var str = this;
  for (var i = 0; i < accent.length; i++) {
    str = str.replace(accent[i], noaccent[i]);
  }

  return str;
}
*/

/**
 * Crée un popup html avec une icône info ou un bouton modal suivant le type donné :0=Latex inline compatible, 1=bouton modal texte long, 2=bouton modal image.
 * ATTENTION la variable texte doit exactement correspondre au nom de l'image sans l'extension  et etre au format png
 * @param {number} numero
 * @param {number} type
 * @param {string} titrePopup = Le titre du texte dévoilé par le bouton
 * @param {string} texte = Ce qu'il y a sur le bouton qui doit exactement etre le nom de l'image sans l'extension
 * @param {string} textePopup = Le texte dévoilé par le bouton ou l'url de l'image.
 * @author Jean-claude Lhote & Rémi Angot & Sebastien Lozano
 **/

export function katexPopup2 (numero, type, texte, titrePopup, textePopup) {
  // ToDo : gérer les popu avec la version 3
  // Pour l'instant, ils sont supprimés
  // if (context.versionMathalea > 2) return texte
  switch (type) {
    case 0:
      return katexPopupTest(texte, titrePopup, textePopup)
    case 1:
      if (context.isHtml) {
        return `${texte}` + modalTexteLong(numero, `${titrePopup}`, `${textePopup}`, `${texte}`, 'info circle')
      } else {
        return `\\textbf{${texte}} \\footnote{\\textbf{${titrePopup}} ${textePopup}}`
      }
    case 2:
      if (context.isHtml) {
        return `${texte}` + modalImage(numero, textePopup, `${titrePopup}`, `${texte}`)
      } else {
        return `\\href{https://coopmaths.fr/images/${texte}.png}{\\textcolor{blue}{\\underline{${texte}}} } \\footnote{\\textbf{${texte}} ${textePopup}}`
      }
  }
}

/**
 * Crée une liste de questions alphabétique
 * @param {number} k valeur numérique
 * @author Sébastien Lozano (Rajout par EE, l'opportunité d'enlever l'espace final qui est par défaut)
 */
export function numAlpha (k, nospace = false) {
  if (context.isHtml) return '<span style="color:#f15929; font-weight:bold">' + String.fromCharCode(97 + k) + ')' + (nospace ? '' : '&nbsp;') + '</span>'
  else return '\\textbf {' + String.fromCharCode(97 + k) + '.}' + (nospace ? '' : ' ')
}

/**
 * Crée une liste de questions numérique
 * @param {number} k valeur numérique
 * @author Eric Elter
 */
export function numAlphaNum (k, nospace = false) {
  k = k + 1
  if (context.isHtml) return '<span style="color:#f15929; font-weight:bold">' + k + ')' + (nospace ? '' : '&nbsp;') + '</span>'
  else return '\\textbf {' + k + '.}' + (nospace ? '' : ' ')
}

/**
 * Retourne la liste des nombres premiers inférieurs à N N<300 N exclu
 * @param {integer} k On cherchera un multiple de k
 * @param {integer} n Ce multiple sera supérieur ou égal à n
 * @author Rémi Angot
 */
export function premierMultipleSuperieur (k, n) {
  let result = n
  let reste
  if (Number.isInteger(k) && Number.isInteger(n)) {
    while (result % k !== 0) {
      result += 1
    }
    return result
  } else {
    if (egal(Math.floor((n / k), n / k))) return n
    else {
      reste = n / k - Math.floor(n / k)
      return n - reste * k + k
    }
  }
}

export function premierMultipleInferieur (k, n) {
  const result = premierMultipleSuperieur(k, n)
  if (result !== n) return result - k
  else return n
}

/**
 * Retourne la liste des nombres premiers inférieurs à N N<300 N exclu
 * @param {number} borneSup
 * @author Sébastien Lozano
 */
export function listeNombresPremiersStrictJusqua (borneSup) {
  // tableau contenant les 300 premiers nombres premiers
  const liste300 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293]
  const liste = []
  let i = 0
  while (liste300[i] < borneSup) {
    liste.push(liste300[i])
    i++
  }
  return liste
}

/**
 * Liste les nombres premiers jusque n avec la méthode du crible d'Eratosthene optimisée
 * @param {number} n
 * @author Sébastien Lozano
 */
export function cribleEratostheneN (n) {
  const tabEntiers = [] // pour tous les entiers de 2 à n
  const testMax = Math.sqrt(n + 1) // inutile de tester au dela de racine de n
  const liste = [] // tableau de la liste des premiers jusqu'à n

  // On rempli un tableau avec des booléeens de 2 à n
  for (let i = 0; i < n + 1; i++) {
    tabEntiers.push(true)
  }

  // On supprime les multiples des nombres premiers à partir de 2, 3, 5,...
  for (let i = 2; i <= testMax; i++) {
    if (tabEntiers[i]) {
      for (let j = i * i; j < n + 1; j += i) {
        tabEntiers[j] = false
      }
    }
  }

  // On récupère tous les indices du tableau des entiers dont le booléen est à true qui sont donc premiers
  for (let i = 2; i < n + 1; i++) {
    if (tabEntiers[i]) {
      liste.push(i)
    }
  }

  return liste
}

/**
 * Liste les premiers compris entre min et max au sens large,
 * min est inclu
 * max est inclu.
 * @param {number} min
 * @param {number} max
 * @author Sébastien Lozano
 */

export function premiersEntreBornes (min, max) {
  // on crée les premiers jusque min
  const premiersASupprimer = cribleEratostheneN(min - 1)
  // on crée les premiers jusque max
  const premiersJusqueMax = cribleEratostheneN(max)
  // on supprime le début de la liste jusque min
  premiersJusqueMax.splice(0, premiersASupprimer.length)
  // on renvoie le tableau restant
  return premiersJusqueMax
}

/**
 * tire à pile ou face pour écrire ou non un texte
 * @param {string} texte
 * @author Sébastien Lozano
 */

export function texteOuPas (texte) {
  const bool = randint(0, 1)
  if (bool === 0) {
    return '\\ldots'
  } else {
    return texte
  }
}

/**
 * Crée un tableau avec un nombre de lignes et de colonnes déterminées
 * par la longueur des tableaux des entetes passés en paramètre
 * Les contenus sont en mode maths par défaut, il faut donc penser à remplir les tableaux
 * en utilisant éventuellement la commande \\text{}
 *
 * @example
 * tableauColonneLigne(['coin','A','B'],['1','2'],['A1','B1','A2','B2']) affiche le tableau ci-dessous
 * ------------------
 * | coin | A  | B  |
 * ------------------
 * |  1   | A1 | B1 |
 * ------------------
 * |  2   | A2 | B2 |
 * ------------------
 *
 * @example
 * tableauColonneLigne(['coin','A','B','C'],['1','2'],['A1','B1','C1','A2','B2','C2']) affiche le tableau ci-dessous
 * -----------------------
 * | coin | A  | B  | C  |
 * -----------------------
 * |  1   | A1 | B1 | C1 |
 * -----------------------
 * |  2   | A2 | B2 | C2 |
 * -----------------------
 *
 * @example
 * tableauColonneLigne(['coin','A','B'],['1','2','3'],['A1','B1','A2','B2','A3','B3']) affiche le tableau ci-dessous
 * ------------------
 * | coin | A  | B  |
 * ------------------
 * |  1   | A1 | B1 |
 * ------------------
 * |  2   | A2 | B2 |
 * ------------------
 * |  3   | A3 | B3 |
 * ------------------
 *
 * @example
 * tableauColonneLigne(['coin','A','B','C'],['1','2','3'],['A1','B1','C1','A2','B2','C2','A3','B3','C3']) affiche le tableau ci-dessous
 * -----------------------
 * | coin | A  | B  | C  |
 * -----------------------
 * |  1   | A1 | B1 | C1 |
 * -----------------------
 * |  2   | A2 | B2 | C2 |
 * -----------------------
 * |  3   | A3 | B3 | C3 |
 * -----------------------
 *
 * @param {array} tabEntetesColonnes contient les entetes des colonnes
 * @param {array} tabEntetesLignes contient les entetes des lignes
 * @param {array} tabLignes contient les elements de chaque ligne
 * @author Sébastien Lozano
 *
 */
export function tableauColonneLigne (tabEntetesColonnes, tabEntetesLignes, tabLignes, arraystretch, math = true) {
  // on définit le nombre de colonnes
  const C = tabEntetesColonnes.length
  // on définit le nombre de lignes
  const L = tabEntetesLignes.length
  // On construit le string pour obtenir le tableau pour compatibilité HTML et LaTeX
  let tableauCL = ''
  if (!arraystretch) {
    if (context.isHtml) {
      arraystretch = 2.5
    } else {
      arraystretch = 1
    }
  }
  if (context.isHtml) {
    tableauCL += `$\\def\\arraystretch{${arraystretch}}\\begin{array}{|`
  } else {
    tableauCL += `$\\renewcommand{\\arraystretch}{${arraystretch}}\n`
    tableauCL += '\\begin{array}{|'
  }
  // on construit la 1ere ligne avec toutes les colonnes
  for (let k = 0; k < C; k++) {
    tableauCL += 'c|'
  }
  tableauCL += '}\n'

  tableauCL += '\\hline\n'
  if (typeof tabEntetesColonnes[0] === 'number') {
    tableauCL += math ? texNombre(tabEntetesColonnes[0]) + '' : `\\text{${stringNombre(tabEntetesColonnes[0])}} `
  } else {
    tableauCL += math ? tabEntetesColonnes[0] : `\\text{${tabEntetesColonnes[0]}}`
  }
  for (let k = 1; k < C; k++) {
    if (typeof tabEntetesColonnes[k] === 'number') {
      tableauCL += ` & ${math ? texNombre(tabEntetesColonnes[k]) : '\\text{' + stringNombre(tabEntetesColonnes[k]) + '}'}`
    } else {
      tableauCL += ` & ${math ? tabEntetesColonnes[k] : '\\text{' + tabEntetesColonnes[k] + '}'}`
    }
  }
  tableauCL += '\\\\\n'
  tableauCL += '\\hline\n'
  // on construit toutes les lignes
  for (let k = 0; k < L; k++) {
    if (typeof tabEntetesLignes[k] === 'number') {
      tableauCL += math ? texNombre(tabEntetesLignes[k]) : `\\text{${stringNombre(tabEntetesLignes[k]) + ''}}`
    } else {
      tableauCL += math ? tabEntetesLignes[k] : `\\text{${tabEntetesLignes[k] + ''}}`
    }
    for (let m = 1; m < C; m++) {
      if (typeof tabLignes[(C - 1) * k + m - 1] === 'number') {
        tableauCL += ` & ${math ? texNombre(tabLignes[(C - 1) * k + m - 1]) : '\\text{' + stringNombre(tabLignes[(C - 1) * k + m - 1]) + '}'}`
      } else {
        tableauCL += ` & ${math ? tabLignes[(C - 1) * k + m - 1] : '\\text{' + tabLignes[(C - 1) * k + m - 1] + '}'}`
      }
    }
    tableauCL += '\\\\\n'
    tableauCL += '\\hline\n'
  }
  tableauCL += '\\end{array}\n'
  if (context.isHtml) {
    tableauCL += '$'
  } else {
    tableauCL += '\\renewcommand{\\arraystretch}{1}$\n'
  }

  return tableauCL
}

/**
 * Renvoie un encart sur fond d'alert semantic ui en HTML ou dans un cadre bclogo en LaTeX avec le texte
 * @param {string} texte
 * @param {string} couleur
 * @param {string} titre
 * @author Sébastien Lozano
 */
export function warnMessage (texte, couleur, titre) {
  const timeStamp = Date.now()
  if (typeof (titre) === 'undefined') {
    titre = ''
  }
  if (context.isHtml) {
    if (context.versionMathalea === 3) {
      return `
      <div id="warnMessage-${timeStamp}">
        <div id="title-warnMessage-${timeStamp}">
        ${titre}
        </div>
        ${texte}
      </div>
      `
    } else {
      return `
    <br>
    <div class="ui compact warning message">
    <h4><i class="lightbulb outline icon"></i>${titre}</h4>
    <p>` + texte + `
    </p>
    </div>
    `
    }
  } else {
    // return texCadreParOrange(texte);
    return `
    \\begin{bclogo}[couleurBarre=` + couleur + ',couleurBord=' + couleur + ',epBord=2,couleur=gray!10,logo=\\bclampe,arrondi=0.1]{\\bf ' + titre + `}
      ` + texte + `
    \\end{bclogo}
    `
  }
}

/**
 * @returns un encart sur fond d'alert semantic ui en HTML ou dans un cadre bclogo en LaTeX avec le texte + icone info
 * @param {object}
 * @author Sébastien Lozano
 */

export function infoMessage ({ titre, texte, couleur }) {
  // ;
  const timeStamp = Date.now()
  if (context.isHtml) {
    if (context.versionMathalea === 3) {
      return `
      <div id="infoMessage-${timeStamp}">
        <div id="title-infoMessage-${timeStamp}">
        ${titre}
        </div>
        ${texte}
      </div>
      `
    } else {
      return `
    <div class="ui compact icon message">
      <i class="info circle icon"></i>
      <div class="content">
          <div class="header">
          ` + titre + `
          </div>
          <p>` + texte + `</p>
      </div>
      </div>
    `
    }
  } else {
    return `
    \\begin{bclogo}[couleurBarre=` + couleur + ',couleurBord=' + couleur + ',epBord=2,couleur=gray!10,logo=\\bcinfo,arrondi=0.1]{\\bf ' + titre + `}
      ` + texte + `
    \\end{bclogo}
    `
  }
}

/**
 * @returns un encart sur fond d'alert semantic ui en HTML ou dans un cadre bclogo en LaTeX avec le texte + icone lampe
 * @param {object}
 * @author Sébastien Lozano
 */

export function lampeMessage ({ titre, texte, couleur }) {
  const timeStamp = Date.now()
  if (context.isHtml) {
    if (context.versionMathalea === 3) {
      return `
      <div id="lampeMessage-${timeStamp}">
        <div id="title-lampeMessage-${timeStamp}">
        ${titre}
        </div>
        ${texte}
      </div>
      `
    } else {
      return `
      <div class="ui compact icon message" style="width: auto">
        <i class="lightbulb outline icon"></i>
        <div class="content">
            <div class="header">
            ` + titre + `
            </div>
            <p>` + texte + `</p>
        </div>
        </div>
      `
    }
  } else if (context.isAmc) {
    return `
    {\\bf ${titre}} : ${texte}
    `
  } else {
    return `
    \\begin{bclogo}[couleurBarre=` + couleur + ',couleurBord=' + couleur + ',epBord=2,couleur=gray!10,logo=\\bclampe,arrondi=0.1]{\\bf ' + titre + `}
      ` + texte + `
    \\end{bclogo}
    `
  }
}

/**
 * renvoie un tableau avec la decomposition en facteurs premiers sous forme développée
 * @param {number} n
 * @author Sébastien Lozano
 */
export function decompositionFacteursPremiersArray (n) {
  const decomposition = []
  const liste = obtenirListeFacteursPremiers(n)
  for (const i in liste) {
    decomposition.push(liste[i])
  }
  return decomposition
}

/**
 * @class
 * @classdesc Classe Relatif - Méthodes utiles sur les relatifs
 * @param {...any} relatifs est un paramètre du reste
 * @author Sébastien Lozano
 */
export function Relatif (...relatifs) {
  // ; pas de use strict avec un paramètre du reste
  this.relatifs = relatifs

  /**
   * * Récupère le signe de chaque relatif déclaré dans le paramètre du reste relatifs,
   * * Si 0 fait partie des relatifs on renvoie une erreur
   * @return {array} Renvoie un tableau de -1 ou 1
   * @example getSigneNumber(-1,-2,8,-9,4) renvoie [-1,-1,1,-1,1]
   */
  function getSigneNumber () {
    const signes = []
    try {
      // port du string interdit !
      relatifs.forEach(function (element) {
        if (typeof element === 'string') {
          throw new TypeError(`${element} est un string !`)
        }
        if (element === 0) {
          throw new RangeError(`${element} a été exclu des valeurs possibles.`)
        }
      })
      // Quoi faire sans nombres ?
      if (relatifs.length === 0) {
        throw new Error('C\'est mieux avec quelques nombres !')
      }
      relatifs.forEach(function (element) {
        if (element < 0) {
          signes.push(-1)
        }
        if (element > 0) {
          signes.push(1)
        }
      })
    } catch (err) {
      console.log(err.message)
      console.log(err.stack)
    }
    return signes
  }

  /**
   * * Récupère le signe de chaque relatif déclaré dans le paramètre du reste relatifs
   * @return {array} Renvoie un tableau de strings valant 'négatif' ou 'positif'
   * @example getSigneNumber(-1,-2,8,-9,4) renvoie le tableau de strings [négatif,négatif,positif,négatif,positif]
   */
  function getSigneString () {
    const signesString = []
    const signes = getSigneNumber()
    signes.forEach(function (element) {
      if (element === -1) {
        signesString.push('négatif')
      }
      if (element === 1) {
        signesString.push('positif')
      }
    })
    return signesString
  }

  /**
   *
   * @param  {...any} n une liste de deux ou plus de nombres relatifs
   * @return {number} Renvoie le signe du produit des nombres de cette liste. 1 ou -1
   * @example getSigneProduitNumber(1,-4,-7) renvoie 1
   */

  function getSigneProduitNumber (...n) {
    let produit = 1
    try {
      // port du string interdit !
      n.forEach(function (element) {
        if (typeof element === 'string') {
          throw new TypeError(`${element} est un string !`)
        }
        if (element === 0) {
          throw new RangeError(`${element} a été exclu des valeurs possibles.`)
        }
      })
      // Quoi faire sans nombres ?
      if (n.length === 0) {
        throw new Error('C\'est mieux avec quelques nombres !')
      }
      n.forEach(function (element) {
        produit = produit * element
      })
      if (produit < 0) {
        return -1
      }
      if (produit > 0) {
        return 1
      }
    } catch (err) {
      console.log(err.message)
      console.log(err.stack)
    }
  }

  /**
   *
   * @param  {...any} n une liste de deux ou plus de nombres relatifs
   * @return {string} Renvoie un string désignant le signe du produit des nombres de cette liste. postif1 ou négatif
   * @example getSigneProduitNumber(1,-4,-7) renvoie le string positif
   */

  function getSigneProduitString (...n) {
    const produit = getSigneProduitNumber(...n)
    if (produit === -1) {
      return 'négatif'
    }
    if (produit === 1) {
      return 'positif'
    }
  }

  /**
   *
   * @param  {...any} n une liste de deux ou plus de nombres relatifs
   * @return {string} Renvoie le nombre d'éléments négatifs des nombres de cette liste.
   * * la liste d'entiers doit être passé dans un tableau
   * @example getCardNegatifs([1,-4,-7]) renvoie 2
   * @example getCardNegatifs([4,-5,7,7,-8,-9]) renvoie 3
   */

  function getCardNegatifs ([...n]) {
    let card = 0
    try {
      // port du string interdit !
      n.forEach(function (element) {
        if (typeof element === 'string') {
          throw new TypeError(`${element} est un string !`)
        }
        if (element === 0) {
          throw new RangeError(`${element} a été exclu des valeurs possibles.`)
        }
      })
      // Quoi faire sans nombres ?
      if (n.length === 0) {
        throw new Error('C\'est mieux avec quelques nombres !')
      }
      n.forEach(function (element) {
        if (element < 0) {
          card = card + 1
        }
      })
      return card
    } catch (err) {
      console.log(err.message)
    }
  }

  /**
   * Fonction locale
   * @param {integer} n un entier désignant le cardinal de facteurs négatifs dans un produit
   * @return un string au singulier ou au pluriel
   * @example orth_facteurs_negatifs(0) ou orth_facteurs_negatifs(1) renvoie 'facteur negatif'
   * @example orth_facteurs_negatifs(7) renvoie 'facteurs negatifs'
   */
  function orthographeFacteursNegatifs (n) {
    if (n >= 2) {
      return 'facteurs négatifs'
    } else {
      return 'facteur négatif'
    }
  }

  /**
   * @param  {...any} n une liste de deux ou plus de nombres relatifs qui constituent les facteurs du produit
   * @return {string} Renvoie la règle qui permet de justifier le signe d'un produit de relatifs adaptée à la liste passée en paramètre.
   * @example setRegleProduitFacteurs([1,-2,-8,5]) renvoie le string 'Il y a 2 facteurs négatifs, le nombre de facteurs négatifs est pair donc le produit est positif.'
   */

  function setRegleSigneProduit (...n) {
    try {
      // port du string interdit !
      n.forEach(function (element) {
        if (typeof element === 'string') {
          throw new TypeError(`${element} est un string !`)
        }
      })
      // Quoi faire sans nombres ?
      if (n.length === 0) {
        throw new Error('C\'est mieux avec quelques nombres !')
      }
      if (n.length === 2) {
        if (getCardNegatifs(n) % 2 === 0) {
          return 'Les deux facteurs ont le même signe donc le produit est positif.'
        } else {
          return 'Les deux facteurs ont un signe différent donc le produit est négatif.'
        }
      } else if (n.length > 2) {
        if (getCardNegatifs(n) % 2 === 0) {
          if (getCardNegatifs(n) === 0) {
            return 'Tous les facteurs sont positifs donc le produit est positif.'
          } else {
            return `Il y a ${getCardNegatifs(n)} ${orthographeFacteursNegatifs(getCardNegatifs(n))}, le nombre de facteurs négatifs est pair donc le produit est positif.`
          }
        } else {
          return `Il y a ${getCardNegatifs(n)} ${orthographeFacteursNegatifs(getCardNegatifs(n))}, le nombre de facteurs négatifs est impair donc le produit est négatif.`
        }
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  /**
   *
   * @param  {...any} num une liste de deux ou plus de nombres relatifs qui constituent les facteurs du numérateur
   * @param  {...any} den une liste de deux ou plus de nombres relatifs qui constituent les facteurs du dénominateur
   * @return {string} Renvoie la règle qui permet de justifier le signe d'un produit de relatifs adaptée à la liste passée en paramètre.
   * @example setRegleProduitQuotient([1,-2],[-8,5]) renvoie le string 'La somme des facteurs négatifs du numérateur et des facteurs négatifs du dénominateur vaut 2, ce nombre est pair donc le quotient est positif.'
   */

  function setRegleSigneQuotient (...n) {
    try {
      // port du string interdit !
      n.forEach(function (element) {
        if (typeof element === 'string') {
          throw new TypeError(`${element} est un string !`)
        }
      })
      // Quoi faire sans nombres ?
      if (n.length === 0) {
        throw new Error('C\'est mieux avec quelques nombres !')
      }
      if (n.length === 2) {
        if (getCardNegatifs(n) % 2 === 0) {
          return 'Le numérateur et le dénominateur ont le même signe donc le quotient est positif.'
        } else {
          return 'Les numérateur et le dénominateur ont un signe différent donc le quotient est négatif.'
        }
      } else if (n.length > 2) {
        if (getCardNegatifs(n) % 2 === 0) {
          if (getCardNegatifs(n) === 0) {
            return 'Tous les facteurs du numérateur et tous les facteurs du dénominateur sont positifs donc le quotient est positif.'
          } else {
            // return `La somme du nombre de facteurs négatifs du numérateur et du nombre de facteurs négatifs du dénominateur vaut ${getCardNegatifs(n)}, ce nombre est pair donc le quotient est positif.`;
            return `Quand on compte les facteurs négatifs du numérateur et du dénominateur, on trouve ${getCardNegatifs(n)}, ce nombre est pair donc le quotient est positif.`
          }
        } else {
          // return `La somme du nombre de facteurs négatifs du numérateur et du nombre de facteurs négatifs du dénominateur vaut ${getCardNegatifs(n)}, ce nombre est impair donc le quotient est négatif.`;
          return `Quand on compte les facteurs négatifs du numérateur et du dénominateur, on trouve ${getCardNegatifs(n)}, ce nombre est impair donc le quotient est négatif.`
        }
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  this.getSigneNumber = getSigneNumber
  this.getSigneString = getSigneString
  this.getSigneProduitNumber = getSigneProduitNumber
  this.getSigneProduitString = getSigneProduitString
  this.getCardNegatifs = getCardNegatifs
  this.setRegleSigneProduit = setRegleSigneProduit
  this.setRegleSigneQuotient = setRegleSigneQuotient
}

// Gestion du fichier à télécharger
export function telechargeFichier (text, filename) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()

  document.body.removeChild(element)
}

// Gestion des styles LaTeX

export function dataTailleDiaporama (exercice) {
  if (context.vue !== 'diap') {
    return ''
  } else if (exercice.tailleDiaporama !== 1) {
    return `data-taille = "${exercice.tailleDiaporama}"`
  }
}

function dataTaille (taille) {
  if (context.vue !== 'diap' || taille === 1) {
    return ''
  } else if (taille !== 1) {
    return `data-taille = "${taille}"`
  }
}
