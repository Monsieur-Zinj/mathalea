<script lang="ts">
  import {
    getAllExercises,
    applyFilters,
    buildReferentiel
  } from '../components/utils/refUtils'
  import {
    type JSONReferentielObject,
    type ResourceAndItsPath
  } from '../lib/types/referentiels'
  import referentielAlea from '../json/referentiel2022.json'
  import referentielStatic from '../json/referentielStatic.json'
  import { selectedFilters } from './store'
  import { onDestroy } from 'svelte'
  import SearchInput from './sidebar/SearchInput.svelte'
  import ReferentielNode from './sidebar/ReferentielNode.svelte'
  const baseReferentiel: JSONReferentielObject = {
    ...referentielAlea,
    static: { ...referentielStatic }
  }
  import referentielProfs from '../json/referentielProfs.json'
  let referentielOutil: JSONReferentielObject = { ...referentielProfs }
  import referentielRessources from '../json/referentielRessources.json'
  import ReferentielEnding from './sidebar/ReferentielEnding.svelte'
  let referentielHtml: JSONReferentielObject = { ...referentielRessources }
  const all = getAllExercises(baseReferentiel)
  let filteredReferentielItems: ResourceAndItsPath[]
  let filteredReferentiel: JSONReferentielObject
  // maj du référentiel chaque fois que le store `selectedFilters` change
  const unsubscribeToFiltersStore = selectedFilters.subscribe(() => {
    filteredReferentielItems = applyFilters(all)
    filteredReferentiel = buildReferentiel(filteredReferentielItems)
  })
  onDestroy(() => {
    unsubscribeToFiltersStore()
  })
  let searchResultReferentiel: ResourceAndItsPath[] = []
</script>

<h1 class="text-4xl font-black text-coopmaths-struct mb-10">Tests</h1>
<div class="p-4">
  <SearchInput
    origin={filteredReferentielItems}
    bind:results={searchResultReferentiel}
  />
</div>
<ul
  class="{searchResultReferentiel.length === 0
    ? 'hidden'
    : 'flex flex-col'} my-10 mx-4 p-4 text-[10px] bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
>
  {#each searchResultReferentiel as item}
    <li>
      <ReferentielEnding ending={item.resource} nestedLevelCount={1} />
    </li>
  {/each}
</ul>

<div class="flex flex-col w-full">
  <ReferentielNode
    bind:subset={filteredReferentiel}
    indexBase={1}
    nestedLevelCount={1}
    levelTitle={'Exercices'}
    class="w-full mt-10 px-4 text-[10px]"
  />
  <ReferentielNode
    bind:subset={referentielOutil}
    indexBase={1}
    nestedLevelCount={1}
    levelTitle={'Outils'}
    class="w-full mt-10 px-4 text-[10px]"
  />
  <ReferentielNode
    bind:subset={referentielHtml}
    indexBase={1}
    nestedLevelCount={1}
    levelTitle={'Vos ressources'}
    class="w-full mt-10 px-4 text-[10px]"
  />
</div>
