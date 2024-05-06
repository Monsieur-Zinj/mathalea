<script lang="ts">
  import {
    type JSONReferentielObject,
    type ResourceAndItsPath,
    type ReferentielInMenu,
    type ActivationName
  } from '../../../../../lib/types/referentiels'
  import {
    buildReferentiel,
    getAllEndings
  } from '../../../../../lib/components/refUtils'
  import ReferentielNode from './referentielNode/ReferentielNode.svelte'
  import SearchBlock from './searchBlock/SearchBlock.svelte'
  import SideMenuApps from './SideMenuApps.svelte'
  import {
    originalReferentiels,
    originalReferentielsCH,
    deepReferentielInMenuCopy,
    referentiels
  } from '../../../../../lib/stores/referentielsStore'
  import codeToLevelList from '../../../../../json/codeToLevelList.json'
  import { onDestroy, onMount } from 'svelte'
  import { applyFilters } from './filtersStore'
  import { referentielLocale } from '../../../../../lib/stores/languagesStore'

  import type { SvelteComponent } from 'svelte'
  import type { Language } from '../../../../../lib/types/languages'
  import { get } from 'svelte/store'
  interface SearchBlockType extends SvelteComponent {
    triggerUpdateFromSearchBlock: () => void
  }

  export let excludedReferentiels: ActivationName[] = []
  export let addExercise: (uuid: string, id: string) => void

  let searchBlock: SearchBlockType

  let referentielsForMenu: ReferentielInMenu[] = []
  /**
   * En fonction de la locale, on choisit le bon référentiel (français par défaut)
   * @param {Language} value
   */
  const setCurrentReferentiels = (value: Language) => {
    let current: ReferentielInMenu[]
    switch (value) {
      case 'fr-FR':
        current = originalReferentiels
        break
      case 'fr-CH':
        current = originalReferentielsCH
        break
      default:
        current = originalReferentiels
        break
    }
    return current
  }
  let currentReferentiels: ReferentielInMenu[] = setCurrentReferentiels(get(referentielLocale))

  /**
   * Souscription aux changements de langues.
   * À chaque changement, on doit :
   * -> changement du référentiel courant (celui qui sert de référence)
   * -> changement du référentiel dans le store
   * -> mise à jour des entrées du menu
   */
  const unsubscribeToReferentielLocale = referentielLocale.subscribe((value) => {
    currentReferentiels = setCurrentReferentiels(value)
    referentiels.set(deepReferentielInMenuCopy(currentReferentiels))
    updateRepositories()
  })

  onMount(() => {
    updateRepositories()
  })
  onDestroy(() => {
    unsubscribeToReferentielLocale()
  })

  function updateRepositories () {
    const updatedRepositories: ReferentielInMenu[] = []
    const repositoriesInMenu: ReferentielInMenu[] = deepReferentielInMenuCopy(
      currentReferentiels
    ).filter((e) => {
      return !excludedReferentiels.includes(e.name)
    })
    for (const repositoryInMenu of repositoriesInMenu) {
      if (repositoryInMenu.searchable) {
        let filteredRepository: JSONReferentielObject =
          buildFilteredRepository(repositoryInMenu)
        if (repositoryInMenu.name === 'aleatoires') {
          filteredRepository = orderFollowingSchoolLevel(filteredRepository)
        }
        repositoryInMenu.referentiel = filteredRepository
        updatedRepositories.push(repositoryInMenu)
      } else {
        // /!\ TODO : doit-ordonner les référentiels non cherchable ? (item.referentiel)
        updatedRepositories.push(repositoryInMenu)
      }
    }
    referentielsForMenu = updatedRepositories
  }

  function buildFilteredRepository (repositoryInMenu: ReferentielInMenu) {
    const allExercices = getAllEndings(repositoryInMenu.referentiel)
    const filteredExercices: ResourceAndItsPath[] = applyFilters(allExercices)
    return buildReferentiel(filteredExercices)
  }

  function orderFollowingSchoolLevel (
    filteredRepository: JSONReferentielObject
  ) {
    for (const key of Object.keys(codeToLevelList).reverse()) {
      if (Object.keys(filteredRepository).includes(key)) {
        const keyToBeFirst = { [key]: null }
        filteredRepository = Object.assign(keyToBeFirst, filteredRepository)
      }
    }
    return filteredRepository
  }

  const buildResourcesSet = (
    refList: ReferentielInMenu[]
  ): ResourceAndItsPath[] => {
    let result: ResourceAndItsPath[] = []
    for (const item of refList) {
      if (item.searchable) {
        result = [...result, ...getAllEndings(item.referentiel)]
      }
    }
    return result
  }
</script>

<aside
  class="flex w-full md:h-full md:min-h-full flex-col items-start pb-4 pt-0 md:pt-4 ml-0 md:mx-0 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
>
  <SearchBlock
    bind:this={searchBlock}
    class="w-full flex flex-col justify-start pt-0 sm:"
    resourcesSet={buildResourcesSet(referentielsForMenu)}
    on:filters-change={() => {
      updateRepositories()
      searchBlock.triggerUpdateFromSearchBlock()
    }}
    {addExercise}
  />
  <div class="mt-4 w-full">
    <!-- Affichage de tous les référentiels -->
    {#each referentielsForMenu as item, i}
      <ReferentielNode
        bind:subset={item.referentiel}
        indexBase={i + 1}
        levelTitle={item.title}
        nestedLevelCount={1}
        class="w-full px-4 text-[10px]"
        pathToThisNode={[]}
      />
    {/each}
    <!-- Bouton spécial pour les applications tierces -->
    <SideMenuApps class="text-start p-6 w-full" />
  </div>
</aside>
