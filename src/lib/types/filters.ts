// inspiration : https://blog.susomejias.dev/blog/design-pattern-criteria

import {
  isExerciceItemInReferentiel,
  type ResourceAndItsPath,
  type Level,
  isResourceHasPlace
} from './referentiels'

/**
 * Définition d'un critère.
 *
 * ### Intention
 *
 * Un critère est essentiellement défini par la déclaration d'une fonction `meetCriterion`
 * qui prend une liste (typiquement un référentiel) et renvoie la liste passée au crible
 * définit dans `meetCriterion`.
 */
export interface Criterion<T> {
  meetCriterion(items: T[]): T[]
}

/**
 * Définition un critère multiple basé sur l'intersection de plusieurs critères
 *
 * ### Intention
 *
 * Tous les critères (stockés dans une variable privée)
 * doivent être vérifiés en même temps.
 *
 * @function addCriterion ajouter un critère (ou un tableau de critères) à la liste
 */
export class MultiCriteria<T> implements Criterion<T> {
  private criteriaList: Criterion<T>[] = []

  addCriterion (criterion: Criterion<T> | Criterion<T>[]): MultiCriteria<T> {
    if (Array.isArray(criterion)) {
      for (const item of criterion) {
        this.criteriaList.push(item)
      }
    } else {
      this.criteriaList.push(criterion)
    }
    return this
  }

  meetCriterion (items: T[]): T[] {
    let result: T[] = items
    for (const criterion of this.criteriaList) {
      result = criterion.meetCriterion(result)
    }
    return result
  }
}

/**
 * Définition d'un critère basé sur l'union de deux autres
 *
 * ### Intention
 *
 * Le critère contrôle si l'un ou l'autre des deux critères passés en paramètres
 * est vérifié.
 */
export class OrCriteria<T> implements Criterion<T> {
  private firstCriterion: Criterion<T>
  private secondCriterion: Criterion<T>
  constructor (firstCriterion: Criterion<T>, secondCriterion: Criterion<T>) {
    this.firstCriterion = firstCriterion
    this.secondCriterion = secondCriterion
  }

  meetCriterion (items: T[]): T[] {
    const firstResult = this.firstCriterion.meetCriterion(items)
    const secondResult = this.secondCriterion.meetCriterion(items)
    return Array.from(new Set([...firstResult, ...secondResult]))
  }
}

/**
 * Définition d'un critère multiple basé sur l'union de tous les critères
 *
 * ### Intention
 *
 * Ce critère sera vérifié si l'un au moins des critères
 * (stockés dans une variable privée) est vérifié.
 *
 * @function addCriterion ajouter un critère (ou un tableau de critères) à la liste
 */
export class AtLeastOneOfCriteria<T> implements Criterion<T> {
  private criteriaList: [Criterion<T>, Criterion<T>, ...Criterion<T>[]]
  // au moins deux critères sont demandés par le constructeur
  constructor (criteriaList: [Criterion<T>, Criterion<T>, ...Criterion<T>[]]) {
    this.criteriaList = [...criteriaList]
  }

  addCriterion (criterion: Criterion<T> | Criterion<T>[]): AtLeastOneOfCriteria<T> {
    if (Array.isArray(criterion)) {
      for (const item of criterion) {
        this.criteriaList.push(item)
      }
    } else {
      this.criteriaList.push(criterion)
    }
    return this
  }

  meetCriterion (items: T[]): T[] {
    const [firstCriterion, secondCriterion, ...list] = [...this.criteriaList]
    let resultCriterion = new OrCriteria<T>(firstCriterion, secondCriterion)
    for (const criterion of list) {
      resultCriterion = new OrCriteria<T>(resultCriterion, criterion)
    }
    return resultCriterion.meetCriterion(items)
  }
}

/**
 * Établie un critère de filtration sur la base d'une liste de spécifications
 * passée en paramètres
 * @remark Au 2023-10-01, seulement `amc` et `interactif` comme spécification autorisée
 * @param {[('interactif' | 'amc')]}specs liste des spécifications à rechercher (sur la base du ET)
 * @returns {Criterion<ResourceAndItsPath>} un critère pour filtration
 * @example
 * ```ts
 * const all = getAllExercises(baseReferentiel)                // création de l'objet de recherche
  const amcSpec = featuresCriteria(['amc'])                   // création du filtre
  const filteredList = amcSpec.meetCriterion(all)             // utilisation du filtre
  const filteredReferentiel = buildReferentiel(filteredList)  // reconstitution du référentiel
  ```
 */
