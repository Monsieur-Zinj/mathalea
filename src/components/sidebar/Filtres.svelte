<script lang="ts">
  import { FILTER_SECTIONS_TITLES, type FilterType } from '../../lib/types'
  import type { Level } from '../../lib/types/referentiels'
  import { allFilters } from '../stores/filtersStore'
  import { getUniqueStringBasedOnTimeStamp } from '../utils/time'
  export let filterType: FilterType = 'levels'
  const timeTag: string = getUniqueStringBasedOnTimeStamp()

  /**
   * Gérer le cochage des filtres. On a juste à gérer les niveaux multiples
   * collège et lycée qui concernent plusieurs niveaux.
   * @remarks __Bizarrerie__ : Pour être sûr que la fonction callback de `subsribe` du store
   * `allFilters` soit appelée, on ajoute 1 à la propriété `clicked`
   * @param selectedEntry
   */
  function handleFiltersChanges (selectedEntry: Level | string) {
    if (filterType === 'levels') {
      switch (selectedEntry) {
        case 'college':
        case 'lycee':
          Object.values($allFilters.levels[selectedEntry].values).forEach(
            (level) => {
              // on met tous les niveaux college/lycee à `true` ou `false`
              if ($allFilters.levels[selectedEntry].isSelected) {
                $allFilters.levels[level].isSelected = true
              } else {
                $allFilters.levels[level].isSelected = false
              }
            }
          )
          $allFilters.levels[selectedEntry].clicked++
          break
        default:
          $allFilters.levels[selectedEntry].clicked++
          break
      }
      // on décoche `college` si tous les niveaux de college ne sont pas cochés
      $allFilters.levels.college.values.forEach((level) => {
        if (!$allFilters.levels[level].isSelected) {
          $allFilters.levels.college.isSelected = false
        }
      })
      // on décoche `lycee` si tous les niveaux de lycee ne sont pas cochés
      $allFilters.levels.lycee.values.forEach((level) => {
        if (!$allFilters.levels[level].isSelected) {
          $allFilters.levels.lycee.isSelected = false
        }
      })
    } else {
      $allFilters[filterType][selectedEntry].clicked++
    }
  }
</script>

<div class={`${$$props.class || ''} flex flex-col`}>
  <div
    class="text-coopmaths-struct font-semibold text-sm px-1 border-b w-full border-coopmaths-struct"
  >
    {FILTER_SECTIONS_TITLES[filterType]}
  </div>
  <div>
    <ul class="w-full columns-[175px] gap-4 mt-2">
      {#each Object.entries($allFilters[filterType]) as [key, filter], i}
        <li class="flex-row justify-start items-center pr-4 pl-6 py-0 my-0 line-clamp-1 leading-none">
          <input
            id="checkbox-{key}-{i}-{timeTag}"
            aria-describedby="checkbox-{key}-{i}-{timeTag}"
            type="checkbox"
            class="w-3 h-3 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-0 rounded"
            value={key}
            bind:checked={filter.isSelected}
            on:change={() => {
              handleFiltersChanges(key)
            }}
          />
          <label
            for="checkbox-{key}-{i}-{timeTag}"
            class="ml-2 text-xs font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus"
          >
            {filter.title}
          </label>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .levelsgrid {
    columns: 150px;
    column-gap: 1rem;
  }
  .normalgrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 1rem;
    line-height: 0.8;
  }
</style>
