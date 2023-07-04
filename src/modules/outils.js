/* globals UI */
import Algebrite from 'algebrite'
import Decimal from 'decimal.js'
import { evaluate, format, isArray, isInteger, round } from 'mathjs'
import { texMulticols } from '../lib/outils/miseEnPage.js'
import { factorisation } from '../lib/outils/primalite.js'
import { context } from './context.js'
import { setReponse } from './gestionInteractif.js'
import { getVueFromUrl } from './gestionUrl.js'

export const tropDeChiffres = 'Trop de chiffres'
export const epsilon = 0.000001
const math = { format, evaluate }

/**
 * Affecte les propriétés contenues et contenuCorrection (d'après les autres propriétés de l'exercice)
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
 * Utilise liste_questions et liste_corrections pour remplir contenu et contenuCorrection
 * La liste des questions devient une liste HTML ou LaTeX avec html_ligne() ou tex_paragraphe()
 * @param {Exercice} exercice
 * @author Rémi Angot
 */
export function listeQuestionsToContenuSansNumero (exercice, retourCharriot = true) {
  // En vue diapCorr, les questions doivent toujours être numérotées, car venant d'exercices différents
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
 * Contraint une valeur à rester dans un intervalle donné. Si elle est trop petite, elle prend la valeur min, si elle est trop grande elle prend la valeur max
 * @author Jean-Claude Lhote à partir du code d'Eric Elter
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
 * @param {boolean} [shuffle=true] si true, on brasse la liste en sortie sinon on garde l'ordre
 * @param {number} nbQuestions obligatoire : c'est la taille de la liste en sortie. Si 999, alors le nbQuestions correspond à la longueur de saisie.
 * @param {number | undefined} melange la valeur utilisée pour l'option mélange
 * @param {boolean} [enleveDoublons=false]  si true, la liste en sortie ne peut pas contenir deux fois la même valeur
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
    if (typeof (saisie) === 'number' || Number.isInteger(saisie)) { // Si c'est un nombre, c'est que le nombre a été saisi dans la barre d'adresses
      listeIndex = [contraindreValeur(min, Math.max(max, melange ?? max), saisie, defaut)]
    } else {
      listeIndexProvisoire = saisie.split('-')// Sinon on crée un tableau à partir des valeurs séparées par des tirets
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
 * Retourne true si le nombre a est inférieur à b
 * @param {number} a premier nombre
 * @param {number} b deuxième nombre
 * @param {number} [tolerance=0.000001] seuil positif en dessous duquel une valeur est considérée comme nulle
 * @return {boolean}
 */
export function inferieur (a, b, tolerance = epsilon) {
  return (b - a > tolerance)
}

/**
 * Retourne true si le nombre a est supérieur ou égal à b
 * @param {number} a premier nombre
 * @param {number} b deuxième nombre
 * @param {number} [tolerance=0.000001] seuil positif en dessous duquel une valeur est considérée comme nulle
 * @return {boolean}
 */
export function superieurouegal (a, b, tolerance = epsilon) {
  return (a - b > tolerance || egal(a, b, tolerance))
}

/**
 * Retourne true si le nombre a est inférieur ou égal à b
 * @param {number} a premier nombre
 * @param {number} b deuxième nombre
 * @param {number} [tolerance=0.000001] seuil positif en dessous duquel une valeur est considérée comme nulle
 * @return {boolean}
 */
export function inferieurouegal (a, b, tolerance = epsilon) {
  return (b - a > tolerance || egal(a, b, tolerance))
}

/**
 * Retourne true si le nombre a est entier ou "presque" entier
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

/**
 * Créé tous les couples possibles avec un élément de E1 et un élément de E2.
 * L'ordre est pris en compte, donc on pourra avoir (3,4) et (4,3).
 * Si le nombre de couples possibles est inférieur à nombreDeCouplesMin alors
 * on concatène 2 fois la même liste, mais avec des ordres différents.
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
    listeAEviter = listeAEviter.map(Number).filter(el => Math.round(el) === el) // on filtre les non-nombres et les non-entiers
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
 * Compter les occurences d'un item dans un tableau
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
 * Enlève toutes les occurences d'un élément d'un tableau donné, mais sans modifier le tableau en paramètre et renvoie le tableau modifié
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
 * Enlève l'élément index d'un tableau attention ! modifie le tableau passé en argument ne retourne rien
 * @param {Array<any>} le tableau à modifier
 * @param {number} index de l'élément à retirer
 * @author Jean-Claude Lhote
 */
export function enleveElementNo (array, index) {
  if (index >= 0 && index < array.length) array.splice(index, 1)
}

/**
 * Enlève l'élément index d'un tableau sans modifier le tableau et retourne le résultat
 * @param {Array<any>} le tableau à modifier
 * @param {number} index de l'élément à retirer
 * @return {Array<any>} une copie du tableau modifié
 * @author Jean-Claude Lhote
 */
export function nouveauTableauPriveDunElement (array, index) {
  const tableaucopie = array.slice()
  return tableaucopie.splice(index, 1)
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
 * Retourne une liste entre 2 bornes sans appartenir à une liste donnée (par défaut des entiers, mais on peut changer le pas)
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
 * Fonction de comparaison à utiliser avec <tableau.sort(compareNombres)>
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
 * @param {array} arr Tableau duquel on veut supprimer les doublons numériques
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
 * de la liste initiale, mais sans gestion de nombre de doublons.
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
  // Concatène liste à elle-même en changeant
  if (liste.length === 0) window.notify('erreur dans CombinaisonListes : la liste à combiner est vide', { liste })
  let l = [...liste] // on ne modifie pas la liste passée en argument !
  while (l.length < tailleMinimale) {
    l = l.concat(liste)
  }
  return l
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
 * Le résultat est un string qui doit être entouré de $ pour le mode mathématique
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
 *
 * @param {Entier} n
 * Extrait le plus grand nombre possible de la racine carrée de n
 * retourne le résulat [a, b] pour a²b=n
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
 * retourne le code Latex de la racine carrée de n réduite
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
 * @deprecated !!! Utiliser la class Decimal pour faire des calculs sur les décimaux exacts :
 * Cette fonction ne règle en rien le problème des flottants
 * `calcul(0.3)` retourne le même 0.3 qui en fait est 0.299999999999999989
 * Si c'est pour arrondir, utiliser arrondi(nombre, précision) qui ne règle pas plus le problème des flottants.
 * @author Rémi Angot modifié par Jean-Claude Lhote mais en vain !
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
 * Utilise la class Decimal pour s'assurer qu'il n'y a pas d'erreur dans les calculs avec des décimaux
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
      cpt++ // Au bout de 20 essais, on laisse tomber la liste à éviter
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
export function scientifiqueToDecimal (mantisse, exp) {
  if (exp < -6) Decimal.set({ toExpNeg: exp - 1 })
  else if (exp > 20) Decimal.set({ toExpPos: exp + 1 })
  return texNombre(new Decimal(mantisse).mul(Decimal.pow(10, exp)), 10)
}

/**
 *
 * @param {string |number} nb
 * @returns {string}
 */
export function insereEspaceDansNombre (nb) {
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

export function insertCharInString (string, index, char) {
  return string.substring(0, index) + char + string.substring(index, string.length)
}

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
