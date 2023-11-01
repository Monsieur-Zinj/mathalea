import {
  isExerciceItemInReferentiel,
  isStaticType,
  type ResourceAndItsPath
} from '../../lib/types/referentiels'

/**
 * Un type pour décomposer les chaînes de caractères
 */
type StringDecomposition = {
  index: number
  value: string[]
  o: string
  s: string
}

/**
 * Un type pour faciliter le tri d'un tableau de resource
 */
type ResourceAndItsPathDecomposition = {
  index: number
  value: string[]
  o: ResourceAndItsPath
  s: string
}

/**
 * Détecte si une chaîne est un nombre ou pas
 * @param v chaine à inspecter
 * @returns `true` si la chaîne contient un nombre
 */
function thisStringRepresentsANumber (v: string) {
  return (+v).toString() === v
}

/**
 * Trier deux objets décrit par un tableau de chaînes
 */
const customSorting = {
  asc: function (a: StringDecomposition, b: StringDecomposition): number {
    let i = 0
    const l = Math.min(a.value.length, b.value.length)

    while (i < l && a.value[i] === b.value[i]) {
      i++
    }
    if (i === l) {
      return a.value.length - b.value.length
    }
    if (
      thisStringRepresentsANumber(a.value[i]) &&
      thisStringRepresentsANumber(b.value[i])
    ) {
      return parseInt(a.value[i]) - parseInt(b.value[i])
    }
    return a.value[i].localeCompare(b.value[i])
  },
  desc: function (a: StringDecomposition, b: StringDecomposition): number {
    return customSorting.asc(b, a)
  }
}

/**
 * Trier deux objets décrit par un tableau de chaînes
 */
const customSortingForResources = {
  asc: function (
    a: ResourceAndItsPathDecomposition,
    b: ResourceAndItsPathDecomposition
  ): number {
    let i = 0
    const l = Math.min(a.value.length, b.value.length)

    while (i < l && a.value[i] === b.value[i]) {
      i++
    }
    if (i === l) {
      return a.value.length - b.value.length
    }
    if (
      thisStringRepresentsANumber(a.value[i]) &&
      thisStringRepresentsANumber(b.value[i])
    ) {
      return parseInt(a.value[i]) - parseInt(b.value[i])
    }
    return a.value[i].localeCompare(b.value[i])
  },
  desc: function (
    a: ResourceAndItsPathDecomposition,
    b: ResourceAndItsPathDecomposition
  ): number {
    return customSortingForResources.asc(b, a)
  }
}

/**
 * Trier un tableau de chaînes de caractères contenant des tirets
 * comme `4A10`, `4A10-1` `4A10-10`, etc.
 * Source : https://stackoverflow.com/a/47051217
 * @param data tableau à trier
 * @param order `asc` (défaut) ou `desc`
 */
export const sortArrayOfStringsWithHyphens = (
  data: string[],
  order: 'asc' | 'desc' = 'asc'
) => {
  // nettoyer les chaînes en ne gardant que les éléments liés par des tirets
  // (comme `4-A10-1`) puis déstructurer cette chaîne
  const mapped = data.map(function (el, i) {
    const string = el.replace(/\d(?=[a-z])|[a-z](?=\.)/gi, '$&. .')
    const regex = /(\d+)|([^0-9.]+)/g
    let m: RegExpExecArray | null
    const parts = []

    while ((m = regex.exec(string)) !== null) {
      parts.push(m[0])
    }
    return { index: i, value: parts, o: el, s: string }
  })
  mapped.sort(customSorting[order] || customSorting.asc)
  return mapped.map(function (el) {
    return data[el.index]
  })
}

export const sortArrayOfResourcesBasedOnProp = (
  data: ResourceAndItsPath[],
  key: 'uuid' | 'id',
  order: 'asc' | 'desc' = 'asc'
): ResourceAndItsPath[] => {
  if (data.length === 0) {
    return data
  }
  const mapped = data.map((elt, i) => {
    const r = elt.resource
    let string: string
    if (isExerciceItemInReferentiel(r) && key === 'id') {
      string = r[key].replace(/\d(?=[a-z])|[a-z](?=\.)/gi, '$&. .')
    } else if (isStaticType(r) && key === 'uuid') {
      string = r[key].replace(/\d(?=[a-z])|[a-z](?=\.)/gi, '$&. .')
    } else {
      throw new Error(`La clé ${key} n'existe pas dans les ressources à trier.`)
    }
    const regex = /(\d+)|([^0-9.]+)/g
    let m: RegExpExecArray | null
    const parts = []

    while ((m = regex.exec(string)) !== null) {
      parts.push(m[0])
    }
    return { index: i, value: parts, o: elt, s: string }
  })
  mapped.sort(customSortingForResources[order] || customSortingForResources.asc)
  return mapped.map(function (el) {
    return data[el.index]
  })
}
