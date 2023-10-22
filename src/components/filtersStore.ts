import { get, writable } from 'svelte/store'
import type { DisplayedFilter, FilterObject, FilterType } from '../lib/types'
import type { Features, Level } from '../lib/types/referentiels'
// pour sauvegarder les sélections de filtres
export const allFilters = writable<
  Record<FilterType, DisplayedFilter<string | Level>>
>({
  levels: {
    '6e': {
      title: 'Sixième',
      values: ['6e'],
      isSelected: false,
      clicked: 0
    },
    '5e': {
      title: 'Cinquième',
      values: ['5e'],
      isSelected: false,
      clicked: 0
    },
    '4e': {
      title: 'Quatrième',
      values: ['4e'],
      isSelected: false,
      clicked: 0
    },
    '3e': {
      title: 'Troisième',
      values: ['3e'],
      isSelected: false,
      clicked: 0
    },
    college: {
      title: 'Collège',
      values: ['6e', '5e', '4e', '3e'],
      isSelected: false,
      clicked: 0
    },
    '2e': {
      title: 'Seconde',
      values: ['2e'],
      isSelected: false,
      clicked: 0
    },
    '1e': {
      title: 'Première',
      values: ['1e'],
      isSelected: false,
      clicked: 0
    },
    techno1: {
      title: 'Première Technologique',
      values: ['techno1'],
      isSelected: false,
      clicked: 0
    },
    Ex: {
      title: 'Terminale Expert',
      values: ['Ex'],
      isSelected: false,
      clicked: 0
    },
    HP: {
      title: 'Hors-Programme (Lycée)',
      values: ['HP'],
      isSelected: false,
      clicked: 0
    },
    lycee: {
      title: 'Lycée',
      values: ['2e', '1e', 'techno1', 'Ex', 'HP'],
      isSelected: false,
      clicked: 0
    }
  },
  specs: {
    amc: {
      title: 'AMC (AutoMultipleChoice)',
      values: ['amc'],
      isSelected: false,
      clicked: 0
    },
    interactif: {
      title: 'Interactif',
      values: ['interactif'],
      isSelected: false,
      clicked: 0
    }
  },
  types: {
    alea: {
      title: 'Aléatoires seulement',
      values: ['alea'],
      isSelected: false,
      clicked: 0
    },
    static: {
      title: 'Statiques seulement',
      values: ['static'],
      isSelected: false,
      clicked: 0
    },
    CAN: {
      title: 'Course aux nombres',
      values: ['CAN'],
      isSelected: false,
      clicked: 0
    }
  }
})

/**
 * Retourne la liste de tous les niveaux sélectionnés
 * @returns {Level[]} la liste des niveaux sélectionnés dans les filtres
 */
export function getSelectedLevels (): Level[] {
  const filters = get(allFilters)
  const selectedLevels: Level[] = []
  // on regarde les niveaux
  Object.entries(filters.levels).forEach(([filter, level]) => {
    if (filter !== 'college' && filter !== 'lycee') {
      if (level.isSelected) {
        selectedLevels.push(filter as Level)
      }
    }
  })
  // on regarde les types (qui sont des niveaux particuliers : CAN, static, etc.)
  Object.entries(filters.types).forEach(([filter, level]) => {
    if (level.isSelected) {
      selectedLevels.push(filter as Level)
    }
  })
  return selectedLevels
}
/**
 * Retourne la liste des filtres sélectionnés sous la forme d'objet comprenant le type, la clé et le contenu
 * @returns liste des filtres sélectionnés comme objects
 */
export function getSelectedFiltersObjects (): FilterObject<string | Level>[] {
  const filters = get(allFilters)
  const levels: FilterObject<string | Level>[] = []
  // on regarde les niveaux
  Object.entries(filters).forEach(([filterType, filterObject]) => {
    Object.entries(filterObject).forEach(([key, obj]) => {
      if (key !== 'college' && key !== 'lycee') {
        if (obj.isSelected) {
          levels.push({ type: filterType as FilterType, key, content: obj })
        }
      }
    })
  })
  return levels
}

/**
 * Retourne la liste de toutes les fonctionnalités cochées (AMC, interactif)
 * @returns liste de toutes les fonctionnalités cochées
 */
export function getSelectedFeatures (): (keyof Features)[] {
  const filters = get(allFilters)
  const selectedFeatures: (keyof Features)[] = []
  Object.entries(filters.specs).forEach(([key, spec]) => {
    if (spec.isSelected) {
      selectedFeatures.push(key as keyof Features)
    }
  })
  return selectedFeatures
}

/**
 * Désélectionne les filtres lycée (ou collège) si une clé lycée (ou collège) est désélectionnée
 * @param {string} key clé à inspecter
 */
export function handleUncheckingMutipleFilters (key: string) {
  const filters = get(allFilters)
  const clgKeys = [...filters.levels.college.values]
  const lyceeKeys = [...filters.levels.lycee.values]
  if (clgKeys.includes(key)) { filters.levels.college.isSelected = false }
  if (lyceeKeys.includes(key)) { filters.levels.lycee.isSelected = false }
}
