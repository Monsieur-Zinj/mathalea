<script lang="ts">
  import {
    getAllEndings,
    applyFilters,
    buildReferentiel
  } from '../components/utils/refUtils'
  import {
    type JSONReferentielObject,
    type ResourceAndItsPath
  } from '../lib/types/referentiels'
  import referentielAlea from '../json/referentiel2022.json'
  import referentielStatic from '../json/referentielStatic.json'
  import { allFilters } from './store'
  import { onDestroy } from 'svelte'
  import ReferentielNode from './sidebar/ReferentielNode.svelte'
  const baseReferentiel: JSONReferentielObject = {
    ...referentielAlea,
    static: { ...referentielStatic }
  }
  import referentielProfs from '../json/referentielProfs.json'
  let referentielOutil: JSONReferentielObject = { ...referentielProfs }
  import referentielRessources from '../json/referentielRessources.json'
  import SearchBlock from './sidebar/SearchBlock.svelte'
  let referentielHtml: JSONReferentielObject = { ...referentielRessources }
  const all = getAllEndings(baseReferentiel)
  let filteredReferentielItems: ResourceAndItsPath[]
  let filteredReferentiel: JSONReferentielObject
  // maj du référentiel chaque fois que le store `allFilters` change
  const unsubscribeToFiltersStore = allFilters.subscribe(() => {
    filteredReferentielItems = applyFilters(all)
    filteredReferentiel = buildReferentiel(filteredReferentielItems)
  })
  onDestroy(() => {
    unsubscribeToFiltersStore()
  })
</script>

<h1 class="text-4xl font-black text-coopmaths-struct mb-10">Tests</h1>
<SearchBlock bind:resourcesSet={filteredReferentielItems} />

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
