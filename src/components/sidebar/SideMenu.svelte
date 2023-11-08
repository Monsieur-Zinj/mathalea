<script lang="ts">
  import {
    type JSONReferentielObject,
    type ResourceAndItsPath,
    type ReferentielInMenu
  } from '../../lib/types/referentiels'
  import {
    applyFilters,
    buildReferentiel,
    getAllEndings
  } from '../utils/refUtils'
  import ReferentielNode from './ReferentielNode.svelte'
  import SearchBlock from './SearchBlock.svelte'
  import SideMenuApps from './SideMenuApps.svelte'
  import {
    referentiels,
    originalReferentiels,
    deepReferentielInMenuCopy
  } from '../stores/referentielsStore'
  import codeToLevelList from '../../json/codeToLevelList.json'
  import { onMount } from 'svelte'
  export let isMenuOpen: boolean = true
  export let sidebarWidth: number = 300
  /**
   * Mise à jour des référentiels en tenant compte des filtres
   * La fonction est appelée lorsqu'est détecté l'événement `filters-change`
   * diffusé par le composant `Filtres` (et remonté à travers tous les composants parents
   * jusqu'à SideMenu) ou le composant `Chip` de la liste des puces de filtres
   */
  const updateRef = () => {
    let filteredReferentielItems: ResourceAndItsPath[] = []
    const results: ReferentielInMenu[] = []
    const copyOfOriginalReferentiel: ReferentielInMenu[] =
      deepReferentielInMenuCopy(originalReferentiels)
    copyOfOriginalReferentiel.forEach((item) => {
      if (item.searchable) {
        const all = getAllEndings(item.referentiel)
        const matchingItems: ResourceAndItsPath[] = applyFilters(all)
        filteredReferentielItems = [
          ...filteredReferentielItems,
          ...matchingItems
        ]
        let filteredReferentiel: JSONReferentielObject =
          buildReferentiel(matchingItems)
        // on ordonne les entrées dans la liste (suivant l'ordre de codeToLevelList.json)
        if (item.name === 'aleatoires') {
          for (const key of Object.keys(codeToLevelList).reverse()) {
            if (Object.keys(filteredReferentiel).includes(key)) {
              const keyToBeFirst = { [key]: null }
              filteredReferentiel = Object.assign(
                keyToBeFirst,
                filteredReferentiel
              )
            }
          }
        }
        const updatedItem: ReferentielInMenu = {
          title: item.title,
          name: item.name,
          searchable: item.searchable,
          referentiel: (item.referentiel = { ...filteredReferentiel })
        }
        results.push(updatedItem)
      } else {
        // /!\ TODO : doit-ordonner les référentiels non cherchable ? (item.referentiel)
        results.push({ ...item })
      }
    })
    $referentiels = [...results]
  }

  const buildHaystack = (
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
  onMount(() => { updateRef() })
</script>

<aside
  class="flex md:h-full z-40 relative transition-all duration-500 transform bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark
  {isMenuOpen ? '-translate-x-0  pr-4 overflow-y-auto' : '-translate-x-full'}"
>
  <div
    style={isMenuOpen ? `width:${sidebarWidth}px;` : 'width: 2.5rem;'}
    class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark transition-all duration-500"
  >
    <div
      class="{isMenuOpen
        ? 'flex'
        : 'hidden'} flex-col items-start pb-4 pt-2 md:pt-4 ml-0 md:mx-0"
    >
      <SearchBlock
        class="w-full flex flex-col justify-start"
        resourcesSet={buildHaystack($referentiels)}
        on:filters-change={updateRef}
      />
      <div class="mt-4 w-full">
        <!-- Affichage de tous les référentiels -->
        {#each $referentiels as item, i}
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
    </div>
  </div>
</aside>
