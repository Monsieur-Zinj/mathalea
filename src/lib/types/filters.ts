// inspiration : https://blog.susomejias.dev/blog/design-pattern-criteria

import {
  isExerciceItemInReferentiel,
  type ResourceAndItsPath,
  type Level,
  isResourceHasPlace,
  isLevelType,
  isTool
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

  addCriterion (
    criterion: Criterion<T> | Criterion<T>[]
  ): AtLeastOneOfCriteria<T> {
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
 * const all = getAllEndings(baseReferentiel)                // création de l'objet de recherche
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
 * @param {boolean} [considerCAN=false] doit-on inclure les exos CAN ou pas ?
 * @returns { Criterion<ResourceAndItsPath>} un critère pour filtration
 */
export function levelCriterion (
  level: Level,
  considerCAN: boolean = false
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

export function idCriterion (idToMatch: string): Criterion<ResourceAndItsPath> {
  const criterion: Criterion<ResourceAndItsPath> = {
    meetCriterion (items: ResourceAndItsPath[]) {
      return items.filter((item: ResourceAndItsPath) => {
        if (
          isExerciceItemInReferentiel(item.resource) ||
          isTool(item.resource)
        ) {
          return item.resource.id.includes(idToMatch)
        } else {
          return false
        }
      })
    }
  }
  return criterion
}

/**
 * Construit un critère de filtration sur un sujet (chaîne de caractères).
 * La recherche s'effectue sur le titre (s'il y en a) ou sur le lieu (s'il y en a)
 * @param {String} subject le sujet à rechercher
 * @param {boolean} [isCanIncluded=false] doit-on inclure les exercices CAN dans le critère de la recherche
 * @returns { Criterion<ResourceAndItsPath>} un critère pour filtration
 */
export function subjectCriterion (
  subject: string,
  isCanIncluded: boolean = false
): Criterion<ResourceAndItsPath> {
  const criterion: Criterion<ResourceAndItsPath> = {
    meetCriterion (items: ResourceAndItsPath[]) {
      return items.filter((item) => {
        if (item.pathToResource.includes('CAN') && !isCanIncluded) {
          return false
        }
        // on recherche un lieu
        let placeMatch = false
        if (isResourceHasPlace(item.resource)) {
          // si le sujet est un lieu et que la ressource a `lieu` dans ses propriété, on compare
          placeMatch = item.resource.lieu
            .toLowerCase()
            .includes(subject.toLowerCase())
        }
        // on rechercher dans le titre
        if (isExerciceItemInReferentiel(item.resource)) {
          // la ressource est un exercice : elle a donc un titre
          if (
            item.resource.titre.toLowerCase().includes(subject.toLowerCase())
          ) {
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

/**
 * Construit un critère de filtration basé sur une chaine de caractère.
 * On distingue les niveaux et les sujets.
 * @param {string} input chaîne de caractère recherchée
 * @param {boolean} [isCanIncluded=false] flag pour savoir si la recherche doit inclure les exercices CAN ou pas
 * @returns un critère unique si un seul mot est recherché ou un critère multiple basé sur le OU
 */
export function stringToCriteria (
  input: string,
  isCanIncluded: boolean = false
): Criterion<ResourceAndItsPath> {
  // on construit le tableau des mots recherchés en retirant les espaces superflus
  // mais en préservant les chaînes entre guillemets ou apostrophes
  // pour l'idée, voir : https://stackoverflow.com/a/16261693/6625987
  const re = /(?:[^\s"']+|['"][^'"]*["'])+/g
  // on enlève les espace aux bornes et on partage la chaîne sur un ou plusieurs espace entre les mots (ainsi pas de chaine vide dans le tableau)
  const regExpResult = input.trim().match(re)
  const words = regExpResult === null ? [] : [...regExpResult]
  if (words.length === 0 || (words.length === 1 && words[0].length === 0)) {
    // la chaîne explorée ne doit pas être vide
    throw new Error('Search input should not be empty when building Criteria')
  } else {
    // on regarde si `CAN` est un mot pour inclure les exos CAN dans le critère de recherche
    if (words.map((word) => word.toUpperCase()).includes('CAN')) {
      isCanIncluded = true
    }
    // on nettoie les guillemets ou apostrophes si présentes dans une chaîne
    // (une chaîne peut être : "labyrinthe de multiples", "l'heure", 'informations inutiles')
    words.forEach((word, index, theArray) => {
      let w = word
      if (/^['||"]/.test(word)) {
        // la chaîne contient un guillemet ou apostrophe au début
        w = w.slice(1) // on retire le premier caractère
      }
      if (/['||"]$/.test(word)) {
        // la chaîne contient un guillemet ou apostrophe à la fin
        w = w.slice(0, -1) // on retire le dernier caractère
      }
      theArray[index] = w
    })
    if (words.length === 1) {
      // un seul mot dans le champ de recherche
      if (isLevelType(words[0])) {
        return levelCriterion(words[0], isCanIncluded)
      } else {
        return new AtLeastOneOfCriteria([
          subjectCriterion(words[0], isCanIncluded),
          tagCriterion(words[0]),
          idCriterion(words[0])
        ])
      }
    } else {
      // plusieurs mots dans le champs de recherche : on construit un critère multiple
      // basé sur le OU entre tous les critères (niveau + sujets)
      const levelsCriteria: Criterion<ResourceAndItsPath>[] = []
      const subjectsCriteria: Criterion<ResourceAndItsPath>[] = []
      const tagsCriteria: Criterion<ResourceAndItsPath>[] = []
      const idsCriteria: Criterion<ResourceAndItsPath>[] = []
      const subjectsAsString: string[] = [] // pour garder trace des sujets comme mots
      for (const word of words) {
        // on sépare les mots suivants qu'ils représentent un niveau ou pas (par exemple '4e' est un niveau)
        // et on crée des critères en conséquences
        if (isLevelType(word)) {
          levelsCriteria.push(levelCriterion(word, isCanIncluded))
        } else {
          subjectsAsString.push(word)
          subjectsCriteria.push(
            subjectCriterion(word.replace('+', ''), isCanIncluded)
          )
          tagsCriteria.push(tagCriterion(word.replace('+', '')))
          idsCriteria.push(tagCriterion(word.replace('+', '')))
        }
      }
      // on a que des critères de niveaux (deux ou plus ici), on en renvoie l'union
      if (subjectsCriteria.length === 0) {
        if (levelsCriteria.length === 1) {
          return levelsCriteria[0]
        } else {
          return new AtLeastOneOfCriteria([
            levelsCriteria[0],
            levelsCriteria[1],
            ...levelsCriteria.slice(2)
          ])
        }
      }
      // on a au moins un critères de sujet donc on traite tous les critères de sujets/tags
      const parsedSubjectsCriteria: Criterion<ResourceAndItsPath> =
        parseStringCriteria(subjectsAsString, subjectsCriteria)
      const parsedTagsCriteria: Criterion<ResourceAndItsPath> =
        parseStringCriteria(subjectsAsString, tagsCriteria)
      const parsedIDsCriteria: Criterion<ResourceAndItsPath> =
        parseStringCriteria(subjectsAsString, idsCriteria)
      // on a que des critères de sujets/tags (deux ou plus ici), on renvoie leur traitement
      if (levelsCriteria.length === 0) {
        return new AtLeastOneOfCriteria([
          parsedSubjectsCriteria,
          parsedTagsCriteria,
          parsedIDsCriteria
        ])
      }
      // dans ce qui suit, on a soit au moins un niveau ET un sujet et peut-être autre chose
      // pour chaque niveaux, on construit le critère de recherche niveau ET sujets/tags traités
      const levelsAndSubjectsCriteria: Criterion<ResourceAndItsPath>[] = []
      for (const criterion of levelsCriteria) {
        levelsAndSubjectsCriteria.push(
          new MultiCriteria<ResourceAndItsPath>()
            .addCriterion(criterion)
            .addCriterion(
              new AtLeastOneOfCriteria([
                parsedSubjectsCriteria,
                parsedTagsCriteria,
                parsedIDsCriteria
              ])
            )
        )
      }
      // on construit et renvoie l'union de tous les critères niveau+sujets/tags
      if (levelsAndSubjectsCriteria.length === 1) {
        return levelsAndSubjectsCriteria[0]
      } else {
        return levelsAndSubjectsCriteria.slice(1).reduce((prev, current) => {
          return new OrCriteria(prev, current)
        }, levelsAndSubjectsCriteria[0])
      }
    }
  }
}

/**
 * Construit un critère correspondant à un tableau de critères de sujet.
 * @remark Si le sujet est précédé d'un `+`, on fait une intersection des critères, sinon, on fait une union
 * @param subjects sujets comme mot
 * @param subjectsCriteria sujets comme critère
 * @returns un critère unique
 */
function parseStringCriteria (
  subjects: string[],
  criteria: Criterion<ResourceAndItsPath>[]
): Criterion<ResourceAndItsPath> {
  let parsedSubjects: Criterion<ResourceAndItsPath>
  if (criteria.length === 0) {
    throw new Error('No criterion passed')
  }
  if (criteria.length !== subjects.length) {
    throw new Error('Number of criterions and number of subjects are different')
  }
  if (criteria.length === 1) {
    parsedSubjects = criteria[0]
  } else {
    // on a plus d'un sujet, on fait l'union
    parsedSubjects = criteria.slice(1).reduce((prev, current, i) => {
      if (subjects[i + 1].slice(0, 1) === '+') {
        return new MultiCriteria<ResourceAndItsPath>()
          .addCriterion(prev)
          .addCriterion(current)
      } else {
        return new OrCriteria(prev, current)
      }
    }, criteria[0])
  }
  return parsedSubjects
}
