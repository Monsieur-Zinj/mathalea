// Ce store est dédié au stockage des référentiels et des outils de leur évolution
import referentielAlea from '../../json/referentiel2022FR.json'
import referentielExams from '../../json/referentielStatic.json'
import referentielProfs from '../../json/referentielProfs.json'
import referentielRessources from '../../json/referentielRessources.json'
import referentielBibliotheque from '../../json/referentielBibliotheque.json'
import referentielGeometrieDynamique from '../../json/referentielGeometrieDynamique.json'
import referentielsActivation from '../../json/referentielsActivation.json'
import type {
  ActivationName,
  JSONReferentielObject,
  ReferentielInMenu,
  ResourceAndItsPath
} from '../types/referentiels'
import { writable } from 'svelte/store'
import {
  buildReferentiel,
  getAllEndings,
  getRecentExercices
} from '../components/refUtils'
import {
  sortArrayOfResourcesBasedOnProp,
  sortArrayOfResourcesBasedOnYearAndMonth
} from '../components/sorting'
const activations: Record<ActivationName, boolean> = { ...referentielsActivation }
const baseReferentiel: JSONReferentielObject = { ...referentielAlea }
const examsReferentiel: JSONReferentielObject = { ...referentielExams }
const referentielOutils: JSONReferentielObject = { ...referentielProfs }
const referentielHtml: JSONReferentielObject = { ...referentielRessources }
const biblioReferentiel: JSONReferentielObject = { ...referentielBibliotheque }
const baseGeometrieDynamiqueReferentiel: JSONReferentielObject = { ...referentielGeometrieDynamique }
// on ajoute les nouveautés
const newExercises: ResourceAndItsPath[] = getRecentExercices(baseReferentiel)
const newExercisesReferentiel: JSONReferentielObject = {}
for (const item of newExercises) {
  newExercisesReferentiel[item.pathToResource[item.pathToResource.length - 1]] =
    { ...item.resource }
}
const baseAndNewsReferentiel: JSONReferentielObject = {
  Nouveautés: { ...newExercisesReferentiel },
  ...baseReferentiel
}
// on trie les examens dans l'ordre inverse des années/mois
let examens = getAllEndings(examsReferentiel)
examens = [...sortArrayOfResourcesBasedOnYearAndMonth(examens, 'desc')]
const orderedExamsReferentiel = buildReferentiel(examens)
// on trie les exercice aléatoires par ID ('4-C10' < '4-C10-1' <'4-C10-10')
let exercices = getAllEndings(baseAndNewsReferentiel)
exercices = [...sortArrayOfResourcesBasedOnProp(exercices, 'id')]
const aleaReferentiel = buildReferentiel(exercices)
const exercicesGeometrieDynamique = getAllEndings(baseGeometrieDynamiqueReferentiel)
const geometrieDynamiqueReferentiel = buildReferentiel(exercicesGeometrieDynamique)
// référentiel original
const allReferentielsInMenus: ReferentielInMenu[] = [
  {
    title: 'Exercices aléatoires',
    name: 'aleatoires',
    searchable: true,
    referentiel: aleaReferentiel
  },
  {
    title: 'Annales examens',
    name: 'examens',
    searchable: true,
    referentiel: orderedExamsReferentiel
  },
  {
    title: 'Géométrie dynamique',
    name: 'geometrieDynamique',
    searchable: false,
    referentiel: geometrieDynamiqueReferentiel
  },
  {
    title: 'Outils',
    name: 'outils',
    searchable: false,
    referentiel: referentielOutils
  },
  {
    title: 'Vos ressources',
    name: 'ressources',
    searchable: false,
    referentiel: referentielHtml
  },
  {
    title: 'Bibliothèque',
    name: 'statiques',
    searchable: false,
    referentiel: biblioReferentiel
  }
]
const activatedReferentielsInMenu: ReferentielInMenu[] = []
for (const ref of allReferentielsInMenus) {
  if (activations[ref.name]) {
    activatedReferentielsInMenu.push(ref)
  }
}

export const originalReferentiels = [...activatedReferentielsInMenu]
/**
 * Fabrique une liste de _vraies_ copies d'objets représentant les référentiels dans le menu.
 * Ces objet sont passés en paramètres sous la forme d'un tableau.
 * @param {ReferentielInMenu[]} originals liste de référentiels
 * @returns {ReferentielInMenu[]} liste des copies des référentiels
 */
export const deepReferentielInMenuCopy = (
  originals: ReferentielInMenu[]
): ReferentielInMenu[] => {
  const copy: ReferentielInMenu[] = []
  for (const item of originals) {
    const ref: ReferentielInMenu = {
      title: item.title,
      name: item.name,
      searchable: item.searchable,
      referentiel: { ...item.referentiel }
    }
    copy.push(ref)
  }
  return copy
}
// référentiel mutable utilisé par les composants
export const referentiels = writable<ReferentielInMenu[]>(
  deepReferentielInMenuCopy(originalReferentiels)
)
