// inspiration : https://blog.susomejias.dev/blog/design-pattern-criteria
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

  addCriterion (criterion: Criterion<T> | Criterion<T>[]): void {
    if (Array.isArray(criterion)) {
      for (const item of criterion) {
        this.criteriaList.push(item)
      }
    } else { this.criteriaList.push(criterion) }
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

  addCriterion (criterion: Criterion<T> | Criterion<T>[]): void {
    if (Array.isArray(criterion)) {
      for (const item of criterion) {
        this.criteriaList.push(item)
      }
    } else { this.criteriaList.push(criterion) }
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
