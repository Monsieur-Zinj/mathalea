import { egal, epsilon } from '../../modules/outils.js'
declare global {
  interface Window {
    notify: (message: string, object: unknown) => void;
    notifyLocal: (message: string, object: unknown) => void;
  }
}
/**
 *
 * @param {any[]} array1
 * @param {any[]} array2
 * @return boolean
 */
export function compareArrays (array1: unknown[], array2: unknown[]): boolean {
  if (!(Array.isArray(array1) && Array.isArray(array2)) || array1.length !== array2.length) return false
  for (let i = 0; i < array1.length; i++) {
    // le test suivant ne fonctionne pas avec des array contenant des objets, car objet1 === objet2 est toujours false.
    // il fonctionne avec des arrays d'array ou de primitives.
    const test = Array.isArray(array1[i]) ? compareArrays(array1[i] as unknown[], array2[i] as unknown[]) : array1[i] === array2[i]
    if (!test) return false
  }
  return true
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
export function creerCouples<T1, T2> (E1: T1[], E2: T2[], nombreDeCouplesMin = 10) {
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

/**
 * Enlève toutes les occurences d'un élément d'un tableau donné
 * Ajouté par Jean-Claude Lhote : la gestion des listes contenant des listes. (par exemple, dans 6N20-2).
 * @param liste
 * @param element
 *
 * @author Rémi Angot
 */
export function enleveElement<T> (array: Array<T>, item: T) {
  //
  for (let i = array.length - 1; i >= 0; i--) {
    if (typeof item === 'number') {
      if (egal(array[i] as number, item)) {
        array.splice(i, 1)
      }
    } else if (Array.isArray(array[i]) && Array.isArray(item)) {
      if (compareArrays(array[i] as unknown[], item)) {
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
 * Enlève toutes les occurences d'un élément d'un tableau donné (array1) et enlève les éléments associés dans un autre tableau (array2)
 * @param array array1
 * @param array array2
 * @param element item
 *
 * @author Rémi Angot
 */
export function enleveElementDouble<T> (array1: T[], array2: T[], item: T) {
  //
  for (let i = array1.length - 1; i >= 0; i--) {
    if (typeof item === 'number') {
      if (egal(array1[i] as number, item)) {
        array1.splice(i, 1)
        array2.splice(i, 1)
      }
    } else {
      if (array1[i] === item) {
        array1.splice(i, 1)
        array2.splice(i, 1)
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
export function compteOccurences<T> (array: T[], value: T): number {
  let cpt = 0
  array.forEach((v) => (v === value && cpt++))
  return cpt
}

/**
 * Enlève toutes les occurences d'un élément d'un tableau donné, mais sans modifier le tableau en paramètre et renvoie le tableau modifié
 * @author Rémi Angot & Jean-Claude Lhote
 */

export function enleveElementBis<T> (array: T[], item?: T) {
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
export function enleveElementNo<T> (array: T[], index: number) {
  if (index >= 0 && index < array.length) array.splice(index, 1)
}

/**
 * Enlève l'élément index d'un tableau sans modifier le tableau et retourne le résultat
 * @param {Array<any>} le tableau à modifier
 * @param {number} index de l'élément à retirer
 * @return {Array<any>} une copie du tableau modifié
 * @author Jean-Claude Lhote
 */
export function nouveauTableauPriveDunElement<T> (array: T[], index: number) {
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
export function choice<T> (liste: T[], listeAEviter: T[] = []): T {
  if (!Array.isArray(listeAEviter)) {
    listeAEviter = [listeAEviter]
  }
  const listebis = liste.slice()
  // Supprime les éléments de liste à éviter
  for (let i = 0; i < listeAEviter.length; i++) {
    enleveElement(listebis, listeAEviter[i])
  }
  const index = Math.floor(Math.random() * listebis.length)
  if (listebis[index] != null) return listebis[index]
  else {
    window.notify('choice a éliminé toutes les possibilités, il ne reste rien à choisir ! ', { liste, listeAEviter })
    return listebis[index] // C'est null...
  }
}

/**
 * retourne un tableau dans lequel les doublons ont été supprimés s'il y en a MAIS SANS TRI
 * @param {array} arr Tableau duquel on veut supprimer les doublons numériques
 * @param {number} tolerance La différence minimale entre deux valeurs pour les considérer comme égales
 * @author Jean-Claude Lhote
 **/
export function enleveDoublonNum (arr: number[], tolerance = epsilon) {
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
 * Mélange les items d'un tableau, sans modifier le tableau passé en argument
 *
 * @Example
 * tableau_melange = shuffle (tableau_origine)
 * @see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
export function shuffle<T> (array: T[]): T[] {
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

export function shuffleJusqua<T> (array: T[], indice: number): T[] {
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
 * @see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
export function shuffleLettres (txt: string) {
  const array = txt.split('')
  return shuffle(array).join('')
}

/**
 * Mélange les items de deux tableaux de la même manière
 *
 *
 * @see https://stackoverflow.com/questions/18194745/shuffle-multiple-javascript-arrays-in-the-same-way
 */
export function shuffle2tableaux<T, U> (obj1: T[], obj2: U[]): void {
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
 * Concatène liste à elle-même en changeant l'ordre à chaque cycle
 * @param {Array | ReadonlyArray} liste - Un tableau
 * @param {number} tailleMinimale - La taille minimale du tableau de sortie
 * @returns {Array} Un tableau du même type que liste
 *
 * @Example
 * combinaisonListes([A,B,C],7)
 * // [B,C,A,C,B,A,A,B,C]
 *
 * @author Rémi Angot
 */
export function combinaisonListes<T> (liste: T[], tailleMinimale: number) {
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
export function combinaisonListes2<T> (liste: T[], tailleMinimale: number) {
  if (liste.length === 0) window.notify('erreur dans CombinaisonListes : la liste à combiner est vide', { liste })
  let l = [...liste] // on ne modifie pas la liste passée en argument !
  while (l.length < tailleMinimale) {
    l = l.concat(choice(liste)as T[])
  }
  return shuffle(l)
}

export function combinaisonListesSansChangerOrdre<T> (liste: T[], tailleMinimale: number) {
  // Concatène liste à elle-même sans changer l'ordre
  if (liste.length === 0) window.notify('erreur dans CombinaisonListes : la liste à combiner est vide', { liste })
  let l = [...liste] // on ne modifie pas la liste passée en argument !
  while (l.length < tailleMinimale) {
    l = l.concat(liste)
  }
  return l
}
