<script lang="ts">
  import { onDestroy } from 'svelte'
  import type { JSONReferentielObject, ReferentielInMenu, ResourceAndItsPath } from '../../lib/types/referentiels'
  import { allFilters } from '../store'
  import { applyFilters, buildReferentiel, getAllEndings } from '../utils/refUtils'
  import ReferentielNode from './ReferentielNode.svelte'
  import SearchBlock from './SearchBlock.svelte'
  export let referentiels: ReferentielInMenu[] = []
  export let isMenuOpen: boolean = true
  export let sidebarWidth: number = 300
  export let isMenuCloseable: boolean = false
  const baseReferentiel: JSONReferentielObject = referentiels[0].referentiel
  const all = getAllEndings(baseReferentiel)
  let filteredReferentielItems: ResourceAndItsPath[]
  let filteredReferentiel: JSONReferentielObject
  // maj du référentiel chaque fois que le store `allFilters` change
  const unsubscribeToFiltersStore = allFilters.subscribe(() => {
    filteredReferentielItems = applyFilters(all)
    filteredReferentiel = buildReferentiel(filteredReferentielItems)
    referentiels[0].referentiel = { ...filteredReferentiel }
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
    class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
  >
    <div
      class="{isMenuOpen
        ? 'flex'
        : 'hidden'} flex-col items-start pb-4 pt-2 md:pt-4 ml-0 md:mx-0"
    >
    <SearchBlock class="w-full flex flex-col justify-start" resourcesSet={filteredReferentielItems} />
      <!-- {#each referentiels as ref}
        <SideMenuList
          {ref}
          moreThanOne={referentiels.length > 1}
          isMenuDeployed={ref.type === 'exercices'}
          on:filters
        />
      {/each} -->
      <div class="mt-4 w-full">
        {#each referentiels as item, i}
          <ReferentielNode
            bind:subset={item.referentiel}
            indexBase={i + 1}
            levelTitle={item.title}
            nestedLevelCount={1}
            class="w-full px-4 text-[10px]"
          />
        {/each}
      </div>
    </div>
    <div
      class="z-40 absolute top-3 hidden md:inline-flex justify-center items-center rounded-r-sm h-10 w-10 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark
      {isMenuOpen
        ? '-translate-x-full -right-10'
        : 'translate-x-10'}  transition-all duration-500 transform"
    >
      <button
        type="button"
        on:click={() => {
          if (isMenuCloseable) {
            isMenuOpen = !isMenuOpen
          }
        }}
      >
        <i
          class="bx {isMenuOpen
            ? 'bx-x'
            : 'bx-right-arrow-alt'} scale-150 text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest hover:dark:text-coopmathsdark-action-lightest"
        />
      </button>
    </div>
  </div>
</aside>