export function featuresCriteria (
  specs: ('interactif' | 'amc')[]
): Criterion<ResourceAndItsPath> {
  // construction du critère pour la spécification `amc`
  const amcCriterion: Criterion<ResourceAndItsPath> = {
    meetCriterion (items: ResourceAndItsPath[]): ResourceAndItsPath[] {
      return items.filter((item: ResourceAndItsPath) => {
        if (isExerciceItemInReferentiel(item.resource)) {
          if (
            item.resource.features.amc &&
            item.resource.features.amc.isActive
          ) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      })
    }
  }
  // construction du critère pour la spécification `interactif`
  const interactifCriterion: Criterion<ResourceAndItsPath> = {
    meetCriterion (items: ResourceAndItsPath[]): ResourceAndItsPath[] {
      return items.filter((item: ResourceAndItsPath) => {
        if (isExerciceItemInReferentiel(item.resource)) {
          if (
            item.resource.features.interactif &&
            item.resource.features.interactif.isActive
          ) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      })
    }
  }
  // on trie en fonction de ce que contient la liste des spécifications
  if (specs.length < 2) {
    if (specs.length === 0) {
      // la liste ne peut pas être vide
      throw new Error(
        'La liste des spécifications passée en paramètre est vide !'
      )
    }
    // une seule spécification est présente : on renvoie le critère correspondant
    switch (specs[0]) {
      case 'amc':
        return amcCriterion
      case 'interactif':
        return interactifCriterion
    }
  } else {
    // les deux spécifications sont présents, on renvoie l'intersection des deux critères
    const criterion = new MultiCriteria<ResourceAndItsPath>()
    criterion.addCriterion(amcCriterion)
    criterion.addCriterion(interactifCriterion)
    return criterion
  }
}

/**
 * Construit un critère pour filtrer une liste d'objets `ResourceAndItsPath`
 * contre un niveau de classe
 * @param {Level} level le niveau de classe retenu
 * @param {boolean} considerCAN doit-on inclure les exos CAN ou pas ?
 * @returns { Criterion<ResourceAndItsPath>} un critère pour filtration
 */
export function levelCriterion (
  level: Level,
  considerCAN: boolean
): Criterion<ResourceAndItsPath> {
  const criterion: Criterion<ResourceAndItsPath> = {
    meetCriterion (items: ResourceAndItsPath[]) {
      return items.filter((item) => {
        // CAN est considéré comme un niveau donc on court-circuite les tests
        if (level === 'CAN') {
          return item.pathToResource[0] === level
        }
        if (considerCAN && item.pathToResource[0] === 'CAN') {
          // cas où on veut des exercices CAN, on regarde le 2e élément du chemin
          return item.pathToResource[1] === level
        } else {
          // dans l'autre cas, le niveau est dans le 1er élément du chemin
          return item.pathToResource[0] === level
        }
      })
    }
  }
  return criterion
}

/**
 * Construit un critère pour filtrer une liste d'objets `ResourceAndItsPath`
 * contre un sujet à rechercher dans la liste des tags
 * @param {string} selectedTag le sujet recherché dans les tags
 * @returns { Criterion<ResourceAndItsPath>} un critère pour filtration
 */
export function tagCriterion (
  selectedTag: string
): Criterion<ResourceAndItsPath> {
  const criterion: Criterion<ResourceAndItsPath> = {
    meetCriterion (items: ResourceAndItsPath[]) {
      return items.filter(
        (item: ResourceAndItsPath) =>
          item.resource.tags &&
          item.resource.tags
            .map((t) => t.toLowerCase())
            .includes(selectedTag.toLowerCase())
      )
    }
  }
  return criterion
}

/**
 * Construit un critère de filtration sur un sujet (chaîne de caractères).
 * La recherche s'effectue sur le titre (s'il y en a) ou sur le lieu (s'il y en a)
 * @param subject le sujet à rechercher
 * @returns { Criterion<ResourceAndItsPath>} un critère pour filtration
 */
export function subjectCriterion (
  subject: string
): Criterion<ResourceAndItsPath> {
  const criterion: Criterion<ResourceAndItsPath> = {
    meetCriterion (items: ResourceAndItsPath[]) {
      return items.filter((item) => {
        let placeMatch = false
        if (isResourceHasPlace(item.resource)) {
          // si le sujet est un lieu et que la ressource a `lieu` dans ses propriété, on compare
          placeMatch = item.resource.lieu.toLowerCase().includes(subject.toLowerCase())
        }
        if (isExerciceItemInReferentiel(item.resource)) {
          // la ressource est un exercice : elle a donc un titre
          if (item.resource.titre.toLowerCase().includes(subject.toLowerCase())) {
            return true
          } else {
            return false || placeMatch
          }
        } else {
          return false || placeMatch
        }
      })
    }
  }
  return criterion
}
