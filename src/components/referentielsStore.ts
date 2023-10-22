// Ce store est dédié au stockage des référentiels et des outils de leur évolution
import referentielAlea from '../json/referentiel2022.json'
import referentielExams from '../json/referentielStatic.json'
import referentielProfs from '../json/referentielProfs.json'
import referentielRessources from '../json/referentielRessources.json'
import referentielBibliotheque from '../json/referentielBibliotheque.json'
import type {
  JSONReferentielObject,
  ReferentielInMenu
} from '../lib/types/referentiels'
import { writable } from 'svelte/store'
const baseReferentiel: JSONReferentielObject = { ...referentielAlea }
const examsReferentiel: JSONReferentielObject = { ...referentielExams }
const referentielOutils: JSONReferentielObject = { ...referentielProfs }
const referentielHtml: JSONReferentielObject = { ...referentielRessources }
const biblioReferentiel: JSONReferentielObject = { ...referentielBibliotheque }
// référentiel original
export const originalReferentiels: ReferentielInMenu[] = [
  {
    title: 'Exercices',
    name: 'aleatoires',
    searchable: true,
    referentiel: baseReferentiel
  },
  {
    title: 'Annales examens',
    name: 'examens',
    searchable: true,
    referentiel: examsReferentiel
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
/**
 * Fabrique une liste de _vraies_ copies d'objets représentant les référentiels dans le menu.
 * Ces objet sont passés en paramètres sous la forme d'un tableau.
 * @param {ReferentielInMenu[]} originals liste de référentiels
 * @returns {ReferentielInMenu[]} liste des copies des référentiels
 */
export const deepReferentielInMenuCopy = (originals: ReferentielInMenu[]): ReferentielInMenu[] => {
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
export const referentiels = writable<ReferentielInMenu[]>(deepReferentielInMenuCopy(originalReferentiels))
