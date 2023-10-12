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
  import FiltresBis from './sidebar/FiltresBis.svelte'
  import { selectedFilters } from './store'
  import { onDestroy } from 'svelte'
  import SearchExerciceBis from './sidebar/SearchExerciceBis.svelte'
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
  <SearchExerciceBis
    origin={filteredReferentielItems}
    bind:results={searchResultReferentiel}
  />
</div>
<ul class="my-10 mx-4 p-4 text-[10px] bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark">
  {#each searchResultReferentiel as item}
    <li>
      <ReferentielEnding ending={item.resource} nestedLevelCount={1} />
    </li>
  {/each}
</ul>
<div>
  <FiltresBis filterType="levels" />
</div>
<div class="mt-10">
  <FiltresBis filterType="specs" />
</div>
<div class="mt-10">
  <FiltresBis filterType="types" />
</div>

<div class="flex flex-row w-full">
  <div class="mt-10 px-8 text-[10px] w-1/3">
    <ReferentielNode
      bind:subset={filteredReferentiel}
      indexBase={1}
      nestedLevelCount={1}
      levelTitle={'Exercices'}
    />
  </div>
  <div class="mt-10 px-8 text-[10px] w-1/3">
    <ReferentielNode
      bind:subset={referentielOutil}
      indexBase={1}
      nestedLevelCount={1}
      levelTitle={'Outils'}
    />
  </div>
  <div class="mt-10 px-8 text-[10px] w-1/3">
    <ReferentielNode
      bind:subset={referentielHtml}
      indexBase={1}
      nestedLevelCount={1}
      levelTitle={'Vos ressources'}
    />
  </div>
</div>
