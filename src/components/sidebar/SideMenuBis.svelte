<script lang="ts">
  import { onDestroy } from 'svelte'
  import type {
    JSONReferentielObject,
    ResourceAndItsPath,
    ReferentielInMenu
  } from '../../lib/types/referentiels'
  import { allFilters } from '../filtersStore'
  import {
    applyFilters,
    buildReferentiel,
    getAllEndings
  } from '../utils/refUtils'
  import ReferentielNode from './ReferentielNode.svelte'
  import SearchBlock from './SearchBlock.svelte'
  import SideMenuApps from './SideMenuApps.svelte'
  import { referentiels, originalReferentiels, deepReferentielInMenuCopy } from '../referentielsStore'
  export let isMenuOpen: boolean = true
  export let sidebarWidth: number = 300
  // const all = getAllEndings(baseReferentiel)
  let filteredReferentielItems: ResourceAndItsPath[] = []
  // maj du référentiel chaque fois que le store `allFilters` change
  const unsubscribeToFiltersStore = allFilters.subscribe(() => {
    const results: ReferentielInMenu[] = []
    const copyOfOriginalReferentiel: ReferentielInMenu[] = deepReferentielInMenuCopy(originalReferentiels)
    copyOfOriginalReferentiel.forEach((item) => {
      if (item.searchable) {
        const all = getAllEndings(item.referentiel)
        const matchingItems: ResourceAndItsPath[] = applyFilters(all)
        filteredReferentielItems = [
          ...filteredReferentielItems,
          ...matchingItems
        ]
        const filteredReferentiel: JSONReferentielObject =
          buildReferentiel(matchingItems)
        const updatedItem: ReferentielInMenu = {
          title: item.title,
          name: item.name,
          searchable: item.searchable,
          referentiel: item.referentiel = { ...filteredReferentiel }
        }
        results.push(updatedItem)
      } else {
        results.push({ ...item })
      }
    })
    $referentiels = [...results]
  })
  onDestroy(() => {
    unsubscribeToFiltersStore()
  })
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
        resourcesSet={filteredReferentielItems}
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
