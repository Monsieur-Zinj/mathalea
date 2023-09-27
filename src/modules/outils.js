/* globals UI */
import Algebrite from 'algebrite'
import { evaluate, round } from 'mathjs'
import {
  combinaisonListes,
  combinaisonListesSansChangerOrdre,
  compteOccurences,
  enleveDoublonNum
} from '../lib/outils/arrayOutils.js'
import { texMulticols } from '../lib/format/miseEnPage.js'
import { arrondi, rangeMinMax } from '../lib/outils/nombres.js'
import { context } from './context.js'

export const tropDeChiffres = 'Trop de chiffres'
export const epsilon = 0.000001

/**
 * Affecte les propriétés contenues et contenuCorrection (d'après les autres propriétés de l'exercice)
 * @param {Exercice} exercice
 */
export function listeQuestionsToContenu (exercice) {
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


/**
 * Utilise liste_questions et liste_corrections pour remplir contenu et contenuCorrection
 * La liste des questions devient une liste HTML ou LaTeX avec html_ligne() ou tex_paragraphe()
 * @param {Exercice} exercice
 * @param {boolean} retourCharriot
 * @author Rémi Angot
 */
export function listeQuestionsToContenuSansNumero (exercice, retourCharriot = true) {
  if (document.getElementById('supprimer_reference') && document.getElementById('supprimer_reference').checked === true) {
    exercice.contenu = texConsigne(exercice.consigne) + texIntroduction(exercice.introduction) + texMulticols(texParagraphe(exercice.listeQuestions, exercice.spacing, retourCharriot), exercice.nbCols)
  } else {
    exercice.contenu = texConsigne(exercice.consigne) + `\n\\marginpar{\\footnotesize ${exercice.id}}` + texIntroduction(exercice.introduction) + texMulticols(texParagraphe(exercice.listeQuestions, exercice.spacing, retourCharriot), exercice.nbCols)
  }
  // exercice.contenuCorrection = texConsigne(exercice.consigneCorrection) + texMulticols(texEnumerateSansNumero(exercice.listeCorrections,exercice.spacingCorr),exercice.nbColsCorr)
  exercice.contenuCorrection = texConsigne(exercice.consigneCorrection) + texMulticols(texParagraphe(exercice.listeCorrections, exercice.spacingCorr, retourCharriot), exercice.nbColsCorr)
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
 * @param {string|number} saisie Ce qui vient du formulaireTexte donc une série de nombres séparés par des tirets ou un seul nombre (normalement en string) ou rien
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
  if (typeof (saisie) === 'boolean' || saisie === '' || saisie === null || saisie === undefined) { // Si aucune liste n'est saisie
    listeIndex = [defaut]
  } else {
    if (typeof (saisie) === 'number' || Number.isInteger(saisie)) { // Si c'est un nombre, c'est que le nombre a été saisi dans la barre d'adresses
      listeIndex = [contraindreValeur(min, Math.max(max, melange ?? max), saisie, defaut)]
    } else {
      listeIndexProvisoire = saisie.split('-')// Sinon on crée un tableau à partir des valeurs séparées par des tirets
      for (let i = 0; i < listeIndexProvisoire.length; i++) { // on a un tableau avec des strings : ['1', '1', '2']
        if (!isNaN(parseInt(listeIndexProvisoire[i]))) {
          listeIndex.push(contraindreValeur(min, Math.max(max, melange ?? max), parseInt(listeIndexProvisoire[i]), defaut))
        } // parseInt en fait un tableau d'entiers
      }
    }
  }
  if (listeIndex.length===0) listeIndex = [defaut] // EE : Le cas où finalement listeIndex est vide car la saisie n'était pas un paramètre attendu.
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
 * @param {number} a borne inférieure
 * @param {number} b borne supérieure
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
  return estentier(Math.sqrt(x))
}

// Fonctions mathématiques

/**
 * Choisit un nombre au hasard entre min et max sans appartenir à liste\_a\_eviter.
 * @param {number} min
 * @param {number} max
 * @param {number | Array<number>} listeAEviter - Tous les éléments que l'on souhaite supprimer
 * @return {number} Nombre au hasard entre min et max non compris dans la listeAEviter
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
export function calculANePlusJamaisUtiliser (x, arrondir = 6) {
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
 * Renvoie une liste HTML ou LaTeX suivant le contexte
 *
 * @param liste une liste de questions
 * @param spacing interligne (line-height en css)
 * @author Rémi Angot
 */
export function enumerate (liste, spacing) {
  return texEnumerate(liste, spacing)
}

/**
 * Renvoie une liste sans puce ni numéro HTML ou LaTeX suivant le contexte
 *
 * @param liste une liste de questions
 * @param spacing interligne (line-height en css)
 * @author Sébastien Lozano
 */
export function enumerateSansPuceSansNumero (liste, spacing) {
  return texEnumerate(liste, spacing).replace('\\begin{enumerate}', '\\begin{enumerate}[label={}]')
}

/**
 * Renvoie \exo{consigne}
 * @author Rémi Angot
 */
export function texConsigne (consigne) {
  return '\\exo{' + ((consigne != null && typeof consigne === 'string')? consigne.replace(/<br>/g, '\\\\') : '') + '}\n\n'
}

/**
 * @author Frédéric Piou
 * @param {number} nb
 * @returns retourne un nombre au format français sans espace après la virgule
 */
export function num (nb) {
  if (typeof nb === 'number'){
    return Intl.NumberFormat('fr-FR', { maximumFractionDigits: 20 }).format(nb).toString().replace(/\s+/g, '\\thickspace ').replace(',', '{,}')
  } else {
    window.notify(`Fonction num() appelée avec autre chose qu'un number`, {nb})
  }

}

/**
 * Affiche un lien vers une URL
 * @param {string} texte à afficher
 * @param {string} lien
 * @author Rémi Angot
 */
export function href (texte, lien) {
  if (typeof texte === 'string' && texte !=='' && typeof lien === 'string' && lien !== '') {
    if (context.isHtml) {
      return `<a target="_blank" href=${lien}> ${texte} </a>`
    } else {
      return `\\href{${lien}}{${texte}}`
    }
  }
}

/**
 * Utilise printlatex et quote de Algebrite
 * @author Rémi Angot
 */

export function printlatex (e) {
  if (typeof e === 'string' && e!=='') {
    if (e === '0x') {
      return '0'
    } else {
      return Algebrite.run(`printlatex(quote(${e}))`)
    }
  }
}

/**
 * Retourne un environnement LaTeX itemize à partir d'une liste
 * @author Rémi Angot
 */
export function itemize (tableauDeTexte) {
  if (Array.isArray(tableauDeTexte) && tableauDeTexte.filter(el=>typeof el !== 'string').length !==0) {
    let texte
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
  } else {
    window.notify(`Fonction itemize appelée avec autre chose qu'un array de string`, {tableauDeTexte})
  }
  }
