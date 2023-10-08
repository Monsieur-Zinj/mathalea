<script lang="ts">
  import { getAllExercises, applyFilters } from '../components/utils/refUtils'
  import {
    type JSONReferentielObject,
    type ResourceAndItsPath,
    isExerciceItemInReferentiel
  } from '../lib/types/referentiels'
  import referentielAlea from '../json/referentiel2022.json'
  import referentielStatic from '../json/referentielStatic.json'
  import FiltresBis from './sidebar/FiltresBis.svelte'
  import { selectedFilters } from './store'
  import { onDestroy } from 'svelte'
  import SearchExerciceBis from './sidebar/SearchExerciceBis.svelte'
  const baseReferentiel: JSONReferentielObject = {
    ...referentielAlea,
    static: { ...referentielStatic }
  }
  const all = getAllExercises(baseReferentiel)
  let filteredReferentiel: ResourceAndItsPath[]
  // maj du référentiel chaque fois que le store `selectedFilters` change
  const unsubscribeToFiltersStore = selectedFilters.subscribe(() => {
    filteredReferentiel = applyFilters(all)
  })
  onDestroy(() => {
    unsubscribeToFiltersStore()
  })
  let searchResultReferentiel: ResourceAndItsPath[] = []
</script>

<h1 class="text-4xl font-black text-coopmaths-struct mb-10">Tests</h1>
<div class="p-4">
  <SearchExerciceBis
    origin={filteredReferentiel}
    bind:results={searchResultReferentiel}
  />
</div>
<ul class="my-10 px-8 text-[10px]">
  {#each searchResultReferentiel as item}
    <li>
      {item.pathToResource.join('/')}
      {#if isExerciceItemInReferentiel(item.resource)}
        : {item.resource.titre}
      {/if}
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

<ul class="mt-10 px-8 text-[10px]">
  {#each filteredReferentiel as item}
    <li>
      {item.pathToResource.join('/')}
    </li>
  {/each}
</ul>
