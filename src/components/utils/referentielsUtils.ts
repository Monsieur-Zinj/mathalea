
import type { InterfaceReferentiel } from 'src/lib/types'
import referentiel from '../json/referentiel2022.json'
import referentielStatic from '../json/referentielStatic.json'
import codeList from '../json/codeToLevelList.json'
import { findPropPaths, findDuplicates } from './searching'
import { toMap } from './toMap'
import { isRecent } from './handleDate'

// Réorganisation du référentiel
// Suppression de la rubrique calcul mental
// On renomme les chapitres pour la partie statique
const baseReferentiel = { ...referentiel, static: { ...referentielStatic } }
// @ts-ignore
delete baseReferentiel['Calcul mental']
// @ts-ignore
baseReferentiel['3e']['Brevet des collèges par thèmes - APMEP'] = baseReferentiel.static['Brevet des collèges par thèmes - APMEP']
// @ts-ignore
baseReferentiel.PE['CRPE (2022-2023) par année'] = baseReferentiel.static['CRPE (2022-2023) par année']
// @ts-ignore
baseReferentiel.PE['CRPE (2022-2023) par thèmes'] = baseReferentiel.static['CRPE (2022-2023) par thèmes']
// @ts-ignore
baseReferentiel.PE['CRPE (2015-2019) par thèmes - COPIRELEM'] = baseReferentiel.static['CRPE (2015-2019) par thèmes - COPIRELEM']
// @ts-ignore
baseReferentiel.PE['CRPE (2015-2019) par année - COPIRELEM'] = baseReferentiel.static['CRPE (2015-2019) par année - COPIRELEM']
let referentielMap = toMap(baseReferentiel)

/**
 *
 * @param listOfEntries COnstruction d'un référentiel basé sur une liste d'entrée
 * @returns
 */
function buildReferentiel (listOfEntries) {
  const referentiel = {}
  for (const path of listOfEntries) {
    let schema = referentiel
    let obj = { ...baseReferentiel }
    for (let i = 0; i < path.length - 1; i++) {
      const elt = path[i]
      if (!schema[elt]) {
        schema[elt] = {}
      }
      schema = schema[elt]
      obj = { ...obj[path[i]] }
    }
    schema[path[path.length - 1]] = obj[path[path.length - 1]]
  }
  return referentiel
}

/**
   * Détecter si une valeur est un objet
   * @param val valeur à analyser
   */
const isObject = (val: unknown) => val && typeof val === 'object' && !Array.isArray(val)

/**
   * Construit un object contenant les références des exercices ayant une date
   * de modification ou de publication récente (<= 1mois)
   * en parcourant récursivement l'objet passé en paramètre
   * Inspiration : {@link https://stackoverflow.com/questions/15690706/recursively-looping-through-an-object-to-build-a-property-list/53620876#53620876}
   * @param {any} obj objet à parcourir (récursivement)
   * @return {[string]} objet des exos nouveaux
   * @author sylvain
   */
function getRecentExercises (obj: InterfaceReferentiel[]): InterfaceReferentiel[] {
  const recentExercises: InterfaceReferentiel[] = []
  /**
   * On parcourt récursivement l'objet référentiel et on en profite pour peupler
   * le tableau recentExercises avec les exercices dont les dates de publication
   * ou de modification sont récentes
   * @param obj Objet à parcourir
   */
  const traverseObject = (obj: InterfaceReferentiel[]): InterfaceReferentiel[] => {
    return Object.entries(obj).reduce((product, [key, value]) => {
      if (isObject(value as InterfaceReferentiel)) {
        if ('uuid' in value) {
          // <-- on arrête la récursivité lorsqu'on tombe sur les données de l'exo
          if (isRecent(value.datePublication) || isRecent(value.dateModification)) {
            // @ts-ignore
            recentExercises.push({ [key]: value })
          }
          return null
        } else {
          return traverseObject(value)
        }
      } else {
        return null
      }
    }, [])
  }
  traverseObject(obj)
  const recentExercisesAsObject = {}
  recentExercises.forEach((exo) => Object.assign(recentExercisesAsObject, exo))
  return recentExercisesAsObject
}

/**
 *
 * @param isAmcOnlySelected Tag pour le filtre AMC
 * @param isInteractiveOnlySelected tag pour le filtre Interactif
 * @param itemsAccepted Tableau des entrées filtrées
 * @param isNewExercisesIncluded tag pour inclure les nouveautés dans la liste
 * @returns tableau de tous les exercices filtrés
 */
export function updateReferentiel (isAmcOnlySelected, isInteractiveOnlySelected, itemsAccepted, isNewExercisesIncluded = true) {
  let filteredReferentiel = {}
  if (itemsAccepted.length === 0) {
    // pas de filtres sélectionnés
    filteredReferentiel = { ...referentiel, static: { ...referentielStatic } }
  } else {
    filteredReferentiel = Object.keys({ ...referentiel, static: { ...referentielStatic } })
      .filter((key) => itemsAccepted.includes(key))
      .reduce((obj, key) => {
        const ref = { ...referentiel, static: { ...referentielStatic } }
        return {
          ...obj,
          [key]: ref[key]
        }
      }, {})
    // console.log("first list :")
    // console.log(filteredReferentiel)
  }
  // Construction du tableau des chemins vers les exercices ayant la propriété `amc` et/ou `interactif`
  if (isAmcOnlySelected && !isInteractiveOnlySelected) {
    const amcCompatible = findPropPaths(baseReferentiel, (key) => key === 'amc').map((elt) => elt.replace(/(?:\.tags\.amc)$/, '').split('.'))
    filteredReferentiel = { ...buildReferentiel(amcCompatible) }
  } else if (isInteractiveOnlySelected && !isAmcOnlySelected) {
    const interactiveCompatible = findPropPaths(baseReferentiel, (key) => key === 'interactif').map((elt) => elt.replace(/(?:\.tags\.interactif)$/, '').split('.'))
    filteredReferentiel = { ...buildReferentiel(interactiveCompatible) }
  } else if (isAmcOnlySelected && isInteractiveOnlySelected) {
    const amcCompatible = findPropPaths(baseReferentiel, (key) => key === 'amc').map((elt) => elt.replace(/(?:\.tags\.amc)$/, '').split('.'))
    const interactiveCompatible = findPropPaths(baseReferentiel, (key) => key === 'interactif').map((elt) => elt.replace(/(?:\.tags\.interactif)$/, '').split('.'))
    // garder que les doublons
    const bothCompatible = findDuplicates(amcCompatible.concat(interactiveCompatible))
    filteredReferentiel = { ...buildReferentiel(bothCompatible) }
  }
  // Construction des entrées nouvelles dans la liste
  filteredReferentiel['Nouveautés'] = getRecentExercises(filteredReferentiel)
  const keysToBeFirst = { Nouveautés: null }
  filteredReferentiel = Object.assign(keysToBeFirst, filteredReferentiel)
  referentielMap = toMap(filteredReferentiel)
  return Array.from(referentielMap, ([key, obj]) => ({ key, obj }))
}

/**
 * Retrouve le titre d'un niveau basé sur son
 * @param levelId
 */
export function codeToLevelTitle (code: string) {
  if (codeList[code]) {
    return codeList[code]
  } else {
    return code
  }
}
