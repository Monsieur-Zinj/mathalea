<script lang='ts'>
  import SearchInput from './SearchInput.svelte'
  import ReferentielEnding from './ReferentielEnding.svelte'
  import type { ResourceAndItsPath } from '../../lib/types/referentiels'
  export let resourcesSet: ResourceAndItsPath[]
  let foundResources: ResourceAndItsPath[] = []
</script>
<!--
  @component
  Bloc de recherche comprenant~:
  - un champ texte pour saisir la recherche
  - la liste des résultats éventuels de la recherche
  #### Paramètres
  - `resourcesSet` : l'ensemble des resources à chercher sous la forme
  d'une liste d'objets de type `ResourceAndItsPath`
 -->
<div class={`${$$props.class || ''}`}>
  <div class="p-4">
    <SearchInput
      origin={resourcesSet}
      bind:results={foundResources}
      on:filters-change
    />
  </div>
  <ul
    class="{foundResources.length === 0
      ? 'hidden'
      : 'flex flex-col justify-start w-full mt-4 mx-0 p-4 text-[10px] bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark'} "
  >
    {#each foundResources as item}
      <li>
        <ReferentielEnding ending={item.resource} nestedLevelCount={1} />
      </li>
    {/each}
  </ul>
</div>
